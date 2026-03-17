"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/app/context/GameContext";
import { useAuth } from "@/app/context/AuthContext";
import { useSpeech, useSound } from "@/app/hooks/useSpeech";
import { getTier } from "@/app/utils/rankTiers";
import styles from "./QuizMode.module.css";

// Shared confetti
const CONFETTI_PIECES = Array.from({ length: 30 }, (_, i) => ({
  x: `${(i * 3.33) % 100}vw`,
  delay: `${i * 0.067}s`,
  duration: `${2 + i * 0.067}s`,
  color: ["#FFD700", "#4ECDC4", "#FF6B6B", "#A78BFA", "#FFB347", "#00E676"][i % 6],
  rotation: `${i * 12}deg`,
}));

function ConfettiOverlay() {
  return (
    <div className={styles.confettiContainer} aria-hidden="true">
      {CONFETTI_PIECES.map((p, i) => (
        <div key={i} className={styles.confettiPiece} style={{
          "--x": p.x, "--delay": p.delay, "--duration": p.duration,
          "--color": p.color, "--rotation": p.rotation,
        }} />
      ))}
    </div>
  );
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MathQuizMode({
  topic,
  onBack,
  cameraEnabled = false,
  onToggleCamera,
}) {
  const game = useGame();
  const { saveQuizAttempt } = useAuth();
  const router = useRouter();
  const { speak } = useSpeech();
  const { play } = useSound();
  const startTimeRef = useRef(null);

  useEffect(() => { startTimeRef.current = Date.now(); }, []);

  const questions = useMemo(() => shuffleArray(topic.exercises || []), [topic]);
  const totalQuestions = questions.length;
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const [finishedDuration, setFinishedDuration] = useState(0);
  const [gesturePreview, setGesturePreview] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [wrongFeedback, setWrongFeedback] = useState(false);
  const maxAttempts = 2;

  const q = questions[currentQ];
  const options = q?.options || [];

  // Auto-speak question
  useEffect(() => {
    if (q && !showResult && !wrongFeedback) {
      const timer = setTimeout(() => speak(q.question), 500);
      return () => clearTimeout(timer);
    }
  }, [currentQ, q, showResult, wrongFeedback, speak]);

  // Submit answer
  const submitAnswer = useCallback(
    (option) => {
      if (showResult) return;
      const correct = String(option) === String(q.answer);
      setSelected(option);
      setGesturePreview(null);

      if (correct) {
        setIsCorrect(true);
        setShowResult(true);
        play("correct");
        const newStreak = streak + 1;
        setStreak(newStreak);
        setScore((prev) => ({ correct: prev.correct + 1, total: prev.total + 1 }));
        game.recordQuiz(topic.title || topic.topic, true);
        game.earnXP(10, "Đúng rồi!");
        if (newStreak > 0 && newStreak % 5 === 0) {
          setTimeout(() => {
            play("streak");
            game.earnXP(25, `Streak ${newStreak}! 🔥`);
          }, 500);
        }
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        play("wrong");
        if (newAttempts >= maxAttempts) {
          setIsCorrect(false);
          setShowResult(true);
          setStreak(0);
          setScore((prev) => ({ ...prev, total: prev.total + 1 }));
          game.recordQuiz(topic.title || topic.topic, false);
        } else {
          setWrongFeedback(true);
          setSelected(null);
          setTimeout(() => setWrongFeedback(false), 1500);
        }
      }
    },
    [showResult, q, streak, play, game, topic, attempts],
  );

  // Click handler
  const handleClickSelect = useCallback(
    (option) => {
      if (showResult || wrongFeedback) return;
      if (cameraEnabled) {
        setGesturePreview(String(option));
      } else {
        submitAnswer(option);
      }
    },
    [showResult, wrongFeedback, cameraEnabled, submitAnswer],
  );

  // Confirm gesture
  const confirmGestureSelection = useCallback(() => {
    if (!gesturePreview || showResult || wrongFeedback) return;
    submitAnswer(gesturePreview);
  }, [gesturePreview, showResult, wrongFeedback, submitAnswer]);

  const handleNext = useCallback(() => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ((prev) => prev + 1);
      setSelected(null);
      setShowResult(false);
      setIsCorrect(false);
      setGesturePreview(null);
      setAttempts(0);
      setWrongFeedback(false);
    } else {
      play("complete");
      const durationMs = Date.now() - (startTimeRef.current || Date.now());
      const timeSeconds = Math.round(durationMs / 1000);
      setFinishedDuration(timeSeconds);
      setFinished(true);
      if (saveQuizAttempt) {
        saveQuizAttempt(
          topic.title || topic.topic,
          score.correct,
          score.total,
          timeSeconds,
          "math",
        ).catch(() => {});
      }
    }
  }, [currentQ, totalQuestions, play, saveQuizAttempt, score, topic]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (showResult) {
        if (e.key === " " || e.key === "Enter") handleNext();
        return;
      }
      if (wrongFeedback) return;
      if (q) {
        const keyMap = { 1: 0, 2: 1, 3: 2, 4: 3 };
        const idx = keyMap[e.key];
        if (idx !== undefined && options[idx] !== undefined) {
          if (cameraEnabled) {
            setGesturePreview(String(options[idx]));
          } else {
            submitAnswer(options[idx]);
          }
        }
        if (e.key === "Enter" && cameraEnabled && gesturePreview) {
          confirmGestureSelection();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showResult, wrongFeedback, q, options, handleNext, submitAnswer, cameraEnabled, gesturePreview, confirmGestureSelection]);

  // Gesture events from CameraOverlay
  useEffect(() => {
    if (!cameraEnabled) return;
    const handleGesture = (e) => {
      const fingerCount = e.detail.answer;
      if (fingerCount === 5 && (showResult || wrongFeedback)) { handleNext(); return; }
      if (wrongFeedback || showResult) return;
      if (fingerCount >= 1 && fingerCount <= 4) {
        const idx = fingerCount - 1;
        if (options[idx] !== undefined) setGesturePreview(String(options[idx]));
      }
      if (fingerCount === 0 && gesturePreview && !showResult && !wrongFeedback) {
        confirmGestureSelection();
      }
    };
    window.addEventListener("gesture-select", handleGesture);
    return () => window.removeEventListener("gesture-select", handleGesture);
  }, [cameraEnabled, options, showResult, wrongFeedback, gesturePreview, confirmGestureSelection, handleNext]);

  if (!q && !finished) return null;

  // Results screen — shared design with QuizMode
  if (finished) {
    const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 50 ? 1 : 0;
    const durationSec = finishedDuration;
    const minutes = Math.floor(durationSec / 60);
    const seconds = durationSec % 60;
    const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    const tier = getTier(score.correct * 10);
    const showConfetti = accuracy >= 70;

    return (
      <div className={styles.resultsScreen}>
        {showConfetti && <ConfettiOverlay />}
        <div className={styles.resultsContent}>
          <div className={styles.starsRow}>
            {[1, 2, 3].map((i) => (
              <span key={i} className={`${styles.star} ${i <= stars ? styles.starActive : ""}`}>⭐</span>
            ))}
          </div>
          <h2>{accuracy >= 70 ? "Giỏi lắm! 🎉" : "Cố gắng lên nhé! 💪"}</h2>
          <div className={styles.tierBadge} style={{ "--tier-color": tier.color, "--tier-glow": tier.glow }}>
            <span className={styles.tierIcon}>{tier.icon}</span>
            <span className={styles.tierName}>{tier.name}</span>
          </div>
          <div className={styles.scoreCard}>
            <div className={styles.scoreStat}>
              <span className={styles.scoreNum}>{score.correct}</span>
              <span className={styles.scoreLabel}>Đúng</span>
            </div>
            <div className={styles.scoreDivider} />
            <div className={styles.scoreStat}>
              <span className={styles.scoreNum}>{score.total}</span>
              <span className={styles.scoreLabel}>Tổng</span>
            </div>
            <div className={styles.scoreDivider} />
            <div className={styles.scoreStat}>
              <span className={styles.scoreNum}>{accuracy}%</span>
              <span className={styles.scoreLabel}>Chính xác</span>
            </div>
            <div className={styles.scoreDivider} />
            <div className={styles.scoreStat}>
              <span className={styles.scoreNum}>{timeStr}</span>
              <span className={styles.scoreLabel}>Thời gian</span>
            </div>
          </div>
          <div className={styles.resultsActions}>
            <button className={styles.ctaPrimary} onClick={onBack}>🔄 Làm quiz khác</button>
            <button className={styles.ctaSecondary} onClick={() => router.push("/leaderboard")}>🏆 Bảng xếp hạng</button>
            <button className={styles.ctaGhost} onClick={() => router.push("/")}>🏠 Về trang chủ</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Top Bar — same as English QuizMode */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={onBack}>← Về</button>
        <div className={styles.topicInfo}>
          <span>{topic.icon} {topic.title}</span>
        </div>
        <div className={styles.scoreInfo}>
          {onToggleCamera && (
            <button
              className={`${styles.cameraBtn} ${cameraEnabled ? styles.cameraBtnActive : ""}`}
              onClick={onToggleCamera}
              title="Bật/tắt webcam gesture"
            >
              📷
            </button>
          )}
          <span className={styles.streakBadge}>
            {streak > 0 && `🔥${streak}`}
          </span>
          <span className={styles.counter}>{currentQ + 1}/{totalQuestions}</span>
        </div>
      </div>

      {/* Question — split text from emoji onto separate lines */}
      {(() => {
        const emojiRegex = /([\p{Emoji_Presentation}\p{Extended_Pictographic}]+(?:\s*[\p{Emoji_Presentation}\p{Extended_Pictographic}]+)*)\s*$/u;
        const match = q.question.match(emojiRegex);
        const textPart = match ? q.question.slice(0, match.index).trim() : q.question;
        const emojiPart = match ? match[1] : null;
        return (
          <div className={styles.questionArea} style={{ marginBottom: 24 }}>
            <h2 className={styles.question}>{textPart}</h2>
            {emojiPart && (
              <div style={{ fontSize: 48, marginTop: 12, letterSpacing: 8, lineHeight: 1.4 }}>
                {emojiPart}
              </div>
            )}
            {q.questionVi && <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 8 }}>{q.questionVi}</p>}
            <button className={styles.listenBtn} onClick={() => speak(q.question)}>
              🔊 Nghe lại
            </button>
          </div>
        );
      })()}

      {/* Wrong feedback */}
      {wrongFeedback && (
        <div className={styles.feedbackArea}>
          <div className={`${styles.feedback} ${styles.feedbackWrong}`}>
            <span>❌ Sai rồi! Thử lại nhé ({maxAttempts - attempts} lần còn lại)</span>
          </div>
        </div>
      )}

      {/* Options Grid — using shared QuizMode styles */}
      <div className={styles.optionsGrid}>
        {options.map((option, i) => {
          const num = i + 1;
          const optStr = String(option);
          const isSelected = String(selected) === optStr;
          const isPreviewed = gesturePreview === optStr;
          const isAnswer = optStr === String(q.answer);

          let optionClass = styles.option;
          if (showResult) {
            if (isAnswer) optionClass += ` ${styles.correct}`;
            else if (isSelected && !isCorrect) optionClass += ` ${styles.wrong}`;
          } else if (isPreviewed) {
            optionClass += ` ${styles.previewed}`;
          } else if (isSelected) {
            optionClass += ` ${styles.selected}`;
          }

          return (
            <button
              key={i}
              className={optionClass}
              onClick={() => handleClickSelect(option)}
              disabled={showResult || wrongFeedback}
            >
              <span className={styles.optionLetter}>{num}</span>
              <span className={styles.optionLabel}>
                <span className={styles.optionWord}>{optStr}</span>
                {cameraEnabled ? (
                  <span className={styles.optionKey}>
                    {isPreviewed ? "✊ Xác nhận" : `☝️ ${num}`}
                  </span>
                ) : (
                  <span className={styles.optionKey}>{num}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Gesture confirm */}
      {cameraEnabled && gesturePreview && !showResult && !wrongFeedback && (
        <div className={styles.feedbackArea}>
          <div className={`${styles.feedback} ${styles.feedbackPreview}`}>
            <span>✊ Nắm tay để xác nhận — hoặc bấm nút bên dưới</span>
          </div>
          <button className="btn btn-primary" onClick={confirmGestureSelection}>
            ✅ Xác nhận
          </button>
        </div>
      )}

      {/* Result feedback + hint */}
      {showResult && (
        <div className={styles.feedbackArea}>
          <div className={`${styles.feedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}`}>
            {isCorrect ? (
              <span>✅ Đúng rồi! +10 XP</span>
            ) : (
              <span>❌ Đáp án đúng: <strong>{q.answer}</strong></span>
            )}
          </div>
          {q.hint && <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textAlign: "center", marginTop: 8 }}>💡 {q.hint}</p>}
          <button className="btn btn-primary" onClick={handleNext}>
            {currentQ < totalQuestions - 1 ? "Câu tiếp ▶️" : "Xem kết quả 📊"}
          </button>
        </div>
      )}
    </div>
  );
}
