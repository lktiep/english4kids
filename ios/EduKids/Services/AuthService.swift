import Foundation
import Supabase
import AuthenticationServices

// MARK: - Auth Service
/// Google OAuth via Supabase + ASWebAuthenticationSession
@MainActor
class AuthService: ObservableObject {
    static let shared = AuthService()

    let client: SupabaseClient

    @Published var session: Session?
    @Published var isLoading = true

    var isAuthenticated: Bool { session != nil }
    var accessToken: String? { session?.accessToken }

    private let redirectScheme = "dev.jackle.edukids"
    private let redirectURL = URL(string: "dev.jackle.edukids://callback")!

    init() {
        client = SupabaseClient(
            supabaseURL: URL(string: "https://hgqigpgrzwgmlwzplpgu.supabase.co")!,
            supabaseKey: "sb_publishable_PcMcsynfGDN0hq8DO2f3Pg_lfB5nn7G"
        )
    }

    // MARK: - Initialize
    func initialize() async {
        isLoading = true
        do {
            session = try await client.auth.session
            if let token = session?.accessToken {
                await APIService.shared.setToken(token)
            }
        } catch {
            session = nil
        }
        isLoading = false

        // Listen for auth changes
        Task {
            for await (event, session) in client.auth.authStateChanges {
                self.session = session
                if let token = session?.accessToken {
                    await APIService.shared.setToken(token)
                }
                if event == .signedOut {
                    await APIService.shared.setToken(nil)
                }
            }
        }
    }

    // MARK: - Google Sign In
    func signInWithGoogle() async throws {
        try await client.auth.signInWithOAuth(
            provider: .google,
            redirectTo: redirectURL,
            launchFlow: { @MainActor url in
                try await self.openAuthSession(url: url)
            }
        )
    }

    // MARK: - Refresh Session (call after OAuth)
    func refreshSession() async {
        do {
            session = try await client.auth.session
            if let token = session?.accessToken {
                await APIService.shared.setToken(token)
            }
            print("✅ Session refreshed: \(session != nil ? "authenticated" : "nil")")
        } catch {
            print("⚠️ Session refresh failed: \(error)")
        }
    }

    // MARK: - ASWebAuthenticationSession
    private func openAuthSession(url: URL) async throws -> URL {
        try await withCheckedThrowingContinuation { continuation in
            let session = ASWebAuthenticationSession(
                url: url,
                callbackURLScheme: redirectScheme
            ) { callbackURL, error in
                if let error = error {
                    // User cancelled is not a real error
                    if (error as? ASWebAuthenticationSessionError)?.code == .canceledLogin {
                        continuation.resume(throwing: CancellationError())
                    } else {
                        continuation.resume(throwing: error)
                    }
                    return
                }
                guard let callbackURL else {
                    continuation.resume(throwing: AuthError.missingCallbackURL)
                    return
                }
                continuation.resume(returning: callbackURL)
            }

            // Present in-app browser
            session.presentationContextProvider = WebAuthContextProvider.shared
            session.prefersEphemeralWebBrowserSession = false
            session.start()
        }
    }

    // MARK: - Handle OAuth Callback (deep link fallback)
    func handleCallback(url: URL) async {
        do {
            try await client.auth.session(from: url)
        } catch {
            print("OAuth callback error: \(error)")
        }
    }

    // MARK: - Sign Out
    func signOut() async {
        do {
            try await client.auth.signOut()
            session = nil
            await APIService.shared.setToken(nil)
        } catch {
            print("Sign out error: \(error)")
        }
    }
}

// MARK: - Auth Errors
enum AuthError: LocalizedError {
    case missingCallbackURL

    var errorDescription: String? {
        switch self {
        case .missingCallbackURL: return "Không nhận được callback URL từ Google"
        }
    }
}

// MARK: - ASWebAuthenticationSession Presentation Context
class WebAuthContextProvider: NSObject, ASWebAuthenticationPresentationContextProviding {
    static let shared = WebAuthContextProvider()

    func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
        guard let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let window = scene.windows.first else {
            return ASPresentationAnchor()
        }
        return window
    }
}
