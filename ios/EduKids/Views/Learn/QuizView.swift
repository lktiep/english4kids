import SwiftUI

// MARK: - Quiz View (Word → Pick Image)
/// Shows English word (text + TTS) → pick correct image from 4 options.
struct QuizView: View {
    let topic: TopicDetail
    @EnvironmentObject var authVM: AuthViewModel
    @Environment(\.dismiss) private var dismiss

    @State private var questions: [QuizQuestion] = []
    @State private var currentIndex = 0
    @State private var score = 0
    @State private var selectedAnswer: String?
    @State private var isCorrect: Bool?
    @State private var completed = false
    @State private var timeRemaining: Double = 1.0
    @State private var shakeOffset: CGFloat = 0
    @State private var timer: Timer?
    @State private var startTime = Date()

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
                Text("\(currentIndex + 1)/\(questions.count)")
                    .font(.system(size: 15, weight: .bold, design: .rounded))
                    .foregroundColor(Theme.textSecondary)
            }
        }
        .onAppear { generateQuestions() }
        .onDisappear { timer?.invalidate() }
    }

    // MARK: - Quiz Content (Word → Pick Image)
    private var quizContent: some View {
        let q = questions[currentIndex]
        return VStack(spacing: 0) {
            // Timer Bar
            GeometryReader { geo in
                RoundedRectangle(cornerRadius: 3)
                    .fill(timeRemaining > 0.3 ? Theme.accent : Theme.danger)
                    .frame(width: geo.size.width * timeRemaining, height: 4)
                    .animation(.linear(duration: 0.1), value: timeRemaining)
            }
            .frame(height: 4)
            .padding(.horizontal, Theme.spacing)
            .padding(.top, 8)

            Spacer()

            // Question: show the WORD in English (big, bold) + speak it
            VStack(spacing: 12) {
                // English word — big and prominent
                Text(q.word.en)
                    .font(.system(size: 42, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)

                // Vietnamese hint
                Text(q.word.vi)
                    .font(.system(size: 16))
                    .foregroundColor(.white.opacity(0.4))

                // "Chọn hình đúng" prompt
                Text("Chọn hình đúng 👇")
                    .font(.system(size: 15, weight: .medium))
                    .foregroundColor(Theme.accent)
                    .padding(.top, 4)

                // Listen again button
                Button {
                    SpeechService.shared.speak(q.word.en)
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "speaker.wave.2.fill")
                        Text("Nghe lại")
                    }
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Theme.accent)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(
                        Capsule()
                            .fill(Theme.accent.opacity(0.15))
                    )
                }
                .padding(.top, 4)
            }
            .offset(x: shakeOffset)
            .onChange(of: currentIndex) { newIndex in
                // Auto-speak the NEW word after index changes
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
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    SpeechService.shared.speak(firstWord)
                }
            }

            Spacer()

            // Options: 2×2 image grid
            LazyVGrid(columns: [
                GridItem(.flexible(), spacing: 12),
                GridItem(.flexible(), spacing: 12)
            ], spacing: 12) {
                ForEach(q.options, id: \.id) { option in
                    ImageOptionButton(
                        word: option,
                        isSelected: selectedAnswer == option.id,
                        isCorrect: selectedAnswer != nil ? option.id == q.word.id : nil,
                        revealed: selectedAnswer != nil
                    ) {
                        selectAnswer(option, question: q)
                    }
                }
            }
            .padding(.horizontal, Theme.spacing)
            .padding(.bottom, 32)
        }
    }

    // MARK: - Completed
    private var completedScreen: some View {
        ZStack {
            ConfettiView()

            VStack(spacing: 20) {
                Text(score == questions.count ? "🌟" : score > questions.count / 2 ? "🎉" : "💪")
                    .font(.system(size: 72))

                Text(score == questions.count ? "Hoàn hảo!" : "Giỏi lắm!")
                    .font(.system(size: 32, weight: .bold, design: .rounded))
                    .foregroundColor(Theme.textPrimary)

                // Score Ring
                ZStack {
                    Circle()
                        .stroke(Theme.bgGlass, lineWidth: 8)
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
                .padding(.vertical, 8)

                let elapsed = Int(Date().timeIntervalSince(startTime))
                Text("Thời gian: \(elapsed)s")
                    .font(.system(size: 14))
                    .foregroundColor(Theme.textSecondary)

                Button(action: { dismiss() }) {
                    HStack {
                        Image(systemName: "house.fill")
                        Text("Về trang chủ")
                    }
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 50)
                    .background(Theme.accentGradient)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                }
                .padding(.horizontal, 40)
            }
        }
    }

    // MARK: - Logic
    private func generateQuestions() {
        questions = topic.words.shuffled().map { word in
            let others = topic.words.filter { $0.id != word.id }.shuffled().prefix(3)
            let options = ([word] + others).shuffled()
            return QuizQuestion(word: word, options: Array(options))
        }
        startTime = Date()
        startTimer()
    }

    private func startTimer() {
        timeRemaining = 1.0
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { _ in
            if timeRemaining > 0 {
                timeRemaining -= 0.01
            } else {
                timer?.invalidate()
                if selectedAnswer == nil {
                    selectAnswer(Word(en: "", vi: "", image: nil, audio: nil, emoji: "", pronunciation: "", sentence: "", sentenceVi: ""), question: questions[currentIndex])
                }
            }
        }
    }

    private func selectAnswer(_ option: Word, question: QuizQuestion) {
        guard selectedAnswer == nil else { return }
        selectedAnswer = option.id
        let correct = option.id == question.word.id
        isCorrect = correct

        if correct {
            score += 1
            UINotificationFeedbackGenerator().notificationOccurred(.success)
            // Speak "Correct!" feedback
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                SpeechService.shared.speak("Correct! \(question.word.en)", rate: 0.5)
            }
        } else {
            UINotificationFeedbackGenerator().notificationOccurred(.error)
            withAnimation(.spring(response: 0.1).repeatCount(4, autoreverses: true)) {
                shakeOffset = 10
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) { shakeOffset = 0 }
        }

        timer?.invalidate()

        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            if currentIndex < questions.count - 1 {
                withAnimation(.spring(response: 0.3)) {
                    currentIndex += 1
                    selectedAnswer = nil
                    isCorrect = nil
                }
                startTimer()
            } else {
                withAnimation(.spring()) { completed = true }
                submitQuiz()
            }
        }
    }

    private func submitQuiz() {
        guard let child = authVM.activeChild else { return }
        struct SubmitBody: Encodable {
            let child_id: String
            let topic: String
            let score: Int
            let total: Int
            let accuracy: Double
            let time_taken: Int
        }
        Task {
            let elapsed = Int(Date().timeIntervalSince(startTime))
            let body = SubmitBody(
                child_id: child.id,
                topic: topic.topic,
                score: score,
                total: questions.count,
                accuracy: Double(score) / Double(questions.count) * 100,
                time_taken: elapsed
            )
            try? await APIService.shared.postVoid("/quiz/submit", body: body)
        }
    }
}

// MARK: - Quiz Question
struct QuizQuestion: Identifiable {
    let id = UUID()
    let word: Word
    let options: [Word]
}

// MARK: - Image Option Button (2×2 grid)
/// Shows image/emoji in a card — kid taps the correct image for the word.
struct ImageOptionButton: View {
    let word: Word
    let isSelected: Bool
    let isCorrect: Bool?
    let revealed: Bool
    let action: () -> Void

    @State private var appear = false

    private var bgColor: Color {
        if !revealed { return Theme.bgCard }
        if word.id == "" { return Theme.bgCard }
        if isCorrect == true && isSelected { return Color(hex: "00E676").opacity(0.2) }
        if isCorrect == true && !isSelected { return Color(hex: "00E676").opacity(0.1) }
        if isSelected && isCorrect == false { return Theme.danger.opacity(0.2) }
        return Theme.bgCard
    }

    private var borderColor: Color {
        if !revealed { return isSelected ? Theme.accent : Theme.border }
        if isCorrect == true { return Theme.success.opacity(0.6) }
        if isSelected && isCorrect == false { return Theme.danger.opacity(0.6) }
        return Theme.border
    }

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                // Image — large, centered
                WordImageView(word: word, size: 90)

                // English word label (small, below image for confirmation after reveal)
                if revealed {
                    Text(word.en)
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(isCorrect == true ? Theme.success : .white.opacity(0.6))
                        .lineLimit(1)
                        .transition(.opacity)
                }
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .padding(.horizontal, 8)
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(bgColor)
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(borderColor, lineWidth: 2)
                    )
            )
            .overlay(alignment: .topTrailing) {
                if revealed {
                    if isCorrect == true {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundColor(Theme.success)
                            .font(.system(size: 20))
                            .offset(x: 6, y: -6)
                            .transition(.scale)
                    } else if isSelected {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(Theme.danger)
                            .font(.system(size: 20))
                            .offset(x: 6, y: -6)
                            .transition(.scale)
                    }
                }
            }
        }
        .disabled(revealed)
        .scaleEffect(appear ? 1 : 0.9)
        .opacity(appear ? 1 : 0)
        .onAppear {
            withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) { appear = true }
        }
    }
}

// MARK: - Old OptionButton kept for backward compat if needed
struct OptionButton: View {
    let word: Word
    let isSelected: Bool
    let isCorrect: Bool?
    let revealed: Bool
    let action: () -> Void

    var body: some View {
        ImageOptionButton(word: word, isSelected: isSelected, isCorrect: isCorrect, revealed: revealed, action: action)
    }
}
