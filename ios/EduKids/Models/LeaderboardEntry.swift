import Foundation

// MARK: - Leaderboard Entry
struct LeaderboardEntry: Codable, Identifiable {
    let rank: Int?
    let childId: String
    let childName: String
    let parentName: String?
    let avatarUrl: String?
    let score: Int
    let quizCount: Int
    let accuracy: Double

    var id: String { childId }

    enum CodingKeys: String, CodingKey {
        case rank
        case childId = "child_id"
        case childName = "child_name"
        case parentName = "parent_name"
        case avatarUrl = "avatar_url"
        case score
        case quizCount = "quiz_count"
        case accuracy
    }
}

// MARK: - Rank Tiers
enum RankTier: String, CaseIterable {
    case bronze = "Bronze"
    case silver = "Silver"
    case gold = "Gold"
    case platinum = "Platinum"
    case diamond = "Diamond"
    case master = "Master"

    var sfSymbol: String {
        switch self {
        case .bronze: "medal.fill"
        case .silver: "medal.fill"
        case .gold: "medal.fill"
        case .platinum: "diamond.fill"
        case .diamond: "crown.fill"
        case .master: "trophy.fill"
        }
    }

    var color: String {
        switch self {
        case .bronze: "CD7F32"
        case .silver: "C0C0C0"
        case .gold: "FFD700"
        case .platinum: "E5E4E2"
        case .diamond: "B9F2FF"
        case .master: "FF6B6B"
        }
    }

    var minScore: Int {
        switch self {
        case .bronze: 0
        case .silver: 500
        case .gold: 1500
        case .platinum: 3000
        case .diamond: 6000
        case .master: 10000
        }
    }

    static func forScore(_ score: Int) -> RankTier {
        for tier in Self.allCases.reversed() {
            if score >= tier.minScore { return tier }
        }
        return .bronze
    }

    static func progress(_ score: Int) -> Double {
        let tier = forScore(score)
        let allCases = Self.allCases
        guard let idx = allCases.firstIndex(of: tier),
              idx < allCases.count - 1 else { return 1.0 }
        let next = allCases[idx + 1]
        let range = Double(next.minScore - tier.minScore)
        return Double(score - tier.minScore) / range
    }
}
