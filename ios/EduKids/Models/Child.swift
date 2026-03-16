import Foundation

// MARK: - Child Profile
struct Child: Codable, Identifiable, Equatable {
    let id: String
    let name: String
    let birthYear: Int
    let avatarUrl: String?
    let createdAt: String?

    var age: Int {
        Calendar.current.component(.year, from: Date()) - birthYear
    }

    enum CodingKeys: String, CodingKey {
        case id, name
        case birthYear = "birth_year"
        case avatarUrl = "avatar_url"
        case createdAt = "created_at"
    }
}

// MARK: - User Profile
struct UserProfile: Codable {
    let id: String
    let email: String?
    let displayName: String?
    let avatarUrl: String?

    enum CodingKeys: String, CodingKey {
        case id, email
        case displayName = "display_name"
        case avatarUrl = "avatar_url"
    }
}
