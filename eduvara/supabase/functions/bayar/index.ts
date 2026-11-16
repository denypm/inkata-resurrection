// Membuat transaksi Midtrans Snap untuk paket Premium. Harga diambil dari tabel public.paket (bukan dari browser).
// Secrets: MIDTRANS_SERVER_KEY, MIDTRANS_PRODUCTION ("true" untuk produksi; selain itu sandbox)
import { admin, callerUser, cors, json } from "../_shared/util.ts";

const SERVER_KEY = Deno.env.get("MIDTRANS_SERVER_KEY") ?? "";
const PROD = Deno.env.get("MIDTRANS_PRODUCTION") === "true";
const SNAP = PROD ? "https://app.midtrans.com/snap/v1/transactions" : "https://app.sandbox.midtrans.com/snap/v1/transactions";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (!SERVER_KEY) return json({ error: "Pembayaran belum diatur oleh pemilik situs." }, 503);
  const user = await callerUser(req);
  if (!user) return json({ error: "Masuk dulu untuk membeli paket." }, 401);

  let body: { paket?: string; kembali?: string };
  try { body = await req.json(); } catch { return json({ error: "Permintaan tidak valid." }, 400); }
  const { data: p } = await admin.from("paket").select("*").eq("id", body.paket ?? "").maybeSingle();
  if (!p) return json({ error: "Paket tidak ditemukan." }, 404);

  const orderId = `STKA-${Date.now()}-${user.id.slice(0, 8)}`;
  const name = (user.user_metadata?.full_name as string | undefined) ?? (user.email ?? "Siswa").split("@")[0];
  const finish = typeof body.kembali === "string" && /^https:\/\//.test(body.kembali) ? body.kembali : undefined;

  const res = await fetch(SNAP, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic " + btoa(SERVER_KEY + ":"),
    },
    body: JSON.stringify({
      transaction_details: { order_id: orderId, gross_amount: p.harga },
      item_details: [{ id: p.id, price: p.harga, quantity: 1, name: String(p.nama).slice(0, 50) }],
      customer_details: { first_name: name.slice(0, 50), email: user.email },
      ...(finish ? { callbacks: { finish } } : {}),
    }),
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok || !out.redirect_url) {
    console.error("midtrans", res.status, out);
    return json({ error: "Gagal membuat pembayaran. Coba lagi nanti." }, 502);
  }
  await admin.from("orders").insert({ order_id: orderId, uid: user.id, paket: p.id, amount: p.harga, status: "pending" });
  return json({ order_id: orderId, token: out.token, redirect_url: out.redirect_url });
});
