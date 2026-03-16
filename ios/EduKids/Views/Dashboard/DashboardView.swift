import SwiftUI

// MARK: - Dashboard View
struct DashboardView: View {
    @EnvironmentObject var authVM: AuthViewModel
    @StateObject private var vm = DashboardViewModel()
    @State private var appear = false
    @State private var showingProfileMenu = false
    @State private var showingAddChild = false
    @State private var newChildName = ""
    @State private var newChildAge = 5

    var body: some View {
        NavigationStack {
            ZStack {
                AnimatedGradientBackground()

                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 24) {
                        headerSection
                            .padding(.top, 16)

                        childSelector
                            .padding(.horizontal, -20)

                        statsGrid
                        suggestedCourses
                        recentQuizzes
                    }
                    .padding(.bottom, 100)
                    .padding(.horizontal, 20)
                    .background(Color.black.opacity(0.001)) // Fix simulator trackpad scroll issue on transparent areas
                }
            }
            .navigationBarHidden(true)
            .navigationBarHidden(true)
            .confirmationDialog("Tài khoản", isPresented: $showingProfileMenu, titleVisibility: .visible) {
                Button("Đăng xuất", role: .destructive) {
                    Task { await authVM.signOut() }
                }
                Button("Huỷ", role: .cancel) {}
            }
            .alert("Thêm hồ sơ bé", isPresented: $showingAddChild) {
                TextField("Tên bé", text: $newChildName)
                TextField("Tuổi", value: $newChildAge, format: .number)
                    .keyboardType(.numberPad)
                Button("Huỷ", role: .cancel) {}
                Button("Lưu") {
                    let year = Calendar.current.component(.year, from: Date()) - newChildAge
                    Task {
                        await authVM.addChild(name: newChildName, birthYear: year)
                        newChildName = ""
                        newChildAge = 5
                    }
                }
            }
        }
        .task {
            if let child = authVM.activeChild {
                await vm.fetchStats(childId: child.id)
            }
            withAnimation(.spring(response: 0.6, dampingFraction: 0.8).delay(0.2)) {
                appear = true
            }
        }
        .onChange(of: authVM.activeChild?.id) { _ in
            if let child = authVM.activeChild {
                Task { await vm.fetchStats(childId: child.id) }
            }
        }
    }

    // MARK: - Header
    private var headerSection: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 4) {
                    Text("Xin chào!")
                        .font(.system(size: 14))
                        .foregroundColor(.white.opacity(0.5))
                    Image(systemName: "hand.wave.fill")
                        .font(.system(size: 12))
                        .foregroundColor(.yellow)
                }
                Text(authVM.activeChild?.name ?? "Bé yêu")
                    .font(.system(size: 28, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
            }
            .opacity(appear ? 1 : 0)
            .offset(x: appear ? 0 : -20)

            Spacer()

            Button(action: { showingProfileMenu = true }) {
                ZStack {
                    Circle()
                        .fill(.ultraThinMaterial)
                        .frame(width: 48, height: 48)
                        .overlay(Circle().stroke(.white.opacity(0.15), lineWidth: 1))
                    Image(systemName: "person.crop.circle.fill")
                        .font(.system(size: 24))
                        .foregroundStyle(
                            LinearGradient(colors: [Color(hex: "4ECDC4"), Color(hex: "67E8F9")], startPoint: .top, endPoint: .bottom)
                        )
                }
            }
            .opacity(appear ? 1 : 0)
        }
    }

    // MARK: - Child Selector
    private var childSelector: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 16) {
                if authVM.children.isEmpty {
                    Button(action: { showingAddChild = true }) {
                        VStack(spacing: 8) {
                            Image(systemName: "plus.circle.fill")
                                .font(.system(size: 32))
                                .foregroundColor(Color(hex: "4ECDC4"))
                            Text("Thêm bé")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.white)
                        }
                        .frame(width: 320, height: 160)
                        .background(
                            RoundedRectangle(cornerRadius: 22)
                                .fill(.ultraThinMaterial)
                                .overlay(RoundedRectangle(cornerRadius: 22).stroke(Color(hex: "4ECDC4").opacity(0.3), style: StrokeStyle(lineWidth: 1, dash: [4])))
                        )
                    }
                } else {
                    ForEach(Array(authVM.children.enumerated()), id: \.element.id) { _, child in
                        ChildCardView(
                            child: child,
                            isActive: child.id == authVM.activeChild?.id,
                            accuracy: vm.childrenStats[child.id]?.avgAccuracy ?? 0,
                            totalQuizzes: vm.childrenStats[child.id]?.totalQuizzes ?? 0
                        )
                        .onTapGesture {
                            withAnimation(.spring(response: 0.3)) {
                                authVM.activeChild = child
                            }
                        }
                    }

                    Button(action: { showingAddChild = true }) {
                        VStack {
                            Image(systemName: "plus")
                                .font(.system(size: 24, weight: .bold))
                                .foregroundColor(.white.opacity(0.5))
                        }
                        .frame(width: 56, height: 160)
                        .background(
                            RoundedRectangle(cornerRadius: 24)
                                .fill(.ultraThinMaterial)
                        )
                    }
                }
            }
            .padding(.horizontal, 20)
        }
        .opacity(appear ? 1 : 0)
        .offset(y: appear ? 0 : 20)
    }

    // MARK: - Stats Grid
    private var statsGrid: some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
            GlassStatCard(
                sfIcon: "target",
                value: "\(vm.stats?.totalQuizzes ?? 0)",
                label: "Quiz đã làm",
                gradient: [Color(hex: "4ECDC4"), Color(hex: "06B6D4")]
            )
            GlassStatCard(
                sfIcon: "star.fill",
                value: "\(vm.stats?.totalScore ?? 0)",
                label: "Tổng điểm",
                gradient: [Color(hex: "FFB347"), Color(hex: "FF6B6B")]
            )
            GlassStatCard(
                sfIcon: "chart.bar.fill",
                value: "\(Int(vm.stats?.avgAccuracy ?? 0))%",
                label: "Độ chính xác",
                gradient: [Color(hex: "A78BFA"), Color(hex: "8B5CF6")]
            )
            GlassStatCard(
                sfIcon: "flame.fill",
                value: "\(vm.stats?.streak ?? 0)",
                label: "Streak",
                gradient: [Color(hex: "FF6B9D"), Color(hex: "FF2D87")]
            )
        }
        .opacity(appear ? 1 : 0)
        .offset(y: appear ? 0 : 30)
    }

    // MARK: - Recent Quizzes
    private var recentQuizzes: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Hoạt động gần đây")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(.white)

            if vm.recentQuizzes.isEmpty {
                HStack {
                    Spacer()
                    VStack(spacing: 8) {
                        Image(systemName: "doc.text")
                            .font(.system(size: 28))
                            .foregroundColor(.white.opacity(0.3))
                        Text("Chưa có quiz nào")
                            .font(.system(size: 14))
                            .foregroundColor(.white.opacity(0.4))
                    }
                    .padding(.vertical, 24)
                    Spacer()
                }
                .background(
                    RoundedRectangle(cornerRadius: 16)
                        .fill(.ultraThinMaterial)
                        .overlay(
                            RoundedRectangle(cornerRadius: 16)
                                .stroke(.white.opacity(0.08), lineWidth: 1)
                        )
                )
            } else {
                ForEach(vm.recentQuizzes.prefix(3)) { quiz in
                    GlassQuizRow(quiz: quiz)
                }
            }
        }
        .opacity(appear ? 1 : 0)
    }

    // MARK: - Suggested Courses
    private var suggestedCourses: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Gợi ý cho bé")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(.white)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ImageCourseCard(imageName: "MathCourseCard", title: "Toán Học Tương Tác", subtitle: "Khám phá con số", color: Theme.accent)
                    ImageCourseCard(imageName: "ReadingCourseCard", title: "Thế Giới Truyện Tranh", subtitle: "Phiêu lưu cùng chữ", color: Theme.secondary)
                }
                .padding(.horizontal, 20)
            }
            .padding(.horizontal, -20)
        }
        .opacity(appear ? 1 : 0)
    }
}

// MARK: - Glass Stat Card
struct GlassStatCard: View {
    let sfIcon: String
    let value: String
    let label: String
    let gradient: [Color]
    @State private var appear = false

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                ZStack {
                    RoundedRectangle(cornerRadius: 10)
                        .fill(LinearGradient(colors: gradient, startPoint: .topLeading, endPoint: .bottomTrailing))
                        .frame(width: 36, height: 36)
                    Image(systemName: sfIcon)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.white)
                }
                Spacer()
            }

            Text(value)
                .font(.system(size: 28, weight: .black, design: .rounded))
                .foregroundColor(.white)

            Text(label)
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(.white.opacity(0.8))
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            ZStack {
                RoundedRectangle(cornerRadius: 20)
                    .fill(
                        LinearGradient(
                            colors: [
                                gradient[0].opacity(0.25),
                                gradient.last?.opacity(0.15) ?? gradient[0].opacity(0.15),
                                Color.black.opacity(0.3)
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )

                // Decorative blurred circles for depth
                Circle()
                    .fill(gradient[0].opacity(0.2))
                    .frame(width: 80, height: 80)
                    .blur(radius: 25)
                    .offset(x: 50, y: -20)

                Circle()
                    .fill((gradient.last ?? gradient[0]).opacity(0.15))
                    .frame(width: 60, height: 60)
                    .blur(radius: 20)
                    .offset(x: -30, y: 30)

                // Glass overlay
                RoundedRectangle(cornerRadius: 20)
                    .fill(.ultraThinMaterial.opacity(0.3))
            }
            .clipShape(RoundedRectangle(cornerRadius: 20))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 20)
                .stroke(.white.opacity(0.1), lineWidth: 1)
        )
        .shadow(color: gradient[0].opacity(0.2), radius: 15, y: 8)
        .scaleEffect(appear ? 1 : 0.85)
        .opacity(appear ? 1 : 0)
        .onAppear {
            withAnimation(.spring(response: 0.5, dampingFraction: 0.7).delay(0.1)) {
                appear = true
            }
        }
    }
}

// MARK: - Glass Quiz Row
struct GlassQuizRow: View {
    let quiz: QuizAttempt

    var body: some View {
        HStack(spacing: 12) {
            ZStack {
                Circle()
                    .fill((quiz.accuracy ?? 0) >= 80 ? Color(hex: "4ECDC4").opacity(0.2) : Color(hex: "FF6B6B").opacity(0.2))
                    .frame(width: 44, height: 44)
                Image(systemName: (quiz.accuracy ?? 0) >= 80 ? "checkmark.circle.fill" : "doc.text")
                    .font(.system(size: 20))
                    .foregroundColor((quiz.accuracy ?? 0) >= 80 ? Color(hex: "4ECDC4") : Color(hex: "FF6B6B"))
            }

            VStack(alignment: .leading, spacing: 3) {
                Text(quiz.topic ?? "Quiz")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(.white)
                Text("\(quiz.score)/\(quiz.total ?? 0) câu")
                    .font(.system(size: 12))
                    .foregroundColor(.white.opacity(0.4))
            }

            Spacer()

            Text("\(Int(quiz.accuracy ?? 0))%")
                .font(.system(size: 17, weight: .bold, design: .rounded))
                .foregroundColor((quiz.accuracy ?? 0) >= 80 ? Color(hex: "4ECDC4") : Color(hex: "FF6B6B"))
        }
        .padding(14)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(.ultraThinMaterial)
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(.white.opacity(0.08), lineWidth: 1)
                )
        )
    }
}

// MARK: - Glass Action Button
struct GlassActionButton: View {
    let sfIcon: String
    let label: String
    let gradient: [Color]
    @State private var pressed = false

    var body: some View {
        VStack(spacing: 8) {
            ZStack {
                RoundedRectangle(cornerRadius: 18)
                    .fill(LinearGradient(colors: gradient, startPoint: .topLeading, endPoint: .bottomTrailing))
                    .overlay(
                        RoundedRectangle(cornerRadius: 18).stroke(.white.opacity(0.2), lineWidth: 1)
                    )
                Image(systemName: sfIcon)
                    .font(.system(size: 26, weight: .semibold))
                    .foregroundColor(.white)
            }
            .frame(height: 70)

            Text(label)
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(.white.opacity(0.7))
        }
        .frame(maxWidth: .infinity)
        .scaleEffect(pressed ? 0.92 : 1)
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in withAnimation(.spring(response: 0.12)) { pressed = true } }
                .onEnded { _ in withAnimation(.spring(response: 0.3)) { pressed = false } }
        )
    }
}

// MARK: - Image Course Card
struct ImageCourseCard: View {
    let imageName: String
    let title: String
    let subtitle: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading) {
            Spacer()
            VStack(alignment: .leading, spacing: 4) {
                Text(subtitle)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(color)
                    .textCase(.uppercase)
                Text(title)
                    .font(.system(size: 20, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
            }
            .padding()
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(
                LinearGradient(colors: [Color.black.opacity(0.8), Color.clear], startPoint: .bottom, endPoint: .top)
            )
        }
        .frame(width: 240, height: 160)
        .background(
            GeometryReader { geo in
                Image(imageName)
                    .resizable()
                    .scaledToFill()
                    .frame(width: geo.size.width, height: geo.size.height)
                    .clipped()
            }
        )
        .cornerRadius(24)
        .overlay(
            RoundedRectangle(cornerRadius: 24)
                .stroke(Color.white.opacity(0.15), lineWidth: 1)
        )
        .shadow(color: color.opacity(0.4), radius: 15, x: 0, y: 10)
    }
}
