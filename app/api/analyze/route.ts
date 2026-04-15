import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { image, student_id } = await req.json();
    if (!image) return NextResponse.json({ error: "Image data missing" }, { status: 400 });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Anda adalah "Sistem Mesin Inkata", pakar analisis kognitif literasi yang sangat akurat. Deteksi sampel tulisan tangan ini secara mutlak berdasarkan "Konvensi Bottleneck Inkata".
      
      Aturan Evaluasi & Kuantifikasi:

      1. Fase Bunyi (Skor Fase 0-40) 
         - Kondisi Wajib: Kalimat sangat sedikit (<15 kata/paragraf), ejaan berantakan (>30% salah), hampir/sama sekali tidak ada tanda baca yang tepat (0-1), kapitalisasi acak di tengah kata. 
         - Aksi Anda: Berikan penilaian "Fase Bunyi" pada kolom fase_saat_ini. Catat kesalahan kritis.

      2. Fase Komunikasi (Skor Fase 41-75)
         - Kondisi Wajib: Kalimat panjang (>15 kata, minimal 3 kalimat) TETAPI ketersambungan makna (kohesi) tidak jelas/tidak saling berhubungan, tanda baca sebagian besar salah (<50% benar). Anak hanya "menulis memanjang" tanpa korelasi logika tinggi.
         - Aksi Anda: Berikan label "Fase Komunikasi". Temukan tumpang tindih sintaksisnya.

      3. Fase Wacana (Skor Fase 76-100)
         - Kondisi Wajib: Terdapat rentetan kalimat berkaitan secara proposisi. Memiliki Koherensi (ketersambungan logika) di atas 80% dan Kohesi kesepadanan tanda baca >80%. Pikiran inti paragraf terlihat nyata.
         - Aksi Anda: Berikan label "Fase Wacana". Evaluasi elaborasi gagasan.

      Keluarkan hasil Anda dalam FORMAT JSON MURNI (tanpa markdown), seperti di bawah ini:
      {
        "skor_keseluruhan": number (0-100 secara kuantitatif murni, menyesuaikan skor fase),
        "fase_saat_ini": string ("Fase Bunyi" / "Fase Komunikasi" / "Fase Wacana"),
        "vokal": number (index 0-100),
        "diksi": number,
        "sintaksis": number,
        "logika": number,
        "ejaan": number,
        "analisis_bunyi": "ringkasan kritis bukti fase",
        "analisis_komunikasi": "ringkasan waspada terkait kohesi",
        "analisis_wacana": "ringkasan ketersambungan makna",
        "jumlah_kata": number (hitung mutlak),
        "error_ejaan": number (jumlah salah mutlak),
        "error_kapital": number
      }
    `;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: image.split(",")[1], mimeType: "image/jpeg" } },
    ]);

    const response = await result.response;
    const text = response.text().replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(text);

    // Ekstraksi Base64 & Tipe Format
    const base64Data = image.split(",")[1];
    const mimeMatch = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

    // Integrasi Permanen ke Database dan Storage Inkata
    let uploadedImageUrl = null;
    
    try {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Upload Berkas Fisik ke Supabase Storage (Bucket: manuscripts)
      const buffer = Buffer.from(base64Data, "base64");
      const filename = `inkata_scan_${crypto.randomUUID()}.${mimeType.split("/")[1]}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('manuscripts')
        .upload(filename, buffer, {
          contentType: mimeType,
          cacheControl: '3600',
          upsert: false
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage.from('manuscripts').getPublicUrl(filename);
        uploadedImageUrl = publicUrlData.publicUrl;
      }

      // 2. Transmisi Data Hasil AI dan Image URL Keterkaitan
      await supabase.from('assessments').insert({
        student_id: student_id || null,
        score: parsedData.skor_keseluruhan,
        literacy_phase: parsedData.fase_saat_ini, 
        vowels: parsedData.vokal,
        diction: parsedData.diksi,
        syntax: parsedData.sintaksis,
        logic: parsedData.logika,
        spelling: parsedData.ejaan,
        image_url: uploadedImageUrl
      });
      
    } catch (dbError) {
      // Graceful degradation
      console.warn("Warning Storage/DB Integration:", dbError);
    }

    // Embed URL pada return untuk merender live pada front-end / modul sertifikat WA
    if (uploadedImageUrl) {
        parsedData.image_url = uploadedImageUrl;
    }

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ error: "Gagal menganalisis gambar" }, { status: 500 });
  }
}
