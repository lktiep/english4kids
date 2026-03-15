import {
  createServerClient,
  jsonOk,
  jsonError,
} from "@/app/lib/supabase-server";

// GET /api/content/vocabulary?topic=animals
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic");

  if (!topic) return jsonError("topic slug required");

  const db = createServerClient();

  // Try DB-backed vocabulary first
  const { data: vocab } = await db
    .from("vocabulary")
    .select("*")
    .eq("topic_name", topic)
    .order("english");

  if (vocab && vocab.length > 0) {
    return jsonOk(vocab);
  }

  // Fallback: load from JSON files
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const filePath = path.join(
      process.cwd(),
      "app",
      "data",
      "vocabulary",
      `${topic}.json`,
    );
    const raw = await fs.readFile(filePath, "utf-8");
    return jsonOk(JSON.parse(raw));
  } catch {
    return jsonError("Topic not found", 404);
  }
}
