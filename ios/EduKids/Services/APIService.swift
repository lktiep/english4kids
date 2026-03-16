import Foundation

// MARK: - API Service
/// Centralized REST client for all /api/* calls through the SSR layer.
actor APIService {
    static let shared = APIService()

    private let baseURL = "https://english4kids.jackle.dev/api"
    private let decoder: JSONDecoder = {
        let d = JSONDecoder()
        return d
    }()

    private var accessToken: String?

    func setToken(_ token: String?) {
        self.accessToken = token
    }
    
    // Response Wrapper
    private struct APIResponse<T: Decodable>: Decodable {
        let success: Bool
        let data: T?
        let error: String?
    }

    // MARK: - GET
    func get<T: Decodable>(_ path: String) async throws -> T {
        let url = URL(string: "\(baseURL)\(path)")!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if let token = accessToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        let (data, response) = try await URLSession.shared.data(for: request)
        try validateResponse(response)
        let res = try decoder.decode(APIResponse<T>.self, from: data)
        if !res.success { throw NSError(domain: "API", code: 400, userInfo: [NSLocalizedDescriptionKey: res.error ?? "API Error"]) }
        if let d = res.data { return d }
        throw NSError(domain: "API", code: 404, userInfo: [NSLocalizedDescriptionKey: "No data"])
    }

    // MARK: - POST
    func post<T: Decodable>(_ path: String, body: some Encodable) async throws -> T {
        let url = URL(string: "\(baseURL)\(path)")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if let token = accessToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        request.httpBody = try JSONEncoder().encode(body)
        let (data, response) = try await URLSession.shared.data(for: request)
        try validateResponse(response)
        let res = try decoder.decode(APIResponse<T>.self, from: data)
        if !res.success { throw NSError(domain: "API", code: 400, userInfo: [NSLocalizedDescriptionKey: res.error ?? "API Error"]) }
        if let d = res.data { return d }
        throw NSError(domain: "API", code: 404, userInfo: [NSLocalizedDescriptionKey: "No data"])
    }

    // MARK: - POST (no response body)
    func postVoid(_ path: String, body: some Encodable) async throws {
        let url = URL(string: "\(baseURL)\(path)")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if let token = accessToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        request.httpBody = try JSONEncoder().encode(body)
        let (_, response) = try await URLSession.shared.data(for: request)
        try validateResponse(response)
    }

    // MARK: - DELETE
    func delete(_ path: String) async throws {
        let url = URL(string: "\(baseURL)\(path)")!
        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if let token = accessToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        let (_, response) = try await URLSession.shared.data(for: request)
        try validateResponse(response)
    }

    // MARK: - Validation
    private func validateResponse(_ response: URLResponse) throws {
        guard let http = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        guard (200...299).contains(http.statusCode) else {
            throw APIError.httpError(http.statusCode)
        }
    }
}

// MARK: - Errors
enum APIError: LocalizedError {
    case invalidResponse
    case httpError(Int)
    case unauthorized

    var errorDescription: String? {
        switch self {
        case .invalidResponse: "Phản hồi không hợp lệ"
        case .httpError(let code): "Lỗi server (\(code))"
        case .unauthorized: "Phiên đăng nhập hết hạn"
        }
    }
}
