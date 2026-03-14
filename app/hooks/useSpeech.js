"use client";

import { useCallback, useRef, useEffect } from "react";
import { useGame } from "@/app/context/GameContext";

// TTS Hook using Web Speech API
export function useSpeech() {
  const synth = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synth.current = window.speechSynthesis;
    }
  }, []);

  const speak = useCallback((text, options = {}) => {
    if (!synth.current) return;

    // Cancel any ongoing speech
    synth.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || "en-US";
    utterance.rate = options.rate || 0.8; // Slower for kids
    utterance.pitch = options.pitch || 1.1; // Slightly higher for friendly tone
    utterance.volume = options.volume || 0.8;

    // Try to use a friendly English voice
    const voices = synth.current.getVoices();
    const preferred =
      voices.find(
        (v) =>
          v.lang.startsWith("en") && v.name.toLowerCase().includes("female"),
      ) || voices.find((v) => v.lang.startsWith("en-US"));

    if (preferred) utterance.voice = preferred;

    return new Promise((resolve) => {
      utterance.onend = resolve;
      utterance.onerror = resolve;
      synth.current.speak(utterance);
    });
  }, []);

  const stop = useCallback(() => {
    if (synth.current) synth.current.cancel();
  }, []);

  return { speak, stop };
}

// Sound Effects Hook
export function useSound() {
  const { settings } = useGame();
  const audioCache = useRef({});

  const play = useCallback(
    (soundName) => {
      if (!settings.soundEnabled || typeof window === "undefined") return;

      const sounds = {
        correct: { freq: [523, 659, 784], duration: 300, type: "sine" },
        wrong: { freq: [330, 262], duration: 250, type: "triangle" },
        click: { freq: [880], duration: 80, type: "sine" },
        flip: { freq: [440, 554], duration: 120, type: "sine" },
        levelup: {
          freq: [523, 659, 784, 1047],
          duration: 450,
          type: "sine",
        },
        streak: {
          freq: [523, 587, 659, 784, 880],
          duration: 350,
          type: "sine",
        },
        complete: {
          freq: [523, 659, 784, 1047, 1319],
          duration: 500,
          type: "sine",
        },
        celebrate: {
          freq: [523, 659, 784, 1047, 784, 1047, 1319],
          duration: 400,
          type: "sine",
        },
      };

      const config = sounds[soundName];
      if (!config) return;

      try {
        const audioCtx = new (
          window.AudioContext || window.webkitAudioContext
        )();
        const volume = settings.soundVolume || 0.7;

        const freqs = Array.isArray(config.freq) ? config.freq : [config.freq];

        freqs.forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.type = config.type;
          const startTime = audioCtx.currentTime + i * 0.12;
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(volume * 0.4, startTime);
          gain.gain.exponentialRampToValueAtTime(
            0.01,
            startTime + config.duration / 1000,
          );

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(startTime);
          osc.stop(startTime + config.duration / 1000);
        });
      } catch (e) {
        // Audio context not available
      }
    },
    [settings],
  );

  return { play };
}
