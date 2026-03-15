import {
  createServerClient,
  jsonOk,
  jsonError,
} from "@/app/lib/supabase-server";

// GET /api/content/topics — list all topics
export async function GET() {
  const db = createServerClient();

  // Try DB-backed subjects first
  const { data: subjects } = await db
    .from("subjects")
    .select("id, slug, name, name_vi, icon, description, subject_category")
    .order("name");

  if (subjects && subjects.length > 0) {
    return jsonOk(subjects);
  }

  // Fallback: return from built-in topics data
  const { default: topics } = await import("@/app/data/topics.json");
  return jsonOk(topics);
}
