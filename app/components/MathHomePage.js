"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/app/context/GameContext";
import { useAuth } from "@/app/context/AuthContext";
import { useSound } from "@/app/hooks/useSpeech";
import mathTopicsRegistry from "@/app/data/math/topics.json";
import MathQuizMode from "@/app/components/game/MathQuizMode";
import XPBar from "./ui/XPBar";
import BadgesPage from "./BadgesPage";
import LevelUpModal from "./ui/LevelUpModal";
import XPPopup from "./ui/XPPopup";
import styles from "./HomePage.module.css";

export default function MathHomePage() {
  const game = useGame();
  const { user, activeChild, children, setActiveChild } = useAuth();
  const router = useRouter();
  const { play } = useSound();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicData, setTopicData] = useState(null);
  const [currentView, setCurrentView] = useState("home");

  const handleTopicClick = async (topicSlug) => {
    play("click");
    try {
      const mod = await import(`@/app/data/math/exercises/${topicSlug}.json`);
      setTopicData(mod.default || mod);
      setSelectedTopic(topicSlug);
      setCurrentView("quiz");
    } catch {
      console.warn("Exercise file not found:", topicSlug);
    }
  };

  const handleBack = () => {
    play("click");
    setCurrentView("home");
    setSelectedTopic(null);
    setTopicData(null);
  };

  if (currentView === "quiz" && selectedTopic && topicData) {
    return (
      <>
        <MathQuizMode topic={topicData} onBack={handleBack} />
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
      {/* Header — same structure as English */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🔢</span>
            <h1 className={styles.logoText}>Toán học</h1>
          </div>
          <div className={styles.headerActions}>
            {/* Child Profile Selector */}
            {user && activeChild && (
              <div className={styles.childSelector}>
                <span className={styles.childAvatar}>
                  {activeChild.avatar || "🧒"}
                </span>
                <select
                  className={styles.childSelect}
                  value={activeChild.id}
                  onChange={(e) => {
                    const child = children.find((c) => c.id === e.target.value);
                    if (child) setActiveChild(child);
                  }}
                >
                  {children.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
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
        <h2>Chào{activeChild ? ` ${activeChild.name}` : " bé"}! 🧮</h2>
        <p>Hôm nay mình luyện toán nào!</p>
        <button
          className={styles.badgeBtn}
          onClick={() => router.push("/learn")}
          style={{ marginTop: 8 }}
        >
          ← Chọn môn
        </button>
        {!user && (
          <button
            className={styles.loginPrompt}
            onClick={() => router.push("/login")}
          >
            🔑 Đăng nhập để lưu điểm lên bảng xếp hạng
          </button>
        )}
        {user && !activeChild && children.length === 0 && (
          <button
            className={styles.loginPrompt}
            onClick={() => router.push("/dashboard")}
          >
            👶 Thêm hồ sơ bé để lưu tiến độ học
          </button>
        )}
      </section>

      {/* Topic Grids — grouped by grade */}
      {Object.keys(mathTopicsRegistry.grades).map((gradeId) => {
        const grade = mathTopicsRegistry.grades[gradeId];
        const gradeTopics = mathTopicsRegistry.topics.filter((t) => t.grade === gradeId);
        if (gradeTopics.length === 0) return null;

        return (
          <section key={gradeId} className={styles.topicsSection}>
            <h3 className={styles.sectionTitle}>
              {grade.icon} {grade.name} ({grade.nameEn}, {grade.ageRange} tuổi)
            </h3>
            <div className={styles.topicGrid}>
              {gradeTopics.map((t, i) => (
                <MathTopicCard
                  key={t.slug}
                  slug={t.slug}
                  index={i}
                  onClick={handleTopicClick}
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

function MathTopicCard({ slug, index, onClick }) {
  const [meta, setMeta] = useState(null);

  useMemo(() => {
    import(`@/app/data/math/exercises/${slug}.json`)
      .then((m) => setMeta(m.default || m))
      .catch(() => setMeta({ title: slug, icon: "📝", color: "#6b7280" }));
  }, [slug]);

  if (!meta) return null;

  const gradient = `linear-gradient(135deg, ${meta.color || "#F59E0B"}, ${meta.color || "#EF4444"}88)`;

  return (
    <div
      className={styles.mathCard}
      onClick={() => onClick(slug)}
      style={{
        "--card-gradient": gradient,
        "--card-color": meta.color || "#F59E0B",
        animationDelay: `${index * 0.08}s`,
      }}
    >
      <div className={styles.mathCardHeader} style={{ background: gradient }}>
        <span className={styles.mathCardIcon}>{meta.icon || "📝"}</span>
        <div className={styles.mathCardHeaderInfo}>
          <h3 className={styles.mathCardTitle}>{meta.title}</h3>
          <p className={styles.mathCardSubtitle}>{meta.titleVi || ""}</p>
        </div>
        <span className={styles.mathCardCount}>{meta.exercises?.length || 0} bài</span>
      </div>
      <div className={styles.mathCardBody}>
        <button className={styles.mathCardBtn} onClick={(e) => { e.stopPropagation(); onClick(slug); }}>
          🧮 Làm bài
        </button>
      </div>
    </div>
  );
}
