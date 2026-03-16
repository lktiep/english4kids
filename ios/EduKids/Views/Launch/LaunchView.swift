import SwiftUI

// MARK: - Animated Background (Reusable)
struct AnimatedGradientBackground: View {
    @State private var phase: CGFloat = 0

    var body: some View {
        GeometryReader { geo in
            ZStack {
                Color(hex: "0A0A1A")

                Image("AppBackground")
                    .resizable()
                    .scaledToFill()
                    .ignoresSafeArea()
                    .opacity(0.65)

                Circle()
                    .fill(
                        RadialGradient(
                            colors: [Color(hex: "4ECDC4").opacity(0.35), Color.clear],
                            center: .center, startRadius: 0, endRadius: 200
                        )
                    )
                    .frame(width: 400, height: 400)
                    .blur(radius: 80)
                    .offset(
                        x: -60 + sin(phase * .pi * 2) * 40,
                        y: -geo.size.height * 0.2 + cos(phase * .pi * 2) * 30
                    )

                Circle()
                    .fill(
                        RadialGradient(
                            colors: [Color(hex: "A78BFA").opacity(0.3), Color.clear],
                            center: .center, startRadius: 0, endRadius: 180
                        )
                    )
                    .frame(width: 350, height: 350)
                    .blur(radius: 70)
                    .offset(
                        x: 80 + cos(phase * .pi * 2) * 50,
                        y: geo.size.height * 0.15 + sin(phase * .pi * 2) * 40
                    )

                Circle()
                    .fill(
                        RadialGradient(
                            colors: [Color(hex: "FF6B9D").opacity(0.2), Color.clear],
                            center: .center, startRadius: 0, endRadius: 150
                        )
                    )
                    .frame(width: 300, height: 300)
                    .blur(radius: 60)
                    .offset(
                        x: 40 + sin(phase * .pi * 2 + 1) * 30,
                        y: geo.size.height * 0.4 + cos(phase * .pi * 2 + 1) * 25
                    )
            }
        }
        .ignoresSafeArea()
        .onAppear {
            withAnimation(.linear(duration: 10).repeatForever(autoreverses: false)) {
                phase = 1
            }
        }
    }
}

// MARK: - Launch View — Immersive Splash
struct LaunchView: View {
    @State private var appear = false
    @State private var pulse = false
    @State private var ringScale: CGFloat = 0.5

    var body: some View {
        ZStack {
            AnimatedGradientBackground()

            VStack(spacing: 20) {
                ZStack {
                    // Outer ring
                    Circle()
                        .stroke(Color(hex: "4ECDC4").opacity(0.3), lineWidth: 2)
                        .frame(width: 140, height: 140)
                        .scaleEffect(ringScale)
                        .opacity(2 - ringScale)

                    // Inner glow
                    Circle()
                        .fill(Color(hex: "4ECDC4").opacity(0.1))
                        .frame(width: 110, height: 110)
                        .blur(radius: 15)
                        .scaleEffect(pulse ? 1.3 : 1)

                    // SF Symbol logo
                    Image(systemName: "graduationcap.fill")
                        .font(.system(size: 52, weight: .medium))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [Color(hex: "4ECDC4"), Color(hex: "67E8F9")],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .shadow(color: Color(hex: "4ECDC4").opacity(0.6), radius: 20)
                }
                .scaleEffect(appear ? 1 : 0.3)

                Text("EduKids")
                    .font(.system(size: 44, weight: .black, design: .rounded))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Color(hex: "4ECDC4"), Color(hex: "67E8F9")],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .opacity(appear ? 1 : 0)
                    .offset(y: appear ? 0 : 20)

                Text("Learn · Play · Grow")
                    .font(.system(size: 16, weight: .medium, design: .rounded))
                    .foregroundColor(.white.opacity(0.5))
                    .tracking(4)
                    .opacity(appear ? 1 : 0)
            }
        }
        .onAppear {
            withAnimation(.spring(response: 0.8, dampingFraction: 0.6)) {
                appear = true
            }
            withAnimation(.easeInOut(duration: 2).repeatForever(autoreverses: true)) {
                pulse = true
            }
            withAnimation(.easeOut(duration: 2.5).repeatForever(autoreverses: false)) {
                ringScale = 2
            }
        }
    }
}
