import {
  createServerClient,
  getAuthUser,
  isAdminUser,
  jsonOk,
  jsonError,
} from "@/app/lib/supabase-server";

// GET /api/admin/usage?days=30 — daily quiz chart
export async function GET(request) {
  const user = await getAuthUser(request);
  if (!user) return jsonError("Unauthorized", 401);
  if (!isAdminUser(user)) return jsonError("Forbidden", 403);

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "30", 10);

  const db = createServerClient();

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);

  const { data: attempts } = await db
    .from("quiz_attempts")
    .select("created_at, score, total_questions")
    .gte("created_at", sinceDate.toISOString());

  const daily = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dayStr = d.toDateString();
    const dayCount = (attempts || []).filter(
      (a) => new Date(a.created_at).toDateString() === dayStr,
    ).length;
    daily.push({
      date: d.toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "short",
      }),
      count: dayCount,
    });
  }

  return jsonOk(daily);
}
