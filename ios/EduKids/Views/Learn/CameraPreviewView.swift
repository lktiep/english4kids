import SwiftUI
import AVFoundation

// MARK: - Camera Preview (UIViewRepresentable)
/// Wraps AVCaptureVideoPreviewLayer in a SwiftUI view
struct CameraPreviewView: UIViewRepresentable {
    let session: AVCaptureSession

    func makeUIView(context: Context) -> CameraUIView {
        let view = CameraUIView()
        view.session = session
        return view
    }

    func updateUIView(_ uiView: CameraUIView, context: Context) {}

    class CameraUIView: UIView {
        var session: AVCaptureSession? {
            didSet {
                guard let session else { return }
                let previewLayer = AVCaptureVideoPreviewLayer(session: session)
                previewLayer.videoGravity = .resizeAspectFill
                previewLayer.frame = bounds
                layer.addSublayer(previewLayer)
                self.previewLayer = previewLayer
            }
        }
        private var previewLayer: AVCaptureVideoPreviewLayer?

        override func layoutSubviews() {
            super.layoutSubviews()
            previewLayer?.frame = bounds
        }
    }
}

// MARK: - Camera Overlay with Finger Count
struct CameraGestureOverlay: View {
    @ObservedObject var gestureService: HandGestureService
    var compact: Bool = true

    private var gestureLabel: String {
        switch gestureService.fingerCount {
        case -1: return "Giơ tay lên!"
        case 0: return "✊ Xác nhận"
        case 1: return "☝️ Đáp án A"
        case 2: return "✌️ Đáp án B"
        case 3: return "🤟 Đáp án C"
        case 4: return "🖐️ Đáp án D"
        case 5: return "👍 Tiếp theo!"
        default: return ""
        }
    }

    private var gestureIcon: String {
        switch gestureService.fingerCount {
        case -1: return "🖐️"
        case 0: return "✊"
        case 1: return "1"
        case 2: return "2"
        case 3: return "3"
        case 4: return "4"
        case 5: return "👍"
        default: return "?"
        }
    }

    var body: some View {
        VStack(spacing: 8) {
            if let session = gestureService.captureSession {
                ZStack(alignment: .bottomTrailing) {
                    CameraPreviewView(session: session)
                        .frame(height: compact ? 120 : 200)
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                        .overlay(
                            RoundedRectangle(cornerRadius: 16)
                                .stroke(Theme.accent.opacity(0.3), lineWidth: 2)
                        )

                    // Finger count badge
                    if gestureService.isActive {
                        Text(gestureIcon)
                            .font(.system(size: 28, weight: .bold, design: .rounded))
                            .frame(width: 48, height: 48)
                            .background(.ultraThinMaterial)
                            .clipShape(Circle())
                            .overlay(Circle().stroke(Theme.accent, lineWidth: 2))
                            .padding(8)
                    }
                }

                // Gesture label
                Text(gestureLabel)
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(Theme.accent)

                // Instructions row
                HStack(spacing: 12) {
                    ForEach(["1☝️=A", "2✌️=B", "3🤟=C", "4🖐️=D", "✊=OK"], id: \.self) { hint in
                        Text(hint)
                            .font(.system(size: 10, weight: .medium, design: .rounded))
                            .foregroundColor(Theme.textMuted)
                    }
                }
            } else if let error = gestureService.error {
                VStack(spacing: 8) {
                    Image(systemName: "camera.fill")
                        .font(.system(size: 24))
                        .foregroundColor(.orange)
                    Text(error)
                        .font(.system(size: 13))
                        .foregroundColor(Theme.textMuted)
                }
                .frame(height: compact ? 120 : 200)
            } else {
                ProgressView("Đang mở camera...")
                    .tint(Theme.accent)
                    .frame(height: compact ? 120 : 200)
            }
        }
    }
}
