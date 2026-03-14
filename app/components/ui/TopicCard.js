"use client";

import styles from "./TopicCard.module.css";

export default function TopicCard({
  topic,
  index,
  wordsLearned,
  quizResult,
  onLearn,
  onQuiz,
  onSpeak,
}) {
  const progress =
    topic.wordCount > 0
      ? Math.round((wordsLearned / topic.wordCount) * 100)
      : 0;
  const accuracy = quizResult
    ? Math.round((quizResult.correct / quizResult.total) * 100)
    : null;

  return (
    <div
      className={styles.card}
      style={{
        "--card-gradient": topic.gradient,
        "--card-color": topic.color,
        animationDelay: `${index * 0.08}s`,
      }}
    >
      <div className={styles.cardHeader} style={{ background: topic.gradient }}>
        <span className={styles.icon}>{topic.icon}</span>
        <div className={styles.headerInfo}>
          <h3 className={styles.title}>{topic.title}</h3>
          <p className={styles.subtitle}>{topic.titleVi}</p>
        </div>
        <span className={styles.wordCount}>{topic.wordCount} từ</span>
      </div>

      <div className={styles.cardBody}>
        {/* Progress */}
        <div className={styles.progressRow}>
          <span className={styles.progressLabel}>Đã học</span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%`, background: topic.gradient }}
            />
          </div>
          <span className={styles.progressText}>
            {wordsLearned}/{topic.wordCount}
          </span>
        </div>

        {accuracy !== null && (
          <div className={styles.accuracyRow}>
            <span>🎯 Quiz: {accuracy}%</span>
            <span>
              ({quizResult.correct}/{quizResult.total})
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button className={styles.learnBtn} onClick={onLearn}>
            📖 Học
          </button>
          <button className={styles.quizBtn} onClick={onQuiz}>
            🎯 Quiz
          </button>
          <button className={styles.speakBtn} onClick={onSpeak}>
            🎙️ Nói
          </button>
        </div>
      </div>
    </div>
  );
}
