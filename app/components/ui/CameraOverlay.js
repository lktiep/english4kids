"use client";

import { useHandGesture } from "@/app/hooks/useHandGesture";
import styles from "./CameraOverlay.module.css";

const GESTURE_LABELS = [
  "✊ Nắm tay = Xác nhận",
  "A (1☝️)",
  "B (2✌️)",
  "C (3🤟)",
  "D (4🖐️)",
  "👍 Tiếp theo!",
];

export default function CameraOverlay({
  enabled,
  onGesture,
  showFingerCount = true,
}) {
  const { videoRef, canvasRef, isLoading, isActive, fingerCount, error } =
    useHandGesture({ enabled, onGesture });

  if (!enabled) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.cameraBox}>
        {isLoading && (
          <div className={styles.loading}>
            <span className={styles.spinner}>📷</span>
            <p>Đang mở camera...</p>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <span>⚠️</span>
            <p>Không mở được camera</p>
            <small>{error}</small>
          </div>
        )}

        <video
          ref={videoRef}
          className={styles.video}
          autoPlay
          playsInline
          muted
          style={{ display: isActive ? "block" : "none" }}
        />
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={320}
          height={240}
          style={{ display: isActive ? "block" : "none" }}
        />

        {isActive && showFingerCount && (
          <div className={styles.fingerDisplay}>
            <span className={styles.fingerCount}>
              {fingerCount === 5 ? "👍" : fingerCount > 0 ? fingerCount : "✊"}
            </span>
            <span className={styles.fingerLabel}>
              {fingerCount >= 0 && fingerCount <= 5
                ? GESTURE_LABELS[fingerCount]
                : "Giơ tay chọn đáp án"}
            </span>
          </div>
        )}

        {isActive && (
          <div className={styles.instructions}>
            <span>1☝️=A</span>
            <span>2✌️=B</span>
            <span>3🤟=C</span>
            <span>4🖐️=D</span>
            <span>✊=OK</span>
            <span>👍=Next</span>
          </div>
        )}
      </div>
    </div>
  );
}
