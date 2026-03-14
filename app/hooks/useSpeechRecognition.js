"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const onResultRef = useRef(null);

  const isSupported =
    typeof window !== "undefined" &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 3;

    recognition.onresult = (event) => {
      const result = event.results[0][0];
      const text = result.transcript.toLowerCase().trim();
      const conf = Math.round(result.confidence * 100);

      setTranscript(text);
      setConfidence(conf);
      setIsListening(false);

      if (onResultRef.current) {
        onResultRef.current({ text, confidence: conf });
      }
    };

    recognition.onerror = (event) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = useCallback((onResult) => {
    if (!recognitionRef.current) return;

    onResultRef.current = onResult || null;
    setTranscript("");
    setConfidence(0);
    setError(null);
    setIsListening(true);

    try {
      recognitionRef.current.start();
    } catch {
      // Already started
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  // Check pronunciation similarity
  const checkPronunciation = useCallback((spoken, target) => {
    const spokenNorm = spoken.toLowerCase().trim();
    const targetNorm = target.toLowerCase().trim();

    // Exact match
    if (spokenNorm === targetNorm) return { match: true, score: 100 };

    // Contains match (partial credit)
    if (spokenNorm.includes(targetNorm) || targetNorm.includes(spokenNorm)) {
      return { match: true, score: 80 };
    }

    // Levenshtein distance for fuzzy matching
    const distance = levenshtein(spokenNorm, targetNorm);
    const maxLen = Math.max(spokenNorm.length, targetNorm.length);
    const similarity = Math.round(((maxLen - distance) / maxLen) * 100);

    return {
      match: similarity >= 60,
      score: similarity,
    };
  }, []);

  return {
    isListening,
    transcript,
    confidence,
    isSupported,
    error,
    startListening,
    stopListening,
    checkPronunciation,
  };
}

// Simple Levenshtein distance
function levenshtein(a, b) {
  const matrix = Array(b.length + 1)
    .fill(null)
    .map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost,
      );
    }
  }

  return matrix[b.length][a.length];
}
