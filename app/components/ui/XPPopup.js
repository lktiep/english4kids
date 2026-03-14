"use client";

import styles from "./XPPopup.module.css";

export default function XPPopup({ amount, reason, id }) {
  return (
    <div key={id} className={styles.popup}>
      <span className={styles.amount}>+{amount} XP</span>
      {reason && <span className={styles.reason}>{reason}</span>}
    </div>
  );
}
