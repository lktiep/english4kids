"use client";

import styles from "./XPBar.module.css";

export default function XPBar({ xp, level, levelInfo, xpProgress }) {
  return (
    <div className={styles.container}>
      <div className={styles.levelBadge}>
        <span className={styles.levelIcon}>{levelInfo.icon}</span>
        <span className={styles.levelNum}>Lv.{level}</span>
      </div>
      <div className={styles.barWrapper}>
        <div className={styles.barTrack}>
          <div
            className={styles.barFill}
            style={{ width: `${xpProgress.percent}%` }}
          />
        </div>
        <div className={styles.barInfo}>
          <span className={styles.levelName}>{levelInfo.nameVi}</span>
          <span className={styles.xpText}>
            {xpProgress.current}/{xpProgress.needed} XP
          </span>
        </div>
      </div>
      <div className={styles.totalXP}>⭐ {xp}</div>
    </div>
  );
}
