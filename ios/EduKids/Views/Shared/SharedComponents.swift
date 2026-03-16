import SwiftUI

// MARK: - Accuracy Ring (Donut Chart)
struct AccuracyRingView: View {
    let accuracy: Double // 0-100
    var size: CGFloat = 56
    var lineWidth: CGFloat = 5

    @State private var animatedProgress: Double = 0

    var body: some View {
        ZStack {
            // Background ring
            Circle()
                .stroke(Theme.bgGlass, lineWidth: lineWidth)

            // Progress ring
            Circle()
                .trim(from: 0, to: animatedProgress / 100)
                .stroke(
                    AngularGradient(
                        colors: [Theme.accent, Theme.success, Theme.accent],
                        center: .center
                    ),
                    style: StrokeStyle(lineWidth: lineWidth, lineCap: .round)
                )
                .rotationEffect(.degrees(-90))

            // Center text
            Text("\(Int(accuracy))%")
                .font(.system(size: size * 0.22, weight: .bold, design: .rounded))
                .foregroundColor(Theme.accent)
        }
        .frame(width: size, height: size)
        .onAppear {
            withAnimation(.easeOut(duration: 1.0).delay(0.2)) {
                animatedProgress = accuracy
            }
        }
    }
}

// MARK: - Progress Bar
struct ProgressBarView: View {
    let progress: Double // 0-1
    var height: CGFloat = 6
    var color: Color = Theme.accent

    @State private var animatedWidth: Double = 0

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                RoundedRectangle(cornerRadius: height / 2)
                    .fill(Theme.bgGlass)

                RoundedRectangle(cornerRadius: height / 2)
                    .fill(
                        LinearGradient(
                            colors: [color, color.opacity(0.7)],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .frame(width: geo.size.width * animatedWidth)
            }
        }
        .frame(height: height)
        .onAppear {
            withAnimation(.spring(response: 0.8, dampingFraction: 0.7).delay(0.3)) {
                animatedWidth = progress
            }
        }
    }
}

// MARK: - Confetti View
struct ConfettiView: View {
    @State private var particles: [ConfettiParticle] = []

    struct ConfettiParticle: Identifiable {
        let id = UUID()
        let x: CGFloat
        let color: Color
        let delay: Double
        let rotation: Double
        let size: CGFloat
    }

    var body: some View {
        ZStack {
            ForEach(particles) { p in
                ConfettiPiece(particle: p)
            }
        }
        .onAppear { generateParticles() }
        .allowsHitTesting(false)
    }

    func generateParticles() {
        let colors: [Color] = [
            Color(hex: "FFD700"), Theme.accent,
            Color(hex: "FF6B6B"), Theme.secondary,
            Color(hex: "FFB347"), Theme.success
        ]
        particles = (0..<30).map { i in
            ConfettiParticle(
                x: CGFloat.random(in: 0...UIScreen.main.bounds.width),
                color: colors[i % colors.count],
                delay: Double(i) * 0.05,
                rotation: Double.random(in: 0...360),
                size: CGFloat.random(in: 6...12)
            )
        }
    }
}

struct ConfettiPiece: View {
    let particle: ConfettiView.ConfettiParticle
    @State private var offsetY: CGFloat = -50
    @State private var opacity: Double = 1

    var body: some View {
        RoundedRectangle(cornerRadius: 2)
            .fill(particle.color)
            .frame(width: particle.size, height: particle.size * 0.6)
            .rotationEffect(.degrees(particle.rotation))
            .position(x: particle.x, y: offsetY)
            .opacity(opacity)
            .onAppear {
                withAnimation(
                    .easeIn(duration: Double.random(in: 2...3))
                    .delay(particle.delay)
                ) {
                    offsetY = UIScreen.main.bounds.height + 50
                    opacity = 0
                }
            }
    }
}
