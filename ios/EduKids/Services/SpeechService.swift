import AVFoundation
import Speech

// MARK: - Speech Service
/// Text-to-Speech + Speech Recognition for pronunciation practice.
@MainActor
class SpeechService: ObservableObject {
    static let shared = SpeechService()

    private let synthesizer = AVSpeechSynthesizer()

    @Published var isListening = false
    @Published var transcript = ""
    @Published var pronunciationScore: Double?

    private var recognizer: SFSpeechRecognizer?
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    private let audioEngine = AVAudioEngine()

    init() {
        recognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))
    }

    // MARK: - Speak (TTS)
    func speak(_ text: String, rate: Float = 0.42) {
        synthesizer.stopSpeaking(at: .immediate)
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: "en-US")
        utterance.rate = rate
        utterance.pitchMultiplier = 1.1
        utterance.volume = 1.0
        synthesizer.speak(utterance)
    }

    // MARK: - Request Permission
    func requestPermission() async -> Bool {
        let speechStatus = await withCheckedContinuation { continuation in
            SFSpeechRecognizer.requestAuthorization { status in
                continuation.resume(returning: status == .authorized)
            }
        }

        let audioStatus: Bool
        if #available(iOS 17.0, *) {
            audioStatus = await AVAudioApplication.requestRecordPermission()
        } else {
            audioStatus = await withCheckedContinuation { continuation in
                AVAudioSession.sharedInstance().requestRecordPermission { granted in
                    continuation.resume(returning: granted)
                }
            }
        }

        return speechStatus && audioStatus
    }

    // MARK: - Listen (Speech Recognition)
    func startListening() async {
        guard let recognizer = recognizer, recognizer.isAvailable else { return }

        let permitted = await requestPermission()
        guard permitted else { return }

        stopListening()

        let request = SFSpeechAudioBufferRecognitionRequest()
        request.shouldReportPartialResults = true
        recognitionRequest = request

        let session = AVAudioSession.sharedInstance()
        try? session.setCategory(.record, mode: .measurement, options: .duckOthers)
        try? session.setActive(true, options: .notifyOthersOnDeactivation)

        let inputNode = audioEngine.inputNode
        let format = inputNode.outputFormat(forBus: 0)
        inputNode.installTap(onBus: 0, bufferSize: 1024, format: format) { buffer, _ in
            request.append(buffer)
        }

        audioEngine.prepare()
        try? audioEngine.start()
        isListening = true
        transcript = ""

        recognitionTask = recognizer.recognitionTask(with: request) { [weak self] result, error in
            guard let self = self else { return }
            if let result = result {
                Task { @MainActor in
                    self.transcript = result.bestTranscription.formattedString
                }
            }
            if error != nil || (result?.isFinal ?? false) {
                Task { @MainActor in
                    self.stopListening()
                }
            }
        }

        // Auto-stop after 5 seconds
        Task {
            try? await Task.sleep(for: .seconds(5))
            stopListening()
        }
    }

    func stopListening() {
        audioEngine.stop()
        audioEngine.inputNode.removeTap(onBus: 0)
        recognitionRequest?.endAudio()
        recognitionTask?.cancel()
        recognitionRequest = nil
        recognitionTask = nil
        isListening = false
    }

    // MARK: - Score Pronunciation
    func scorePronunciation(expected: String, actual: String) -> (score: Double, match: Bool) {
        let exp = expected.lowercased().trimmingCharacters(in: .whitespacesAndNewlines)
        let act = actual.lowercased().trimmingCharacters(in: .whitespacesAndNewlines)

        if exp == act { return (100, true) }

        // Levenshtein distance
        let distance = levenshtein(exp, act)
        let maxLen = Double(max(exp.count, act.count))
        let similarity = maxLen > 0 ? (1.0 - Double(distance) / maxLen) * 100 : 0

        return (max(0, min(100, similarity)), similarity >= 50)
    }

    private func levenshtein(_ s: String, _ t: String) -> Int {
        let m = s.count, n = t.count
        var d = Array(repeating: Array(repeating: 0, count: n + 1), count: m + 1)
        for i in 0...m { d[i][0] = i }
        for j in 0...n { d[0][j] = j }
        let sArray = Array(s), tArray = Array(t)
        for i in 1...m {
            for j in 1...n {
                let cost = sArray[i-1] == tArray[j-1] ? 0 : 1
                d[i][j] = min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + cost)
            }
        }
        return d[m][n]
    }
}
