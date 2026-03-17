"use client";

import { useState, useCallback, useMemo } from "react";
import { useSound } from "@/app/hooks/useSpeech";
import styles from "./MathQuizMode.module.css";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const CONFETTI = Array.from({ length: 20 }, (_, i) => ({
  x: `${(i * 5) % 100}vw`,
  delay: `${i * 0.08}s`,
  duration: `${2 + i * 0.06}s`,
  color: ["#FFD700", "#4ECDC4", "#FF6B6B", "#A78BFA", "#FFB347", "#00E676"][i % 6],
}));

export default function MathQuizMode({ topic, onBack }) {
  const { play } = useSound();
  const questions = useMemo(() => shuffle(topic.exercises || []), [topic]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);

  const q = questions[current];

  const handleSelect = useCallback((option) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);

    const isCorrect = String(option) === String(q.answer);
    if (isCorrect) {
      play("correct");
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else {
      play("wrong");
      setStreak(0);
    }

    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent((c) => c + 1);
        setSelected(null);
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 1200);
  }, [answered, current, q, questions.length, play]);

  if (showResult) {
    const pct = Math.round((score / questions.length) * 100);
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : pct >= 30 ? 1 : 0;
    return (
      <div className={styles.resultsScreen}>
        {pct >= 80 && (
          <div className={styles.confettiContainer}>
            {CONFETTI.map((c, i) => (
              <div key={i} className={styles.confettiPiece} style={{
                "--x": c.x, "--delay": c.delay, "--duration": c.duration, "--color": c.color,
              }} />
            ))}
          </div>
        )}
        <div className={styles.resultsContent}>
          <div className={styles.starsRow}>
            {[1, 2, 3].map((s) => (
              <span key={s} className={`${styles.star} ${s <= stars ? styles.starActive : ""}`}>⭐</span>
            ))}
          </div>
          <h2>{pct >= 80 ? "🎉 Xuất sắc!" : pct >= 50 ? "👍 Tốt lắm!" : "💪 Cố gắng thêm!"}</h2>
          <div className={styles.scoreCard}>
            <div className={styles.scoreStat}>
              <span className={styles.scoreNum}>{score}/{questions.length}</span>
              <span className={styles.scoreLabel}>Đúng</span>
            </div>
            <div className={styles.scoreDivider} />
            <div className={styles.scoreStat}>
              <span className={styles.scoreNum}>{pct}%</span>
              <span className={styles.scoreLabel}>Điểm</span>
            </div>
          </div>
          <div className={styles.resultsActions}>
            <button className={styles.ctaPrimary} onClick={() => { setCurrent(0); setScore(0); setSelected(null); setAnswered(false); setShowResult(false); setStreak(0); }}>
              🔄 Làm lại
            </button>
            <button className={styles.ctaGhost} onClick={onBack}>← Quay lại</button>
          </div>
        </div>
      </div>
    );
  }

  if (!q) return null;
  const options = q.options || [];

  return (
    <div className={styles.container}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={onBack}>← Quay lại</button>
        <span className={styles.topicInfo}>{topic.icon} {topic.title}</span>
        <div className={styles.scoreInfo}>
          {streak >= 2 && <span className={styles.streakBadge}>🔥{streak}</span>}
          <span className={styles.counter}>{current + 1}/{questions.length}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>

      {/* Question */}
      <div className={styles.questionArea}>
        <h2 className={styles.question}>{q.question}</h2>
        <p className={styles.questionVi}>{q.questionVi}</p>
        {q.hint && answered && (
          <p className={styles.hint}>💡 {q.hint}</p>
        )}
      </div>

      {/* Options */}
      <div className={styles.optionsGrid}>
        {options.map((option, i) => {
          const isCorrect = String(option) === String(q.answer);
          const isSelected = String(selected) === String(option);
          let className = styles.option;
          if (answered && isSelected && isCorrect) className += ` ${styles.correct}`;
          else if (answered && isSelected && !isCorrect) className += ` ${styles.wrong}`;
          else if (answered && isCorrect) className += ` ${styles.correctReveal}`;

          return (
            <button
              key={i}
              className={className}
              onClick={() => handleSelect(option)}
              disabled={answered}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className={styles.optionLetter}>{String.fromCharCode(65 + i)}</span>
              <span className={styles.optionText}>{String(option)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
