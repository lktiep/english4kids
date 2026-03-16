import SwiftUI

// MARK: - Speak View (Pronunciation Practice)
struct SpeakView: View {
    let topic: TopicDetail
    @StateObject private var speech = SpeechService.shared
    @Environment(\.dismiss) private var dismiss

    @State private var currentIndex = 0
    @State private var result: (score: Double, match: Bool)?
    @State private var completed = false
    @State private var stats = (perfect: 0, good: 0, tryAgain: 0)
    @State private var micPulse = false

    var word: Word { topic.words[currentIndex] }

    var body: some View {
        ZStack {
            Theme.bg.ignoresSafeArea()

            if completed {
                completedScreen
            } else {
                pronunciationContent
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .principal) {
                HStack(spacing: 6) {
                    Image(systemName: "mic.fill")
                        .foregroundColor(Theme.tertiary)
                    Text("Luyện nói")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Theme.textPrimary)
                }
            }
            ToolbarItem(placement: .topBarTrailing) {
                Text("\(currentIndex + 1)/\(topic.words.count)")
                    .font(.system(size: 13, weight: .bold, design: .rounded))
                    .foregroundColor(Theme.textMuted)
            }
        }
    }

    // MARK: - Content
    private var pronunciationContent: some View {
        VStack(spacing: 24) {
            Spacer()

            // Word Card
            VStack(spacing: 14) {
                WordImageView(word: word, size: 100)

                Text(word.word)
                    .font(.system(size: 36, weight: .bold, design: .rounded))
                    .foregroundColor(Theme.textPrimary)

                Text(word.pronunciation ?? "")
                    .font(.system(size: 16))
                    .foregroundColor(Theme.accent)

                Text(word.vietnamese)
                    .font(.system(size: 18))
                    .foregroundColor(Theme.textSecondary)
            }
            .padding(.vertical, 32)
            .frame(maxWidth: .infinity)
            .glassCard(cornerRadius: Theme.cornerXL)
            .padding(.horizontal, 24)

            Spacer()

            // Controls
            HStack(spacing: 24) {
                // Listen
                Button(action: { speech.speak(word.word) }) {
                    VStack(spacing: 6) {
                        Image(systemName: "speaker.wave.2.fill")
                            .font(.system(size: 24))
                            .frame(width: 56, height: 56)
                            .background(Theme.accent.opacity(0.12))
                            .clipShape(Circle())
                        Text("Nghe mẫu")
                            .font(.system(size: 11, weight: .medium))
                            .foregroundColor(Theme.textMuted)
                    }
                }
                .foregroundColor(Theme.accent)

                // Speak
                Button(action: { Task { await startListening() } }) {
                    VStack(spacing: 6) {
                        ZStack {
                            if speech.isListening {
                                Circle()
                                    .fill(Theme.danger.opacity(0.2))
                                    .frame(width: 80, height: 80)
                                    .scaleEffect(micPulse ? 1.3 : 1)
                                    .opacity(micPulse ? 0 : 0.5)
                            }

                            Image(systemName: speech.isListening ? "mic.fill" : "mic")
                                .font(.system(size: 28, weight: .semibold))
                                .frame(width: 72, height: 72)
                                .background(
                                    speech.isListening
                                    ? Theme.danger.opacity(0.2)
                                    : Theme.tertiary.opacity(0.12)
                                )
                                .clipShape(Circle())
                                .overlay(
                                    Circle()
                                        .stroke(speech.isListening ? Theme.danger.opacity(0.4) : Theme.tertiary.opacity(0.3), lineWidth: 2)
                                )
                        }

                        Text(speech.isListening ? "Đang nghe..." : "Nói thử")
                            .font(.system(size: 11, weight: .medium))
                            .foregroundColor(Theme.textMuted)
                    }
                }
                .foregroundColor(speech.isListening ? Theme.danger : Theme.tertiary)
                .disabled(speech.isListening)
            }

            // Result
            if let result = result {
                resultCard(result)
                    .transition(.asymmetric(
                        insertion: .scale.combined(with: .opacity),
                        removal: .opacity
                    ))
            }

            Spacer().frame(height: 24)
        }
    }

    // MARK: - Result Card
    private func resultCard(_ r: (score: Double, match: Bool)) -> some View {
        VStack(spacing: 12) {
            HStack {
                Image(systemName: r.score >= 80 ? "sparkles" : r.match ? "hand.thumbsup.fill" : "bolt.heart.fill")
                    .font(.system(size: 28))
                    .foregroundColor(r.score >= 80 ? Theme.success : r.match ? Theme.tertiary : Theme.danger)
                Text("\(Int(r.score))%")
                    .font(.system(size: 24, weight: .bold, design: .rounded))
                    .foregroundColor(r.score >= 80 ? Theme.success : r.match ? Theme.tertiary : Theme.danger)
            }

            Text(r.score >= 80 ? "Tuyệt vời! Phát âm chuẩn!" : r.match ? "Tốt lắm! Cố thêm chút nữa!" : "Thử lại nhé, bé ơi!")
                .font(.system(size: 14))
                .foregroundColor(Theme.textSecondary)

            if !speech.transcript.isEmpty {
                Text("Bé nói: \"\(speech.transcript)\"")
                    .font(.system(size: 13))
                    .foregroundColor(Theme.textMuted)
            }

            HStack(spacing: 12) {
                Button { Task { await startListening() } } label: {
                    HStack(spacing: 4) {
                        Image(systemName: "arrow.counterclockwise")
                        Text("Nói lại")
                    }
                }
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Theme.accent)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 10)
                    .background(Theme.accent.opacity(0.12))
                    .clipShape(Capsule())

                Button { goNext() } label: {
                    HStack(spacing: 4) {
                        Image(systemName: currentIndex < topic.words.count - 1 ? "forward.fill" : "chart.bar.fill")
                        Text(currentIndex < topic.words.count - 1 ? "Từ tiếp" : "Kết quả")
                    }
                }
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(.white)
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(Theme.accentGradient)
                .clipShape(Capsule())
            }
        }
        .padding(20)
        .frame(maxWidth: .infinity)
        .glassCard(cornerRadius: Theme.cornerMD)
        .padding(.horizontal, 24)
    }

    // MARK: - Completed
    private var completedScreen: some View {
        VStack(spacing: 24) {
            Spacer()

            Image(systemName: "mic.fill")
                .font(.system(size: 56))
                .foregroundColor(Theme.tertiary)
            Text("Luyện nói xong rồi!")
                .font(.system(size: 28, weight: .bold, design: .rounded))
                .foregroundColor(Theme.textPrimary)

            HStack(spacing: 20) {
                SpeakStatCard(sfIcon: "sparkles", count: stats.perfect, label: "Tuyệt vời", color: Theme.success)
                SpeakStatCard(sfIcon: "hand.thumbsup.fill", count: stats.good, label: "Tốt", color: Theme.tertiary)
                SpeakStatCard(sfIcon: "bolt.heart.fill", count: stats.tryAgain, label: "Cần luyện", color: Theme.danger)
            }
            .padding(.horizontal, 24)

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

            Spacer()
        }
    }

    // MARK: - Logic
    private func startListening() async {
        result = nil
        await speech.startListening()

        // Wait for result
        DispatchQueue.main.asyncAfter(deadline: .now() + 5.5) {
            guard !speech.transcript.isEmpty else { return }
            let r = speech.scorePronunciation(expected: word.word, actual: speech.transcript)
            withAnimation(.spring()) { result = r }

            if r.score >= 80 {
                stats.perfect += 1
                UINotificationFeedbackGenerator().notificationOccurred(.success)
            } else if r.match {
                stats.good += 1
            } else {
                stats.tryAgain += 1
                UINotificationFeedbackGenerator().notificationOccurred(.warning)
            }
        }

        withAnimation(.easeInOut(duration: 0.8).repeatForever(autoreverses: true)) {
            micPulse = true
        }
    }

    private func goNext() {
        if currentIndex < topic.words.count - 1 {
            withAnimation(.spring(response: 0.3)) {
                currentIndex += 1
                result = nil
                micPulse = false
            }
            UIImpactFeedbackGenerator(style: .soft).impactOccurred()
        } else {
            withAnimation(.spring()) { completed = true }
        }
    }
}

// MARK: - Speak Stat Card
struct SpeakStatCard: View {
    let sfIcon: String
    let count: Int
    let label: String
    let color: Color

    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: sfIcon)
                .font(.system(size: 24))
                .foregroundColor(color)
            Text("\(count)")
                .font(.system(size: 24, weight: .bold, design: .rounded))
                .foregroundColor(Theme.textPrimary)
            Text(label)
                .font(.system(size: 11, weight: .medium))
                .foregroundColor(Theme.textMuted)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)
        .glassCard()
    }
}
