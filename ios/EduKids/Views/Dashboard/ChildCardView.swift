import SwiftUI

// MARK: - Child Card View (Glass)
struct ChildCardView: View {
    let child: Child
    var isActive: Bool = false
    var accuracy: Double = 0
    var totalQuizzes: Int = 0
    @State private var appear = false

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 12) {
                ZStack {
                    Circle()
                        .fill(.ultraThinMaterial)
                        .frame(width: 56, height: 56)
                        .overlay(
                            Circle().stroke(Color.white.opacity(isActive ? 0.6 : 0.2), lineWidth: 2)
                        )
                    
                    Image(systemName: "person.crop.circle.fill")
                        .font(.system(size: 32))
                        .foregroundStyle(Color.white)
                }
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(child.name)
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(.white)
                        .lineLimit(1)
                    
                    Text("\(child.age) tuổi")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(.white.opacity(0.8))
                }
                
                Spacer()
            }
            
            Spacer()
            
            HStack(spacing: 16) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("\(totalQuizzes)")
                        .font(.system(size: 16, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                    Text("quiz")
                        .font(.system(size: 11))
                        .foregroundColor(.white.opacity(0.7))
                }
                
                Rectangle()
                    .fill(.white.opacity(0.3))
                    .frame(width: 1, height: 24)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text("\(Int(accuracy))%")
                        .font(.system(size: 16, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                    Text("đúng")
                        .font(.system(size: 11))
                        .foregroundColor(.white.opacity(0.7))
                }
            }
        }
        .padding(20)
        .frame(width: 320, height: 160)
        .background(
            GeometryReader { geo in
                ZStack {
                    Image("ProfileCardBackground")
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: geo.size.width, height: geo.size.height)
                        .clipped()
                    
                    LinearGradient(colors: [.black.opacity(0.6), .black.opacity(0.1), .clear], startPoint: .leading, endPoint: .trailing)
                }
            }
        )
        .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .stroke(
                    isActive
                    ? LinearGradient(colors: [Color(hex: "4ECDC4"), Color(hex: "3B82F6")], startPoint: .topLeading, endPoint: .bottomTrailing)
                    : LinearGradient(colors: [.white.opacity(0.2), .white.opacity(0.05)], startPoint: .topLeading, endPoint: .bottomTrailing),
                    lineWidth: isActive ? 2 : 1
                )
        )
        .shadow(color: isActive ? Color(hex: "4ECDC4").opacity(0.3) : .black.opacity(0.2), radius: isActive ? 15 : 10, y: 5)
        .scaleEffect(appear ? 1 : 0.85)
        .opacity(appear ? 1 : 0)
        .onAppear {
            withAnimation(.spring(response: 0.5, dampingFraction: 0.7)) {
                appear = true
            }
        }
    }
}
