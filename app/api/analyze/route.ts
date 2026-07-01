import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Validasi struktur output AI
function validateAIOutput(data: any): boolean {
  const requiredFields = [
    'skor_keseluruhan', 'fase_saat_ini', 'vokal', 'diksi', 
    'sintaksis', 'logika', 'ejaan', 'analisis_bunyi', 
    'analisis_komunikasi', 'analisis_wacana', 'jumlah_kata',
    'error_ejaan', 'error_kapital'
  ];
  return requiredFields.every(field => field in data);
}

// Cross-validasi bottleneck: pastikan fase sesuai indikator kuantitatif
function crossValidatePhase(data: any, isKelas1: boolean): string {
  const errorEjaan = Number(data.error_ejaan) || 0;
  const errorKapital = Number(data.error_kapital) || 0;
  const jumlahKata = Number(data.jumlah_kata) || 0;
  const totalErrors = errorEjaan + errorKapital;

  if (isKelas1) {
    // Kelas 1 rubrik (Filter Piramida)
    if (jumlahKata <= 15 || totalErrors >= 7) return "Fase Bunyi";
    if (jumlahKata > 30 && totalErrors < 3) return "Fase Wacana";
    return "Fase Komunikasi";
  } else {
    // Kelas 2-6 rubrik (Filter Piramida)
    if (totalErrors > 5) return "Fase Bunyi";
    if (totalErrors < 3) return "Fase Wacana";
    return "Fase Komunikasi";
  }
}

// Deteksi kelas dari string grade
function detectKelas(grade: string): { isKelas1: boolean; level: number } {
  const g = String(grade || "").toLowerCase().trim();
  
  // Cari angka kelas secara eksplisit
  // Pattern: "kelas 1", "1 sd", "kelas 1 sd", "1 - A", dll
  const kelasMatch = g.match(/(?:kelas\s*)?(\d{1,2})\s*(?:sd|mi|smp|mts|sma|smk|ma)?/i);
  
  if (kelasMatch) {
    const level = parseInt(kelasMatch[1], 10);
    return { isKelas1: level === 1, level };
  }
  
  // Pattern: "SD - A" (tanpa angka kelas, asumsikan umum)
  if (g.includes('sd') || g.includes('mi')) {
    return { isKelas1: false, level: 0 };
  }
  
  return { isKelas1: false, level: 0 };
}

// Limit: max 10MB base64
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    // === AUTH CHECK ===
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Akses ditolak. Silakan login terlebih dahulu." }, 
        { status: 401 }
      );
    }

    const { image, student_id, grade } = await req.json();
    if (!image) {
      return NextResponse.json({ error: "Image data missing" }, { status: 400 });
    }

    // === SIZE CHECK ===
    const base64Data = image.split(",")[1];
    if (!base64Data) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }
    
    const estimatedSize = Math.ceil(base64Data.length * 0.75);
    if (estimatedSize > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Ukuran gambar terlalu besar. Maksimal 10MB." }, 
        { status: 413 }
      );
    }

    // === STUDENT VALIDATION ===
    if (student_id) {
      const { data: studentCheck } = await supabase
        .from('students')
        .select('id')
        .eq('id', student_id)
        .single();
      
      if (!studentCheck) {
        return NextResponse.json(
          { error: "Student ID tidak valid atau tidak ditemukan." }, 
          { status: 404 }
        );
      }
    }

    // === DETECT MIME TYPE ===
    const mimeMatch = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9\-.+]+).*,/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

    // === KELAS DETECTION ===
    const { isKelas1, level } = detectKelas(grade);

    // === QUOTA CHECK (Token Pulsa) ===
    const { data: teacherInfo } = await supabase
      .from('teachers')
      .select(`
        id,
        school_id,
        schools (
          api_tokens_limit,
          api_tokens_used
        )
      `)
      .eq('id', user.id)
      .single();

    if (!teacherInfo || !teacherInfo.school_id) {
      return NextResponse.json({ error: "Akun Guru tidak terdaftar pada sekolah manapun." }, { status: 403 });
    }

    // Handle single object vs array from join (Supabase usually returns array or single object depending on relation, here it's single since school_id is foreign key)
    const schoolData = Array.isArray(teacherInfo.schools) ? teacherInfo.schools[0] : teacherInfo.schools;
    
    if (schoolData && (schoolData.api_tokens_used >= schoolData.api_tokens_limit)) {
      return NextResponse.json(
        { error: "Kuota AI Sekolah Anda telah habis. Silakan hubungi Admin Sekolah untuk isi ulang." }, 
        { status: 402 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

      PENTING: Hitung error_ejaan dan error_kapital secara MUTLAK dari gambar, bukan perkiraan.

      Keluarkan hasil Anda dalam FORMAT JSON MURNI (tanpa markdown, tanpa backtick), seperti di bawah ini:
      {
        "skor_keseluruhan": number (0-100 secara kuantitatif murni),
        "fase_saat_ini": string ("Fase Bunyi" / "Fase Komunikasi" / "Fase Wacana"),
        "vokal": number (0-100),
        "diksi": number (0-100),
        "sintaksis": number (0-100),
        "logika": number (0-100),
        "ejaan": number (0-100),
        "analisis_bunyi": "ringkasan kritis bukti fase bunyi",
        "analisis_komunikasi": "ringkasan terkait kohesi dan komunikasi",
        "analisis_wacana": "ringkasan ketersambungan makna dan wacana",
        "jumlah_kata": number (hitung mutlak dari gambar),
        "error_ejaan": number (jumlah salah ejaan mutlak),
        "error_kapital": number (jumlah salah kapital mutlak)
      }
    `;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType } },
    ]);

    const response = await result.response;
    const text = response.text().replace(/```json|```/g, "").trim();
    
    let parsedData: any;
    try {
      parsedData = JSON.parse(text);
    } catch (parseError) {
      console.error("AI returned invalid JSON:", text);
      return NextResponse.json(
        { error: "AI mengembalikan format yang tidak valid. Silakan coba lagi." }, 
        { status: 500 }
      );
    }

    // === VALIDATE AI OUTPUT STRUCTURE ===
    if (!validateAIOutput(parsedData)) {
      console.error("AI output missing required fields:", Object.keys(parsedData));
      return NextResponse.json(
        { error: "AI mengembalikan data yang tidak lengkap. Silakan coba lagi." }, 
        { status: 500 }
      );
    }

    // === CROSS-VALIDATE BOTTLENECK ===
    const validatedPhase = crossValidatePhase(parsedData, isKelas1);
    parsedData.fase_saat_ini = validatedPhase;

    // Clamp score to 0-100
    parsedData.skor_keseluruhan = Math.max(0, Math.min(100, Number(parsedData.skor_keseluruhan) || 0));

    // === UPLOAD IMAGE TO STORAGE ===
    let uploadedImageUrl = null;
    
    try {
      const buffer = Buffer.from(base64Data, "base64");
      const fileExt = mimeType.split("/")[1] || "jpeg";
      const filename = `inkata_scan_${crypto.randomUUID()}.${fileExt}`;
      
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
    } catch (storageError) {
      console.warn("Storage upload warning:", storageError);
    }

    // === SINGLE INSERT TO DATABASE (menghapus duplikasi) ===
    if (student_id) {
      const { error: insertError } = await supabase.from('assessments').insert({
        student_id,
        teacher_id: teacherInfo?.id || null,
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

      if (!insertError) {
        // Increment Quota via RPC
        const { error: rpcError } = await supabase.rpc('increment_api_usage', { p_school_id: teacherInfo.school_id });
        if (rpcError) {
          console.error("Gagal memotong kuota AI:", rpcError);
        }
      } else {
        console.error("Assessment insert error:", insertError);
      }
    }

    // Embed URL for frontend
    if (uploadedImageUrl) {
      parsedData.image_url = uploadedImageUrl;
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("AI Analysis Error:", error?.message || error);
    return NextResponse.json(
      { error: "Gagal menganalisis gambar: " + (error?.message || String(error)) }, 
      { status: 500 }
    );
  }
}
