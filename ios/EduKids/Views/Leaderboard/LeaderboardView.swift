import SwiftUI

// MARK: - Leaderboard View
struct LeaderboardView: View {
    @StateObject private var vm = LeaderboardViewModel()
    @State private var appear = false

    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(spacing: Theme.spacingLG) {
                    if vm.isLoading {
                        ProgressView()
                            .tint(Theme.accent)
                            .scaleEffect(1.5)
                            .padding(.top, 100)
                    } else if vm.entries.isEmpty {
                        emptyState
                    } else {
                        // Podium Top 3
                        if vm.entries.count >= 3 {
                            podiumSection
                                .opacity(appear ? 1 : 0)
                                .offset(y: appear ? 0 : 30)
                        }

                        // Rankings List
                        rankingsList
                    }

                    Spacer(minLength: 100)
                }
                .padding(.top, Theme.spacingSM)
            }
            .background(Theme.bg.ignoresSafeArea())
            .navigationTitle("Xếp hạng")
            .navigationBarTitleDisplayMode(.large)
        }
        .task {
            await vm.fetch()
            withAnimation(.spring(response: 0.6, dampingFraction: 0.8).delay(0.2)) {
                appear = true
            }
        }
    }

    // MARK: - Podium
    private var podiumSection: some View {
        HStack(alignment: .bottom, spacing: 8) {
            // 2nd place
            PodiumCard(entry: vm.entries[1], rank: 2, height: 100)

            // 1st place
            PodiumCard(entry: vm.entries[0], rank: 1, height: 130)

            // 3rd place
            PodiumCard(entry: vm.entries[2], rank: 3, height: 80)
        }
        .padding(.horizontal, Theme.spacing)
    }

    // MARK: - Rankings List
    private var rankingsList: some View {
        VStack(spacing: 8) {
            ForEach(Array(vm.entries.enumerated()), id: \.element.id) { idx, entry in
                RankRow(entry: entry, rank: idx + 1, index: idx)
            }
        }
        .padding(.horizontal, Theme.spacing)
    }

    // MARK: - Empty State
    private var emptyState: some View {
        VStack(spacing: 16) {
            Image(systemName: "trophy.fill")
                .font(.system(size: 56))
                .foregroundColor(Color(hex: "FFD700").opacity(0.5))
            Text("Chưa có dữ liệu")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(Theme.textPrimary)
            Text("Làm quiz để được lên bảng xếp hạng!")
                .font(.system(size: 14))
                .foregroundColor(Theme.textSecondary)
        }
        .padding(.top, 80)
    }
}

// MARK: - Podium Card
struct PodiumCard: View {
    let entry: LeaderboardEntry
    let rank: Int
    let height: CGFloat
    @State private var appear = false

    var medalColor: Color {
        switch rank {
        case 1: Color(hex: "FFD700")
        case 2: Color(hex: "C0C0C0")
        case 3: Color(hex: "CD7F32")
        default: Color.white
        }
    }

    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: "medal.fill")
                .font(.system(size: rank == 1 ? 36 : 28))
                .foregroundColor(medalColor)
                .scaleEffect(appear ? 1 : 0.3)

            Text(entry.childName)
                .font(.system(size: 13, weight: .semibold))
                .foregroundColor(Theme.textPrimary)
                .lineLimit(1)

            Text("\(entry.score)")
                .font(.system(size: 18, weight: .bold, design: .rounded))
                .foregroundStyle(rank == 1 ? Theme.goldGradient : Theme.heroGradient)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 14)
        .frame(height: height)
        .background(
            RoundedRectangle(cornerRadius: Theme.cornerMD)
                .fill(Theme.bgCard)
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.cornerMD)
                        .stroke(
                            rank == 1 ? Color(hex: "FFD700").opacity(0.3)
                            : rank == 2 ? Color(hex: "C0C0C0").opacity(0.2)
                            : Color(hex: "CD7F32").opacity(0.2),
                            lineWidth: 1
                        )
                )
        )
        .shadow(color: rank == 1 ? Color(hex: "FFD700").opacity(0.15) : .clear, radius: 10, y: 4)
        .scaleEffect(appear ? 1 : 0.7)
        .onAppear {
            withAnimation(.spring(response: 0.5, dampingFraction: 0.6).delay(Double(rank) * 0.15)) {
                appear = true
            }
        }
    }
}

// MARK: - Rank Row
struct RankRow: View {
    let entry: LeaderboardEntry
    let rank: Int
    let index: Int
    @State private var appear = false

    var body: some View {
        HStack(spacing: 14) {
            // Rank
            Text("\(rank)")
                .font(.system(size: 15, weight: .bold, design: .rounded))
                .foregroundColor(rank <= 3 ? Theme.accent : Theme.textMuted)
                .frame(width: 30)

            // Avatar
            Circle()
                .fill(Theme.bgGlass)
                .frame(width: 40, height: 40)
                .overlay(
                    Image(systemName: "person.crop.circle.fill")
                        .font(.system(size: 22))
                        .foregroundStyle(
                            LinearGradient(colors: [Color(hex: "A78BFA"), Color(hex: "8B5CF6")], startPoint: .top, endPoint: .bottom)
                        )
                )

            // Info
            VStack(alignment: .leading, spacing: 2) {
                Text(entry.childName)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(Theme.textPrimary)
                Text("\(entry.quizCount) quiz · \(Int(entry.accuracy))%")
                    .font(.system(size: 12))
                    .foregroundColor(Theme.textMuted)
            }

            Spacer()

            Text("\(entry.score)")
                .font(.system(size: 17, weight: .bold, design: .rounded))
                .foregroundColor(Theme.accent)
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 10)
        .glassCard()
        .offset(x: appear ? 0 : 50)
        .opacity(appear ? 1 : 0)
        .onAppear {
            withAnimation(.spring(response: 0.5, dampingFraction: 0.8).delay(Double(index) * 0.05)) {
                appear = true
            }
        }
    }
}
