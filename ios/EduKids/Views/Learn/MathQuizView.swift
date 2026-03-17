import SwiftUI

// MARK: - Math Quiz View (native, same flow as English QuizView)
struct MathQuizView: View {
    let topic: MathTopicDetail
    @Environment(\.dismiss) var dismiss
    @State private var currentIndex = 0
    @State private var selected: String? = nil
    @State private var isCorrect = false
    @State private var showResult = false
    @State private var score = 0
    @State private var total = 0
    @State private var streak = 0
    @State private var finished = false
    @State private var attempts = 0
    @State private var wrongFeedback = false
    private let maxAttempts = 2

    var exercises: [MathExercise] { topic.exercises }
    var current: MathExercise? { currentIndex < exercises.count ? exercises[currentIndex] : nil }
    var accuracy: Int { total > 0 ? Int(Double(score) / Double(total) * 100) : 0 }
    var stars: Int { accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 50 ? 1 : 0 }

    var body: some View {
        ZStack {
            Theme.bg.ignoresSafeArea()

            if finished {
                resultsView
            } else if let q = current {
                quizView(q)
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .principal) {
                Text("\(topic.icon) \(topic.titleVi)")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.white)
            }
        }
    }

    // MARK: - Quiz Question View
    @ViewBuilder
    func quizView(_ q: MathExercise) -> some View {
        VStack(spacing: 0) {
            // Progress bar
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 4)
                        .fill(.white.opacity(0.1))
                        .frame(height: 6)
                    RoundedRectangle(cornerRadius: 4)
                        .fill(Color(hex: topic.color))
                        .frame(width: geo.size.width * CGFloat(currentIndex) / CGFloat(max(exercises.count, 1)), height: 6)
                }
            }
            .frame(height: 6)
            .padding(.horizontal, 20)
            .padding(.top, 8)

            // Counter + streak
            HStack {
                Text("\(currentIndex + 1)/\(exercises.count)")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.white.opacity(0.5))
                Spacer()
                if streak > 0 {
                    Text("🔥\(streak)")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.orange)
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 8)

            Spacer()

            // Question — split text from emoji
            VStack(spacing: 12) {
                let parts = splitQuestionEmoji(q.question)
                Text(parts.text)
                    .font(.system(size: 24, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)

                if let emoji = parts.emoji {
                    Text(emoji)
                        .font(.system(size: 44))
                        .lineSpacing(8)
                }

                if let vi = q.questionVi {
                    Text(vi)
                        .font(.system(size: 14))
                        .foregroundColor(.white.opacity(0.5))
                }
            }
            .padding(.horizontal, 20)

            Spacer()

            // Wrong feedback
            if wrongFeedback {
                Text("❌ Sai rồi! Thử lại (\(maxAttempts - attempts) lần còn)")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.red)
                    .padding(.bottom, 8)
            }

            // Options grid
            LazyVGrid(columns: [
                GridItem(.flexible(), spacing: 12),
                GridItem(.flexible(), spacing: 12)
            ], spacing: 12) {
                ForEach(Array(q.options.enumerated()), id: \.offset) { idx, option in
                    let optStr = option.stringValue
                    let isAnswer = optStr == q.answer.stringValue
                    let isSelected = selected == optStr

                    Button {
                        guard !showResult && !wrongFeedback else { return }
                        submitAnswer(optStr, isAnswer: isAnswer)
                    } label: {
                        VStack(spacing: 6) {
                            Text("\(idx + 1)")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.white.opacity(0.4))
                                .frame(maxWidth: .infinity, alignment: .leading)
                            Text(optStr)
                                .font(.system(size: 22, weight: .bold, design: .rounded))
                                .foregroundColor(.white)
                        }
                        .padding(16)
                        .frame(maxWidth: .infinity, minHeight: 80)
                        .background(
                            RoundedRectangle(cornerRadius: 16)
                                .fill(optionColor(isSelected: isSelected, isAnswer: isAnswer))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(optionBorder(isSelected: isSelected, isAnswer: isAnswer), lineWidth: 2)
                                )
                        )
                    }
                    .disabled(showResult || wrongFeedback)
                }
            }
            .padding(.horizontal, 20)

            // Result feedback + next
            if showResult {
                VStack(spacing: 10) {
                    Text(isCorrect ? "✅ Đúng rồi! +10 XP" : "❌ Đáp án: \(current?.answer.stringValue ?? "")")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(isCorrect ? .green : .red)

                    if let hint = current?.hint {
                        Text("💡 \(hint)")
                            .font(.system(size: 13))
                            .foregroundColor(.white.opacity(0.5))
                    }

                    Button {
                        nextQuestion()
                    } label: {
                        Text(currentIndex < exercises.count - 1 ? "Câu tiếp ▶️" : "Xem kết quả 📊")
                            .font(.system(size: 16, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(
                                RoundedRectangle(cornerRadius: 14)
                                    .fill(Color(hex: topic.color))
                            )
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, 12)
            }

            Spacer().frame(height: 32)
        }
    }

    // MARK: - Results View
    var resultsView: some View {
        VStack(spacing: 20) {
            Spacer()

            // Stars
            HStack(spacing: 8) {
                ForEach(1...3, id: \.self) { i in
                    Text("⭐")
                        .font(.system(size: 36))
                        .opacity(i <= stars ? 1 : 0.2)
                        .scaleEffect(i <= stars ? 1.1 : 0.9)
                }
            }

            Text(accuracy >= 70 ? "Giỏi lắm! 🎉" : "Cố gắng lên! 💪")
                .font(.system(size: 26, weight: .bold, design: .rounded))
                .foregroundColor(.white)

            // Score card
            HStack(spacing: 16) {
                statBox(value: "\(score)", label: "Đúng")
                statDivider
                statBox(value: "\(total)", label: "Tổng")
                statDivider
                statBox(value: "\(accuracy)%", label: "Chính xác")
            }
            .padding(20)
            .background(
                RoundedRectangle(cornerRadius: 20)
                    .fill(.white.opacity(0.06))
                    .overlay(
                        RoundedRectangle(cornerRadius: 20)
                            .stroke(.white.opacity(0.1), lineWidth: 1)
                    )
            )
            .padding(.horizontal, 20)

            Spacer()

            // Actions
            VStack(spacing: 10) {
                Button {
                    dismiss()
                } label: {
                    HStack {
                        Text("🔄")
                        Text("Làm quiz khác")
                    }
                    .font(.system(size: 16, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(
                        RoundedRectangle(cornerRadius: 14)
                            .fill(Color(hex: topic.color))
                    )
                }
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 32)
        }
    }

    // MARK: - Helpers
    private func submitAnswer(_ optStr: String, isAnswer: Bool) {
        selected = optStr

        if isAnswer {
            isCorrect = true
            showResult = true
            score += 1
            total += 1
            streak += 1
        } else {
            attempts += 1
            if attempts >= maxAttempts {
                isCorrect = false
                showResult = true
                total += 1
                streak = 0
            } else {
                wrongFeedback = true
                selected = nil
                DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
                    wrongFeedback = false
                }
            }
        }
    }

    private func nextQuestion() {
        if currentIndex < exercises.count - 1 {
            currentIndex += 1
            selected = nil
            showResult = false
            isCorrect = false
            attempts = 0
            wrongFeedback = false
        } else {
            finished = true
        }
    }

    private func splitQuestionEmoji(_ text: String) -> (text: String, emoji: String?) {
        // Split trailing emoji from text
        var lastTextIndex = text.endIndex
        for (offset, char) in text.reversed().enumerated() {
            if char.isEmoji || char == " " {
                continue
            } else {
                let idx = text.index(text.endIndex, offsetBy: -(offset))
                lastTextIndex = idx
                break
            }
        }
        let textPart = String(text[text.startIndex..<lastTextIndex]).trimmingCharacters(in: .whitespaces)
        let emojiPart = String(text[lastTextIndex...]).trimmingCharacters(in: .whitespaces)
        
        return (text: textPart.isEmpty ? text : textPart, emoji: emojiPart.isEmpty ? nil : emojiPart)
    }

    private func optionColor(isSelected: Bool, isAnswer: Bool) -> Color {
        guard showResult else { return .white.opacity(0.06) }
        if isAnswer { return .green.opacity(0.2) }
        if isSelected { return .red.opacity(0.2) }
        return .white.opacity(0.06)
    }

    private func optionBorder(isSelected: Bool, isAnswer: Bool) -> Color {
        guard showResult else { return .white.opacity(0.1) }
        if isAnswer { return .green.opacity(0.6) }
        if isSelected { return .red.opacity(0.6) }
        return .white.opacity(0.1)
    }

    private func statBox(value: String, label: String) -> some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.system(size: 22, weight: .bold, design: .rounded))
                .foregroundColor(.white)
            Text(label)
                .font(.system(size: 12))
                .foregroundColor(.white.opacity(0.5))
        }
    }

    private var statDivider: some View {
        Rectangle()
            .fill(.white.opacity(0.15))
            .frame(width: 1, height: 40)
    }
}

// MARK: - Character isEmoji helper
extension Character {
    var isEmoji: Bool {
        unicodeScalars.contains { $0.properties.isEmoji && $0.value > 0x238C }
    }
}
