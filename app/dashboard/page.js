"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/i18nContext";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { getTier, getTierProgress } from "../utils/rankTiers";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const {
    user,
    profile,
    children,
    activeChild,
    setActiveChild,
    loading,
    signOut,
    addChild,
    removeChild,
  } = useAuth();
  const router = useRouter();
  const { t, locale, setLocale, loadPage } = useI18n();
  const [showAddChild, setShowAddChild] = useState(false);
  const [childName, setChildName] = useState("");
  const [birthYear, setBirthYear] = useState(2020);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadPage("dashboard");
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [loadPage]);

  // Stats state
  const [stats, setStats] = useState(null);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [topicStats, setTopicStats] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [childrenStats, setChildrenStats] = useState({});

  const fetchStats = useCallback(async (childId) => {
    setStatsLoading(true);
    try {
      // Fetch all quiz attempts for this child
      const { data: attempts } = await supabase
        .from("quiz_attempts")
        .select("*")
        .eq("child_id", childId)
        .order("created_at", { ascending: false });

      if (!attempts || attempts.length === 0) {
        setStats(null);
        setRecentQuizzes([]);
        setWeeklyData([]);
        setTopicStats([]);
        setStatsLoading(false);
        return;
      }

      // Overview stats
      const totalQuizzes = attempts.length;
      const totalCorrect = attempts.reduce((s, a) => s + a.score, 0);
      const totalQuestions = attempts.reduce(
        (s, a) => s + a.total_questions,
        0,
      );
      const avgAccuracy =
        totalQuestions > 0
          ? Math.round((totalCorrect / totalQuestions) * 100)
          : 0;
      const avgTime = Math.round(
        attempts.reduce((s, a) => s + (a.time_seconds || 0), 0) / totalQuizzes,
      );

      // Streak: count consecutive days with quizzes
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let streak = 0;
      let checkDate = new Date(today);
      const dateSet = new Set(
        attempts.map((a) => new Date(a.created_at).toDateString()),
      );
      while (dateSet.has(checkDate.toDateString())) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }

      // Quizzes this week
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay() + 1);
      const quizzesThisWeek = attempts.filter(
        (a) => new Date(a.created_at) >= weekStart,
      ).length;

      // Total score for tier
      const totalScore = totalCorrect;

      setStats({
        totalQuizzes,
        avgAccuracy,
        avgTime,
        streak,
        quizzesThisWeek,
        totalScore,
      });

      // Recent quizzes (top 5)
      setRecentQuizzes(attempts.slice(0, 5));

      // 7-day chart data
      const chartData = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dayStr = d.toDateString();
        const dayAttempts = attempts.filter(
          (a) => new Date(a.created_at).toDateString() === dayStr,
        );
        chartData.push({
          label: d.toLocaleDateString("vi-VN", { weekday: "short" }),
          count: dayAttempts.length,
          score: dayAttempts.reduce((s, a) => s + a.score, 0),
        });
      }
      setWeeklyData(chartData);

      // Topic mastery
      const byTopic = {};
      for (const a of attempts) {
        const t = a.topic_name || "Unknown";
        if (!byTopic[t]) byTopic[t] = { total: 0, correct: 0, count: 0 };
        byTopic[t].total += a.total_questions;
        byTopic[t].correct += a.score;
        byTopic[t].count++;
      }
      const topicArr = Object.entries(byTopic).map(([name, d]) => ({
        name,
        accuracy: d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0,
        quizzes: d.count,
      }));
      topicArr.sort((a, b) => b.quizzes - a.quizzes);
      setTopicStats(topicArr);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
    setStatsLoading(false);
  }, []);

  // Fetch mini stats for ALL children (for profile cards)
  useEffect(() => {
    if (!children || children.length === 0) return;
    const fetchAllChildStats = async () => {
      const statsMap = {};
      await Promise.all(
        children.map(async (child) => {
          try {
            const { data: attempts } = await supabase
              .from("quiz_attempts")
              .select("score, total_questions, created_at")
              .eq("child_id", child.id);
            if (attempts && attempts.length > 0) {
              const totalQ = attempts.reduce(
                (s, a) => s + a.total_questions,
                0,
              );
              const totalC = attempts.reduce((s, a) => s + a.score, 0);
              const topicsSet = new Set(attempts.map((a) => a.topic_name));
              // Streak
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              let streak = 0;
              let checkDate = new Date(today);
              const dateSet = new Set(
                attempts.map((a) => new Date(a.created_at).toDateString()),
              );
              while (dateSet.has(checkDate.toDateString())) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
              }
              statsMap[child.id] = {
                quizzes: attempts.length,
                accuracy: totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0,
                streak,
                topics: topicsSet.size,
              };
            }
          } catch {}
        }),
      );
      setChildrenStats(statsMap);
    };
    fetchAllChildStats();
  }, [children]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (activeChild?.id) {
      let cancelled = false;
      (async () => {
        await fetchStats(activeChild.id);
      })();
      return () => {
        cancelled = true;
      };
    }
  }, [activeChild?.id, fetchStats]);

  if (loading || !user) return null;

  const handleAddChild = async (e) => {
    e.preventDefault();
    if (!childName.trim()) return;
    await addChild(childName.trim(), birthYear);
    setChildName("");
    setBirthYear(2020);
    setShowAddChild(false);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = currentYear - 2; y >= currentYear - 15; y--) {
    yearOptions.push(y);
  }

  const tier = stats ? getTier(stats.totalScore) : null;
  const tierProgress = stats ? getTierProgress(stats.totalScore) : null;
  const maxChart = Math.max(...weeklyData.map((d) => d.count), 1);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.logo} onClick={() => router.push("/")}>
            🎓 EduKids
          </span>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.userInfo}>
            {profile?.avatar_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="" className={styles.avatar} />
            )}
            <span className={styles.userName}>
              {profile?.display_name || user.email}
            </span>
          </div>
          <button
              className={styles.langSwitch}
              onClick={() => setLocale(locale === "vi" ? "en" : "vi")}
              title={
                locale === "vi"
                  ? "Switch to English"
                  : "Chuyển sang Tiếng Việt"
              }
            >
              {locale === "vi" ? "🇻🇳 VI" : "🇬🇧 EN"}
            </button>
          <button className={styles.signOutBtn} onClick={signOut}>
            {t("btn_sign_out")}
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {t("title_hello", { name: profile?.display_name?.split(" ")[0] })}
        </h1>
        <p className={styles.subtitle}>{t("subtitle")}</p>

        {/* Children Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t("section_children")}</h2>
            <button
              className={styles.addBtn}
              onClick={() => setShowAddChild(!showAddChild)}
            >
              {showAddChild ? t("btn_cancel") : t("btn_add_child")}
            </button>
          </div>

          {showAddChild && (
            <form className={styles.addForm} onSubmit={handleAddChild}>
              <input
                type="text"
                placeholder="Tên con"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className={styles.input}
                autoFocus
              />
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(Number(e.target.value))}
                className={styles.select}
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    Năm sinh: {y} ({currentYear - y} tuổi)
                  </option>
                ))}
              </select>
              <button type="submit" className={styles.submitBtn}>
                Thêm
              </button>
            </form>
          )}

          <div className={styles.childrenGrid}>
            {children.map((child) => {
              const cs = childrenStats[child.id];
              return (
                <div
                  key={child.id}
                  className={`${styles.childCard} ${activeChild?.id === child.id ? styles.activeChild : ""}`}
                  onClick={() => setActiveChild(child)}
                >
                  <div className={styles.childTopRow}>
                    <div className={styles.childAvatar}>
                      {child.avatar || "🧒"}
                    </div>
                    <div className={styles.childInfo}>
                      <span className={styles.childName}>{child.name}</span>
                      <span className={styles.childAge}>
                        {currentYear - child.birth_year}{" "}
                        {locale === "vi" ? "tuổi" : "yrs"}
                      </span>
                    </div>
                    {activeChild?.id === child.id && (
                      <span className={styles.activeBadge}>
                        {t("child_selected")}
                      </span>
                    )}
                    <button
                      className={styles.removeBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeChild(child.id);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  {cs && (
                    <div className={styles.childMetrics}>
                      <div className={styles.metricItem}>
                        <div
                          className={styles.metricRing}
                          style={{ "--pct": `${cs.accuracy}%` }}
                        >
                          <span className={styles.metricValue}>
                            {cs.accuracy}%
                          </span>
                        </div>
                        <span className={styles.metricLabel}>
                          {locale === "vi" ? "Chính xác" : "Accuracy"}
                        </span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricBig}>{cs.quizzes}</span>
                        <span className={styles.metricLabel}>
                          {locale === "vi" ? "Bài quiz" : "Quizzes"}
                        </span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricBig}>{cs.topics}/16</span>
                        <span className={styles.metricLabel}>
                          {locale === "vi" ? "Chủ đề" : "Topics"}
                        </span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricBig}>🔥{cs.streak}</span>
                        <span className={styles.metricLabel}>
                          {locale === "vi" ? "Chuỗi ngày" : "Streak"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {children.length === 0 && !showAddChild && (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>👶</span>
                <p>{t("child_empty")}</p>
                <button
                  className={styles.addBtn}
                  onClick={() => setShowAddChild(true)}
                >
                  {t("child_add_now")}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Progress Stats (for activeChild) */}
        {activeChild && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {t("section_progress", { name: activeChild.name })}
            </h2>

            {statsLoading ? (
              <div className={styles.statsLoading}>
                <div className={styles.spinner} />
                <span>{t("stats_loading")}</span>
              </div>
            ) : !stats ? (
              <div className={styles.emptyStats}>
                <span className={styles.emptyIcon}>📝</span>
                <p>{t("no_quiz_data")}</p>
                <button
                  className={styles.addBtn}
                  onClick={() => router.push("/learn/english")}
                >
                  {t("do_quiz_now")}
                </button>
              </div>
            ) : (
              <>
                {/* Stats Overview Cards */}
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <span className={styles.statIcon}>🎯</span>
                    <span className={styles.statValue}>
                      {stats.totalQuizzes}
                    </span>
                    <span className={styles.statLabel}>
                      {t("stat_total_quizzes")}
                    </span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statIcon}>✅</span>
                    <span className={styles.statValue}>
                      {stats.avgAccuracy}%
                    </span>
                    <span className={styles.statLabel}>
                      {t("stat_accuracy")}
                    </span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statIcon}>⏱️</span>
                    <span className={styles.statValue}>{stats.avgTime}s</span>
                    <span className={styles.statLabel}>
                      {t("stat_avg_time")}
                    </span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statIcon}>🔥</span>
                    <span className={styles.statValue}>{stats.streak}</span>
                    <span className={styles.statLabel}>{t("stat_streak")}</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statIcon}>📅</span>
                    <span className={styles.statValue}>
                      {stats.quizzesThisWeek}
                    </span>
                    <span className={styles.statLabel}>
                      {t("stat_week_quizzes")}
                    </span>
                  </div>
                  <div className={`${styles.statCard} ${styles.tierCard}`}>
                    <span className={styles.statIcon}>{tier?.icon}</span>
                    <span className={styles.statValue}>{tier?.name}</span>
                    <span className={styles.statLabel}>
                      {t("stat_current_tier")}
                    </span>
                    {tierProgress && (
                      <div className={styles.tierBar}>
                        <div
                          className={styles.tierBarFill}
                          style={{
                            width: `${tierProgress.percentage}%`,
                            background: tier?.color,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 7-Day Progress Chart */}
                <div className={styles.chartSection}>
                  <h3 className={styles.chartTitle}>{t("chart_7days")}</h3>
                  <div className={styles.chart}>
                    {weeklyData.map((d, i) => (
                      <div key={i} className={styles.chartCol}>
                        <span className={styles.chartValue}>{d.count}</span>
                        <div className={styles.chartBarWrap}>
                          <div
                            className={styles.chartBar}
                            style={{
                              height: `${(d.count / maxChart) * 100}%`,
                            }}
                          />
                        </div>
                        <span className={styles.chartLabel}>{d.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Topic Mastery */}
                {topicStats.length > 0 && (
                  <div className={styles.chartSection}>
                    <h3 className={styles.chartTitle}>
                      {t("chart_topic_mastery")}
                    </h3>
                    <div className={styles.topicGrid}>
                      {topicStats.map((tp) => (
                        <div key={tp.name} className={styles.topicCard}>
                          <div className={styles.topicHeader}>
                            <span className={styles.topicName}>{tp.name}</span>
                            <span className={styles.topicBadge}>
                              {tp.quizzes} quiz
                            </span>
                          </div>
                          <div className={styles.topicBar}>
                            <div
                              className={styles.topicBarFill}
                              style={{
                                width: `${tp.accuracy}%`,
                                background:
                                  tp.accuracy >= 80
                                    ? "#4ecdc4"
                                    : tp.accuracy >= 60
                                      ? "#FFB347"
                                      : "#FF6B6B",
                              }}
                            />
                          </div>
                          <span className={styles.topicAccuracy}>
                            {tp.accuracy}%{" "}
                            {locale === "vi" ? "chính xác" : "accurate"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Activity */}
                {recentQuizzes.length > 0 && (
                  <div className={styles.chartSection}>
                    <h3 className={styles.chartTitle}>{t("chart_recent")}</h3>
                    <div className={styles.activityList}>
                      {recentQuizzes.map((q) => {
                        const acc =
                          q.total_questions > 0
                            ? Math.round((q.score / q.total_questions) * 100)
                            : 0;
                        return (
                          <div key={q.id} className={styles.activityItem}>
                            <div className={styles.activityLeft}>
                              <span className={styles.activityEmoji}>
                                {acc >= 80 ? "🌟" : acc >= 50 ? "👍" : "💪"}
                              </span>
                              <div>
                                <span className={styles.activityTopic}>
                                  {q.topic_name}
                                </span>
                                <span className={styles.activityTime}>
                                  {new Date(q.created_at).toLocaleDateString(
                                    locale === "vi" ? "vi-VN" : "en-US",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className={styles.activityRight}>
                              <span
                                className={styles.activityScore}
                                data-level={
                                  acc >= 80 ? "high" : acc >= 50 ? "mid" : "low"
                                }
                              >
                                {q.score}/{q.total_questions}
                              </span>
                              {q.time_seconds && (
                                <span className={styles.activityDuration}>
                                  {q.time_seconds}s
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* Subjects Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("section_subjects")}</h2>
          <div className={styles.subjectsGrid}>
            <a
              href="/learn/english"
              className={styles.subjectCard}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span className={styles.subjectIcon}>🇬🇧</span>
              <h3>{t("subject_english")}</h3>
              <p>{t("subject_english_desc")}</p>
              {topicStats.length > 0 ? (
                <div className={styles.subjectProgress}>
                  <div className={styles.progressBarWrap}>
                    <div
                      className={styles.progressBarFill}
                      style={{
                        width: `${Math.round((topicStats.length / 16) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className={styles.progressText}>
                    {topicStats.length}/16{" "}
                    {locale === "vi" ? "chủ đề đã học" : "topics completed"}
                  </span>
                </div>
              ) : (
                <span className={styles.subjectBadge}>
                  16 {t("stat_topics")}
                </span>
              )}
            </a>
            <div className={`${styles.subjectCard} ${styles.comingSoon}`}>
              <span className={styles.subjectIcon}>🔢</span>
              <h3>{t("subject_math")}</h3>
              <p>
                {locale === "vi"
                  ? "Phép tính, hình học, logic"
                  : "Arithmetic, geometry, logic"}
              </p>
              <span className={styles.comingSoonBadge}>{t("coming_soon")}</span>
            </div>
            <div className={`${styles.subjectCard} ${styles.comingSoon}`}>
              <span className={styles.subjectIcon}>🔬</span>
              <h3>{t("subject_science")}</h3>
              <p>
                {locale === "vi"
                  ? "Thế giới tự nhiên, thí nghiệm"
                  : "Nature, experiments"}
              </p>
              <span className={styles.comingSoonBadge}>{t("coming_soon")}</span>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        {activeChild && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t("section_quick")}</h2>
            <div className={styles.actionsGrid}>
              <button
                className={styles.actionCard}
                onClick={() => router.push("/learn/english")}
              >
                <span>🎯</span>
                <span>{t("btn_do_quiz")}</span>
              </button>
              <button
                className={styles.actionCard}
                onClick={() => router.push("/leaderboard")}
              >
                <span>🏆</span>
                <span>{t("btn_leaderboard")}</span>
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
