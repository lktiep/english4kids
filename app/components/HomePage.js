"use client";

import { useState } from "react";
import { useGame } from "@/app/context/GameContext";
import { getAllTopics } from "@/app/utils/topics";
import { useSound } from "@/app/hooks/useSpeech";
import TopicCard from "./ui/TopicCard";
import XPBar from "./ui/XPBar";
import FlashcardMode from "./game/FlashcardMode";
import QuizMode from "./game/QuizMode";
import LevelUpModal from "./ui/LevelUpModal";
import XPPopup from "./ui/XPPopup";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const game = useGame();
  const { play } = useSound();
  const [currentView, setCurrentView] = useState("home"); // home, learn, quiz
  const [selectedTopic, setSelectedTopic] = useState(null);

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
  };

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
        <QuizMode topic={selectedTopic} onBack={handleBack} />
        {game.xpPopup && <XPPopup {...game.xpPopup} />}
        {game.levelUpData && <LevelUpModal data={game.levelUpData} />}
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
          <div className={styles.streakBadge}>
            <span>🔥</span>
            <span>{game.streak} ngày</span>
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

      {/* Topic Grid */}
      <section className={styles.topicsSection}>
        <h3 className={styles.sectionTitle}>📚 Chủ đề Lớp 1</h3>
        <div className={styles.topicGrid}>
          {topics.map((topic, i) => (
            <TopicCard
              key={topic.slug}
              topic={topic}
              index={i}
              wordsLearned={game.wordsLearned[topic.slug]?.length || 0}
              quizResult={game.quizResults[topic.slug]}
              onLearn={() => handleTopicClick(topic, "learn")}
              onQuiz={() => handleTopicClick(topic, "quiz")}
            />
          ))}
        </div>
      </section>

      {/* XP Popup */}
      {game.xpPopup && <XPPopup {...game.xpPopup} />}
      {game.levelUpData && <LevelUpModal data={game.levelUpData} />}
    </div>
  );
}
