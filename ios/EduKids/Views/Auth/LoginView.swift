import SwiftUI

// MARK: - Login View — Premium Glassmorphism
struct LoginView: View {
    @EnvironmentObject var authVM: AuthViewModel
    @State private var appear = false
    @State private var phase: CGFloat = 0
    @State private var shimmer: CGFloat = -1

    var body: some View {
        ZStack {
            // Background
            AnimatedGradientBackground()

            // Content
            ScrollView(showsIndicators: false) {
                VStack(spacing: 32) {
                    // Logo
                    logoSection
                        .padding(.top, 80)

                    // Glass Feature Card
                    glassFeatureCard

                    // Sign In Button
                    signInButton

                    Spacer().frame(height: 40)
                }
                .padding(.horizontal, 24)
            }
        }
        .onAppear {
            withAnimation(.spring(response: 0.9, dampingFraction: 0.7).delay(0.15)) {
                appear = true
            }
            withAnimation(.easeInOut(duration: 2.5).repeatForever(autoreverses: true).delay(0.5)) {
                shimmer = 1
            }
        }
    }

    // MARK: - Logo Section
    private var logoSection: some View {
        VStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(Color(hex: "4ECDC4").opacity(0.12))
                    .frame(width: 120, height: 120)
                    .blur(radius: 20)

                Image(systemName: "graduationcap.fill")
                    .font(.system(size: 52, weight: .medium))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Color(hex: "4ECDC4"), Color(hex: "67E8F9")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .shadow(color: Color(hex: "4ECDC4").opacity(0.5), radius: 20)
            }
            .scaleEffect(appear ? 1 : 0.3)
            .opacity(appear ? 1 : 0)

            Text("EduKids")
                .font(.system(size: 48, weight: .black, design: .rounded))
                .foregroundStyle(
                    LinearGradient(
                        colors: [Color(hex: "4ECDC4"), Color(hex: "67E8F9"), Color(hex: "3B82F6")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .shadow(color: Color(hex: "4ECDC4").opacity(0.3), radius: 15)
                .opacity(appear ? 1 : 0)
                .offset(y: appear ? 0 : 20)

            Text("Nền tảng học tập thông minh\ncho trẻ em Việt Nam")
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(.white.opacity(0.6))
                .multilineTextAlignment(.center)
                .fixedSize(horizontal: false, vertical: true)
                .opacity(appear ? 1 : 0)
                .offset(y: appear ? 0 : 15)
        }
    }

    // MARK: - Glass Feature Card
    private var glassFeatureCard: some View {
        VStack(spacing: 0) {
            GlassFeatureRow(
                sfIcon: "target",
                title: "Quiz tương tác",
                subtitle: "Trắc nghiệm với hình ảnh sinh động",
                gradient: [Color(hex: "4ECDC4"), Color(hex: "06B6D4")]
            )

            Divider().background(.white.opacity(0.08)).padding(.horizontal, 12)

            GlassFeatureRow(
                sfIcon: "mic.fill",
                title: "Luyện phát âm AI",
                subtitle: "Chấm điểm phát âm thời gian thực",
                gradient: [Color(hex: "A78BFA"), Color(hex: "8B5CF6")]
            )

            Divider().background(.white.opacity(0.08)).padding(.horizontal, 12)

            GlassFeatureRow(
                sfIcon: "trophy.fill",
                title: "Bảng xếp hạng",
                subtitle: "Thi đua với bạn bè toàn quốc",
                gradient: [Color(hex: "FFB347"), Color(hex: "FF6B6B")]
            )
        }
        .padding(.vertical, 8)
        .background(
            RoundedRectangle(cornerRadius: 24)
                .fill(.ultraThinMaterial)
                .overlay(
                    RoundedRectangle(cornerRadius: 24)
                        .stroke(
                            LinearGradient(
                                colors: [.white.opacity(0.2), .white.opacity(0.05)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ),
                            lineWidth: 1
                        )
                )
        )
        .shadow(color: .black.opacity(0.3), radius: 30, y: 15)
        .scaleEffect(appear ? 1 : 0.9)
        .opacity(appear ? 1 : 0)
    }

    // MARK: - Sign In Button
    private var signInButton: some View {
        VStack(spacing: 16) {
            Button(action: { Task { await authVM.signInWithGoogle() } }) {
                ZStack {
                    RoundedRectangle(cornerRadius: 18)
                        .fill(
                            LinearGradient(
                                colors: [Color(hex: "4ECDC4"), Color(hex: "3B82F6"), Color(hex: "4ECDC4")],
                                startPoint: UnitPoint(x: shimmer - 0.5, y: 0),
                                endPoint: UnitPoint(x: shimmer + 0.5, y: 1)
                            )
                        )
                        .shadow(color: Color(hex: "4ECDC4").opacity(0.5), radius: 20, y: 8)

                    HStack(spacing: 12) {
                        Image(systemName: "person.badge.key.fill")
                            .font(.system(size: 20, weight: .semibold))
                        Text("Đăng nhập với Google")
                            .font(.system(size: 18, weight: .bold))
                    }
                    .foregroundColor(.white)
                }
                .frame(height: 58)
            }
            .scaleEffect(appear ? 1 : 0.8)
            .opacity(appear ? 1 : 0)

            if let error = authVM.error {
                Text(error)
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "FF6B6B"))
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }
}

// MARK: - Glass Feature Row
struct GlassFeatureRow: View {
    let sfIcon: String
    let title: String
    let subtitle: String
    let gradient: [Color]
    @State private var appear = false

    var body: some View {
        HStack(spacing: 14) {
            ZStack {
                RoundedRectangle(cornerRadius: 14)
                    .fill(LinearGradient(colors: gradient, startPoint: .topLeading, endPoint: .bottomTrailing))
                    .frame(width: 48, height: 48)

                Image(systemName: sfIcon)
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(.white)
            }

            VStack(alignment: .leading, spacing: 3) {
                Text(title)
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.white)

                Text(subtitle)
                    .font(.system(size: 13))
                    .foregroundColor(.white.opacity(0.5))
                    .fixedSize(horizontal: false, vertical: true)
            }

            Spacer(minLength: 4)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 14)
        .offset(x: appear ? 0 : 30)
        .opacity(appear ? 1 : 0)
        .onAppear {
            withAnimation(.spring(response: 0.6, dampingFraction: 0.7).delay(0.3)) {
                appear = true
            }
        }
    }
}
