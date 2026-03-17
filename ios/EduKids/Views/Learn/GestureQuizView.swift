import SwiftUI

// MARK: - Gesture Quiz View
/// Quiz with camera-based hand gesture selection
/// Shows English word (big text + TTS) → pick correct image with gestures
/// 1-4 fingers = preview option, fist = confirm, 5 fingers = next question
struct GestureQuizView: View {
    let topic: TopicDetail
    @EnvironmentObject var authVM: AuthViewModel
    @Environment(\.dismiss) private var dismiss
    @StateObject private var gestureService = HandGestureService()

    @State private var questions: [QuizQuestion] = []
    @State private var currentIndex = 0
    @State private var score = 0
    @State private var selectedAnswer: String?
    @State private var isCorrect: Bool?
    @State private var completed = false
    @State private var previewedAnswer: String?
    @State private var streak = 0
    @State private var attempts = 0
    @State private var wrongFeedback = false
    @State private var startTime = Date()
    private let maxAttempts = 2

    var body: some View {
        ZStack {
            Theme.bg.ignoresSafeArea()

            if completed {
                completedScreen
            } else if questions.isEmpty {
                ProgressView().tint(Theme.accent)
            } else {
                quizContent
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .principal) {
                HStack(spacing: 6) {
                    Text("📷")
                    Text("\(currentIndex + 1)/\(questions.count)")
                        .font(.system(size: 15, weight: .bold, design: .rounded))
                        .foregroundColor(Theme.textSecondary)
                }
            }
        }
        .onAppear {
            generateQuestions()
            gestureService.startSession()
        }
        .onDisappear {
            gestureService.stopSession()
        }
        .onChange(of: gestureService.fingerCount) { _, newValue in
            handleGesture(newValue)
        }
    }

    // MARK: - Quiz Content
    private var quizContent: some View {
        let q = questions[currentIndex]
        return ScrollView(showsIndicators: false) {
            VStack(spacing: 0) {
                // Camera preview — BIGGER, takes more vertical space
                CameraGestureOverlay(gestureService: gestureService, compact: false)
                    .frame(height: 200)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                    .padding(.horizontal, 16)
                    .padding(.top, 8)

                // English word — BIG text + TTS (same pattern as regular quiz)
                VStack(spacing: 8) {
                    Text(q.word.en)
                        .font(.system(size: 36, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                        .multilineTextAlignment(.center)

                    Text(q.word.vi)
                        .font(.system(size: 14))
                        .foregroundColor(.white.opacity(0.4))

                    HStack(spacing: 16) {
                        Text("Chọn hình đúng 👇")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(Theme.accent)

                        // Listen again button
                        Button {
                            speakCurrentWord()
                        } label: {
                            HStack(spacing: 4) {
                                Image(systemName: "speaker.wave.2.fill")
                                Text("Nghe")
                            }
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(Theme.accent)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(
                                Capsule().fill(Theme.accent.opacity(0.15))
                            )
                        }
                    }

                    if streak > 0 {
                        Text("🔥 Streak \(streak)")
                            .font(.system(size: 13, weight: .bold, design: .rounded))
                            .foregroundColor(.orange)
                    }
                }
                .padding(.top, 12)

                // Wrong feedback
                if wrongFeedback {
                    Text("❌ Sai rồi! Thử lại (\(maxAttempts - attempts) lần)")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(Theme.danger)
                        .padding(.vertical, 6)
                } else {
                    Spacer().frame(height: 12)
                }

                // Options: 2×2 IMAGE grid (no word text — kid picks by image)
                LazyVGrid(columns: [
                    GridItem(.flexible(), spacing: 10),
                    GridItem(.flexible(), spacing: 10)
                ], spacing: 10) {
                    ForEach(Array(q.options.enumerated()), id: \.element.id) { index, option in
                        GestureImageOptionButton(
                            word: option,
                            number: index + 1,
                            isPreviewed: previewedAnswer == option.id,
                            isSelected: selectedAnswer == option.id,
                            isCorrectAnswer: option.id == q.word.id,
                            isRevealed: selectedAnswer != nil
                        ) {
                            handleTapSelect(option)
                        }
                    }
                }
                .padding(.horizontal, 16)

                // Result feedback / Next button
                if selectedAnswer != nil {
                    VStack(spacing: 10) {
                        if isCorrect == true {
                            Text("✅ Đúng rồi! +10 XP")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(Theme.success)
                        } else {
                            Text("❌ Đáp án: \(q.word.en) = \(q.word.vi)")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(Theme.danger)
                        }

                        Button(action: goNext) {
                            HStack {
                                Text(currentIndex < questions.count - 1 ? "Câu tiếp ▶️" : "Xem kết quả 📊")
                                Text("(👍)")
                                    .foregroundColor(Theme.textMuted)
                            }
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 44)
                            .background(Theme.accentGradient)
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                        }
                        .padding(.horizontal, 16)
                    }
                    .padding(.top, 10)
                    .padding(.bottom, 16)
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                }

                Spacer(minLength: 16)
            }
        }
        .onChange(of: currentIndex) { newIndex in
            // Auto-speak the NEW word
            guard newIndex < questions.count else { return }
            let newWord = questions[newIndex].word.en
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                SpeechService.shared.speak(newWord)
            }
        }
        .onAppear {
            // Speak first word
            guard !questions.isEmpty else { return }
            let firstWord = questions[0].word.en
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
                SpeechService.shared.speak(firstWord)
            }
        }
    }

    // MARK: - Completed Screen
    private var completedScreen: some View {
        ZStack {
            ConfettiView()
            VStack(spacing: 20) {
                Text(score == questions.count ? "🌟" : score > questions.count / 2 ? "🎉" : "💪")
                    .font(.system(size: 72))

                Text(score == questions.count ? "Hoàn hảo!" : "Giỏi lắm!")
                    .font(.system(size: 32, weight: .bold, design: .rounded))
                    .foregroundColor(Theme.textPrimary)

                ZStack {
                    Circle().stroke(Theme.bgGlass, lineWidth: 8)
                    Circle()
                        .trim(from: 0, to: Double(score) / Double(questions.count))
                        .stroke(Theme.accentGradient, style: StrokeStyle(lineWidth: 8, lineCap: .round))
                        .rotationEffect(.degrees(-90))
                    VStack(spacing: 2) {
                        Text("\(score)/\(questions.count)")
                            .font(.system(size: 28, weight: .bold, design: .rounded))
                            .foregroundColor(Theme.textPrimary)
                        Text("câu đúng")
                            .font(.system(size: 12))
                            .foregroundColor(Theme.textMuted)
                    }
                }
                .frame(width: 120, height: 120)

                let elapsed = Int(Date().timeIntervalSince(startTime))
                Text("⏱ \(elapsed)s • 📷 Gesture Quiz")
                    .font(.system(size: 14))
                    .foregroundColor(Theme.textSecondary)

                Button(action: { dismiss() }) {
                    HStack {
                        Image(systemName: "house.fill")
                        Text("Về trang chủ")
                    }
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity).frame(height: 50)
                    .background(Theme.accentGradient)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                }
                .padding(.horizontal, 40)
            }
        }
    }

    // MARK: - Helpers
    private func speakCurrentWord() {
        guard currentIndex < questions.count else { return }
        SpeechService.shared.speak(questions[currentIndex].word.en)
    }

    // MARK: - Gesture Handling
    private func handleGesture(_ fingerCount: Int) {
        guard !questions.isEmpty, !completed else { return }
        let q = questions[currentIndex]

        // 5 fingers / thumbs-up = next (when result is showing)
        if fingerCount == 5 && selectedAnswer != nil {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) { goNext() }
            return
        }

        guard selectedAnswer == nil, !wrongFeedback else { return }

        // 1-4 fingers = preview option
        if fingerCount >= 1 && fingerCount <= 4 {
            let idx = fingerCount - 1
            if idx < q.options.count {
                withAnimation(.spring(response: 0.2)) {
                    previewedAnswer = q.options[idx].id
                }
            }
        }

        // Fist (0 fingers) = confirm previewed selection
        if fingerCount == 0, let previewed = previewedAnswer {
            if let option = q.options.first(where: { $0.id == previewed }) {
                submitAnswer(option)
            }
        }
    }

    private func handleTapSelect(_ option: Word) {
        guard selectedAnswer == nil, !wrongFeedback else { return }
        withAnimation(.spring(response: 0.2)) {
            previewedAnswer = option.id
        }
    }

    private func submitAnswer(_ option: Word) {
        let q = questions[currentIndex]
        let correct = option.id == q.word.id

        withAnimation(.spring(response: 0.3)) {
            selectedAnswer = option.id
            previewedAnswer = nil
        }

        if correct {
            isCorrect = true
            streak += 1
            score += 1
            UINotificationFeedbackGenerator().notificationOccurred(.success)
            // Voice feedback
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                SpeechService.shared.speak("Correct! \(q.word.en)", rate: 0.5)
            }
        } else {
            let newAttempts = attempts + 1
            attempts = newAttempts
            UINotificationFeedbackGenerator().notificationOccurred(.error)

            if newAttempts >= maxAttempts {
                isCorrect = false
                streak = 0
            } else {
                wrongFeedback = true
                selectedAnswer = nil
                DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                    wrongFeedback = false
                }
                return
            }
        }
    }

    private func goNext() {
        if currentIndex < questions.count - 1 {
            withAnimation(.spring(response: 0.3)) {
                currentIndex += 1
                selectedAnswer = nil
                isCorrect = nil
                previewedAnswer = nil
                attempts = 0
                wrongFeedback = false
            }
            UIImpactFeedbackGenerator(style: .soft).impactOccurred()
        } else {
            withAnimation(.spring()) { completed = true }
            gestureService.stopSession()
        }
    }

    private func generateQuestions() {
        questions = topic.words.shuffled().map { word in
            let others = topic.words.filter { $0.id != word.id }.shuffled().prefix(3)
            let options = ([word] + others).shuffled()
            return QuizQuestion(word: word, options: Array(options))
        }
        startTime = Date()
    }
}

// MARK: - Gesture Image Option Button (image-focused, no word text)
struct GestureImageOptionButton: View {
    let word: Word
    let number: Int
    let isPreviewed: Bool
    let isSelected: Bool
    let isCorrectAnswer: Bool
    let isRevealed: Bool
    let action: () -> Void

    private var bgColor: Color {
        if !isRevealed && !isPreviewed { return Theme.bgCard }
        if isPreviewed { return Theme.accent.opacity(0.15) }
        if isCorrectAnswer { return Color(hex: "00E676").opacity(0.2) }
        if isSelected { return Theme.danger.opacity(0.2) }
        return Theme.bgCard
    }

    private var borderColor: Color {
        if isPreviewed { return Theme.accent }
        if !isRevealed { return Theme.border }
        if isCorrectAnswer { return Theme.success }
        if isSelected { return Theme.danger }
        return Theme.border
    }

    var body: some View {
        Button(action: action) {
            VStack(spacing: 6) {
                // Number badge
                Text("\(number)")
                    .font(.system(size: 11, weight: .bold, design: .rounded))
                    .foregroundColor(isPreviewed ? .white : Theme.textMuted)
                    .frame(width: 22, height: 22)
                    .background(isPreviewed ? Theme.accent : Theme.bgGlass)
                    .clipShape(Circle())

                // Image — LARGE, the main thing kid sees
                WordImageView(word: word, size: 70)

                // Show English word ONLY after reveal (to learn)
                if isRevealed {
                    Text(word.en)
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(isCorrectAnswer ? Theme.success : .white.opacity(0.5))
                        .lineLimit(1)
                        .transition(.opacity)
                }

                // Result indicator
                if isRevealed {
                    if isCorrectAnswer {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundColor(Theme.success)
                            .font(.system(size: 18))
                    } else if isSelected {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(Theme.danger)
                            .font(.system(size: 18))
                    }
                }
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 10)
            .background(
                RoundedRectangle(cornerRadius: 14)
                    .fill(bgColor)
                    .overlay(
                        RoundedRectangle(cornerRadius: 14)
                            .stroke(borderColor, lineWidth: isPreviewed ? 2.5 : 1)
                    )
            )
            .scaleEffect(isPreviewed ? 1.05 : 1.0)
            .animation(.spring(response: 0.2), value: isPreviewed)
        }
        .disabled(isRevealed)
    }
}
