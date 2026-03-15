import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client with service role key
// Only used in API Route Handlers (never exposed to client)
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

// Verify auth token from request and return user
export async function getAuthUser(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.replace("Bearer ", "");
  const supabase = createServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) return null;

  return user;
}

// Standard JSON responses
export function jsonOk(data, status = 200) {
  return Response.json({ success: true, data }, { status });
}

export function jsonError(message, status = 400) {
  return Response.json({ success: false, error: message }, { status });
}

// Admin check
const ADMIN_EMAILS = (
  process.env.NEXT_PUBLIC_ADMIN_EMAILS ||
  "lktiep@gmail.com,hkdjackshrimp@gmail.com"
)
  .split(",")
  .map((e) => e.trim().toLowerCase());

export function isAdminUser(user) {
  return ADMIN_EMAILS.includes((user.email || "").toLowerCase());
}
