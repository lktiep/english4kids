"use client";

import { useState, useEffect, useCallback } from "react";
import { useGame } from "@/app/context/GameContext";
import { useSpeech, useSound } from "@/app/hooks/useSpeech";
import styles from "./FlashcardMode.module.css";

function WordVisual({ word }) {
  if (word.image) {
    return (
      <div className={styles.imageWrapper}>
        <img src={word.image} alt={word.word} className={styles.wordImage} />
      </div>
    );
  }
  return <div className={styles.emoji}>{word.emoji}</div>;
}

export default function FlashcardMode({ topic, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);
  const game = useGame();
  const { speak } = useSpeech();
  const { play } = useSound();

  const words = topic.words;
  const word = words[currentIndex];

  // Auto-speak when card changes
  useEffect(() => {
    if (word && !completed) {
      const timer = setTimeout(() => speak(word.word), 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, word, completed, speak]);

  const handleNext = useCallback(() => {
    if (currentIndex < words.length - 1) {
      play("flip");
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
      // Mark word as learned + earn XP
      game.learnWord(topic.topic, word.id);
      game.earnXP(2, "Học từ");
    } else {
      // Completed all words
      game.learnWord(topic.topic, word.id);
      game.earnXP(50, "Hoàn thành chủ đề!");
      play("complete");
      setCompleted(true);
    }
  }, [currentIndex, words.length, word, game, topic, play]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      play("flip");
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex, play]);

  const handleSpeak = useCallback(() => {
    speak(word.word);
    play("click");
  }, [word, speak, play]);

  const handleSpeakSentence = useCallback(() => {
    speak(word.sentence);
    play("click");
  }, [word, speak, play]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
    play("flip");
  }, [play]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Enter") handleFlip();
      if (e.key === "s") handleSpeak();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleNext, handlePrev, handleFlip, handleSpeak]);

  if (completed) {
    return (
      <div className={styles.completedScreen}>
        <div className={styles.completedContent}>
          <span className={styles.completedIcon}>🎉</span>
          <h2>Giỏi lắm!</h2>
          <p>
            Bé đã học xong {words.length} từ chủ đề{" "}
            <strong>{topic.titleVi}</strong>
          </p>
          <div className={styles.completedXP}>+50 XP</div>
          <div className={styles.completedActions}>
            <button className={`btn btn-primary`} onClick={onBack}>
              🏠 Về trang chủ
            </button>
          </div>
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
          <span>{topic.titleVi}</span>
        </div>
        <span className={styles.counter}>
          {currentIndex + 1}/{words.length}
        </span>
      </div>

      {/* Progress Dots */}
      <div className={styles.progressDots}>
        {words.map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ""} ${i < currentIndex ? styles.dotDone : ""}`}
          />
        ))}
      </div>

      {/* Flashcard */}
      <div className={styles.cardWrapper} onClick={handleFlip}>
        <div
          className={`${styles.flashcard} ${isFlipped ? styles.flipped : ""}`}
        >
          {/* Front */}
          <div className={styles.cardFront}>
            <WordVisual word={word} />
            <h1 className={styles.word}>{word.word}</h1>
            <p className={styles.pronunciation}>{word.pronunciation}</p>
            <p className={styles.tapHint}>👆 Chạm để xem nghĩa</p>
          </div>
          {/* Back */}
          <div className={styles.cardBack}>
            <WordVisual word={word} />
            <h1 className={styles.word}>{word.word}</h1>
            <p className={styles.vietnamese}>{word.vietnamese}</p>
            <div className={styles.sentence}>
              <p className={styles.sentenceEn}>&ldquo;{word.sentence}&rdquo;</p>
              <p className={styles.sentenceVi}>{word.sentenceVi}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${styles.prevBtn}`}
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ◀️
        </button>
        <button
          className={`${styles.actionBtn} ${styles.speakBtn}`}
          onClick={handleSpeak}
        >
          🔊 Nghe
        </button>
        <button
          className={`${styles.actionBtn} ${styles.sentenceBtn}`}
          onClick={handleSpeakSentence}
        >
          💬 Câu
        </button>
        <button
          className={`${styles.actionBtn} ${styles.nextBtn}`}
          onClick={handleNext}
        >
          ▶️
        </button>
      </div>
    </div>
  );
}
