"use client";

import { useRouter } from "next/navigation";
import styles from "./learn.module.css";

const subjects = [
  {
    id: "english",
    name: "Tiếng Anh",
    nameEn: "English",
    icon: "🇬🇧",
    color: "#4ECDC4",
    gradient: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)",
    description: "Từ vựng, phát âm, quiz tương tác",
    topics: 37,
    href: "/learn/english",
  },
  {
    id: "math",
    name: "Toán học",
    nameEn: "Math",
    icon: "🔢",
    color: "#F59E0B",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
    description: "Đếm số, phép tính, hình học, phân số",
    topics: 24,
    href: "/learn/math",
  },
  {
    id: "science",
    name: "Khoa học",
    nameEn: "Science",
    icon: "🔬",
    color: "#8B5CF6",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
    description: "Sắp ra mắt...",
    topics: 0,
    href: null,
    comingSoon: true,
  },
];

export default function LearnPage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.stars} />
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🎓</span>
          <h1 className={styles.logoText}>EduKids</h1>
        </div>
        <p className={styles.subtitle}>Chọn môn học để bắt đầu</p>
      </header>

      <div className={styles.subjectGrid}>
        {subjects.map((s) => (
          <button
            key={s.id}
            className={`${styles.subjectCard} ${s.comingSoon ? styles.disabled : ""}`}
            onClick={() => s.href && router.push(s.href)}
            disabled={s.comingSoon}
            style={{ "--subject-color": s.color, "--subject-gradient": s.gradient }}
          >
            <span className={styles.subjectIcon}>{s.icon}</span>
            <h2 className={styles.subjectName}>{s.name}</h2>
            <span className={styles.subjectNameEn}>{s.nameEn}</span>
            <p className={styles.subjectDesc}>{s.description}</p>
            {s.topics > 0 && (
              <span className={styles.topicCount}>{s.topics} chủ đề</span>
            )}
            {s.comingSoon && (
              <span className={styles.comingSoonBadge}>Sắp ra mắt</span>
            )}
          </button>
        ))}
      </div>

      <footer className={styles.footer}>
        <button className={styles.footerLink} onClick={() => router.push("/leaderboard")}>
          🏆 Bảng xếp hạng
        </button>
        <button className={styles.footerLink} onClick={() => router.push("/dashboard")}>
          👤 Tài khoản
        </button>
      </footer>
    </div>
  );
}
