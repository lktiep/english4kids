"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// Finger counting logic for hand gesture recognition
// 1 finger = A, 2 fingers = B, 3 fingers = C, 4 fingers = D
// Only counts index, middle, ring, pinky (NOT thumb — too unreliable at angles)
function countFingers(landmarks) {
  if (!landmarks || landmarks.length === 0) return 0;

  const hand = landmarks[0]; // First hand

  // Finger tip and pip landmark indices (index, middle, ring, pinky)
  const fingerTips = [8, 12, 16, 20];
  const fingerPips = [6, 10, 14, 18];

  let count = 0;

  // Fingers: compare y position (tip above pip = extended)
  for (let i = 0; i < fingerTips.length; i++) {
    if (hand[fingerTips[i]].y < hand[fingerPips[i]].y) {
      count++;
    }
  }

  return count;
}

export function useHandGesture({ enabled = false, onGesture = () => {} }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [fingerCount, setFingerCount] = useState(0);
  const [hasCamera, setHasCamera] = useState(true);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);
  const lastGestureRef = useRef(0);
  const gestureStableRef = useRef({ count: 0, frames: 0 });
  const onGestureRef = useRef(onGesture);

  // Keep callback ref current
  useEffect(() => {
    onGestureRef.current = onGesture;
  }, [onGesture]);

  const startCamera = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      // Request camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: "user" },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Load MediaPipe Hand Landmarker
      const { FilesetResolver, HandLandmarker } =
        await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
      );

      const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 1,
      });

      handLandmarkerRef.current = handLandmarker;
      setIsActive(true);
      setIsLoading(false);

      // Start detection loop
      const detect = () => {
        if (
          !videoRef.current ||
          !handLandmarkerRef.current ||
          videoRef.current.readyState < 2
        ) {
          animationRef.current = requestAnimationFrame(detect);
          return;
        }

        const result = handLandmarkerRef.current.detectForVideo(
          videoRef.current,
          performance.now(),
        );

        if (result.landmarks && result.landmarks.length > 0) {
          const count = countFingers(result.landmarks);
          setFingerCount(count);

          // Gesture stability: require same count for 10 frames before triggering
          if (count === gestureStableRef.current.count) {
            gestureStableRef.current.frames++;
          } else {
            gestureStableRef.current = { count, frames: 1 };
          }

          // Trigger gesture if stable and different from last
          if (
            gestureStableRef.current.frames >= 10 &&
            count !== lastGestureRef.current &&
            count >= 1 &&
            count <= 4
          ) {
            lastGestureRef.current = count;
            onGestureRef.current(count);
          }
        } else {
          setFingerCount(0);
          gestureStableRef.current = { count: 0, frames: 0 };
        }

        // Draw landmarks on canvas
        if (canvasRef.current && result.landmarks) {
          const ctx = canvasRef.current.getContext("2d");
          ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height,
          );

          if (result.landmarks[0]) {
            // Draw dots on finger tips
            const tips = [4, 8, 12, 16, 20];
            result.landmarks[0].forEach((lm, idx) => {
              const x = lm.x * canvasRef.current.width;
              const y = lm.y * canvasRef.current.height;

              ctx.beginPath();
              ctx.arc(x, y, tips.includes(idx) ? 6 : 3, 0, Math.PI * 2);
              ctx.fillStyle = tips.includes(idx) ? "#FF6B9D" : "#4ECDC4";
              ctx.fill();
            });
          }
        }

        animationRef.current = requestAnimationFrame(detect);
      };

      detect();
    } catch (err) {
      console.error("Camera/MediaPipe error:", err);
      setHasCamera(false);
      setError(err.message);
      setIsLoading(false);
    }
  }, [enabled]);

  const stopCamera = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (handLandmarkerRef.current) {
      handLandmarkerRef.current.close();
      handLandmarkerRef.current = null;
    }
    setIsActive(false);
    setFingerCount(0);
    lastGestureRef.current = 0;
    gestureStableRef.current = { count: 0, frames: 0 };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  // Auto-start when enabled
  useEffect(() => {
    if (enabled) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [enabled, startCamera, stopCamera]);

  return {
    videoRef,
    canvasRef,
    isLoading,
    isActive,
    fingerCount,
    hasCamera,
    error,
    startCamera,
    stopCamera,
  };
}
