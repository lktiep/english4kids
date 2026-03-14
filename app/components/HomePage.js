"use client";

import { useState, useCallback } from "react";
import { useGame } from "@/app/context/GameContext";
import { getAllTopics, getGradeInfo } from "@/app/utils/topics";
import topicsRegistry from "@/app/data/topics.json";
import { useSound } from "@/app/hooks/useSpeech";
import TopicCard from "./ui/TopicCard";
import XPBar from "./ui/XPBar";
import FlashcardMode from "./game/FlashcardMode";
import QuizMode from "./game/QuizMode";
import SpeakMode from "./game/SpeakMode";
import CameraOverlay from "./ui/CameraOverlay";
import BadgesPage from "./BadgesPage";
import LevelUpModal from "./ui/LevelUpModal";
import XPPopup from "./ui/XPPopup";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const game = useGame();
  const { play } = useSound();
  const [currentView, setCurrentView] = useState("home");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);

  const topics = getAllTopics();

  const handleTopicClick = (topic, mode) => {
    play("click");
    setSelectedTopic(topic);
    setCurrentView(mode);
  };

  const handleBack = () => {
    play("click");
    setCurrentView("home");
    setSelectedTopic(null);
    setCameraEnabled(false);
  };

  const handleGesture = useCallback((fingerCount) => {
    // This will be called when a stable gesture is detected
    // Pass it down to QuizMode via a custom event
    window.dispatchEvent(
      new CustomEvent("gesture-select", { detail: { answer: fingerCount } }),
    );
  }, []);

  if (currentView === "learn" && selectedTopic) {
    return (
      <>
        <FlashcardMode topic={selectedTopic} onBack={handleBack} />
        {game.xpPopup && <XPPopup {...game.xpPopup} />}
        {game.levelUpData && <LevelUpModal data={game.levelUpData} />}
      </>
    );
  }

  if (currentView === "quiz" && selectedTopic) {
    return (
      <>
        <QuizMode
          topic={selectedTopic}
          onBack={handleBack}
          cameraEnabled={cameraEnabled}
          onToggleCamera={() => setCameraEnabled((v) => !v)}
        />
        <CameraOverlay enabled={cameraEnabled} onGesture={handleGesture} />
        {game.xpPopup && <XPPopup {...game.xpPopup} />}
        {game.levelUpData && <LevelUpModal data={game.levelUpData} />}
      </>
    );
  }

  if (currentView === "speak" && selectedTopic) {
    return (
      <>
        <SpeakMode topic={selectedTopic} onBack={handleBack} />
        {game.xpPopup && <XPPopup {...game.xpPopup} />}
        {game.levelUpData && <LevelUpModal data={game.levelUpData} />}
      </>
    );
  }

  if (currentView === "badges") {
    return (
      <>
        <BadgesPage onBack={handleBack} />
        {game.xpPopup && <XPPopup {...game.xpPopup} />}
      </>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🎓</span>
            <h1 className={styles.logoText}>EnglishKids</h1>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.badgeBtn}
              onClick={() => {
                play("click");
                setCurrentView("badges");
              }}
            >
              🏅 {game.badges?.length || 0}
            </button>
            <div className={styles.streakBadge}>
              <span>🔥</span>
              <span>{game.streak} ngày</span>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <XPBar
          xp={game.xp}
          level={game.level}
          levelInfo={game.levelInfo}
          xpProgress={game.xpProgress}
        />
      </header>

      {/* Welcome */}
      <section className={styles.welcome}>
        <h2>Chào bé! 👋</h2>
        <p>Hôm nay mình học gì nào?</p>
      </section>

      {/* Topic Grids — grouped by grade */}
      {Object.keys(topicsRegistry.grades).map((gradeId) => {
        const grade = getGradeInfo(gradeId);
        const gradeTopics = topics.filter((t) => t.grade === gradeId);
        if (gradeTopics.length === 0) return null;

        return (
          <section key={gradeId} className={styles.topicsSection}>
            <h3 className={styles.sectionTitle}>
              {grade.icon} {grade.name} ({grade.nameEn}, {grade.ageRange} tuổi)
            </h3>
            <div className={styles.topicGrid}>
              {gradeTopics.map((topic, i) => (
                <TopicCard
                  key={topic.slug}
                  topic={topic}
                  index={i}
                  wordsLearned={game.wordsLearned[topic.slug]?.length || 0}
                  quizResult={game.quizResults[topic.slug]}
                  onLearn={() => handleTopicClick(topic, "learn")}
                  onQuiz={() => handleTopicClick(topic, "quiz")}
                  onSpeak={() => handleTopicClick(topic, "speak")}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* XP Popup */}
      {game.xpPopup && <XPPopup {...game.xpPopup} />}
      {game.levelUpData && <LevelUpModal data={game.levelUpData} />}
    </div>
  );
}
