"use client";

import { useMemo } from "react";
import styles from "./LevelUpModal.module.css";

const CONFETTI_COLORS = ["#FF6B9D", "#4ECDC4", "#FFB347", "#667EEA", "#51CF66"];

export default function LevelUpModal({ data }) {
  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        x: `${i * 5 + ((i * 37) % 100)}%`,
        delay: `${i * 0.025}s`,
        color: CONFETTI_COLORS[i % 5],
      })),
    [],
  );
  if (!data) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.stars}>✨🌟✨</div>
        <div className={styles.icon}>{data.icon}</div>
        <h2 className={styles.title}>Lên Level!</h2>
        <p className={styles.level}>Level {data.level}</p>
        <p className={styles.name}>{data.nameVi}</p>
        <div className={styles.confetti}>
          {confettiPieces.map((piece, i) => (
            <span
              key={i}
              className={styles.confettiPiece}
              style={{
                "--x": piece.x,
                "--delay": piece.delay,
                "--color": piece.color,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
