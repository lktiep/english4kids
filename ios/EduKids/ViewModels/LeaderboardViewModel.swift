import Foundation

// MARK: - Leaderboard ViewModel
@MainActor
class LeaderboardViewModel: ObservableObject {
    @Published var entries: [LeaderboardEntry] = []
    @Published var isLoading = false

    // Expected API Response shape
    private struct LeaderboardResponse: Decodable {
        let entries: [LeaderboardEntry]
    }

    func fetch() async {
        isLoading = true
        do {
            let res: LeaderboardResponse = try await APIService.shared.get("/leaderboard?week=current&limit=50")
            entries = res.entries
        } catch {
            print("Leaderboard error: \(error)")
        }
        isLoading = false
    }
}
