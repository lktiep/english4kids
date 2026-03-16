import Foundation
import SwiftUI

// MARK: - Auth ViewModel
@MainActor
class AuthViewModel: ObservableObject {
    private let auth = AuthService.shared

    @Published var isLoading = true
    @Published var isAuthenticated = false
    @Published var profile: UserProfile?
    @Published var children: [Child] = []
    @Published var activeChild: Child?
    @Published var error: String?

    init() {
        Task { await initialize() }
    }

    func initialize() async {
        isLoading = true
        await auth.initialize()
        isAuthenticated = auth.isAuthenticated

        if isAuthenticated {
            await fetchChildren()
        }
        isLoading = false
    }

    func signInWithGoogle() async {
        do {
            try await auth.signInWithGoogle()
            // Force-refresh session from Supabase after OAuth completes
            await auth.refreshSession()
            isAuthenticated = auth.isAuthenticated
            if isAuthenticated {
                await fetchChildren()
            }
        } catch {
            if !(error is CancellationError) {
                self.error = error.localizedDescription
            }
        }
    }

    func handleOAuthCallback(url: URL) async {
        await auth.handleCallback(url: url)
        await auth.refreshSession()
        isAuthenticated = auth.isAuthenticated
        if isAuthenticated {
            await fetchChildren()
        }
    }

    func signOut() async {
        await auth.signOut()
        isAuthenticated = false
        children = []
        activeChild = nil
        profile = nil
    }

    func fetchChildren() async {
        do {
            children = try await APIService.shared.get("/children")
            if activeChild == nil, let first = children.first {
                activeChild = first
            }
        } catch {
            print("Fetch children error: \(error)")
        }
    }

    func addChild(name: String, birthYear: Int) async {
        struct Body: Encodable { let name: String; let birthYear: Int
            enum CodingKeys: String, CodingKey { case name; case birthYear = "birth_year" }
        }
        do {
            let _: Child = try await APIService.shared.post("/children", body: Body(name: name, birthYear: birthYear))
            await fetchChildren()
        } catch {
            self.error = error.localizedDescription
        }
    }

    func removeChild(_ child: Child) async {
        do {
            try await APIService.shared.delete("/children?id=\(child.id)")
            await fetchChildren()
        } catch {
            self.error = error.localizedDescription
        }
    }

    func selectChild(_ child: Child) {
        withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
            activeChild = child
        }
    }
}
