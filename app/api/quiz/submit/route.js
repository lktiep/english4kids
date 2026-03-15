import {
  createServerClient,
  getAuthUser,
  jsonOk,
  jsonError,
} from "@/app/lib/supabase-server";

// POST /api/quiz/submit — save quiz attempt + update leaderboard
export async function POST(request) {
  const user = await getAuthUser(request);
  if (!user) return jsonError("Unauthorized", 401);

  const body = await request.json();
  const { child_id, topic_name, score, total_questions, time_seconds } = body;

  if (!child_id || !topic_name || score == null || !total_questions) {
    return jsonError("Missing required fields");
  }

  const db = createServerClient();

  // Verify child belongs to user
  const { data: child } = await db
    .from("children")
    .select("id, name, parent_id")
    .eq("id", child_id)
    .single();

  if (!child || child.parent_id !== user.id) {
    return jsonError("Child not found", 404);
  }

  // Save quiz attempt
  const { data: attempt, error } = await db
    .from("quiz_attempts")
    .insert({
      child_id,
      topic_name,
      score,
      total_questions,
      time_seconds: time_seconds || 0,
    })
    .select()
    .single();

  if (error) return jsonError(error.message, 500);

  // Update weekly leaderboard (server-side)
  const weekStart = getWeekStart();

  // Get user's profile for country
  const { data: profile } = await db
    .from("profiles")
    .select("country")
    .eq("id", user.id)
    .single();

  // Try RPC first, fallback to direct upsert
  try {
    await db.rpc("upsert_leaderboard", {
      p_child_id: child_id,
      p_child_name: child.name,
      p_parent_id: user.id,
      p_country: profile?.country || "VN",
      p_score: score,
      p_week_start: weekStart,
    });
  } catch {
    await db.from("leaderboard_weekly").upsert(
      {
        child_id,
        child_name: child.name,
        parent_id: user.id,
        country: profile?.country || "VN",
        total_score: score,
        total_quizzes: 1,
        week_start: weekStart,
      },
      { onConflict: "child_id,week_start" },
    );
  }

  return jsonOk(attempt, 201);
}

function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(now.setDate(diff));
  return weekStart.toISOString().split("T")[0];
}
