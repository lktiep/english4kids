"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import styles from "./admin.module.css";

const ADMIN_EMAILS = (
  process.env.NEXT_PUBLIC_ADMIN_EMAILS ||
  "lktiep@gmail.com,hkdjackshrimp@gmail.com"
)
  .split(",")
  .map((e) => e.trim().toLowerCase());

export default function AdminPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [overview, setOverview] = useState(null);
  const [topTopics, setTopTopics] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [dailyQuizzes, setDailyQuizzes] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const isAdmin =
    user &&
    profile &&
    ADMIN_EMAILS.includes((profile.email || user.email || "").toLowerCase());

  const fetchAdminData = useCallback(async () => {
    setDataLoading(true);

    // 1. Platform overview
    const [profilesRes, childrenRes, quizzesRes, lbRes] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("children").select("*", { count: "exact", head: true }),
      supabase
        .from("quiz_attempts")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("leaderboard_weekly")
        .select("*", { count: "exact", head: true }),
    ]);

    // Quizzes today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { count: quizzesToday } = await supabase
      .from("quiz_attempts")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayStart.toISOString());

    setOverview({
      totalUsers: profilesRes.count || 0,
      totalChildren: childrenRes.count || 0,
      totalQuizzes: quizzesRes.count || 0,
      quizzesToday: quizzesToday || 0,
      leaderboardEntries: lbRes.count || 0,
    });

    // 2. Top topics
    const { data: allAttempts } = await supabase
      .from("quiz_attempts")
      .select("topic_name, score, total_questions, time_seconds");

    if (allAttempts && allAttempts.length > 0) {
      const byTopic = {};
      for (const a of allAttempts) {
        const t = a.topic_name || "Unknown";
        if (!byTopic[t]) byTopic[t] = { count: 0, totalScore: 0, totalQ: 0 };
        byTopic[t].count++;
        byTopic[t].totalScore += a.score;
        byTopic[t].totalQ += a.total_questions;
      }
      const sorted = Object.entries(byTopic)
        .map(([name, d]) => ({
          name,
          count: d.count,
          accuracy:
            d.totalQ > 0 ? Math.round((d.totalScore / d.totalQ) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count);
      setTopTopics(sorted.slice(0, 10));

      // Daily quizzes (30 days)
      const daily = [];
      const now = new Date();
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const dayStr = d.toDateString();
        const dayCount = allAttempts.filter(
          (a) => new Date(a.created_at).toDateString() === dayStr,
        ).length;
        daily.push({
          date: d.toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "short",
          }),
          count: dayCount,
        });
      }
      setDailyQuizzes(daily);
    }

    // 3. Recent users
    const { data: users } = await supabase
      .from("profiles")
      .select("id, email, display_name, avatar_url, created_at")
      .order("created_at", { ascending: false })
      .limit(10);
    setRecentUsers(users || []);

    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (isAdmin) {
      let cancelled = false;
      (async () => {
        await fetchAdminData();
      })();
      return () => {
        cancelled = true;
      };
    }
  }, [isAdmin, fetchAdminData]);

  if (loading || !user) return null;

  if (!isAdmin) {
    return (
      <div className={styles.container}>
        <div className={styles.forbidden}>
          <span className={styles.forbiddenIcon}>🔒</span>
          <h2>Truy cập bị từ chối</h2>
          <p>Bạn không có quyền truy cập trang admin.</p>
          <button className={styles.backBtn} onClick={() => router.push("/")}>
            ← Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const maxDaily = Math.max(...dailyQuizzes.map((d) => d.count), 1);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.logo} onClick={() => router.push("/")}>
            🎓 EduKids
          </span>
          <span className={styles.adminBadge}>Admin</span>
        </div>
        <div className={styles.headerRight}>
          <nav className={styles.tabs}>
            {[
              { key: "overview", label: "📊 Tổng quan" },
              { key: "users", label: "👥 Users" },
              { key: "content", label: "📚 Content" },
            ].map((tab) => (
              <button
                key={tab.key}
                className={`${styles.tab} ${activeTab === tab.key ? styles.activeTab : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <button
            className={styles.backBtn}
            onClick={() => router.push("/dashboard")}
          >
            Dashboard →
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {dataLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <span>Đang tải dữ liệu...</span>
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <>
                {/* Platform Overview */}
                <h2 className={styles.pageTitle}>📊 Tổng quan nền tảng</h2>
                <div className={styles.overviewGrid}>
                  <div className={styles.overviewCard}>
                    <span className={styles.cardIcon}>👤</span>
                    <span className={styles.cardValue}>
                      {overview?.totalUsers}
                    </span>
                    <span className={styles.cardLabel}>Phụ huynh</span>
                  </div>
                  <div className={styles.overviewCard}>
                    <span className={styles.cardIcon}>🧒</span>
                    <span className={styles.cardValue}>
                      {overview?.totalChildren}
                    </span>
                    <span className={styles.cardLabel}>Học sinh</span>
                  </div>
                  <div className={styles.overviewCard}>
                    <span className={styles.cardIcon}>🎯</span>
                    <span className={styles.cardValue}>
                      {overview?.totalQuizzes}
                    </span>
                    <span className={styles.cardLabel}>Tổng quiz</span>
                  </div>
                  <div
                    className={`${styles.overviewCard} ${styles.highlightCard}`}
                  >
                    <span className={styles.cardIcon}>🔥</span>
                    <span className={styles.cardValue}>
                      {overview?.quizzesToday}
                    </span>
                    <span className={styles.cardLabel}>Quiz hôm nay</span>
                  </div>
                </div>

                {/* Daily Usage Chart */}
                {dailyQuizzes.length > 0 && (
                  <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                      📈 Quizzes / ngày (30 ngày)
                    </h3>
                    <div className={styles.dailyChart}>
                      {dailyQuizzes.map((d, i) => (
                        <div key={i} className={styles.dailyCol}>
                          <div className={styles.dailyBarWrap}>
                            <div
                              className={styles.dailyBar}
                              style={{
                                height: `${(d.count / maxDaily) * 100}%`,
                              }}
                            />
                          </div>
                          {i % 5 === 0 && (
                            <span className={styles.dailyLabel}>{d.date}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Top Topics */}
                {topTopics.length > 0 && (
                  <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                      🏆 Top chủ đề phổ biến
                    </h3>
                    <div className={styles.table}>
                      <div className={styles.tableHeader}>
                        <span>Chủ đề</span>
                        <span>Lượt quiz</span>
                        <span>Accuracy TB</span>
                      </div>
                      {topTopics.map((t) => (
                        <div key={t.name} className={styles.tableRow}>
                          <span className={styles.topicName}>{t.name}</span>
                          <span className={styles.topicCount}>{t.count}</span>
                          <span
                            className={styles.topicAcc}
                            data-level={
                              t.accuracy >= 80
                                ? "high"
                                : t.accuracy >= 50
                                  ? "mid"
                                  : "low"
                            }
                          >
                            {t.accuracy}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {activeTab === "users" && (
              <>
                <h2 className={styles.pageTitle}>👥 Người dùng</h2>
                <div className={styles.table}>
                  <div className={styles.tableHeader}>
                    <span>Tên</span>
                    <span>Email</span>
                    <span>Ngày tham gia</span>
                  </div>
                  {recentUsers.map((u) => (
                    <div key={u.id} className={styles.tableRow}>
                      <span className={styles.userName2}>
                        {u.avatar_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={u.avatar_url}
                            alt=""
                            className={styles.userAvatar}
                          />
                        )}
                        {u.display_name || "—"}
                      </span>
                      <span className={styles.userEmail}>{u.email}</span>
                      <span className={styles.userDate}>
                        {new Date(u.created_at).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === "content" && (
              <>
                <h2 className={styles.pageTitle}>📚 Content & Dữ liệu</h2>
                <div className={styles.contentInfo}>
                  <div className={styles.contentCard}>
                    <span className={styles.cardIcon}>📖</span>
                    <span className={styles.cardValue}>18</span>
                    <span className={styles.cardLabel}>Topics</span>
                  </div>
                  <div className={styles.contentCard}>
                    <span className={styles.cardIcon}>🔤</span>
                    <span className={styles.cardValue}>180+</span>
                    <span className={styles.cardLabel}>Từ vựng</span>
                  </div>
                  <div className={styles.contentCard}>
                    <span className={styles.cardIcon}>🖼️</span>
                    <span className={styles.cardValue}>180+</span>
                    <span className={styles.cardLabel}>Hình ảnh</span>
                  </div>
                  <div className={styles.contentCard}>
                    <span className={styles.cardIcon}>🌍</span>
                    <span className={styles.cardValue}>1</span>
                    <span className={styles.cardLabel}>Ngôn ngữ</span>
                  </div>
                </div>
                <div className={styles.mcpNote}>
                  <h4>🔌 MCP Content Pipeline</h4>
                  <p>
                    Sử dụng MCP Server + OpenClaw để tự động sinh vocabulary và
                    hình ảnh. Admin tạo API Key → cấp cho MCP agent.
                  </p>
                  <span className={styles.comingTag}>Sắp triển khai</span>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
