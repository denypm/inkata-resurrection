import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { image, student_id, grade } = await req.json();
    if (!image) return NextResponse.json({ error: "Image data missing" }, { status: 400 });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Cek apakah siswa berlabel kelas 1
    const isKelas1 = grade === "1" || grade === "Kelas 1";

    const prompt = `
      Anda adalah "Sistem Mesin Inkata", pakar analisis kognitif literasi yang sangat teliti. Evaluasi tulisan tangan ini secara mutlak berdasarkan "Konvensi Bottleneck Inkata".
      Evaluasi ini untuk siswa ${grade}. PENTING: Ikuti RUMUS BOTTLENECK ini dan JANGAN simpan simpangan:

      ${isKelas1 ? `
      [RUMUS KELAS 1]
      1. Fase Bunyi: Penulisan huruf kapital dan tanda baca kurang tepat hingga tidak ada tanda baca. Jumlah kata tidak lebih dari 15 kata. Jumlah saltik (salah ketik/ejaan) lebih dari 7.
      2. Fase Komunikasi: Kalimat cukup panjang (minimal 3 kalimat), jumlah saltik kurang dari 7. Jumlah kalimat lebih dari 15 kata. Ketepatan penggunaan tanda baca sedang. Tapi di fase ini, tulisan siswa tidak koheren.
      3. Fase Wacana: Tulisan siswa sudah mencakup 1 paragraf atau lebih. Jumlah saltik kurang dari 3. Jumlah kalimat lebih dari 30 kata. Penggunaan tanda baca tinggi. Dan tulisan sudah berkesinambungan, berkoherensi, dan menghubungkan proposisi/pernyataan satu dengan lainnya.
      ` : `
      [RUMUS KELAS 2 HINGGA 6]
      1. Fase Bunyi: Terdapat kesalahan ejaan/kapital lebih dari 5 letak. Sistem otomatis mengunci di Fase Bunyi.
      2. Fase Komunikasi: Kesalahan ejaan/kapital berjumlah 3 hingga 5 kali. Kalimat sudah mulai menyambung namun belum koheren sempurna.
      3. Fase Wacana: Kesalahan ejaan/kapital rapi (0 hingga 2 letak saltik saja), dan WAJIB terdapat struktur tulisan satu paragraf murni (berkesinambungan, berkoherensi, dan menghubungkan proposisi satu dengan yang lainnya).
      `}

      Keluarkan hasil Anda dalam FORMAT JSON MURNI (tanpa markdown), seperti di bawah ini:
      {
        "skor_keseluruhan": number (0-100 secara kuantitatif murni),
        "fase_saat_ini": string ("Fase Bunyi" / "Fase Komunikasi" / "Fase Wacana"),
        "vokal": number,
        "diksi": number,
        "sintaksis": number,
        "logika": number,
        "ejaan": number,
        "analisis_bunyi": "ringkasan kritis bukti fase",
        "analisis_komunikasi": "ringkasan terkait kohesi",
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
        insights: {
          fase_saat_ini: parsedData.fase_saat_ini,
          vokal: parsedData.vokal,
          diksi: parsedData.diksi,
          sintaksis: parsedData.sintaksis,
          logika: parsedData.logika,
          ejaan: parsedData.ejaan,
          analisis_bunyi: parsedData.analisis_bunyi,
          analisis_komunikasi: parsedData.analisis_komunikasi,
          analisis_wacana: parsedData.analisis_wacana,
          jumlah_kata: parsedData.jumlah_kata,
          error_ejaan: parsedData.error_ejaan,
          error_kapital: parsedData.error_kapital
        },
        narrative_feedback: `${parsedData.fase_saat_ini} — ${parsedData.analisis_bunyi || ''} ${parsedData.analisis_komunikasi || ''} ${parsedData.analisis_wacana || ''}`.trim(),
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
