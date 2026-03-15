"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { getTier } from "../utils/rankTiers";
import styles from "./leaderboard.module.css";

const COUNTRY_FLAGS = {
  VN: "🇻🇳",
  US: "🇺🇸",
  UK: "🇬🇧",
  JP: "🇯🇵",
  KR: "🇰🇷",
  CN: "🇨🇳",
  TH: "🇹🇭",
  SG: "🇸🇬",
  AU: "🇦🇺",
  DE: "🇩🇪",
  FR: "🇫🇷",
  IN: "🇮🇳",
  BR: "🇧🇷",
  CA: "🇨🇦",
  MY: "🇲🇾",
};

const RANK_STYLES = [
  { emoji: "🥇", color: "#FFD700", glow: "rgba(255,215,0,0.3)" },
  { emoji: "🥈", color: "#C0C0C0", glow: "rgba(192,192,192,0.3)" },
  { emoji: "🥉", color: "#CD7F32", glow: "rgba(205,127,50,0.3)" },
];

// Demo data for display
const DEMO_DATA = [
  {
    child_name: "Minh Anh",
    country: "VN",
    total_score: 980,
    total_quizzes: 45,
  },
  { child_name: "Hà My", country: "VN", total_score: 920, total_quizzes: 42 },
  {
    child_name: "Đức Khang",
    country: "VN",
    total_score: 870,
    total_quizzes: 38,
  },
  { child_name: "Emily", country: "US", total_score: 850, total_quizzes: 36 },
  { child_name: "Yuki", country: "JP", total_score: 810, total_quizzes: 35 },
  {
    child_name: "Bảo Ngọc",
    country: "VN",
    total_score: 780,
    total_quizzes: 33,
  },
  { child_name: "Somchai", country: "TH", total_score: 750, total_quizzes: 30 },
  { child_name: "Min-jun", country: "KR", total_score: 720, total_quizzes: 28 },
  { child_name: "Sophie", country: "FR", total_score: 690, total_quizzes: 26 },
  { child_name: "Arjun", country: "IN", total_score: 660, total_quizzes: 24 },
];

// Animated counter hook
function useAnimatedCount(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    const start = prevTarget.current;
    const diff = target - start;
    if (diff === 0) return;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    prevTarget.current = target;
  }, [target, duration]);

  return count;
}

export default function LeaderboardPage() {
  const { user, activeChild } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const [flashId, setFlashId] = useState(null);

  const loadLeaderboard = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("leaderboard_weekly")
        .select("*")
        .order("total_score", { ascending: false })
        .limit(50);

      if (data && data.length > 0) {
        setEntries(data);
      } else {
        setEntries(DEMO_DATA);
      }
    } catch {
      setEntries(DEMO_DATA);
    }
    setLoading(false);
  }, []);

  const updateCountdown = useCallback(() => {
    const now = new Date();
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + ((8 - now.getDay()) % 7 || 7));
    nextMonday.setHours(0, 0, 0, 0);
    const diff = nextMonday - now;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    setTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s`);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase
          .from("leaderboard_weekly")
          .select("*")
          .order("total_score", { ascending: false })
          .limit(50);
        if (cancelled) return;
        setEntries(data && data.length > 0 ? data : DEMO_DATA);
      } catch {
        if (!cancelled) setEntries(DEMO_DATA);
      }
      if (!cancelled) setLoading(false);
    })();
    const interval = setInterval(updateCountdown, 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [updateCountdown]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("leaderboard-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leaderboard_weekly",
        },
        () => {
          loadLeaderboard();
        },
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [loadLeaderboard]);

  const myRank = activeChild
    ? entries.findIndex((e) => e.child_name === activeChild.name) + 1
    : 0;

  // Stats
  const totalPlayers = entries.length;
  const totalQuizzes = entries.reduce(
    (sum, e) => sum + (e.total_quizzes || 0),
    0,
  );
  const uniqueCountries = new Set(entries.map((e) => e.country)).size;
  const myEntry = activeChild
    ? entries.find((e) => e.child_name === activeChild.name)
    : null;
  const myTier = myEntry ? getTier(myEntry.total_score) : null;

  // Animated counts
  const animPlayers = useAnimatedCount(totalPlayers);
  const animQuizzes = useAnimatedCount(totalQuizzes);
  const animCountries = useAnimatedCount(uniqueCountries);

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <span className={styles.logo} onClick={() => router.push("/")}>
          🎓 EduKids
        </span>
        <span className={styles.navTitle}>🏆 Bảng xếp hạng</span>
        <button className={styles.backBtn} onClick={() => router.back()}>
          ← Quay lại
        </button>
      </nav>

      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            Bảng xếp hạng <span className={styles.gradient}>toàn cầu</span>
          </h1>
          <p className={styles.subtitle}>
            Top quiz hàng tuần — thi đua cùng bạn bè khắp thế giới
          </p>
          <div className={styles.countdown}>
            <span className={styles.countdownLabel}>Reset trong</span>
            <span className={styles.countdownTimer}>{timeLeft}</span>
          </div>
        </div>

        {/* Animated Stats */}
        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <span className={styles.statNum}>{animPlayers}</span>
            <span className={styles.statLabel}>Người chơi</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNum}>{animQuizzes}</span>
            <span className={styles.statLabel}>Quiz tuần này</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNum}>{animCountries}</span>
            <span className={styles.statLabel}>Quốc gia</span>
          </div>
        </div>

        {/* Personal Stats Card */}
        {myEntry && (
          <div
            className={styles.personalCard}
            style={{ "--tier-color": myTier?.color }}
          >
            <div className={styles.personalHeader}>
              <span className={styles.personalTitle}>🎯 Tuần của bạn</span>
              <span
                className={styles.personalTier}
                style={{ color: myTier?.color }}
              >
                {myTier?.icon} {myTier?.name}
              </span>
            </div>
            <div className={styles.personalStats}>
              <div className={styles.personalStat}>
                <span className={styles.personalNum}>#{myRank}</span>
                <span className={styles.personalLabel}>Hạng</span>
              </div>
              <div className={styles.personalStat}>
                <span className={styles.personalNum}>
                  {myEntry.total_score}
                </span>
                <span className={styles.personalLabel}>Điểm</span>
              </div>
              <div className={styles.personalStat}>
                <span className={styles.personalNum}>
                  {myEntry.total_quizzes}
                </span>
                <span className={styles.personalLabel}>Quiz</span>
              </div>
            </div>
          </div>
        )}

        {/* Podium — Top 3 */}
        {entries.length >= 3 && (
          <div className={styles.podium}>
            {[1, 0, 2].map((idx) => {
              const entry = entries[idx];
              const rank = RANK_STYLES[idx];
              const tier = getTier(entry.total_score);
              return (
                <div
                  key={idx}
                  className={`${styles.podiumCard} ${idx === 0 ? styles.podiumFirst : ""}`}
                  style={{ "--glow": rank.glow, "--accent": rank.color }}
                >
                  <span className={styles.podiumEmoji}>{rank.emoji}</span>
                  <div className={styles.podiumAvatar}>
                    {COUNTRY_FLAGS[entry.country] || "🌍"}
                  </div>
                  <span className={styles.podiumName}>{entry.child_name}</span>
                  <span
                    className={styles.podiumTier}
                    style={{ color: tier.color }}
                  >
                    {tier.icon} {tier.name}
                  </span>
                  <span className={styles.podiumScore}>
                    {entry.total_score.toLocaleString()} XP
                  </span>
                  <span className={styles.podiumQuizzes}>
                    {entry.total_quizzes} quiz
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* My Rank (fallback if no personal card) */}
        {myRank > 0 && !myEntry && (
          <div className={styles.myRank}>
            <span>
              🎯 Thứ hạng của bạn: <strong>#{myRank}</strong>
            </span>
          </div>
        )}

        {/* Table */}
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span className={styles.thRank}>#</span>
            <span className={styles.thName}>Tên</span>
            <span className={styles.thTier}>Hạng</span>
            <span className={styles.thScore}>Điểm</span>
            <span className={styles.thQuizzes}>Quiz</span>
          </div>
          {loading ? (
            <div className={styles.loadingRow}>Đang tải...</div>
          ) : (
            entries.map((entry, i) => {
              const isMe = activeChild && entry.child_name === activeChild.name;
              const tier = getTier(entry.total_score);
              const isFlashing = flashId === entry.child_name;
              return (
                <div
                  key={i}
                  className={`${styles.row} ${i < 3 ? styles.topRow : ""} ${isMe ? styles.myRow : ""} ${isFlashing ? styles.flashRow : ""}`}
                >
                  <span className={styles.rank}>
                    {i < 3 ? RANK_STYLES[i].emoji : i + 1}
                  </span>
                  <span className={styles.name}>
                    <span className={styles.flag}>
                      {COUNTRY_FLAGS[entry.country] || "🌍"}
                    </span>
                    {entry.child_name}
                    {isMe && <span className={styles.meBadge}>Bạn</span>}
                  </span>
                  <span
                    className={styles.tierCell}
                    style={{ color: tier.color }}
                  >
                    {tier.icon}
                  </span>
                  <span className={styles.score}>
                    {entry.total_score.toLocaleString()}
                  </span>
                  <span className={styles.quizzes}>{entry.total_quizzes}</span>
                </div>
              );
            })
          )}
        </div>

        {/* CTA */}
        <div className={styles.ctaSection}>
          <button
            className={styles.playBtn}
            onClick={() => router.push("/learn/english")}
          >
            🎯 Làm Quiz ngay để leo hạng!
          </button>
        </div>
      </main>
    </div>
  );
}
