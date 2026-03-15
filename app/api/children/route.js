import {
  createServerClient,
  getAuthUser,
  jsonOk,
  jsonError,
} from "@/app/lib/supabase-server";

// GET /api/children — list children for current user
export async function GET(request) {
  const user = await getAuthUser(request);
  if (!user) return jsonError("Unauthorized", 401);

  const db = createServerClient();
  const { data, error } = await db
    .from("children")
    .select("*")
    .eq("parent_id", user.id)
    .order("created_at", { ascending: true });

  if (error) return jsonError(error.message, 500);
  return jsonOk(data);
}

// POST /api/children — add a child
export async function POST(request) {
  const user = await getAuthUser(request);
  if (!user) return jsonError("Unauthorized", 401);

  const body = await request.json();
  const { name, birth_year } = body;

  if (!name || !name.trim()) {
    return jsonError("Name is required");
  }

  const db = createServerClient();
  const { data, error } = await db
    .from("children")
    .insert({
      parent_id: user.id,
      name: name.trim(),
      birth_year: birth_year || null,
    })
    .select()
    .single();

  if (error) return jsonError(error.message, 500);
  return jsonOk(data, 201);
}

// DELETE /api/children?id=xxx — remove a child
export async function DELETE(request) {
  const user = await getAuthUser(request);
  if (!user) return jsonError("Unauthorized", 401);

  const { searchParams } = new URL(request.url);
  const childId = searchParams.get("id");
  if (!childId) return jsonError("Child ID required");

  const db = createServerClient();

  // Verify ownership
  const { data: child } = await db
    .from("children")
    .select("parent_id")
    .eq("id", childId)
    .single();

  if (!child || child.parent_id !== user.id) {
    return jsonError("Not found or not authorized", 404);
  }

  const { error } = await db.from("children").delete().eq("id", childId);
  if (error) return jsonError(error.message, 500);

  return jsonOk({ deleted: childId });
}
