import SwiftUI

@main
struct EduKidsApp: App {
    @StateObject private var authVM = AuthViewModel()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authVM)
                .preferredColorScheme(.dark)
                .onOpenURL { url in
                    Task { await authVM.handleOAuthCallback(url: url) }
                }
        }
    }
}

struct ContentView: View {
    @EnvironmentObject var authVM: AuthViewModel

    var body: some View {
        Group {
            if authVM.isLoading {
                LaunchView()
            } else if authVM.isAuthenticated {
                MainTabView()
                    .transition(.opacity.combined(with: .scale(scale: 0.95)))
            } else {
                LoginView()
                    .transition(.opacity.combined(with: .move(edge: .bottom)))
            }
        }
        .animation(.spring(response: 0.5, dampingFraction: 0.85), value: authVM.isAuthenticated)
        .animation(.easeOut(duration: 0.3), value: authVM.isLoading)
    }
}

struct MainTabView: View {
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            DashboardView()
                .tabItem {
                    Label("Trang chủ", systemImage: "house.fill")
                }
                .tag(0)

            TopicListView()
                .tabItem {
                    Label("Học tập", systemImage: "book.fill")
                }
                .tag(1)

            LeaderboardView()
                .tabItem {
                    Label("Xếp hạng", systemImage: "trophy.fill")
                }
                .tag(2)
        }
        .tint(Theme.accent)
    }
}
