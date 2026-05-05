'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'
import { createClient } from '@/lib/supabase/client'

type StudentAssessment = {
  id: string
  name: string
  grade_level: string
  room: string
  score: number
  phase: string
  vokal: number
  diksi: number
  sintaksis: number
  logika: number
  ejaan: number
  jumlah_kata: number
  error_ejaan: number
  error_kapital: number
  analisis_bunyi: string
  analisis_komunikasi: string
  analisis_wacana: string
  narrative_feedback: string
  image_url: string | null
  assessed_at: string | null
}

export default function LiteracyAnalysisPage() {
  const [students, setStudents] = useState<StudentAssessment[]>([])
  const [activeClass, setActiveClass] = useState('Semua Kelas')
  const [isExporting, setIsExporting] = useState(false)
  const [isExportingExcel, setIsExportingExcel] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [classOptions, setClassOptions] = useState<string[]>([])
  const reportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: teacher } = await supabase
        .from('teachers')
        .select('school_id')
        .eq('id', user.id)
        .single()

      let query = supabase
        .from('students')
        .select(`
          *,
          assessments:assessments(
            score, insights, narrative_feedback, image_url, created_at
          )
        `)

      if (teacher?.school_id) {
        query = query.eq('school_id', teacher.school_id)
      }

      const { data: studentsData } = await query

      if (studentsData) {
        const formatted: StudentAssessment[] = studentsData.map((s: any) => {
          const hasAssessment = s.assessments && s.assessments.length > 0
          const latest = hasAssessment ? s.assessments[s.assessments.length - 1] : null
          const insights = latest?.insights || {}

          return {
            id: s.id,
            name: s.name,
            grade_level: s.grade || '-',
            room: s.grade || '-',
            score: latest ? latest.score : 0,
            phase: insights.fase_saat_ini || 'Belum Dinilai',
            vokal: insights.vokal ?? 0,
            diksi: insights.diksi ?? 0,
            sintaksis: insights.sintaksis ?? 0,
            logika: insights.logika ?? 0,
            ejaan: insights.ejaan ?? 0,
            jumlah_kata: insights.jumlah_kata ?? 0,
            error_ejaan: insights.error_ejaan ?? 0,
            error_kapital: insights.error_kapital ?? 0,
            analisis_bunyi: insights.analisis_bunyi || '-',
            analisis_komunikasi: insights.analisis_komunikasi || '-',
            analisis_wacana: insights.analisis_wacana || '-',
            narrative_feedback: latest?.narrative_feedback || '-',
            image_url: latest?.image_url || null,
            assessed_at: latest?.created_at || null,
          }
        })

        setStudents(formatted)

        // Extract unique class options
        const rooms = [...new Set(formatted.map(s => s.room).filter(r => r !== '-'))]
        setClassOptions(rooms.sort())
      }

      setLoading(false)
    }
    fetchData()
  }, [])

  // Filter by class
  const filteredStudents = activeClass === 'Semua Kelas'
    ? students
    : students.filter(s => s.room === activeClass)

  const assessedStudents = filteredStudents.filter(s => s.score > 0)
  const totalFiltered = filteredStudents.length
  const avgScore = assessedStudents.length > 0
    ? Math.round(assessedStudents.reduce((sum, s) => sum + s.score, 0) / assessedStudents.length)
    : 0

  // Phase distribution
  const phaseWacana = assessedStudents.filter(s => s.phase.toLowerCase().includes('wacana')).length
  const phaseKomunikasi = assessedStudents.filter(s => s.phase.toLowerCase().includes('komunikasi')).length
  const phaseBunyi = assessedStudents.filter(s => s.phase.toLowerCase().includes('bunyi')).length
  const pctWacana = assessedStudents.length > 0 ? Math.round((phaseWacana / assessedStudents.length) * 100) : 0
  const pctKomunikasi = assessedStudents.length > 0 ? Math.round((phaseKomunikasi / assessedStudents.length) * 100) : 0
  const pctBunyi = assessedStudents.length > 0 ? Math.round((phaseBunyi / assessedStudents.length) * 100) : 0

  // Avg indicators
  const avgVokal = assessedStudents.length > 0 ? Math.round(assessedStudents.reduce((s, x) => s + x.vokal, 0) / assessedStudents.length) : 0
  const avgDiksi = assessedStudents.length > 0 ? Math.round(assessedStudents.reduce((s, x) => s + x.diksi, 0) / assessedStudents.length) : 0
  const avgSintaksis = assessedStudents.length > 0 ? Math.round(assessedStudents.reduce((s, x) => s + x.sintaksis, 0) / assessedStudents.length) : 0

  const handleExportPDF = async () => {
    if (!reportRef.current) return
    setIsExporting(true)

    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, logging: false })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      })
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
      pdf.save(`Laporan_Inkata_${activeClass.replace(' ', '_')}.pdf`)
    } catch (error) {
      console.error("Gagal mengekspor PDF", error)
      alert("Maaf, terjadi kesalahan saat menyusun dokumen PDF.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportExcel = async () => {
    setIsExportingExcel(true)

    try {
      const data = filteredStudents.map((s, idx) => ({
        'No': idx + 1,
        'Nama Siswa': s.name,
        'Jenjang': s.grade_level,
        'Kelas': s.room,
        'Skor Keseluruhan': s.score > 0 ? s.score : 'Belum Dinilai',
        'Fase Literasi': s.phase,
        'Vokal': s.score > 0 ? s.vokal : '-',
        'Diksi': s.score > 0 ? s.diksi : '-',
        'Sintaksis': s.score > 0 ? s.sintaksis : '-',
        'Logika': s.score > 0 ? s.logika : '-',
        'Ejaan': s.score > 0 ? s.ejaan : '-',
        'Jumlah Kata': s.score > 0 ? s.jumlah_kata : '-',
        'Kesalahan Ejaan': s.score > 0 ? s.error_ejaan : '-',
        'Kesalahan Kapital': s.score > 0 ? s.error_kapital : '-',
        'Analisis Fase Bunyi': s.score > 0 ? s.analisis_bunyi : '-',
        'Analisis Fase Komunikasi': s.score > 0 ? s.analisis_komunikasi : '-',
        'Analisis Fase Wacana': s.score > 0 ? s.analisis_wacana : '-',
        'Feedback Naratif': s.score > 0 ? s.narrative_feedback : '-',
        'URL Gambar Tulisan': s.image_url || '-',
        'Tanggal Asesmen': s.assessed_at
          ? new Date(s.assessed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
          : 'Belum Dinilai',
      }))

      // Create workbook with summary sheet + detail sheet
      const wb = XLSX.utils.book_new()

      // Sheet 1: Rekap Ringkas
      const summaryData = [
        ['LAPORAN KOLEKTIF ASESMEN LITERASI — INKATA.'],
        ['Diekspor pada', new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })],
        ['Filter Kelas', activeClass],
        [''],
        ['RINGKASAN STATISTIK'],
        ['Total Siswa', totalFiltered],
        ['Sudah Diasesmen', assessedStudents.length],
        ['Rata-rata Skor', avgScore + '%'],
        [''],
        ['DISTRIBUSI FASE LITERASI'],
        ['Fase Wacana', phaseWacana, `${pctWacana}%`],
        ['Fase Komunikasi', phaseKomunikasi, `${pctKomunikasi}%`],
        ['Fase Bunyi', phaseBunyi, `${pctBunyi}%`],
        ['Belum Dinilai', totalFiltered - assessedStudents.length],
        [''],
        ['RATA-RATA INDIKATOR'],
        ['Vokal', avgVokal],
        ['Diksi', avgDiksi],
        ['Sintaksis', avgSintaksis],
      ]
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData)
      // Set column widths for summary
      wsSummary['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 10 }]
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan')

      // Sheet 2: Detail Lengkap
      const wsDetail = XLSX.utils.json_to_sheet(data)
      // Set column widths for detail
      wsDetail['!cols'] = [
        { wch: 5 },  // No
        { wch: 25 }, // Nama
        { wch: 10 }, // Jenjang
        { wch: 8 },  // Kelas
        { wch: 18 }, // Skor
        { wch: 18 }, // Fase
        { wch: 8 },  // Vokal
        { wch: 8 },  // Diksi
        { wch: 10 }, // Sintaksis
        { wch: 8 },  // Logika
        { wch: 8 },  // Ejaan
        { wch: 12 }, // Jumlah Kata
        { wch: 16 }, // Kesalahan Ejaan
        { wch: 16 }, // Kesalahan Kapital
        { wch: 40 }, // Analisis Bunyi
        { wch: 40 }, // Analisis Komunikasi
        { wch: 40 }, // Analisis Wacana
        { wch: 50 }, // Feedback
        { wch: 50 }, // URL Gambar
        { wch: 20 }, // Tanggal
      ]
      XLSX.utils.book_append_sheet(wb, wsDetail, 'Detail Siswa')

      XLSX.writeFile(wb, `Rekap_Asesmen_Inkata_${activeClass.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`)
    } catch (error) {
      console.error("Gagal mengekspor Excel", error)
      alert("Maaf, terjadi kesalahan saat menyusun dokumen Excel.")
    } finally {
      setIsExportingExcel(false)
    }
  }

  const handleSync = () => {
    setIsSyncing(true)
    // Trigger re-fetch dari database
    window.location.reload()
  }

  const getPhaseStyle = (phase: string) => {
    const p = phase.toLowerCase()
    if (p.includes('wacana')) return 'bg-[#F0F5FF] text-[#1D4ED8] border-[#1D4ED8]/10'
    if (p.includes('komunikasi')) return 'bg-orange-50 text-orange-600 border-orange-100'
    if (p.includes('bunyi')) return 'bg-slate-100 text-slate-600 border-slate-200'
    return 'bg-slate-50 text-slate-400 border-slate-100'
  }

  const getAvatarColor = (phase: string) => {
    const p = phase.toLowerCase()
    if (p.includes('wacana')) return 'bg-[#1D4ED8] shadow-[#1D4ED8]/20'
    if (p.includes('komunikasi')) return 'bg-orange-500 shadow-orange-500/20'
    if (p.includes('bunyi')) return 'bg-slate-400 shadow-slate-400/20'
    return 'bg-slate-300 shadow-slate-300/20'
  }

  return (
    <div className="bg-[#F8FAFC]/50 font-manrope pt-20 text-slate-900 antialiased pb-32 min-h-screen">
      <main className="max-w-[1200px] mx-auto px-8 py-10">
        <section className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="max-w-2xl">
              <span className="font-extrabold text-[10px] tracking-[0.2em] uppercase text-[#1D4ED8] mb-3 block">Laporan Deskriptif Sentral</span>
              <h1 className="text-4xl md:text-[40px] font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6 flex items-center gap-3">
                Analitik Eksekutif 
                <img src="/inkata-logo.png" alt="Inkata. Logo" className="h-10 w-auto object-contain" />
              </h1>
              
              <div className="flex items-center gap-4">
                <span className="font-extrabold text-[11px] text-slate-400 uppercase tracking-widest">Ruang Analisis:</span>
                <select 
                  value={activeClass}
                  onChange={(e) => setActiveClass(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-800 font-extrabold text-[11px] uppercase tracking-widest px-5 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 cursor-pointer hover:border-[#1D4ED8]/30 transition-all appearance-none pr-10 relative shadow-[0_10px_20px_rgba(0,0,0,0.02)]"
                >
                  <option value="Semua Kelas">Seluruh Institusi</option>
                  {classOptions.map(room => (
                    <option key={room} value={room}>Kelas {room}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto flex-wrap">
              {/* Excel Export Button */}
              <button 
                onClick={handleExportExcel}
                disabled={isExportingExcel || filteredStudents.length === 0}
                className="flex flex-1 md:flex-none items-center justify-center gap-3 px-6 py-4 rounded-full bg-emerald-600 text-white font-extrabold text-[11px] uppercase tracking-widest hover:bg-emerald-700 shadow-[0_10px_20px_rgba(16,185,129,0.2)] transition-all disabled:opacity-50 active:scale-95"
              >
                {isExportingExcel ? <span className="material-symbols-outlined text-[18px] animate-spin">sync</span> : <span className="material-symbols-outlined text-[18px]">table_chart</span>}
                {isExportingExcel ? 'MENYUSUN...' : 'EXCEL KOLEKTIF'}
              </button>
              {/* PDF Export Button */}
              <button 
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex flex-1 md:flex-none items-center justify-center gap-3 px-6 py-4 rounded-full bg-white border border-slate-200 text-slate-600 font-extrabold text-[11px] uppercase tracking-widest hover:bg-slate-50 shadow-[0_10px_20px_rgba(0,0,0,0.02)] transition-all disabled:opacity-50"
              >
                {isExporting ? <span className="material-symbols-outlined text-[18px] animate-spin">sync</span> : <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>} 
                {isExporting ? 'MENYUSUN...' : 'PDF VISUAL'}
              </button>
              {/* WhatsApp Share */}
              <button 
                onClick={() => window.open(`https://wa.me/?text=Halo%20Bapak%2FIbu%2C%20ini%20adalah%20Laporan%20Kolektif%20Analisa%20Sistem%20Inkata.%20dari%20sekolah.%20%5BLink_Laporan%5D`, '_blank')}
                className="flex flex-1 md:flex-none items-center justify-center gap-3 px-6 py-4 rounded-full bg-[#25D366]/10 text-[#1DA851] font-extrabold text-[11px] uppercase tracking-widest shadow-[0_4px_14px_rgba(37,211,102,0.15)] hover:bg-[#25D366]/20 transition-all border border-[#25D366]/30"
              >
                <span className="material-symbols-outlined text-[18px]">share</span> TRANSMISI WA
              </button>
            </div>
          </div>
        </section>
        
        <div ref={reportRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#F8FAFC]/50 p-2 rounded-2xl">
          <div className="lg:col-span-4 space-y-8">
            {/* Distribution Chart */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-slate-100 transition-transform">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-8">Distribusi Kefasihan Literasi</h3>
              <div className="relative w-full aspect-square flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[24px] border-slate-50 transition-all"></div>
                {pctWacana > 0 && <div className="absolute inset-0 rounded-full border-[24px] border-[#1D4ED8] border-r-transparent border-b-transparent border-l-transparent rotate-[45deg] transition-all"></div>}
                {pctKomunikasi > 0 && <div className="absolute inset-0 rounded-full border-[24px] border-emerald-500 border-t-transparent border-r-transparent border-b-transparent rotate-[160deg] transition-all"></div>}
                <div className="text-center">
                  <span className="block text-6xl font-extrabold text-slate-900 tracking-tighter mb-1">{totalFiltered}</span>
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">Populasi Filter</span>
                </div>
              </div>
              <div className="mt-12 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#1D4ED8] shadow-sm"></div>
                    <span className="text-slate-600 font-extrabold text-sm">Fase Wacana</span>
                  </div>
                  <span className="font-extrabold text-slate-900 text-lg">{pctWacana}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm"></div>
                    <span className="text-slate-600 font-extrabold text-sm">Fase Komunikasi</span>
                  </div>
                  <span className="font-extrabold text-slate-900 text-lg">{pctKomunikasi}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-3.5 h-3.5 rounded-full bg-slate-300 shadow-sm"></div>
                    <span className="text-slate-600 font-extrabold text-sm">Fase Bunyi</span>
                  </div>
                  <span className="font-extrabold text-slate-900 text-lg">{pctBunyi}%</span>
                </div>
              </div>
            </div>
            
            {/* AI Insight Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 border border-slate-800 shadow-xl overflow-hidden relative group">
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex border border-white/10 items-center justify-center text-white">
                    <span className="material-symbols-outlined text-2xl">lightbulb</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight">Diagnostik Sentral Sistem</h3>
                </div>
                <p className="text-white/80 leading-relaxed mb-8 text-[13px] font-medium">
                  {assessedStudents.length > 0 ? (
                    <>
                      Dari <span className="text-white font-extrabold">{assessedStudents.length}</span> siswa yang telah diasesmen, 
                      rata-rata skor mencapai <span className="text-white font-extrabold">{avgScore}%</span>. 
                      {phaseBunyi > 0 && <> Terdapat <span className="text-white font-extrabold">{phaseBunyi} siswa</span> yang masih di Fase Bunyi dan membutuhkan intervensi segera.</>}
                      {phaseWacana > 0 && <> Sebanyak <span className="text-white font-extrabold">{phaseWacana} siswa</span> telah mencapai Fase Wacana.</>}
                    </>
                  ) : (
                    <>Belum ada data asesmen. Mulai pindai tulisan siswa untuk melihat analitik di sini.</>
                  )}
                </p>
                <Link href="/dashboard/students" className="inline-flex py-3 px-6 bg-white text-slate-900 items-center justify-center rounded-full text-[10px] font-extrabold uppercase tracking-widest gap-2 hover:bg-slate-100 transition-colors">
                  Rekomendasi Intervensi
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/3 pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>
            </div>
          </div>
          
          <div className="lg:col-span-8 space-y-8">
            {/* 3 Metric Cards - Real Data */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2rem] shadow-[0_15px_30px_rgba(0,0,0,0.02)] border border-slate-100 transition-all hover:bg-slate-50/50 hover:-translate-y-1 group">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1D4ED8] block mb-4">Rata-rata Vokal</span>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-extrabold text-slate-900 tracking-tighter">{avgVokal}</span>
                  <span className="text-sm font-extrabold text-slate-400">Skor</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-gradient-to-r from-[#1D4ED8] to-cyan-500 rounded-full group-hover:w-[85%] transition-all duration-1000 delay-100" style={{ width: `${avgVokal}%` }}></div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-[0_15px_30px_rgba(0,0,0,0.02)] border border-slate-100 transition-all hover:bg-slate-50/50 hover:-translate-y-1 group">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1D4ED8] block mb-4">Rata-rata Diksi</span>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-extrabold text-slate-900 tracking-tighter">{avgDiksi}</span>
                  <span className="text-sm font-extrabold text-slate-400">Skor</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-gradient-to-r from-[#1D4ED8] to-emerald-500 rounded-full group-hover:w-[90%] transition-all duration-1000 delay-200" style={{ width: `${avgDiksi}%` }}></div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-[0_15px_30px_rgba(0,0,0,0.02)] border border-slate-100 transition-all hover:bg-slate-50/50 hover:-translate-y-1 group">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1D4ED8] block mb-4">Rata-rata Sintaksis</span>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-extrabold text-slate-900 tracking-tighter">{avgSintaksis}</span>
                  <span className="text-sm font-extrabold text-slate-400">Skor</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-gradient-to-r from-[#1D4ED8] to-purple-500 rounded-full group-hover:w-[96%] transition-all duration-1000 delay-300" style={{ width: `${avgSintaksis}%` }}></div>
                </div>
              </div>
            </div>
            
            {/* Students Data Table - Real Data */}
            <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
              <div className="px-10 py-8 flex justify-between items-center border-b border-slate-100 flex-wrap gap-4">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Laporan Matriks Performa Individu ({activeClass})</h3>
                <div className="flex gap-2">
                  <span className="px-4 py-2 bg-[#F0F5FF] text-[#1D4ED8] text-[9px] uppercase tracking-widest font-extrabold rounded-full">{assessedStudents.length} Telah Dinilai</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-16 text-center">
                    <div className="w-8 h-8 border-4 border-[#1D4ED8]/30 border-t-[#1D4ED8] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[10px] font-extrabold text-slate-400 tracking-[0.2em] uppercase">Memuat Data Brankas</p>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="p-16 text-center text-slate-400 font-bold text-sm">Tidak ada data siswa.</div>
                ) : (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left text-[10px] font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-100 bg-slate-50/50">
                        <th className="px-10 py-6">Identitas</th>
                        <th className="px-6 py-6">Kelas</th>
                        <th className="px-6 py-6">Skor</th>
                        <th className="px-6 py-6">Vokal</th>
                        <th className="px-6 py-6">Diksi</th>
                        <th className="px-6 py-6">Sintaksis</th>
                        <th className="px-6 py-6">Salah Ejaan</th>
                        <th className="px-6 py-6">Salah Kapital</th>
                        <th className="px-6 py-6">Jumlah Kata</th>
                        <th className="px-10 py-6 text-right">Fase</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-slate-50 transition-colors group border-b border-slate-100/50">
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-[11px] text-white shadow-sm ${getAvatarColor(student.phase)}`}>
                                {student.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-extrabold text-slate-900 block">{student.name}</span>
                                {student.image_url && (
                                  <a href={student.image_url} target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold text-[#1D4ED8] hover:underline uppercase tracking-wider">Lihat Tulisan →</a>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6 font-bold text-slate-500 text-xs">{student.room}</td>
                          <td className="px-6 py-6">
                            <span className={`font-extrabold text-lg ${student.score >= 80 ? 'text-[#1D4ED8]' : student.score >= 50 ? 'text-orange-500' : student.score > 0 ? 'text-red-500' : 'text-slate-300'}`}>
                              {student.score > 0 ? student.score : '—'}
                            </span>
                          </td>
                          <td className="px-6 py-6 font-extrabold text-slate-600">{student.score > 0 ? student.vokal : '—'}</td>
                          <td className="px-6 py-6 font-extrabold text-slate-600">{student.score > 0 ? student.diksi : '—'}</td>
                          <td className="px-6 py-6 font-extrabold text-slate-600">{student.score > 0 ? student.sintaksis : '—'}</td>
                          <td className="px-6 py-6">
                            {student.score > 0 ? (
                              <span className={`font-extrabold ${student.error_ejaan > 5 ? 'text-red-500' : student.error_ejaan > 2 ? 'text-orange-500' : 'text-emerald-500'}`}>
                                {student.error_ejaan}
                              </span>
                            ) : '—'}
                          </td>
                          <td className="px-6 py-6">
                            {student.score > 0 ? (
                              <span className={`font-extrabold ${student.error_kapital > 5 ? 'text-red-500' : student.error_kapital > 2 ? 'text-orange-500' : 'text-emerald-500'}`}>
                                {student.error_kapital}
                              </span>
                            ) : '—'}
                          </td>
                          <td className="px-6 py-6 font-extrabold text-slate-600">{student.score > 0 ? student.jumlah_kata : '—'}</td>
                          <td className="px-10 py-6 text-right">
                            <span className={`px-4 py-2 font-extrabold rounded-full text-[9px] uppercase tracking-widest border ${getPhaseStyle(student.phase)}`}>
                              {student.phase}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              {!loading && filteredStudents.length > 0 && (
                <div className="p-6 bg-slate-50 border-t border-slate-100 text-center flex justify-between items-center px-10">
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                    {filteredStudents.length} siswa • {assessedStudents.length} sudah dinilai • Rata-rata {avgScore}%
                  </span>
                  <button 
                    onClick={handleExportExcel} 
                    disabled={isExportingExcel}
                    className="text-[#1D4ED8] font-extrabold text-[10px] uppercase tracking-widest hover:text-[#1E40AF] transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    Download Rekap Excel
                  </button>
                </div>
              )}
            </div>
            
            <div className="pt-6">
              <button 
                onClick={handleSync}
                disabled={isSyncing}
                className={`w-full text-white py-6 rounded-[2rem] font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all group ${isSyncing ? 'bg-emerald-500 hover:scale-100 opacity-90' : 'bg-[#1D4ED8] shadow-md hover:shadow-lg hover:-translate-y-1 active:scale-[0.98]'}`}
              >
                {isSyncing ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
                    MENYINKRONKAN JARINGAN INKATA...
                  </>
                ) : (
                  <>
                    Otorisasi Rekapitulasi Sinkronik
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
