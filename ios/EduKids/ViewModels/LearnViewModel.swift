import Foundation

// MARK: - Learn ViewModel
@MainActor
class LearnViewModel: ObservableObject {
    @Published var topics: [Topic] = []
    @Published var grades: [String: Grade] = [:]
    @Published var isLoading = false
    @Published var currentTopic: TopicDetail?

    // Grade order for display — all 6 grades (PreK → Grade 5)
    let gradeOrder = ["prek", "grade1", "grade2", "grade3", "grade4", "grade5"]

    var sortedGrades: [(key: String, value: Grade)] {
        gradeOrder.compactMap { key in
            grades[key].map { (key: key, value: $0) }
        }
    }

    func topicsForGrade(_ gradeId: String) -> [Topic] {
        topics.filter { $0.grade == gradeId }.sorted { ($0.order ?? 0) < ($1.order ?? 0) }
    }

    /// Fetch topics from API. force=true bypasses cache for pull-to-refresh.
    func fetchTopics(force: Bool = false) async {
        guard force || topics.isEmpty else { return }
        isLoading = true
        do {
            let res: TopicsResponse = try await APIService.shared.get("/content/topics")
            topics = res.topics
            grades = res.grades ?? [:]
        } catch {
            print("Topics error: \(error)")
        }
        isLoading = false
    }

    func fetchVocabulary(slug: String) async -> TopicDetail? {
        do {
            let detail: TopicDetail = try await APIService.shared.get("/content/vocabulary?topic=\(slug)")
            currentTopic = detail
            return detail
        } catch {
            print("Vocabulary error: \(error)")
            return nil
        }
    }
}
