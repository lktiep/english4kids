import {
  createServerClient,
  getAuthUser,
  jsonOk,
  jsonError,
} from "@/app/lib/supabase-server";

const LEVEL_THRESHOLDS = [0, 100, 350, 850, 1850, 3850];

function calculateLevel(xp) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

// POST /api/progress/xp — add XP for a child
export async function POST(request) {
  const user = await getAuthUser(request);
  if (!user) return jsonError("Unauthorized", 401);

  const body = await request.json();
  const { child_id, amount, source } = body;

  if (!child_id || !amount) return jsonError("child_id and amount required");

  const db = createServerClient();

  // Verify ownership
  const { data: child } = await db
    .from("children")
    .select("parent_id")
    .eq("id", child_id)
    .single();

  if (!child || child.parent_id !== user.id) {
    return jsonError("Not authorized", 403);
  }

  // Get or create progress
  let { data: progress } = await db
    .from("user_progress")
    .select("*")
    .eq("child_id", child_id)
    .single();

  if (!progress) {
    const { data: created } = await db
      .from("user_progress")
      .insert({ child_id })
      .select()
      .single();
    progress = created;
  }

  const newXP = (progress?.xp || 0) + amount;
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > (progress?.level || 1);

  // Update streak
  const today = new Date().toISOString().split("T")[0];
  const lastLogin = progress?.last_login_date;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  let newStreak = progress?.streak || 0;
  if (lastLogin !== today) {
    newStreak = lastLogin === yesterday ? newStreak + 1 : 1;
  }

  const { data: updated, error } = await db
    .from("user_progress")
    .update({
      xp: newXP,
      level: newLevel,
      streak: newStreak,
      last_login_date: today,
    })
    .eq("child_id", child_id)
    .select()
    .single();

  if (error) return jsonError(error.message, 500);

  return jsonOk({
    ...updated,
    leveledUp,
    xpAdded: amount,
    source: source || "quiz",
  });
}
