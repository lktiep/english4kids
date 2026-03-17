import SwiftUI

// MARK: - Learn Tab (Subject → Grades → Topics)
struct TopicListView: View {
    @StateObject private var vm = LearnViewModel()
    @EnvironmentObject var authVM: AuthViewModel
    @State private var selectedSubject: String? = nil

    var body: some View {
        NavigationStack {
            ScrollView(.vertical, showsIndicators: false) {
                VStack(alignment: .leading, spacing: 20) {
                    if selectedSubject == nil {
                        subjectSelectionView
                    } else {
                        gradeTopicsView
                    }
                }
                .padding(.bottom, 100)
            }
            .refreshable {
                await vm.fetchTopics(force: true)
            }
            .background(Theme.bg)
        }
        .task { await vm.fetchTopics() }
    }

    // MARK: - Step 1: Subject Selection
    private var subjectSelectionView: some View {
        VStack(alignment: .leading, spacing: 20) {
            VStack(alignment: .leading, spacing: 6) {
                Text("Học tập")
                    .font(.system(size: 28, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                Text("Chọn môn học để bắt đầu!")
                    .font(.system(size: 14))
                    .foregroundColor(.white.opacity(0.6))
            }
            .padding(.horizontal, 20)
            .padding(.top, 12)

            // Subject cards
            VStack(spacing: 14) {
                SubjectCard(
                    imageName: "SubjectEnglish",
                    title: "Tiếng Anh",
                    subtitle: "English for Kids",
                    description: "37 chủ đề • 6 cấp độ",
                    color: "#4ECDC4"
                ) {
                    withAnimation(.spring(response: 0.35)) {
                        selectedSubject = "english"
                    }
                }

                SubjectCard(
                    imageName: "SubjectMath",
                    title: "Toán",
                    subtitle: "Math for Kids",
                    description: "24 chủ đề • 6 cấp độ",
                    color: "#F59E0B"
                ) {
                    withAnimation(.spring(response: 0.35)) {
                        selectedSubject = "math"
                    }
                }

                SubjectCard(
                    imageName: "SubjectScience",
                    title: "Khoa học",
                    subtitle: "Science",
                    description: "Sắp ra mắt",
                    color: "#8B5CF6",
                    isLocked: true
                ) { }
            }
            .padding(.horizontal, 16)
        }
    }

    // MARK: - Step 2: Grade → Topics
    private var gradeTopicsView: some View {
        VStack(alignment: .leading, spacing: 20) {
            // Back button + header
            HStack(spacing: 10) {
                Button {
                    withAnimation(.spring(response: 0.35)) {
                        selectedSubject = nil
                    }
                } label: {
                    Image(systemName: "chevron.left")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Theme.accent)
                }

                VStack(alignment: .leading, spacing: 2) {
                    Text(selectedSubject == "math" ? "Toán học" : "Tiếng Anh")
                        .font(.system(size: 24, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                    Text("Chọn cấp độ và chủ đề")
                        .font(.system(size: 13))
                        .foregroundColor(.white.opacity(0.5))
                }
                Spacer()
            }
            .padding(.horizontal, 20)
            .padding(.top, 12)

            if vm.isLoading {
                ProgressView()
                    .tint(Theme.accent)
                    .frame(maxWidth: .infinity, minHeight: 200)
            } else if selectedSubject == "math" {
                // Math topics — loaded from local exercises for now
                mathTopicsView
            } else if vm.sortedGrades.isEmpty {
                // Fallback flat grid
                topicsGrid(vm.topics)
                    .padding(.horizontal, 16)
            } else {
                ForEach(vm.sortedGrades, id: \.key) { entry in
                    GradeSectionView(
                        grade: entry.value,
                        topics: vm.topicsForGrade(entry.key),
                        vm: vm
                    )
                }
            }
        }
    }

    // MARK: - Math Topics (placeholder until API supports math)
    private var mathTopicsView: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("🔢 Toán học hiện chưa có trên ứng dụng iOS.")
                .font(.system(size: 15))
                .foregroundColor(.white.opacity(0.7))
                .padding(.horizontal, 20)

            Text("Hãy truy cập trang web để làm bài Toán:")
                .font(.system(size: 14))
                .foregroundColor(.white.opacity(0.5))
                .padding(.horizontal, 20)

            Link(destination: URL(string: "https://english4kids.jackle.dev/learn/math")!) {
                HStack {
                    Image(systemName: "safari.fill")
                    Text("Mở Toán trên Web")
                }
                .font(.system(size: 16, weight: .bold, design: .rounded))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(
                    RoundedRectangle(cornerRadius: 16)
                        .fill(
                            LinearGradient(
                                colors: [Color(hex: "#F59E0B"), Color(hex: "#EF4444")],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                )
            }
            .padding(.horizontal, 20)
        }
        .padding(.vertical, 20)
    }

    @ViewBuilder
    func topicsGrid(_ topics: [Topic]) -> some View {
        LazyVGrid(columns: [
            GridItem(.flexible(), spacing: 12),
            GridItem(.flexible(), spacing: 12)
        ], spacing: 12) {
            ForEach(topics) { topic in
                NavigationLink(destination: TopicDetailView(topic: topic, vm: vm)) {
                    TopicCardView(topic: topic)
                }
                .buttonStyle(.plain)
            }
        }
    }
}

// MARK: - Subject Card
struct SubjectCard: View {
    let imageName: String
    let title: String
    let subtitle: String
    let description: String
    let color: String
    var isLocked: Bool = false
    let onTap: () -> Void

    var body: some View {
        Button(action: isLocked ? {} : onTap) {
            ZStack(alignment: .bottomLeading) {
                // Background image
                Image(imageName)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(height: 120)
                    .clipped()

                // Gradient overlay for text readability
                LinearGradient(
                    colors: [
                        Color.black.opacity(0.7),
                        Color.black.opacity(0.3),
                        Color.clear
                    ],
                    startPoint: .bottomLeading,
                    endPoint: .topTrailing
                )

                // Content
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        HStack(spacing: 6) {
                            Text(title)
                                .font(.system(size: 20, weight: .bold, design: .rounded))
                                .foregroundColor(.white)
                            if isLocked {
                                Image(systemName: "lock.fill")
                                    .font(.system(size: 12))
                                    .foregroundColor(.white.opacity(0.5))
                            }
                        }
                        Text(subtitle)
                            .font(.system(size: 13))
                            .foregroundColor(.white.opacity(0.7))
                        Text(description)
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(isLocked ? .white.opacity(0.4) : Color(hex: color))
                    }

                    Spacer()

                    if !isLocked {
                        Image(systemName: "chevron.right")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white.opacity(0.6))
                    }
                }
                .padding(16)
            }
            .frame(height: 120)
            .clipShape(RoundedRectangle(cornerRadius: 20))
            .overlay(
                RoundedRectangle(cornerRadius: 20)
                    .stroke(Color(hex: color).opacity(isLocked ? 0.1 : 0.3), lineWidth: 1.5)
            )
            .opacity(isLocked ? 0.5 : 1)
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Grade Section (expandable)
struct GradeSectionView: View {
    let grade: Grade
    let topics: [Topic]
    @ObservedObject var vm: LearnViewModel
    @State private var isExpanded = true

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Button {
                withAnimation(.spring(response: 0.3)) {
                    isExpanded.toggle()
                }
            } label: {
                HStack(spacing: 10) {
                    Text(grade.displayIcon)
                        .font(.system(size: 24))

                    VStack(alignment: .leading, spacing: 2) {
                        Text(grade.name)
                            .font(.system(size: 18, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                        if let ageRange = grade.ageRange {
                            Text("\(ageRange) tuổi • \(topics.count) chủ đề")
                                .font(.system(size: 12))
                                .foregroundColor(.white.opacity(0.5))
                        }
                    }

                    Spacer()

                    Image(systemName: isExpanded ? "chevron.up" : "chevron.down")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.white.opacity(0.4))
                }
                .padding(14)
                .background(
                    RoundedRectangle(cornerRadius: 16)
                        .fill(Color(hex: grade.displayColor).opacity(0.12))
                        .overlay(
                            RoundedRectangle(cornerRadius: 16)
                                .stroke(Color(hex: grade.displayColor).opacity(0.25), lineWidth: 1)
                        )
                )
            }
            .buttonStyle(.plain)
            .padding(.horizontal, 16)

            if isExpanded {
                LazyVGrid(columns: [
                    GridItem(.flexible(), spacing: 12),
                    GridItem(.flexible(), spacing: 12)
                ], spacing: 12) {
                    ForEach(topics) { topic in
                        NavigationLink(destination: TopicDetailView(topic: topic, vm: vm)) {
                            TopicCardView(topic: topic)
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(.horizontal, 16)
                .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
    }
}

// MARK: - Topic Card
struct TopicCardView: View {
    let topic: Topic

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // SF Symbol icon (reliable on Simulator & device)
            Image(systemName: topic.sfSymbolIcon)
                .font(.system(size: 28, weight: .semibold))
                .foregroundColor(Color(hex: topic.displayColor))
                .frame(width: 48, height: 48)
                .background(Color(hex: topic.displayColor).opacity(0.15))
                .clipShape(RoundedRectangle(cornerRadius: 12))
                .frame(maxWidth: .infinity, alignment: .leading)

            Spacer()

            Text(topic.displayTitle)
                .font(.system(size: 16, weight: .bold, design: .rounded))
                .foregroundColor(.white)
                .lineLimit(1)

            HStack {
                Text(topic.displayTitleEn)
                    .font(.system(size: 11))
                    .foregroundColor(.white.opacity(0.45))
                    .lineLimit(1)
                Spacer()
                Text("\(topic.displayWordCount) từ")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(Color(hex: topic.displayColor))
            }
        }
        .padding(14)
        .frame(height: 130)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color(hex: topic.displayColor).opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(Color(hex: topic.displayColor).opacity(0.2), lineWidth: 1)
                )
        )
    }
}

// MARK: - Topic Detail View
struct TopicDetailView: View {
    let topic: Topic
    @ObservedObject var vm: LearnViewModel
    @State private var detail: TopicDetail?
    @State private var isLoading = true

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                if isLoading {
                    ProgressView()
                        .tint(Theme.accent)
                        .frame(maxWidth: .infinity, minHeight: 300)
                } else if let detail {
                    VStack(spacing: 12) {
                        Text(topic.displayIcon)
                            .font(.system(size: 56))
                        Text(detail.titleVi)
                            .font(.system(size: 24, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                        Text("\(detail.words.count) từ vựng")
                            .font(.system(size: 14))
                            .foregroundColor(.white.opacity(0.6))
                    }
                    .padding(.top, 20)

                    // Action Buttons
                    VStack(spacing: 10) {
                        NavigationLink(destination: FlashcardView(topic: detail)) {
                            HStack {
                                Image(systemName: "play.fill")
                                Text("Bắt đầu học")
                            }
                            .font(.system(size: 17, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 16)
                            .background(
                                RoundedRectangle(cornerRadius: 16)
                                    .fill(Color(hex: topic.displayColor))
                            )
                        }

                        HStack(spacing: 10) {
                            NavigationLink(destination: QuizView(topic: detail)) {
                                HStack {
                                    Image(systemName: "questionmark.circle.fill")
                                    Text("Quiz")
                                }
                                .font(.system(size: 15, weight: .semibold, design: .rounded))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(
                                    RoundedRectangle(cornerRadius: 14)
                                        .fill(Theme.secondary.opacity(0.8))
                                )
                            }

                            NavigationLink(destination: GestureQuizView(topic: detail)) {
                                HStack {
                                    Text("📷")
                                    Text("Cử chỉ")
                                }
                                .font(.system(size: 15, weight: .semibold, design: .rounded))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(
                                    RoundedRectangle(cornerRadius: 14)
                                        .fill(Theme.accent.opacity(0.8))
                                )
                            }
                        }
                    }
                    .padding(.horizontal, 20)

                    VStack(spacing: 10) {
                        ForEach(detail.words) { word in
                            HStack {
                                WordImageView(word: word, size: 44)
                                Text(word.en)
                                    .font(.system(size: 16, weight: .semibold))
                                    .foregroundColor(.white)
                                Spacer()
                                Text(word.vi)
                                    .font(.system(size: 14))
                                    .foregroundColor(.white.opacity(0.6))
                            }
                            .padding(14)
                            .background(
                                RoundedRectangle(cornerRadius: 12)
                                    .fill(.white.opacity(0.06))
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 12)
                                            .stroke(.white.opacity(0.08), lineWidth: 1)
                                    )
                            )
                        }
                    }
                    .padding(.horizontal, 20)
                } else {
                    VStack(spacing: 12) {
                        Image(systemName: "exclamationmark.triangle")
                            .font(.system(size: 40))
                            .foregroundColor(.orange)
                        Text("Không tải được chủ đề")
                            .foregroundColor(.white.opacity(0.6))
                    }
                }
            }
            .padding(.bottom, 40)
        }
        .background(Theme.bg)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .principal) {
                Text(topic.displayTitle)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.white)
            }
        }
        .task {
            detail = await vm.fetchVocabulary(slug: topic.slug)
            isLoading = false
        }
    }
}
