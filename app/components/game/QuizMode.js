"use client";

import { useState, useEffect, useCallback } from "react";
import { useGame } from "@/app/context/GameContext";
import { useSpeech, useSound } from "@/app/hooks/useSpeech";
import { shuffle } from "@/app/utils/topics";
import styles from "./QuizMode.module.css";

// Generate questions outside component to avoid lint issues
function generateQuestions(topic) {
  const words = shuffle(topic.words);
  return words.map((correctWord) => {
    const otherWords = topic.words.filter((w) => w.id !== correctWord.id);
    const wrongOptions = shuffle(otherWords).slice(0, 3);
    const options = shuffle([correctWord, ...wrongOptions]);
    return {
      correctWord,
      options,
      questionVi: `Đâu là "${correctWord.word}"?`,
    };
  });
}

export default function QuizMode({
  topic,
  onBack,
  cameraEnabled = false,
  onToggleCamera,
}) {
  const game = useGame();
  const { speak } = useSpeech();
  const { play } = useSound();

  const [questions] = useState(() => generateQuestions(topic));
  const totalQuestions = questions.length;
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [finished, setFinished] = useState(false);

  // Gesture preview: highlighted but not submitted yet
  const [gesturePreview, setGesturePreview] = useState(null);

  // Try-again state: allow retry on wrong answer (max 2 attempts per question)
  const [attempts, setAttempts] = useState(0);
  const [wrongFeedback, setWrongFeedback] = useState(false);
  const maxAttempts = 2;

  const q = questions[currentQ];

  // Auto-speak question
  useEffect(() => {
    if (q && !showResult && !wrongFeedback) {
      const timer = setTimeout(() => speak(q.correctWord.word), 500);
      return () => clearTimeout(timer);
    }
  }, [currentQ, q, showResult, wrongFeedback, speak]);

  // Submit answer (used by both click and gesture-confirm)
  const submitAnswer = useCallback(
    (option) => {
      if (showResult) return;

      const correct = option.id === q.correctWord.id;
      setSelected(option.id);
      setGesturePreview(null);

      if (correct) {
        setIsCorrect(true);
        setShowResult(true);
        play("correct");
        const newStreak = streak + 1;
        setStreak(newStreak);
        setScore((prev) => ({
          correct: prev.correct + 1,
          total: prev.total + 1,
        }));
        game.recordQuiz(topic.topic, true);
        game.earnXP(10, "Đúng rồi!");

        // Streak bonus
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
          // Out of attempts — show correct answer
          setIsCorrect(false);
          setShowResult(true);
          setStreak(0);
          setScore((prev) => ({ ...prev, total: prev.total + 1 }));
          game.recordQuiz(topic.topic, false);
          setTimeout(() => speak(q.correctWord.word), 800);
        } else {
          // Allow try again
          setWrongFeedback(true);
          setSelected(null);
          setTimeout(() => setWrongFeedback(false), 1500);
        }
      }
    },
    [showResult, q, streak, play, game, topic, speak, attempts],
  );

  // Click handler: direct submit (non-gesture mode)
  const handleClickSelect = useCallback(
    (option) => {
      if (showResult || wrongFeedback) return;

      if (cameraEnabled) {
        // In camera mode, click also previews (same as gesture)
        setGesturePreview(option.id);
      } else {
        // Normal mode: click = submit
        submitAnswer(option);
      }
    },
    [showResult, wrongFeedback, cameraEnabled, submitAnswer],
  );

  // Confirm gesture preview (fist or click confirm button)
  const confirmGestureSelection = useCallback(() => {
    if (!gesturePreview || showResult || wrongFeedback) return;
    const option = q.options.find((o) => o.id === gesturePreview);
    if (option) submitAnswer(option);
  }, [gesturePreview, showResult, wrongFeedback, q, submitAnswer]);

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
      setFinished(true);
    }
  }, [currentQ, totalQuestions, play]);

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
        if (idx !== undefined && q.options[idx]) {
          if (cameraEnabled) {
            setGesturePreview(q.options[idx].id);
          } else {
            submitAnswer(q.options[idx]);
          }
        }
        // Enter to confirm in camera mode
        if (e.key === "Enter" && cameraEnabled && gesturePreview) {
          confirmGestureSelection();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [
    showResult,
    wrongFeedback,
    q,
    handleNext,
    submitAnswer,
    cameraEnabled,
    gesturePreview,
    confirmGestureSelection,
  ]);

  // Listen for hand gesture events from CameraOverlay
  useEffect(() => {
    if (!cameraEnabled) return;

    const handleGesture = (e) => {
      const fingerCount = e.detail.answer; // 0-5

      // Thumbs-up (5): advance to next question when showing result
      if (fingerCount === 5 && (showResult || wrongFeedback)) {
        handleNext();
        return;
      }

      if (wrongFeedback || showResult) return;

      // Fingers 1-4: preview selection (don't submit)
      if (fingerCount >= 1 && fingerCount <= 4) {
        const idx = fingerCount - 1;
        if (q && q.options[idx]) {
          setGesturePreview(q.options[idx].id);
        }
      }

      // Fist (0 fingers): confirm selection immediately
      if (fingerCount === 0 && gesturePreview && !showResult && !wrongFeedback) {
        confirmGestureSelection();
      }
    };

    window.addEventListener("gesture-select", handleGesture);
    return () => window.removeEventListener("gesture-select", handleGesture);
  }, [
    cameraEnabled,
    q,
    showResult,
    wrongFeedback,
    gesturePreview,
    confirmGestureSelection,
    handleNext,
  ]);

  if (!q && !finished) return null;

  // Results screen
  if (finished) {
    const accuracy =
      score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    const stars =
      accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 50 ? 1 : 0;

    return (
      <div className={styles.resultsScreen}>
        <div className={styles.resultsContent}>
          <div className={styles.starsRow}>
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className={`${styles.star} ${i <= stars ? styles.starActive : ""}`}
              >
                ⭐
              </span>
            ))}
          </div>
          <h2>{accuracy >= 70 ? "Giỏi lắm! 🎉" : "Cố gắng lên nhé! 💪"}</h2>
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
          </div>
          <div className={styles.resultsActions}>
            <button className="btn btn-primary" onClick={onBack}>
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
        <div className={styles.topicInfo}>
          <span>{topic.icon} Quiz</span>
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
          <span className={styles.counter}>
            {currentQ + 1}/{totalQuestions}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className={styles.questionArea}>
        <h2 className={styles.question}>{q.questionVi}</h2>
        <button
          className={styles.listenBtn}
          onClick={() => speak(q.correctWord.word)}
        >
          🔊 Nghe lại
        </button>
      </div>

      {/* Wrong feedback hint */}
      {wrongFeedback && (
        <div className={styles.feedbackArea}>
          <div className={`${styles.feedback} ${styles.feedbackWrong}`}>
            <span>
              ❌ Sai rồi! Thử lại nhé ({maxAttempts - attempts} lần còn lại)
            </span>
          </div>
        </div>
      )}

      {/* Options Grid */}
      <div className={styles.optionsGrid}>
        {q.options.map((option, i) => {
          const letter = ["A", "B", "C", "D"][i];
          const isSelected = selected === option.id;
          const isPreviewed = gesturePreview === option.id;
          const isAnswer = option.id === q.correctWord.id;

          let optionClass = styles.option;
          if (showResult) {
            if (isAnswer) optionClass += ` ${styles.correct}`;
            else if (isSelected && !isCorrect)
              optionClass += ` ${styles.wrong}`;
          } else if (isPreviewed) {
            optionClass += ` ${styles.previewed}`;
          } else if (isSelected) {
            optionClass += ` ${styles.selected}`;
          }

          return (
            <button
              key={option.id}
              className={optionClass}
              onClick={() => handleClickSelect(option)}
              disabled={showResult || wrongFeedback}
            >
              <span className={styles.optionLetter}>{letter}</span>
              <span className={styles.optionEmoji}>{option.emoji}</span>
              <span className={styles.optionWord}>{option.vietnamese}</span>
              {cameraEnabled ? (
                <span className={styles.optionKey}>
                  {isPreviewed ? "✊ Nắm tay = xác nhận" : `☝️ ${i + 1} ngón`}
                </span>
              ) : (
                <span className={styles.optionKey}>Phím {i + 1}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Gesture confirm button (visible when previewing with camera) */}
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

      {/* Result feedback (shown after answer) */}
      {showResult && (
        <div className={styles.feedbackArea}>
          <div
            className={`${styles.feedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}`}
          >
            {isCorrect ? (
              <span>✅ Đúng rồi! +10 XP</span>
            ) : (
              <span>
                ❌ Đáp án đúng: <strong>{q.correctWord.word}</strong> ={" "}
                {q.correctWord.vietnamese}
              </span>
            )}
          </div>
          <button className="btn btn-primary" onClick={handleNext}>
            {currentQ < totalQuestions - 1 ? "Câu tiếp ▶️" : "Xem kết quả 📊"}
          </button>
        </div>
      )}
    </div>
  );
}
