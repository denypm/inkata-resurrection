// Notifikasi pembayaran dari Midtrans. Deploy dengan --no-verify-jwt lalu isi URL fungsi ini di
// Midtrans Dashboard → Settings → Payment → Notification URL.
// Secrets: MIDTRANS_SERVER_KEY
import { admin, json } from "../_shared/util.ts";

const SERVER_KEY = Deno.env.get("MIDTRANS_SERVER_KEY") ?? "";

async function sha512(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ ok: true });
  let n: Record<string, string>;
  try { n = await req.json(); } catch { return json({ error: "bad json" }, 400); }
  const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = n;
  if (!order_id || !signature_key) return json({ error: "incomplete" }, 400);
  if ((await sha512(order_id + status_code + gross_amount + SERVER_KEY)) !== signature_key) return json({ error: "bad signature" }, 403);

  const { data: order } = await admin.from("orders").select("*").eq("order_id", order_id).maybeSingle();
  if (!order) return json({ error: "unknown order" }, 404);

  const paid = transaction_status === "settlement" || (transaction_status === "capture" && fraud_status === "accept");
  const failed = ["deny", "cancel", "expire", "failure"].includes(transaction_status);
  const status = paid ? "paid" : failed ? transaction_status : "pending";

  if (paid && order.status !== "paid") {
    if (Math.round(Number(gross_amount)) !== order.amount) return json({ error: "amount mismatch" }, 400);
    const { data: p } = await admin.from("paket").select("hari,sampai").eq("id", order.paket).maybeSingle();
    const { data: cur } = await admin.from("subscriptions").select("until").eq("uid", order.uid).maybeSingle();
    const base = Math.max(Date.now(), cur ? new Date(cur.until).getTime() : 0);
    let until = p?.hari ? base + p.hari * 864e5 : base + 30 * 864e5;
    if (p?.sampai) until = Math.max(until, new Date(p.sampai + "T23:59:59+07:00").getTime());
    await admin.from("subscriptions").upsert({ uid: order.uid, plan: order.paket, until: new Date(until).toISOString(), updated_at: new Date().toISOString() });
  }
  await admin.from("orders").update({ status, raw: n, updated_at: new Date().toISOString() }).eq("order_id", order_id);
  return json({ ok: true });
});
