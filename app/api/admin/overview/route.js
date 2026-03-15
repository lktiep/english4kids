import {
  createServerClient,
  getAuthUser,
  isAdminUser,
  jsonOk,
  jsonError,
} from "@/app/lib/supabase-server";

// GET /api/admin/overview — platform stats (admin only)
export async function GET(request) {
  const user = await getAuthUser(request);
  if (!user) return jsonError("Unauthorized", 401);
  if (!isAdminUser(user)) return jsonError("Forbidden", 403);

  const db = createServerClient();

  const [profilesRes, childrenRes, quizzesRes, lbRes] = await Promise.all([
    db.from("profiles").select("*", { count: "exact", head: true }),
    db.from("children").select("*", { count: "exact", head: true }),
    db.from("quiz_attempts").select("*", { count: "exact", head: true }),
    db.from("leaderboard_weekly").select("*", { count: "exact", head: true }),
  ]);

  // Quizzes today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const { count: quizzesToday } = await db
    .from("quiz_attempts")
    .select("*", { count: "exact", head: true })
    .gte("created_at", todayStart.toISOString());

  return jsonOk({
    totalUsers: profilesRes.count || 0,
    totalChildren: childrenRes.count || 0,
    totalQuizzes: quizzesRes.count || 0,
    quizzesToday: quizzesToday || 0,
    leaderboardEntries: lbRes.count || 0,
  });
}
