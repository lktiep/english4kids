import {
  createServerClient,
  getAuthUser,
  isAdminUser,
  jsonOk,
  jsonError,
} from "@/app/lib/supabase-server";

// GET /api/admin/topics — top topics by usage
export async function GET(request) {
  const user = await getAuthUser(request);
  if (!user) return jsonError("Unauthorized", 401);
  if (!isAdminUser(user)) return jsonError("Forbidden", 403);

  const db = createServerClient();

  const { data: allAttempts } = await db
    .from("quiz_attempts")
    .select("topic_name, score, total_questions");

  if (!allAttempts || allAttempts.length === 0) {
    return jsonOk([]);
  }

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
      accuracy: d.totalQ > 0 ? Math.round((d.totalScore / d.totalQ) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return jsonOk(sorted);
}
