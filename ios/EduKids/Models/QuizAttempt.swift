import Foundation

// MARK: - Quiz Attempt
struct QuizAttempt: Codable, Identifiable {
    let id: String?
    let childId: String?
    let topic: String?
    let score: Int
    let total: Int?
    let accuracy: Double?
    let timeTaken: Int?
    let createdAt: String?

    // API returns camelCase JSON keys directly
    enum CodingKeys: String, CodingKey {
        case id
        case childId
        case topic, score, total, accuracy
        case timeTaken
        case createdAt = "created_at"
    }
}

// MARK: - Quiz Stats (from /api/quiz/stats)
// API returns camelCase keys: totalQuizzes, avgAccuracy, avgTime, streak, etc.
struct QuizStats: Codable {
    let totalQuizzes: Int
    let totalScore: Int
    let avgAccuracy: Double
    let avgTime: Double
    let streak: Int
    let quizzesThisWeek: Int
    let weeklyData: [WeeklyPoint]?
    let topicStats: [TopicStat]?

    // No CodingKeys needed — API returns camelCase which matches Swift property names
}

struct WeeklyPoint: Codable, Identifiable {
    let label: String?
    let day: String?
    let count: Int
    let score: Int?
    var id: String { label ?? day ?? UUID().uuidString }
}

struct TopicStat: Codable, Identifiable {
    let name: String
    let accuracy: Int
    let quizzes: Int
    var id: String { name }
}

// MARK: - Child Mini Stats (inline in child cards)
struct ChildMiniStats: Codable {
    let totalQuizzes: Int
    let avgAccuracy: Double
    let streak: Int

    // No CodingKeys needed — API returns camelCase

    static let empty = ChildMiniStats(totalQuizzes: 0, avgAccuracy: 0, streak: 0)
}
