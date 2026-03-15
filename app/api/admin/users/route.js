import {
  createServerClient,
  getAuthUser,
  isAdminUser,
  jsonOk,
  jsonError,
} from "@/app/lib/supabase-server";

// GET /api/admin/users?limit=10 — recent users
export async function GET(request) {
  const user = await getAuthUser(request);
  if (!user) return jsonError("Unauthorized", 401);
  if (!isAdminUser(user)) return jsonError("Forbidden", 403);

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const db = createServerClient();

  const { data, error } = await db
    .from("profiles")
    .select("id, email, display_name, avatar_url, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return jsonError(error.message, 500);
  return jsonOk(data);
}
