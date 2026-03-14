"use client";

import { useGame } from "@/app/context/GameContext";
import { getAllBadges } from "@/app/utils/badges";
import styles from "./BadgesPage.module.css";

export default function BadgesPage({ onBack }) {
  const { state } = useGame();
  const allBadges = getAllBadges();
  const earnedIds = state?.badges || [];

  const earned = allBadges.filter((b) => earnedIds.includes(b.id));
  const locked = allBadges.filter((b) => !earnedIds.includes(b.id));

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={onBack}>
          ← Về
        </button>
        <h1 className={styles.title}>🏅 Huy chương</h1>
        <span className={styles.counter}>
          {earned.length}/{allBadges.length}
        </span>
      </div>

      {earned.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>✨ Đã đạt được</h2>
          <div className={styles.badgeGrid}>
            {earned.map((badge) => (
              <div key={badge.id} className={styles.badgeCard}>
                <span className={styles.badgeIcon}>{badge.icon}</span>
                <h3 className={styles.badgeName}>{badge.name}</h3>
                <p className={styles.badgeDesc}>{badge.description}</p>
                <span className={styles.badgeXP}>+{badge.xpReward} XP</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🔒 Chưa mở khóa</h2>
        <div className={styles.badgeGrid}>
          {locked.map((badge) => (
            <div
              key={badge.id}
              className={`${styles.badgeCard} ${styles.locked}`}
            >
              <span className={styles.badgeIcon}>{badge.icon}</span>
              <h3 className={styles.badgeName}>{badge.name}</h3>
              <p className={styles.badgeDesc}>{badge.description}</p>
              <span className={styles.badgeXP}>+{badge.xpReward} XP</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
