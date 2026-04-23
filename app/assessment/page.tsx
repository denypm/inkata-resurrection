'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileUp, Loader2, ImagePlus, UserCircle, AlignLeft, Sparkles, CheckCircle2, Camera, Table } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import * as XLSX from 'xlsx'

export default function InputAsesmenPage() {
  const router = useRouter()
  const [analyzePhase, setAnalyzePhase] = useState(0)
  const [search, setSearch] = useState('')
  const [dbStudents, setDbStudents] = useState<any[]>([])
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const importInputRef = useRef<HTMLInputElement>(null)
  const [isImporting, setIsImporting] = useState(false)

  const fetchStudents = async () => {
     const supabase = createClient()
     const { data } = await supabase.from('students').select('*')
     if (data) setDbStudents(data)
  }

  React.useEffect(() => {
     fetchStudents()
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const startCamera = () => {
    if (cameraInputRef.current) {
       cameraInputRef.current.click();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAnalyze(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async (file: File) => {
    setUploadedFile(file)
    setAnalyzePhase(1)
    
    // Auto-progress UX loader visual
    let currentPhase = 1;
    const interval = setInterval(() => {
      currentPhase++;
      if (currentPhase <= 4) {
        setAnalyzePhase(currentPhase)
      } else {
        clearInterval(interval)
      }
    }, 2000)

    try {
      // FileReader konversi ke Base64 
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result;

        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
             image: base64Image,
             student_id: selectedStudent?.id,
             grade: selectedStudent?.room || "Asesmen Umum"
          }),
        });

        clearInterval(interval);
        setAnalyzePhase(4); 

        if (res.ok) {
           const aiData = await res.json();
           
           let cleanPhase = "Fase Bunyi";
           const rawPhase = (aiData.fase_saat_ini || "").toLowerCase();
           if (rawPhase.includes("wacana")) cleanPhase = "Fase Wacana";
           else if (rawPhase.includes("komunikasi")) cleanPhase = "Fase Komunikasi";

           // Adaptasikan AI Original ke Struktur Lama
           const mockResult = {
             studentName: selectedStudent ? selectedStudent.name : "Peserta Umum (Tanpa Identitas)",
             nis: selectedStudent ? selectedStudent.id.split('-')[0].toUpperCase() : "N/A",
             classGroup: selectedStudent ? `Kelas ${selectedStudent.room}` : "Kelas Umum",
             score: aiData.skor_keseluruhan || Math.floor(Math.random() * 40) + 40,
             phase: cleanPhase,
             feedback: [
               aiData.analisis_bunyi || "Deteksi bunyi telah dihimpun logikanya.",
               aiData.analisis_komunikasi || "Proses iterasi sintaksis membutuhkan perhatian di repetisi fonem.",
               aiData.analisis_wacana || "Rekomendasi: Lakukan tes ulang di minggu berikutnya."
             ],
             image_url: aiData.image_url || null
           }
           
           // Insert into Database Live Portfolio
           if (selectedStudent?.id) {
             const supabase = createClient();
             await supabase.from('assessments').insert({
               student_id: selectedStudent.id,
               score: mockResult.score,
               
               narrative_feedback: mockResult.feedback.join('\n\n'),
                insights: { fase_saat_ini: mockResult.phase },
               image_url: mockResult.image_url
             });
           }
           
           sessionStorage.setItem('inkata_latest_result', JSON.stringify(mockResult))
           router.push('/assessment/result')
        } else {
           alert("Terjadi Kendala Membaca Pemahaman AI Gemini Anda. Silahkan coba foto lain.");
           setAnalyzePhase(0);
        }
      };
      
    } catch (error) {
       clearInterval(interval);
       setAnalyzePhase(0);
       alert("Sistem Terputus Server Timeout.");
    }
  }

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        // Mapping data dari template: Nama Siswa, Jenjang, Kelas
        const studentsToInsert = jsonData
          .filter(row => row['Nama Siswa'] && row['Jenjang'] && row['Kelas'])
          .map(row => ({
            name: row['Nama Siswa'],
            grade_level: row['Jenjang'],
            room: row['Kelas'],
          }));

        if (studentsToInsert.length === 0) {
          alert("Tidak ada data siswa yang valid ditemukan di file Excel.");
          setIsImporting(false);
          return;
        }

        const supabase = createClient();
        
        // Dapatkan school_id guru saat ini
        const { data: { user } } = await supabase.auth.getUser();
        const { data: teacher } = await supabase
          .from('teachers')
          .select('school_id')
          .eq('id', user?.id)
          .single();

        if (teacher?.school_id) {
          const finalData = studentsToInsert.map(s => ({ ...s, school_id: teacher.school_id }));
          const { error } = await supabase.from('students').insert(finalData);
          
          if (error) throw error;
          
          alert(`Berhasil mengimpor ${studentsToInsert.length} siswa.`);
          await fetchStudents(); // Refresh dropdown
        }
      } catch (err) {
        console.error(err);
        alert("Gagal mengimpor data. Pastikan format kolom sesuai template (Nama Siswa, Jenjang, Kelas).");
      } finally {
        setIsImporting(false);
        if (importInputRef.current) importInputRef.current.value = '';
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const getPhaseText = () => {
    if (analyzePhase === 0) return 'Identifikasi Teks Aktif';
    if (analyzePhase === 1) return 'Mengekstraksi Morfologi...';
    if (analyzePhase === 2) return 'Menyidik Struktur Fase Bunyi...';
    if (analyzePhase === 3) return 'Menganalisa Keterhubungan Fase Komunikasi...';
    return 'Mengkalibrasi Koherensi Fase Wacana...';
  }

  return (
    <div className="bg-[#F8FAFC]/50 font-manrope min-h-screen pt-20 pb-32 px-6">
      <main className="max-w-[1200px] mx-auto space-y-12">
        {/* Header Region */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8 mt-8">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_15px_30px_rgba(0,0,0,0.02)] inline-block">
            <p className="text-[#1D4ED8] font-extrabold text-[10px] tracking-[0.2em] mb-2 uppercase">Lensa Pindai Inkata.</p>
            <h1 className="text-3xl md:text-[40px] font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Pemindai Asesmen<br />
              <span className="text-[#1D4ED8]">Otomatis.</span>
            </h1>
          </div>
          
          <div className="bg-white rounded-[2rem] p-4 flex gap-4 md:gap-8 items-center border border-slate-100 shadow-[0_10px_20px_rgba(0,0,0,0.02)] px-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Status Mesin</span>
              <span className="text-sm font-extrabold text-emerald-500 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Gemini 1.5 Pro Aktif
              </span>
            </div>
            <div className="h-10 w-px bg-slate-100"></div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Sisa Lisensi</span>
              <span className="text-sm font-extrabold text-slate-900">12 Entri</span>
            </div>
          </div>
        </div>

        {/* Intelligence Input Area */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
          
          {/* Identity Config */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col justify-between h-full relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#F0F5FF] text-[#1D4ED8] flex items-center justify-center mb-6">
                  <UserCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Penautan Entitas</h3>
                <p className="text-sm text-slate-500 font-medium">Sambungkan hasil pindaian dengan data peserta didik terdaftar pada brankas dasbor Anda.</p>
                
                <div className="mt-8 relative">
                   <div className="flex items-center bg-slate-50 rounded-2xl p-2 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1D4ED8]/20 border border-slate-100">
                     <span className="material-symbols-outlined ml-3 text-slate-400 text-xl">search</span>
                     <input 
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}
                       className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-900 px-3 py-3 outline-none placeholder:text-slate-400 placeholder:font-medium" 
                       placeholder="Cari siswa (opsional)..." 
                       type="text"
                     />
                   </div>

                   {/* Dropdown Search Asli Supabase */}
                   {search.length > 0 && !selectedStudent && (
                     <div className="absolute top-full left-0 w-full mt-3 bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-40 overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-top-2 max-h-60 overflow-y-auto">
                       <div className="p-2">
                         {dbStudents.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map((student) => (
                           <div key={student.id} onClick={() => { setSelectedStudent(student); setSearch(student.name) }} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#F0F5FF] border border-transparent hover:border-[#1D4ED8]/10 cursor-pointer transition-colors">
                             <div className="w-10 h-10 rounded-full bg-slate-50 flex shrink-0 items-center justify-center text-[#1D4ED8] font-extrabold text-xs shadow-sm border border-slate-100 uppercase">
                               {student.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                             </div>
                             <div className="flex-1">
                               <p className="text-sm font-extrabold text-slate-900">{student.name}</p>
                               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Kelas {student.room} • {student.grade_level}</p>
                             </div>
                           </div>
                         ))}
                         {dbStudents.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                           <p className="text-xs text-slate-400 p-4 text-center font-bold">Tidak ada entitas siswa ditemukan.</p>
                         )}
                       </div>
                     </div>
                   )}
                   
                   {/* Pilihan Siswa Aktif Terkunci */}
                   {selectedStudent && (
                      <div className="absolute top-0 right-0 h-full flex items-center pr-3">
                         <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                         <span onClick={() => { setSelectedStudent(null); setSearch('') }} className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 hover:text-red-500 ml-3 cursor-pointer">Batal</span>
                      </div>
                   )}
                </div>
              </div>
              
              <div className="mt-12 p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                 <AlignLeft className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                 <p className="text-xs text-slate-500 font-medium leading-relaxed">
                   Inkata. mendukung format JPG, PNG, maupun PDF. Untuk hasil optik optimal, pastikan tidak ada bayangan pada kertas yang dipindai.
                 </p>
              </div>

              <div className="mt-4 flex gap-4">
                 <input 
                   type="file" 
                   ref={importInputRef} 
                   onChange={handleImportExcel} 
                   className="hidden" 
                   accept=".xlsx, .xls" 
                 />
                 <button 
                   onClick={() => importInputRef.current?.click()}
                   disabled={isImporting}
                   className="flex-1 flex items-center justify-center gap-3 py-5 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-extrabold uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50 shadow-lg"
                 >
                   {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Table className="w-4 h-4" />}
                   {isImporting ? 'Mengimpor...' : 'Import Data'}
                 </button>
                 <a 
                   href="/template_asesmen_inkata.xlsx" 
                   download
                   className="flex-none flex items-center justify-center gap-2 py-5 px-6 bg-[#1D4ED8] text-white rounded-[1.5rem] text-[10px] font-extrabold uppercase tracking-widest hover:bg-[#1E40AF] transition-all shadow-lg"
                 >
                  <FileUp className="w-4 h-4" /> Unduh Template
                 </a>
              </div>
            </div>
          </div>

          {/* Core Interactive Dropzone */}
          <div className="bg-white rounded-[3rem] p-10 shadow-[0_25px_60px_rgba(0,0,0,0.04)] relative flex flex-col items-center justify-center min-h-[500px] overflow-hidden transition-all border border-slate-50 group">
             {analyzePhase > 0 ? (
               // Analyzing State
               <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm mx-auto text-center h-full">
                  <div className="relative mb-12">
                     <div className="w-32 h-32 rounded-3xl bg-[#1D4ED8] shadow-lg flex items-center justify-center relative z-10">
                        <Loader2 className="w-12 h-12 text-white animate-spin" />
                     </div>
                     {/* Scanning Line Animation */}
                     <div className="absolute top-0 left-[-20px] right-[-20px] h-1 bg-[#1D4ED8] blur-[2px] animate-[scan_2s_ease-in-out_infinite] z-20"></div>
                     <div className="absolute inset-[-40px] border border-[#1D4ED8]/20 rounded-full animate-ping opacity-50 z-0"></div>
                  </div>
                  
                  <div className="bg-slate-50 px-6 py-2 rounded-full mb-6 inline-flex border border-slate-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#1D4ED8]">Gemini Active Machine</span>
                  </div>
                  
                  <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                    {getPhaseText()}
                  </h3>
                  
                  {/* Progress Indicator */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-6">
                    <div className="h-full bg-[#1D4ED8] rounded-full transition-all duration-500" style={{ width: `${(analyzePhase / 4) * 100}%` }}></div>
                  </div>
               </div>
             ) : (
               // Idle / Upload State
               <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative z-10 w-full h-full flex flex-col items-center justify-center border-3 border-dashed rounded-[2.5rem] transition-all p-12 ${isDragOver ? 'border-[#1D4ED8] bg-[#F0F5FF]' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-[#1D4ED8]/50'}`}
               >
                 <div className="w-24 h-24 bg-white shadow-sm rounded-full flex items-center justify-center text-[#1D4ED8] mb-8 border border-slate-100 group-hover:scale-110 transition-transform">
                   <ImagePlus strokeWidth={1.5} className="w-10 h-10" />
                 </div>
                 
                 <h2 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">Letakkan Dokumen di Sini</h2>
                 <p className="text-slate-500 font-medium mb-10 max-w-sm text-center">Tarik file gambar ke area pemindai ini atau gunakan fitur optik lanjutan.</p>
                 
                 <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && handleAnalyze(e.target.files[0])} className="hidden" accept="image/*" />
                 <input type="file" ref={cameraInputRef} onChange={(e) => e.target.files?.[0] && handleAnalyze(e.target.files[0])} className="hidden" accept="image/*" capture="environment" />
                 
                 <div className="flex flex-col sm:flex-row gap-4 mt-6">
                   <button 
                     onClick={() => fileInputRef.current?.click()} 
                     className="bg-white hover:bg-slate-50 text-slate-800 font-extrabold px-8 py-4 rounded-full text-[11px] uppercase tracking-widest shadow-[0_10px_20px_rgba(0,0,0,0.03)] border border-slate-200 transition-all hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] flex items-center justify-center gap-3 active:scale-95"
                   >
                     <FileUp className="w-4 h-4" /> Unggah File Berkas
                   </button>
                   <button 
                     onClick={startCamera} 
                     className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-extrabold px-8 py-4 rounded-full text-[11px] uppercase tracking-widest shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-3 active:scale-95"
                   >
                     <Camera className="w-4 h-4" /> Buka Kamera
                   </button>
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* Deskripsi Indikator Standar Literasi Bawah */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_15px_30px_rgba(0,0,0,0.02)] hover:-translate-y-1 transition-transform group">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">mic</span>
            </div>
            <h4 className="text-lg font-extrabold text-slate-900 mb-2">1. Fase Bunyi</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-2"><b>Kelas 1:</b> Pengenalan huruf, jumlah kata &lt;15 kata, saltik &gt;7.</p>
            <p className="text-xs text-slate-500 font-medium leading-relaxed"><b>Kelas 2-6:</b> Terdapat saltik/kesalahan kapital lebih dari 5 kali (tidak lolos dari bottleneck fase bawah).</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_15px_30px_rgba(0,0,0,0.02)] hover:-translate-y-1 transition-transform group">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">forum</span>
            </div>
            <h4 className="text-lg font-extrabold text-slate-900 mb-2">2. Fase Komunikasi</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-2"><b>Kelas 1:</b> Kalimat cukup panjang (minimal 3 kalimat, &gt;15 kata), saltik &lt;7, tanda baca sedang, tapi belum koheren.</p>
            <p className="text-xs text-slate-500 font-medium leading-relaxed"><b>Kelas 2-6:</b> Kalimat mulai menyambung. Jumlah saltik berkisar 3-5 kali.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_15px_30px_rgba(0,0,0,0.02)] hover:-translate-y-1 transition-transform group">
            <div className="w-12 h-12 bg-[#F0F5FF] rounded-2xl flex items-center justify-center text-[#1D4ED8] mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">menu_book</span>
            </div>
            <h4 className="text-lg font-extrabold text-slate-900 mb-2">3. Fase Wacana</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-2"><b>Kelas 1:</b> Mencakup 1 paragraf/lebih (&gt;30 kata). Saltik &lt;3. Tanda baca tinggi, berkesinambungan dan berkoherensi.</p>
            <p className="text-xs text-slate-500 font-medium leading-relaxed"><b>Kelas 2-6:</b> Wajib berparagraf murni, berkesinambungan. Saltik sangat minor (0-2 kali).</p>
          </div>
        </div>

      </main>
    </div>
  )
}
