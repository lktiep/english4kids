import {
  createServerClient,
  getAuthUser,
  jsonOk,
  jsonError,
} from "@/app/lib/supabase-server";

// GET /api/quiz/stats?child_id=xxx — aggregated stats for a child
export async function GET(request) {
  const user = await getAuthUser(request);
  if (!user) return jsonError("Unauthorized", 401);

  const { searchParams } = new URL(request.url);
  const childId = searchParams.get("child_id");
  if (!childId) return jsonError("child_id required");

  const db = createServerClient();

  // Verify child belongs to user
  const { data: child } = await db
    .from("children")
    .select("parent_id")
    .eq("id", childId)
    .single();

  if (!child || child.parent_id !== user.id) {
    return jsonError("Not authorized", 403);
  }

  // Fetch all attempts
  const { data: attempts } = await db
    .from("quiz_attempts")
    .select("*")
    .eq("child_id", childId)
    .order("created_at", { ascending: false });

  if (!attempts || attempts.length === 0) {
    return jsonOk({
      totalQuizzes: 0,
      avgAccuracy: 0,
      avgTime: 0,
      streak: 0,
      quizzesThisWeek: 0,
      totalScore: 0,
      weeklyData: [],
      topicStats: [],
    });
  }

  // Overview stats
  const totalQuizzes = attempts.length;
  const totalCorrect = attempts.reduce((s, a) => s + a.score, 0);
  const totalQuestions = attempts.reduce((s, a) => s + a.total_questions, 0);
  const avgAccuracy =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const avgTime = Math.round(
    attempts.reduce((s, a) => s + (a.time_seconds || 0), 0) / totalQuizzes,
  );

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

  // Quizzes this week
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);
  const quizzesThisWeek = attempts.filter(
    (a) => new Date(a.created_at) >= weekStart,
  ).length;

  // 7-day chart
  const weeklyData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dayStr = d.toDateString();
    const dayAttempts = attempts.filter(
      (a) => new Date(a.created_at).toDateString() === dayStr,
    );
    weeklyData.push({
      label: d.toLocaleDateString("vi-VN", { weekday: "short" }),
      count: dayAttempts.length,
      score: dayAttempts.reduce((s, a) => s + a.score, 0),
    });
  }

  // Topic mastery
  const byTopic = {};
  for (const a of attempts) {
    const t = a.topic_name || "Unknown";
    if (!byTopic[t]) byTopic[t] = { total: 0, correct: 0, count: 0 };
    byTopic[t].total += a.total_questions;
    byTopic[t].correct += a.score;
    byTopic[t].count++;
  }
  const topicStats = Object.entries(byTopic)
    .map(([name, d]) => ({
      name,
      accuracy: d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0,
      quizzes: d.count,
    }))
    .sort((a, b) => b.quizzes - a.quizzes);

  return jsonOk({
    totalQuizzes,
    avgAccuracy,
    avgTime,
    streak,
    quizzesThisWeek,
    totalScore: totalCorrect,
    weeklyData,
    topicStats,
  });
}
