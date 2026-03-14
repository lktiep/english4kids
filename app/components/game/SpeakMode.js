"use client";

import { useState, useCallback } from "react";
import { useGame } from "@/app/context/GameContext";
import { useSpeech, useSound } from "@/app/hooks/useSpeech";
import { useSpeechRecognition } from "@/app/hooks/useSpeechRecognition";
import styles from "./SpeakMode.module.css";

export default function SpeakMode({ topic, onBack }) {
  const game = useGame();
  const { speak } = useSpeech();
  const { play } = useSound();
  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    checkPronunciation,
  } = useSpeechRecognition();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null); // { match, score }
  const [attempts, setAttempts] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [stats, setStats] = useState({ perfect: 0, good: 0, tryAgain: 0 });

  const words = topic.words;
  const word = words[currentIndex];

  const handleListen = useCallback(() => {
    speak(word.word);
    play("click");
  }, [word, speak, play]);

  const handleSpeak = useCallback(() => {
    setResult(null);
    startListening(({ text }) => {
      const checkResult = checkPronunciation(text, word.word);

      setResult(checkResult);
      setAttempts((prev) => prev + 1);

      if (checkResult.score >= 80) {
        play("correct");
        game.earnXP(15, "Phát âm tuyệt vời! 🎙️");
        setStats((prev) => ({ ...prev, perfect: prev.perfect + 1 }));
      } else if (checkResult.match) {
        play("correct");
        game.earnXP(5, "Phát âm tốt!");
        setStats((prev) => ({ ...prev, good: prev.good + 1 }));
      } else {
        play("wrong");
        setStats((prev) => ({ ...prev, tryAgain: prev.tryAgain + 1 }));
      }
    });
  }, [word, startListening, checkPronunciation, play, game]);

  const handleNext = useCallback(() => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setResult(null);
      setAttempts(0);
      play("flip");
    } else {
      game.earnXP(30, "Hoàn thành luyện nói! 🎤");
      play("complete");
      setCompleted(true);
    }
  }, [currentIndex, words.length, play, game]);

  if (!isSupported) {
    return (
      <div className={styles.container}>
        <div className={styles.unsupported}>
          <span>🎙️</span>
          <h2>Trình duyệt chưa hỗ trợ</h2>
          <p>Hãy dùng Chrome hoặc Edge để luyện phát âm nhé!</p>
          <button className="btn btn-primary" onClick={onBack}>
            ← Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (completed) {
    const total = stats.perfect + stats.good + stats.tryAgain;
    return (
      <div className={styles.completedScreen}>
        <div className={styles.completedContent}>
          <span className={styles.completedIcon}>🎤</span>
          <h2>Luyện nói xong rồi!</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span>🌟</span>
              <span className={styles.statNum}>{stats.perfect}</span>
              <span className={styles.statLabel}>Tuyệt vời</span>
            </div>
            <div className={styles.statCard}>
              <span>👍</span>
              <span className={styles.statNum}>{stats.good}</span>
              <span className={styles.statLabel}>Tốt</span>
            </div>
            <div className={styles.statCard}>
              <span>💪</span>
              <span className={styles.statNum}>{stats.tryAgain}</span>
              <span className={styles.statLabel}>Cần luyện</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={onBack}>
            🏠 Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={onBack}>
          ← Về
        </button>
        <div className={styles.topicTitle}>
          <span>{topic.icon}</span>
          <span>Luyện nói</span>
        </div>
        <span className={styles.counter}>
          {currentIndex + 1}/{words.length}
        </span>
      </div>

      {/* Word Card */}
      <div className={styles.wordArea}>
        <div className={styles.wordCard}>
          <span className={styles.emoji}>{word.emoji}</span>
          <h1 className={styles.word}>{word.word}</h1>
          <p className={styles.pronunciation}>{word.pronunciation}</p>
          <p className={styles.vietnamese}>{word.vietnamese}</p>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button className={styles.listenBtn} onClick={handleListen}>
          🔊 Nghe mẫu
        </button>

        <button
          className={`${styles.speakBtn} ${isListening ? styles.listening : ""}`}
          onClick={handleSpeak}
          disabled={isListening}
        >
          {isListening ? (
            <>
              <span className={styles.micPulse}>🎙️</span> Đang nghe...
            </>
          ) : (
            <>🎙️ Nói thử</>
          )}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className={styles.resultArea}>
          <div
            className={`${styles.resultCard} ${result.score >= 80 ? styles.perfect : result.match ? styles.good : styles.tryAgain}`}
          >
            <div className={styles.resultHeader}>
              <span className={styles.resultIcon}>
                {result.score >= 80 ? "🌟" : result.match ? "👍" : "💪"}
              </span>
              <span className={styles.resultScore}>{result.score}%</span>
            </div>
            <p className={styles.resultText}>
              {result.score >= 80
                ? "Tuyệt vời! Phát âm chuẩn!"
                : result.match
                  ? "Tốt lắm! Cố thêm chút nữa nhé!"
                  : "Thử lại nhé, bé ơi!"}
            </p>
            {transcript && (
              <p className={styles.transcript}>
                Bé nói: &ldquo;{transcript}&rdquo;
              </p>
            )}
          </div>

          <div className={styles.resultActions}>
            <button className={styles.retryBtn} onClick={handleSpeak}>
              🔄 Nói lại
            </button>
            <button className={styles.nextBtn} onClick={handleNext}>
              {currentIndex < words.length - 1
                ? "▶️ Từ tiếp"
                : "📊 Xem kết quả"}
            </button>
          </div>
        </div>
      )}

      {/* Attempt counter */}
      {attempts > 0 && !result && (
        <p className={styles.attemptHint}>Lần thử: {attempts}</p>
      )}
    </div>
  );
}
