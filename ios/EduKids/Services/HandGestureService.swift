import Foundation
import AVFoundation
import Vision
import Combine

// MARK: - Hand Gesture Service
/// Uses Vision framework to detect hand poses and count raised fingers.
/// Finger count mapping: 0 = fist (confirm), 1-4 = select option, 5 = next/thumbs-up
@MainActor
class HandGestureService: NSObject, ObservableObject {
    @Published var fingerCount: Int = -1  // -1 = no hand detected
    @Published var isActive = false
    @Published var error: String?

    private(set) var captureSession: AVCaptureSession?
    private let processingInterval: TimeInterval = 0.15 // ~7 fps for gestures
    private var stableCount = 0
    private var lastStableValue: Int = -1

    // Debounce: require N consecutive identical readings
    private let debounceThreshold = 3

    // These are accessed from the capture queue — keep them nonisolated
    // by storing in a separate helper that lives outside the MainActor.
    private let processor = GestureProcessor()

    override init() {
        super.init()
    }

    var previewLayer: AVCaptureVideoPreviewLayer? {
        guard let session = captureSession else { return nil }
        let layer = AVCaptureVideoPreviewLayer(session: session)
        layer.videoGravity = .resizeAspectFill
        return layer
    }

    func startSession() {
        guard captureSession == nil else { return }

        let session = AVCaptureSession()
        session.sessionPreset = .medium

        guard let camera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front),
              let input = try? AVCaptureDeviceInput(device: camera) else {
            error = "Không thể mở camera trước"
            return
        }

        guard session.canAddInput(input) else {
            error = "Không thể thêm camera input"
            return
        }
        session.addInput(input)

        let output = AVCaptureVideoDataOutput()
        output.setSampleBufferDelegate(processor, queue: DispatchQueue(label: "gesture.processing"))
        output.alwaysDiscardsLateVideoFrames = true

        guard session.canAddOutput(output) else {
            error = "Không thể thêm video output"
            return
        }
        session.addOutput(output)

        // Wire processor → self
        processor.onFingerCount = { [weak self] count in
            Task { @MainActor [weak self] in
                self?.updateFingerCount(count)
            }
        }

        captureSession = session

        DispatchQueue.global(qos: .userInitiated).async {
            session.startRunning()
            Task { @MainActor [weak self] in
                self?.isActive = true
            }
        }
    }

    func stopSession() {
        captureSession?.stopRunning()
        captureSession = nil
        isActive = false
        fingerCount = -1
    }

    private func updateFingerCount(_ newValue: Int) {
        if newValue == lastStableValue {
            stableCount += 1
        } else {
            lastStableValue = newValue
            stableCount = 1
        }

        // Only update published value after debounce threshold
        if stableCount >= debounceThreshold && fingerCount != newValue {
            fingerCount = newValue
        }
    }
}

// MARK: - Gesture Processor (nonisolated — runs on capture queue)
/// Separate class to handle AVCaptureVideoDataOutputSampleBufferDelegate
/// without touching @MainActor state directly. Fully nonisolated.
private class GestureProcessor: NSObject, AVCaptureVideoDataOutputSampleBufferDelegate {
    private let handPoseRequest = VNDetectHumanHandPoseRequest()
    private var lastProcessTime = Date.distantPast
    private let processingInterval: TimeInterval = 0.15

    /// Callback with finger count — will be dispatched to @MainActor by caller.
    var onFingerCount: ((Int) -> Void)?

    override init() {
        super.init()
        handPoseRequest.maximumHandCount = 1
    }

    func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
        // Throttle processing
        let now = Date()
        guard now.timeIntervalSince(lastProcessTime) >= processingInterval else { return }
        lastProcessTime = now

        guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }

        let handler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer, orientation: .up, options: [:])

        do {
            try handler.perform([handPoseRequest])

            guard let observation = handPoseRequest.results?.first else {
                onFingerCount?(-1)
                return
            }

            let count = try countFingers(from: observation)
            onFingerCount?(count)
        } catch {
            onFingerCount?(-1)
        }
    }

    // MARK: - Finger Counting Logic
    private func countFingers(from observation: VNHumanHandPoseObservation) throws -> Int {
        let fingerTips: [VNHumanHandPoseObservation.JointName] = [
            .thumbTip, .indexTip, .middleTip, .ringTip, .littleTip
        ]
        let fingerPIPs: [VNHumanHandPoseObservation.JointName] = [
            .thumbIP, .indexPIP, .middlePIP, .ringPIP, .littlePIP
        ]

        var raisedFingers = 0

        // Thumb: use different logic (compare x positions relative to wrist)
        let thumbTip = try observation.recognizedPoint(.thumbTip)
        let thumbIP = try observation.recognizedPoint(.thumbIP)
        let wrist = try observation.recognizedPoint(.wrist)

        if thumbTip.confidence > 0.3 && thumbIP.confidence > 0.3 && wrist.confidence > 0.3 {
            let thumbTipDist = abs(thumbTip.location.x - wrist.location.x)
            let thumbIPDist = abs(thumbIP.location.x - wrist.location.x)
            if thumbTipDist > thumbIPDist + 0.03 {
                raisedFingers += 1
            }
        }

        // Other fingers: tip above PIP = raised
        for i in 1..<5 {
            let tip = try observation.recognizedPoint(fingerTips[i])
            let pip = try observation.recognizedPoint(fingerPIPs[i])

            if tip.confidence > 0.3 && pip.confidence > 0.3 {
                if tip.location.y > pip.location.y + 0.02 {
                    raisedFingers += 1
                }
            }
        }

        return raisedFingers
    }
}
