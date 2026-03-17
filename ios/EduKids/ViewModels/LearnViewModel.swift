import Foundation

// MARK: - Learn ViewModel
@MainActor
class LearnViewModel: ObservableObject {
    @Published var topics: [Topic] = []
    @Published var mathTopics: [Topic] = []
    @Published var grades: [String: Grade] = [:]
    @Published var isLoading = false
    @Published var currentTopic: TopicDetail?
    @Published var currentMathTopic: MathTopicDetail?

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

    func mathTopicsForGrade(_ gradeId: String) -> [Topic] {
        mathTopics.filter { $0.grade == gradeId }.sorted { ($0.order ?? 0) < ($1.order ?? 0) }
    }

    /// Fetch English topics
    func fetchTopics(force: Bool = false) async {
        guard force || topics.isEmpty else { return }
        isLoading = true
        do {
            let res: TopicsResponse = try await APIService.shared.get("/content/topics?subject=english")
            topics = res.topics
            grades = res.grades ?? [:]
        } catch {
            print("Topics error: \(error)")
        }
        isLoading = false
    }

    /// Fetch Math topics
    func fetchMathTopics(force: Bool = false) async {
        guard force || mathTopics.isEmpty else { return }
        do {
            let res: TopicsResponse = try await APIService.shared.get("/content/topics?subject=math")
            mathTopics = res.topics
            // Merge grades if not loaded yet
            if let newGrades = res.grades {
                for (k, v) in newGrades where grades[k] == nil {
                    grades[k] = v
                }
            }
        } catch {
            print("Math topics error: \(error)")
        }
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

    func fetchMathExercises(slug: String) async -> MathTopicDetail? {
        do {
            let detail: MathTopicDetail = try await APIService.shared.get("/content/exercises?topic=\(slug)")
            currentMathTopic = detail
            return detail
        } catch {
            print("Math exercises error: \(error)")
            return nil
        }
    }
}
