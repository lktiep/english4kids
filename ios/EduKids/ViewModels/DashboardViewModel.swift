import Foundation

// MARK: - Dashboard ViewModel
@MainActor
class DashboardViewModel: ObservableObject {
    @Published var stats: QuizStats?
    @Published var recentQuizzes: [QuizAttempt] = []
    @Published var childrenStats: [String: ChildMiniStats] = [:]
    @Published var isLoading = false

    func fetchStats(childId: String) async {
        isLoading = true
        do {
            stats = try await APIService.shared.get("/quiz/stats?child_id=\(childId)")
            recentQuizzes = try await APIService.shared.get("/quiz/recent?child_id=\(childId)&limit=5")
        } catch {
            print("Stats error: \(error)")
        }
        isLoading = false
    }

    func fetchChildMiniStats(childId: String) async {
        do {
            let s: ChildMiniStats = try await APIService.shared.get("/quiz/stats?child_id=\(childId)&mini=true")
            childrenStats[childId] = s
        } catch {
            childrenStats[childId] = .empty
        }
    }
}
