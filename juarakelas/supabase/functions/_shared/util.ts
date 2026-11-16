import { createClient, type SupabaseClient, type User } from "npm:@supabase/supabase-js@2";

export const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}

export const admin: SupabaseClient = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } },
);

/** Pengguna yang memanggil fungsi (dari header Authorization), atau null. */
export async function callerUser(req: Request): Promise<User | null> {
  const auth = req.headers.get("Authorization");
  if (!auth) return null;
  const { data, error } = await admin.auth.getUser(auth.replace(/^Bearer\s+/i, ""));
  return error ? null : data.user;
}

export async function isPremium(uid: string): Promise<boolean> {
  const { data } = await admin.from("subscriptions").select("until").eq("uid", uid).maybeSingle();
  return !!data && new Date(data.until).getTime() > Date.now();
}
