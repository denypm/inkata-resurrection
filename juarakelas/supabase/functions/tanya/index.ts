// Tanya Soal: siswa mengirim teks dan/atau foto soal, Claude menjelaskan langkah demi langkah.
// Secrets: ANTHROPIC_API_KEY (supabase secrets set ANTHROPIC_API_KEY=...)
import Anthropic from "npm:@anthropic-ai/sdk";
import { admin, callerUser, cors, isPremium, json } from "../_shared/util.ts";

const client = new Anthropic(); // membaca ANTHROPIC_API_KEY dari environment
const LIMIT_GRATIS = 3;
const LIMIT_PREMIUM = 30;
const MAPEL: Record<string, string> = { mat: "Matematika", bind: "Bahasa Indonesia", lain: "lainnya" };

const SYSTEM = `Kamu adalah "Kak Juara", tutor ramah di JuaraKelas untuk siswa SD kelas 6 di Indonesia yang bersiap menghadapi Tes Kemampuan Akademik (TKA) SD.

Cara menjawab:
- Gunakan bahasa Indonesia yang sederhana, hangat, dan mudah dipahami anak usia 11–12 tahun.
- Jelaskan langkah demi langkah dengan langkah bernomor. Setiap langkah singkat, satu gagasan.
- Untuk Matematika: tulis perhitungan lengkap, gunakan simbol × dan : untuk kali dan bagi, pecahan seperti 3/4, satuan seperti cm² dan cm³. Periksa ulang hasil hitunganmu sebelum menulis jawaban akhir.
- Untuk Bahasa Indonesia: tunjukkan bagian bacaan yang menjadi bukti jawaban.
- Jika soal pilihan ganda, sebutkan pilihan yang benar dan alasan singkat mengapa pilihan lain kurang tepat.
- Akhiri dengan baris "**Jawaban: …**" lalu satu kalimat tips agar siswa bisa mengerjakan soal serupa sendiri.
- Format teks biasa. Boleh memakai **tebal** untuk kata penting. Jangan memakai LaTeX, tabel Markdown, atau judul (#).
- Jika foto buram atau soal tidak lengkap, katakan bagian mana yang tidak terbaca dan minta siswa mengetik ulang soalnya.
- Jika pertanyaan bukan tentang pelajaran sekolah, jawab singkat dan sopan bahwa kamu hanya membantu soal pelajaran, lalu ajak kembali belajar.
- Jangan meminta atau menyimpan data pribadi siswa.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Metode tidak didukung" }, 405);

  const user = await callerUser(req);
  if (!user) return json({ error: "Masuk dulu untuk bertanya." }, 401);

  let body: { teks?: string; mapel?: string; gambar?: string | null };
  try { body = await req.json(); } catch { return json({ error: "Permintaan tidak valid." }, 400); }
  const teks = String(body.teks ?? "").trim().slice(0, 2000);
  const mapel = body.mapel && MAPEL[body.mapel] ? body.mapel : "lain";
  const gambar = typeof body.gambar === "string" ? body.gambar : null;
  if (!teks && !gambar) return json({ error: "Tulis soal atau kirim foto." }, 400);

  let imgData: string | null = null;
  if (gambar) {
    const m = /^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec(gambar);
    if (!m) return json({ error: "Format foto tidak didukung." }, 400);
    if (m[1].length > 1_600_000) return json({ error: "Foto terlalu besar." }, 413);
    imgData = m[1];
  }

  // Kuota harian (hari dihitung dalam WIB)
  const wib = new Date(Date.now() + 7 * 3600_000);
  const startWib = new Date(Date.UTC(wib.getUTCFullYear(), wib.getUTCMonth(), wib.getUTCDate()) - 7 * 3600_000);
  const { count } = await admin.from("tanya").select("id", { count: "exact", head: true })
    .eq("uid", user.id).gte("created_at", startWib.toISOString());
  const limit = (await isPremium(user.id)) ? LIMIT_PREMIUM : LIMIT_GRATIS;
  if ((count ?? 0) >= limit) {
    return json({ error: `Kuota Tanya Soal hari ini (${limit}) sudah habis. Coba lagi besok${limit === LIMIT_GRATIS ? " atau upgrade ke Premium" : ""}.` }, 429);
  }

  const content: Anthropic.Beta.BetaContentBlockParam[] = [];
  if (imgData) content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: imgData } });
  content.push({ type: "text", text: `Mata pelajaran: ${MAPEL[mapel]}\n\n${teks || "Tolong bantu jelaskan soal di foto ini."}` });

  let jawaban: string;
  try {
    const res = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 8000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium" },
      system: SYSTEM,
      messages: [{ role: "user", content }],
    });
    if (res.stop_reason === "refusal") {
      jawaban = "Maaf, Kak Juara tidak bisa membantu pertanyaan ini. Coba tanyakan soal pelajaran lain, ya!";
    } else {
      jawaban = res.content.filter((b) => b.type === "text").map((b) => (b as { text: string }).text).join("\n").trim();
      if (res.stop_reason === "max_tokens") jawaban += "\n\n(Jawaban terpotong karena terlalu panjang. Coba tanyakan bagian yang lebih kecil.)";
    }
  } catch (err) {
    console.error(err);
    if (err instanceof Anthropic.RateLimitError) return json({ error: "Kak Juara sedang sibuk. Coba lagi sebentar lagi." }, 429);
    if (err instanceof Anthropic.BadRequestError) return json({ error: "Soal tidak bisa diproses. Coba foto ulang atau ketik soalnya." }, 400);
    if (err instanceof Anthropic.APIError) return json({ error: "Layanan AI sedang bermasalah. Coba lagi nanti." }, 502);
    return json({ error: "Terjadi kesalahan. Coba lagi nanti." }, 500);
  }
  if (!jawaban) jawaban = "Maaf, Kak Juara belum bisa menjawab. Coba ketik ulang soalnya, ya.";

  const { data, error } = await admin.from("tanya")
    .insert({ uid: user.id, mapel, teks, gambar: gambar ?? null, jawaban, status: "ai" })
    .select("id").single();
  if (error) console.error(error);
  return json({ id: data?.id ?? null, jawaban, sisa: Math.max(0, limit - (count ?? 0) - 1) });
});
