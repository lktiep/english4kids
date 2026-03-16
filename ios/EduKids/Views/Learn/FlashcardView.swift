import SwiftUI

// MARK: - Flashcard View
struct FlashcardView: View {
    let topic: TopicDetail
    @State private var currentIndex = 0
    @State private var isFlipped = false
    @State private var completed = false
    @State private var dragOffset: CGFloat = 0
    @StateObject private var speech = SpeechService.shared
    @Environment(\.dismiss) private var dismiss

    var word: Word { topic.words[currentIndex] }

    var body: some View {
        ZStack {
            Theme.bg.ignoresSafeArea()

            if completed {
                completedScreen
            } else {
                VStack(spacing: 0) {
                    // Progress Dots
                    progressDots
                        .padding(.top, 8)

                    Spacer()

                    // Flashcard
                    flashcard
                        .padding(.horizontal, 24)

                    Spacer()

                    // Actions
                    actionButtons
                        .padding(.bottom, 32)
                }
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .principal) {
                HStack(spacing: 6) {
                    Text(topic.icon)
                    Text(topic.titleVi)
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
        .onAppear { speakWord() }
    }

    // MARK: - Progress Dots
    private var progressDots: some View {
        HStack(spacing: 4) {
            ForEach(0..<topic.words.count, id: \.self) { i in
                Circle()
                    .fill(i == currentIndex ? Theme.accent : (i < currentIndex ? Theme.success : Theme.bgGlass))
                    .frame(width: i == currentIndex ? 10 : 6, height: i == currentIndex ? 10 : 6)
                    .animation(.spring(response: 0.3), value: currentIndex)
            }
        }
    }

    // MARK: - Flashcard
    private var flashcard: some View {
        ZStack {
            // Front
            cardContent(isFront: true)
                .rotation3DEffect(.degrees(isFlipped ? 180 : 0), axis: (x: 0, y: 1, z: 0))
                .opacity(isFlipped ? 0 : 1)

            // Back
            cardContent(isFront: false)
                .rotation3DEffect(.degrees(isFlipped ? 0 : -180), axis: (x: 0, y: 1, z: 0))
                .opacity(isFlipped ? 1 : 0)
        }
        .offset(x: dragOffset)
        .rotationEffect(.degrees(dragOffset / 30))
        .gesture(
            DragGesture()
                .onChanged { v in
                    withAnimation(.interactiveSpring()) { dragOffset = v.translation.width }
                }
                .onEnded { v in
                    if v.translation.width > 80 {
                        withAnimation(.spring()) { dragOffset = 400 }
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) { goNext() }
                    } else if v.translation.width < -80 {
                        withAnimation(.spring()) { dragOffset = -400 }
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) { goPrev() }
                    } else {
                        withAnimation(.spring()) { dragOffset = 0 }
                    }
                }
        )
        .onTapGesture { flipCard() }
    }

    private func cardContent(isFront: Bool) -> some View {
        VStack(spacing: 20) {
            WordImageView(word: word, size: 120)

            Text(word.word)
                .font(.system(size: 36, weight: .bold, design: .rounded))
                .foregroundColor(Theme.textPrimary)

            if isFront {
                Text(word.pronunciation ?? "")
                    .font(.system(size: 16))
                    .foregroundColor(Theme.accent)

                Text("👆 Chạm để xem nghĩa")
                    .font(.system(size: 13))
                    .foregroundColor(Theme.textMuted)
                    .padding(.top, 12)
            } else {
                Text(word.vietnamese)
                    .font(.system(size: 22, weight: .semibold))
                    .foregroundColor(Theme.tertiary)

                VStack(spacing: 6) {
                    Text("\"\(word.sentence ?? "")\"")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Theme.textSecondary)
                        .multilineTextAlignment(.center)

                    Text(word.sentenceVi ?? "")
                        .font(.system(size: 13))
                        .foregroundColor(Theme.textMuted)
                }
                .padding(.top, 8)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 48)
        .padding(.horizontal, 24)
        .background(
            RoundedRectangle(cornerRadius: Theme.cornerXL)
                .fill(Theme.bgCard)
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.cornerXL)
                        .stroke(Theme.border, lineWidth: 1)
                )
        )
        .shadow(color: Theme.accent.opacity(0.08), radius: 20, y: 8)
    }

    // MARK: - Action Buttons
    private var actionButtons: some View {
        HStack(spacing: 16) {
            CircleButton(icon: "chevron.left", action: goPrev, disabled: currentIndex == 0)
            CircleButton(icon: "speaker.wave.2.fill", action: speakWord, color: Theme.accent, size: 56)
            CircleButton(icon: "arrow.triangle.2.circlepath", action: flipCard, color: Theme.secondary)
            CircleButton(icon: "chevron.right", action: goNext)
        }
    }

    // MARK: - Completed Screen
    private var completedScreen: some View {
        ZStack {
            ConfettiView()

            VStack(spacing: 20) {
                Text("🎉")
                    .font(.system(size: 64))
                Text("Giỏi lắm!")
                    .font(.system(size: 28, weight: .bold, design: .rounded))
                    .foregroundColor(Theme.textPrimary)
                Text("Bé đã học xong \(topic.words.count) từ chủ đề \(topic.titleVi)")
                    .font(.system(size: 15))
                    .foregroundColor(Theme.textSecondary)
                    .multilineTextAlignment(.center)

                Text("+50 XP")
                    .font(.system(size: 24, weight: .bold, design: .rounded))
                    .foregroundStyle(Theme.goldGradient)
                    .padding(.top, 8)

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
                .padding(.top, 16)
            }
        }
    }

    // MARK: - Logic
    private func speakWord() { speech.speak(word.word) }

    private func flipCard() {
        withAnimation(.spring(response: 0.4, dampingFraction: 0.7)) {
            isFlipped.toggle()
        }
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
    }

    private func goNext() {
        if currentIndex < topic.words.count - 1 {
            isFlipped = false
            dragOffset = 0
            withAnimation(.spring(response: 0.3)) { currentIndex += 1 }
            UIImpactFeedbackGenerator(style: .soft).impactOccurred()
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) { speakWord() }
        } else {
            withAnimation(.spring()) { completed = true }
        }
    }

    private func goPrev() {
        if currentIndex > 0 {
            isFlipped = false
            dragOffset = 0
            withAnimation(.spring(response: 0.3)) { currentIndex -= 1 }
            UIImpactFeedbackGenerator(style: .soft).impactOccurred()
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) { speakWord() }
        }
    }
}

// MARK: - Circle Button
struct CircleButton: View {
    let icon: String
    let action: () -> Void
    var color: Color = Theme.textSecondary
    var size: CGFloat = 48
    var disabled: Bool = false

    var body: some View {
        Button(action: action) {
            Image(systemName: icon)
                .font(.system(size: size * 0.36, weight: .semibold))
                .foregroundColor(disabled ? Theme.textMuted : color)
                .frame(width: size, height: size)
                .background(Theme.bgGlass)
                .clipShape(Circle())
                .overlay(Circle().stroke(Theme.border, lineWidth: 1))
        }
        .disabled(disabled)
    }
}
