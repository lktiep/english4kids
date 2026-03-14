'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './leaderboard.module.css';

const COUNTRY_FLAGS = {
  VN: '🇻🇳', US: '🇺🇸', UK: '🇬🇧', JP: '🇯🇵', KR: '🇰🇷',
  CN: '🇨🇳', TH: '🇹🇭', SG: '🇸🇬', AU: '🇦🇺', DE: '🇩🇪',
  FR: '🇫🇷', IN: '🇮🇳', BR: '🇧🇷', CA: '🇨🇦', MY: '🇲🇾',
};

const RANK_STYLES = [
  { emoji: '🥇', color: '#FFD700', glow: 'rgba(255,215,0,0.3)' },
  { emoji: '🥈', color: '#C0C0C0', glow: 'rgba(192,192,192,0.3)' },
  { emoji: '🥉', color: '#CD7F32', glow: 'rgba(205,127,50,0.3)' },
];

// Demo data for display
const DEMO_DATA = [
  { child_name: 'Minh Anh', country: 'VN', total_score: 980, total_quizzes: 45 },
  { child_name: 'Hà My', country: 'VN', total_score: 920, total_quizzes: 42 },
  { child_name: 'Đức Khang', country: 'VN', total_score: 870, total_quizzes: 38 },
  { child_name: 'Emily', country: 'US', total_score: 850, total_quizzes: 36 },
  { child_name: 'Yuki', country: 'JP', total_score: 810, total_quizzes: 35 },
  { child_name: 'Bảo Ngọc', country: 'VN', total_score: 780, total_quizzes: 33 },
  { child_name: 'Somchai', country: 'TH', total_score: 750, total_quizzes: 30 },
  { child_name: 'Min-jun', country: 'KR', total_score: 720, total_quizzes: 28 },
  { child_name: 'Sophie', country: 'FR', total_score: 690, total_quizzes: 26 },
  { child_name: 'Arjun', country: 'IN', total_score: 660, total_quizzes: 24 },
];

export default function LeaderboardPage() {
  const { user, activeChild } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    loadLeaderboard();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  async function loadLeaderboard() {
    try {
      const { data, error } = await supabase
        .from('leaderboard_weekly')
        .select('*')
        .order('total_score', { ascending: false })
        .limit(50);

      if (data && data.length > 0) {
        setEntries(data);
      } else {
        // Use demo data if no real data
        setEntries(DEMO_DATA);
      }
    } catch {
      setEntries(DEMO_DATA);
    }
    setLoading(false);
  }

  function updateCountdown() {
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
  }

  const myRank = activeChild
    ? entries.findIndex(e => e.child_name === activeChild.name) + 1
    : 0;

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <span className={styles.logo} onClick={() => router.push('/')}>🎓 EduKids</span>
        <span className={styles.navTitle}>🏆 Bảng xếp hạng</span>
        <button className={styles.backBtn} onClick={() => router.back()}>← Quay lại</button>
      </nav>

      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Bảng xếp hạng <span className={styles.gradient}>toàn cầu</span></h1>
          <p className={styles.subtitle}>Top quiz hàng tuần — thi đua cùng bạn bè khắp thế giới</p>
          <div className={styles.countdown}>
            <span className={styles.countdownLabel}>Reset trong</span>
            <span className={styles.countdownTimer}>{timeLeft}</span>
          </div>
        </div>

        {/* Podium — Top 3 */}
        {entries.length >= 3 && (
          <div className={styles.podium}>
            {[1, 0, 2].map((idx) => {
              const entry = entries[idx];
              const rank = RANK_STYLES[idx];
              return (
                <div
                  key={idx}
                  className={`${styles.podiumCard} ${idx === 0 ? styles.podiumFirst : ''}`}
                  style={{ '--glow': rank.glow, '--accent': rank.color }}
                >
                  <span className={styles.podiumEmoji}>{rank.emoji}</span>
                  <div className={styles.podiumAvatar}>
                    {COUNTRY_FLAGS[entry.country] || '🌍'}
                  </div>
                  <span className={styles.podiumName}>{entry.child_name}</span>
                  <span className={styles.podiumScore}>{entry.total_score.toLocaleString()} XP</span>
                  <span className={styles.podiumQuizzes}>{entry.total_quizzes} quiz</span>
                </div>
              );
            })}
          </div>
        )}

        {/* My Rank */}
        {myRank > 0 && (
          <div className={styles.myRank}>
            <span>🎯 Thứ hạng của bạn: <strong>#{myRank}</strong></span>
          </div>
        )}

        {/* Table */}
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span className={styles.thRank}>#</span>
            <span className={styles.thName}>Tên</span>
            <span className={styles.thScore}>Điểm</span>
            <span className={styles.thQuizzes}>Quiz</span>
          </div>
          {loading ? (
            <div className={styles.loadingRow}>Đang tải...</div>
          ) : (
            entries.map((entry, i) => {
              const isMe = activeChild && entry.child_name === activeChild.name;
              return (
                <div
                  key={i}
                  className={`${styles.row} ${i < 3 ? styles.topRow : ''} ${isMe ? styles.myRow : ''}`}
                >
                  <span className={styles.rank}>
                    {i < 3 ? RANK_STYLES[i].emoji : i + 1}
                  </span>
                  <span className={styles.name}>
                    <span className={styles.flag}>
                      {COUNTRY_FLAGS[entry.country] || '🌍'}
                    </span>
                    {entry.child_name}
                    {isMe && <span className={styles.meBadge}>Bạn</span>}
                  </span>
                  <span className={styles.score}>{entry.total_score.toLocaleString()}</span>
                  <span className={styles.quizzes}>{entry.total_quizzes}</span>
                </div>
              );
            })
          )}
        </div>

        {/* CTA */}
        <div className={styles.ctaSection}>
          <button className={styles.playBtn} onClick={() => router.push('/learn/english')}>
            🎯 Làm Quiz ngay để leo hạng!
          </button>
        </div>
      </main>
    </div>
  );
}
