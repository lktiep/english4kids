import SwiftUI

// MARK: – Design System matching web dark theme
enum Theme {
    // Primary palette
    static let accent = Color(hex: "4ECDC4")       // Teal
    static let accentGlow = Color(hex: "4ECDC4").opacity(0.3)
    static let secondary = Color(hex: "A78BFA")    // Purple
    static let tertiary = Color(hex: "FFB347")      // Orange
    static let danger = Color(hex: "FF5252")
    static let success = Color(hex: "00E676")

    // Background layers
    static let bg = Color(hex: "0a0e1a")
    static let bgCard = Color(hex: "111827")
    static let bgCardHover = Color(hex: "1a2332")
    static let bgGlass = Color.white.opacity(0.06)
    static let bgGlassHover = Color.white.opacity(0.12)

    // Text
    static let textPrimary = Color.white
    static let textSecondary = Color.white.opacity(0.7)
    static let textMuted = Color.white.opacity(0.4)

    // Borders
    static let border = Color.white.opacity(0.08)
    static let borderHover = Color.white.opacity(0.15)

    // Gradients
    static let heroGradient = LinearGradient(
        colors: [Color(hex: "4ECDC4"), Color(hex: "3B82F6")],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )

    static let goldGradient = LinearGradient(
        colors: [Color(hex: "FFD700"), Color(hex: "FFB347")],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )

    static let cardGradient = LinearGradient(
        colors: [Color(hex: "111827"), Color(hex: "0f1729")],
        startPoint: .top,
        endPoint: .bottom
    )

    static let accentGradient = LinearGradient(
        colors: [Color(hex: "4ECDC4"), Color(hex: "06B6D4")],
        startPoint: .leading,
        endPoint: .trailing
    )

    // Shadows
    static func glowShadow(_ color: Color = accent, radius: CGFloat = 20) -> some View {
        EmptyView()
            .shadow(color: color.opacity(0.3), radius: radius, x: 0, y: 8)
    }

    // Corner Radius
    static let cornerSM: CGFloat = 10
    static let cornerMD: CGFloat = 16
    static let cornerLG: CGFloat = 24
    static let cornerXL: CGFloat = 32

    // Spacing
    static let spacing: CGFloat = 16
    static let spacingXS: CGFloat = 4
    static let spacingSM: CGFloat = 8
    static let spacingLG: CGFloat = 24
    static let spacingXL: CGFloat = 32
}

// MARK: – Hex Color Extension
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3:
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - Glass Card Modifier
struct GlassCard: ViewModifier {
    var cornerRadius: CGFloat = Theme.cornerMD

    func body(content: Content) -> some View {
        content
            .background(
                RoundedRectangle(cornerRadius: cornerRadius)
                    .fill(Theme.bgCard)
                    .overlay(
                        RoundedRectangle(cornerRadius: cornerRadius)
                            .stroke(Theme.border, lineWidth: 1)
                    )
            )
    }
}

extension View {
    func glassCard(cornerRadius: CGFloat = Theme.cornerMD) -> some View {
        modifier(GlassCard(cornerRadius: cornerRadius))
    }

    func glowEffect(color: Color = Theme.accent, radius: CGFloat = 20) -> some View {
        self.shadow(color: color.opacity(0.3), radius: radius, x: 0, y: 8)
    }
}
