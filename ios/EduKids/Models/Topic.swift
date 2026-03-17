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
        // English
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
        case "feelings": return "face.smiling.fill"
        case "time", "daily-routines": return "clock.fill"
        case "nature": return "leaf.fill"
        case "jobs": return "briefcase.fill"
        case "holidays": return "gift.fill"
        case "cooking": return "frying.pan.fill"
        case "travel": return "airplane"
        case "environment": return "globe.americas.fill"
        case "technology": return "desktopcomputer"
        case "arts": return "paintbrush.fill"
        case "health": return "heart.fill"
        case "geography": return "map.fill"
        case "science-words": return "atom"
        case "history": return "scroll.fill"
        case "cultures": return "globe.asia.australia.fill"
        case "media": return "newspaper.fill"
        case "space": return "sparkles"
        case "career-dream": return "star.fill"
        // Math
        case "counting": return "number"
        case "shapes-2d": return "diamond.fill"
        case "bigger-smaller": return "arrow.up.arrow.down"
        case "patterns": return "circle.grid.3x3.fill"
        case "addition-10", "addition-100": return "plus"
        case "subtraction-10", "subtraction-100": return "minus"
        case "compare-numbers": return "equal"
        case "measurement-basic": return "ruler.fill"
        case "time-clock": return "clock.fill"
        case "money-vn": return "banknote.fill"
        case "multiplication": return "multiply"
        case "division-basic": return "divide"
        case "fractions-intro", "fractions-compare", "fraction-ops": return "chart.pie.fill"
        case "geometry-basic": return "triangle.fill"
        case "multi-digit-ops": return "number.square.fill"
        case "decimals-intro", "decimals-ops": return "textformat.123"
        case "area-perimeter": return "square.dashed"
        case "percentages": return "percent"
        case "data-graphs": return "chart.bar.fill"
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

// MARK: - Math Topic Detail (exercises for a math topic)
struct MathTopicDetail: Codable {
    let topic: String
    let title: String
    let titleVi: String
    let icon: String
    let color: String
    let exercises: [MathExercise]
}

struct MathExercise: Codable, Identifiable {
    let id: String
    let question: String
    let questionVi: String?
    let answer: AnyCodableValue
    let options: [AnyCodableValue]
    let hint: String?
}

/// Handles JSON values that can be Int or String (math answers can be either)
struct AnyCodableValue: Codable, Equatable, CustomStringConvertible {
    let stringValue: String

    var description: String { stringValue }

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let intVal = try? container.decode(Int.self) {
            stringValue = String(intVal)
        } else if let doubleVal = try? container.decode(Double.self) {
            // Format nicely — no trailing .0 for whole numbers
            if doubleVal == Double(Int(doubleVal)) {
                stringValue = String(Int(doubleVal))
            } else {
                stringValue = String(doubleVal)
            }
        } else if let strVal = try? container.decode(String.self) {
            stringValue = strVal
        } else {
            stringValue = ""
        }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(stringValue)
    }
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
