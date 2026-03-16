import SwiftUI

// MARK: - Word Image View
/// Displays a vocabulary word's image from URL, with emoji fallback
struct WordImageView: View {
    let word: Word
    var size: CGFloat = 120

    private var imageURL: URL? {
        guard let imagePath = word.image, !imagePath.isEmpty else { return nil }
        return URL(string: "https://english4kids.jackle.dev\(imagePath)")
    }

    var body: some View {
        if let url = imageURL {
            AsyncImage(url: url) { phase in
                switch phase {
                case .success(let image):
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: size, height: size)
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                        .shadow(color: .black.opacity(0.2), radius: 8, y: 4)
                case .failure:
                    emojiFallback
                case .empty:
                    ProgressView()
                        .tint(Theme.accent)
                        .frame(width: size, height: size)
                @unknown default:
                    emojiFallback
                }
            }
        } else {
            emojiFallback
        }
    }

    private var emojiFallback: some View {
        Text(word.emoji ?? "📝")
            .font(.system(size: size * 0.6))
            .frame(width: size, height: size)
    }
}
