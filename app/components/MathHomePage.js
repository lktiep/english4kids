"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useSound } from "@/app/hooks/useSpeech";
import mathTopicsRegistry from "@/app/data/math/topics.json";
import MathQuizMode from "@/app/components/game/MathQuizMode";
import styles from "./MathHomePage.module.css";

export default function MathHomePage() {
  const { user, activeChild } = useAuth();
  const router = useRouter();
  const { play } = useSound();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicData, setTopicData] = useState(null);

  const handleTopicClick = async (topicSlug, topicMeta) => {
    play("click");
    try {
      const mod = await import(`@/app/data/math/exercises/${topicSlug}.json`);
      setTopicData(mod.default || mod);
      setSelectedTopic(topicSlug);
    } catch {
      console.warn("Exercise file not found:", topicSlug);
    }
  };

  const handleBack = () => {
    play("click");
    setSelectedTopic(null);
    setTopicData(null);
  };

  if (selectedTopic && topicData) {
    return <MathQuizMode topic={topicData} onBack={handleBack} />;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <button className={styles.backToSubjects} onClick={() => router.push("/learn")}>
            ← Chọn môn
          </button>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🔢</span>
            <h1 className={styles.logoText}>Toán học</h1>
          </div>
          <div style={{ width: 80 }} />
        </div>
      </header>

      <section className={styles.welcome}>
        <h2>Chào{activeChild ? ` ${activeChild.name}` : " bé"}! 🧮</h2>
        <p>Hôm nay mình luyện toán nào!</p>
        {!user && (
          <button className={styles.loginPrompt} onClick={() => router.push("/login")}>
            🔑 Đăng nhập để lưu điểm
          </button>
        )}
      </section>

      {Object.entries(mathTopicsRegistry.grades).map(([gradeId, grade]) => {
        const gradeTopics = mathTopicsRegistry.topics.filter((t) => t.grade === gradeId);
        if (gradeTopics.length === 0) return null;

        return (
          <section key={gradeId} className={styles.topicsSection}>
            <h3 className={styles.sectionTitle}>
              {grade.icon} {grade.name} ({grade.nameEn}, {grade.ageRange} tuổi)
            </h3>
            <div className={styles.topicGrid}>
              {gradeTopics.map((t, i) => (
                <MathTopicCard key={t.slug} slug={t.slug} index={i} onClick={handleTopicClick} />
              ))}
            </div>
          </section>
        );
      })}
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

  return (
    <button
      className={styles.topicCard}
      onClick={() => onClick(slug, meta)}
      style={{
        "--card-color": meta.color || "#6b7280",
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <span className={styles.topicIcon}>{meta.icon || "📝"}</span>
      <span className={styles.topicTitle}>{meta.title}</span>
      <span className={styles.topicTitleVi}>{meta.titleVi || ""}</span>
      <span className={styles.topicCount}>
        {meta.exercises?.length || 0} bài
      </span>
    </button>
  );
}
