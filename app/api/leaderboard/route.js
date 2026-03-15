import {
  createServerClient,
  jsonOk,
  jsonError,
} from "@/app/lib/supabase-server";

// GET /api/leaderboard?limit=50 — weekly leaderboard
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const db = createServerClient();

  // Calculate current week start
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(now);
  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);

  const { data, error } = await db
    .from("leaderboard_weekly")
    .select("*")
    .gte("week_start", weekStart.toISOString().split("T")[0])
    .order("total_score", { ascending: false })
    .limit(limit);

  if (error) return jsonError(error.message, 500);

  // Calculate countdown to next Monday
  const nextMonday = new Date(weekStart);
  nextMonday.setDate(nextMonday.getDate() + 7);
  const msRemaining = nextMonday.getTime() - Date.now();

  return jsonOk({
    entries: data || [],
    weekStart: weekStart.toISOString().split("T")[0],
    countdown: {
      ms: Math.max(0, msRemaining),
      days: Math.floor(msRemaining / 86400000),
      hours: Math.floor((msRemaining % 86400000) / 3600000),
      minutes: Math.floor((msRemaining % 3600000) / 60000),
    },
  });
}
