import Foundation

// MARK: - Topic (from /api/content/topics)
struct Topic: Codable, Identifiable {
    let slug: String
    let grade: String
    let order: Int?

    // Enriched fields (from vocabulary JSONs)
    let title_vi: String?
    let title_en: String?
    let icon: String?
    let color: String?
    let word_count: Int?

    var id: String { slug }

    var displayTitle: String { title_vi ?? title_en ?? slug.capitalized }
    var displayTitleEn: String { title_en ?? slug.capitalized }
    var displayIcon: String { icon ?? "📚" }
    var displayColor: String { color ?? "#4ECDC4" }
    var displayWordCount: Int { word_count ?? 0 }

    /// SF Symbol icon mapped from topic slug — works reliably on Simulator & device
    var sfSymbolIcon: String {
        switch slug.lowercased() {
        case "animals": return "pawprint.fill"
        case "fruits": return "leaf.fill"
        case "colors": return "paintpalette.fill"
        case "numbers": return "number"
        case "family": return "person.3.fill"
        case "food": return "fork.knife"
        case "weather": return "cloud.sun.fill"
        case "body": return "figure.stand"
        case "clothes": return "tshirt.fill"
        case "school": return "book.fill"
        case "greetings": return "hand.wave.fill"
        case "shapes": return "diamond.fill"
        case "flowers": return "camera.macro"
        case "vehicles": return "car.fill"
        case "sports": return "sportscourt.fill"
        case "music": return "music.note"
        case "house": return "house.fill"
        case "toys": return "gamecontroller.fill"
        default: return "book.fill"
        }
    }
}

// MARK: - Grade (from /api/content/topics)
struct Grade: Codable, Identifiable {
    let id: String
    let name: String
    let nameEn: String?
    let ageRange: String?
    let icon: String?
    let color: String?

    var displayIcon: String { icon ?? "📚" }
    var displayColor: String { color ?? "#4ECDC4" }
}

// MARK: - Topics API response
struct TopicsResponse: Codable {
    let grades: [String: Grade]?
    let topics: [Topic]
}

// MARK: - Topic Detail (vocabulary words for a topic)
struct TopicDetail: Codable {
    let topic: String
    let title: String
    let titleVi: String
    let icon: String
    let color: String
    let words: [Word]
}

struct Word: Codable, Identifiable {
    let en: String
    let vi: String
    let image: String?
    let audio: String?
    let emoji: String?
    let pronunciation: String?
    let sentence: String?
    let sentenceVi: String?

    var id: String { en }

    // Backward compat accessors
    var word: String { en }
    var vietnamese: String { vi }

    // Custom decoding: JSON files use "word"/"vietnamese", API may use "en"/"vi"
    enum CodingKeys: String, CodingKey {
        case en, vi, word, vietnamese
        case image, audio, emoji, pronunciation, sentence, sentenceVi
    }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        // Try "en" first, fall back to "word"
        self.en = (try? c.decode(String.self, forKey: .en))
            ?? (try? c.decode(String.self, forKey: .word))
            ?? ""
        // Try "vi" first, fall back to "vietnamese"
        self.vi = (try? c.decode(String.self, forKey: .vi))
            ?? (try? c.decode(String.self, forKey: .vietnamese))
            ?? ""
        self.image = try? c.decode(String.self, forKey: .image)
        self.audio = try? c.decode(String.self, forKey: .audio)
        self.emoji = try? c.decode(String.self, forKey: .emoji)
        self.pronunciation = try? c.decode(String.self, forKey: .pronunciation)
        self.sentence = try? c.decode(String.self, forKey: .sentence)
        self.sentenceVi = try? c.decode(String.self, forKey: .sentenceVi)
    }

    func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        try c.encode(en, forKey: .en)
        try c.encode(vi, forKey: .vi)
        try c.encodeIfPresent(image, forKey: .image)
        try c.encodeIfPresent(audio, forKey: .audio)
        try c.encodeIfPresent(emoji, forKey: .emoji)
        try c.encodeIfPresent(pronunciation, forKey: .pronunciation)
        try c.encodeIfPresent(sentence, forKey: .sentence)
        try c.encodeIfPresent(sentenceVi, forKey: .sentenceVi)
    }

    // Manual init for programmatic creation (e.g. QuizView timeout dummy)
    init(en: String, vi: String, image: String? = nil, audio: String? = nil,
         emoji: String? = nil, pronunciation: String? = nil,
         sentence: String? = nil, sentenceVi: String? = nil) {
        self.en = en
        self.vi = vi
        self.image = image
        self.audio = audio
        self.emoji = emoji
        self.pronunciation = pronunciation
        self.sentence = sentence
        self.sentenceVi = sentenceVi
    }
}
