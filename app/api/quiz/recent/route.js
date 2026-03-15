import {
  createServerClient,
  getAuthUser,
  jsonOk,
  jsonError,
} from "@/app/lib/supabase-server";

// GET /api/quiz/recent?child_id=xxx&limit=5
export async function GET(request) {
  const user = await getAuthUser(request);
  if (!user) return jsonError("Unauthorized", 401);

  const { searchParams } = new URL(request.url);
  const childId = searchParams.get("child_id");
  const limit = parseInt(searchParams.get("limit") || "5", 10);

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

  const { data, error } = await db
    .from("quiz_attempts")
    .select("*")
    .eq("child_id", childId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return jsonError(error.message, 500);
  return jsonOk(data);
}
