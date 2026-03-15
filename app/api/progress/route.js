import {
  createServerClient,
  getAuthUser,
  jsonOk,
  jsonError,
} from "@/app/lib/supabase-server";

// GET /api/progress?child_id=xxx — get XP, level, streak, badges
export async function GET(request) {
  const user = await getAuthUser(request);
  if (!user) return jsonError("Unauthorized", 401);

  const { searchParams } = new URL(request.url);
  const childId = searchParams.get("child_id");
  if (!childId) return jsonError("child_id required");

  const db = createServerClient();

  // Verify ownership
  const { data: child } = await db
    .from("children")
    .select("parent_id")
    .eq("id", childId)
    .single();

  if (!child || child.parent_id !== user.id) {
    return jsonError("Not authorized", 403);
  }

  // Get or create progress
  let { data: progress } = await db
    .from("user_progress")
    .select("*")
    .eq("child_id", childId)
    .single();

  if (!progress) {
    // Create default progress
    const { data: newProgress } = await db
      .from("user_progress")
      .insert({ child_id: childId })
      .select()
      .single();
    progress = newProgress || {
      xp: 0,
      level: 1,
      streak: 0,
      badges: [],
      settings: {},
    };
  }

  return jsonOk(progress);
}
