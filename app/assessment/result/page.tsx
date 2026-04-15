'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Printer, Download, ArrowLeft, Building2, UserCircle2, BrainCircuit, CheckCircle2, ChevronRight, Share2 } from 'lucide-react'

export default function AssessmentResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    const savedData = sessionStorage.getItem('inkata_latest_result')
    if (savedData) {
      setResult(JSON.parse(savedData))
    } else {
      // Jika tidak ada data, kembalikan ke pemindai
      router.push('/assessment')
    }
  }, [router])

  const handlePrint = () => {
    window.print()
  }

  if (!result) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]/50">
      <div className="w-8 h-8 border-4 border-[#1D4ED8]/30 border-t-[#1D4ED8] rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="bg-[#F8FAFC]/50 flex justify-center py-10 font-manrope min-h-screen relative">
      
      {/* Tombol Navigasi Desktop Tersembunyi Saat Dicetak */}
      <div className="absolute top-10 left-10 print:hidden z-10 flex gap-4">
        <button onClick={() => router.push('/assessment')} className="bg-white p-4 rounded-full shadow-sm hover:shadow-md transition-shadow flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <div className="absolute top-10 right-10 print:hidden z-10 flex gap-4">
        <button className="bg-white p-4 rounded-full shadow-sm hover:shadow-md transition-shadow flex items-center justify-center text-slate-400 hover:text-[#1D4ED8]">
          <Share2 className="w-5 h-5" />
        </button>
        <button onClick={handlePrint} className="bg-[#1D4ED8] text-white px-8 py-4 rounded-full shadow-[0_10px_25px_rgba(29,78,216,0.3)] hover:shadow-[0_15px_35px_rgba(29,78,216,0.4)] transition-all font-extrabold text-xs uppercase tracking-widest flex items-center gap-3 active:scale-95">
          <Download className="w-4 h-4" /> Export Document
        </button>
      </div>

      {/* Rangka Dokumen - A4 Size Simulation */}
      <div className="bg-white lg:w-[800px] w-full min-h-[1100px] shadow-[0_30px_60px_rgba(0,0,0,0.06)] rounded-[3rem] print:shadow-none print:rounded-none relative overflow-hidden print:w-full print:min-h-screen">
        
        {/* Kop Surat Header */}
        <div className="px-12 py-10 border-b border-slate-100 flex justify-between items-center bg-white print:bg-white relative z-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-[#F0F5FF] rounded-2xl flex items-center justify-center text-[#1D4ED8]">
                <Building2 className="w-6 h-6" />
             </div>
             <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">SD Pelita Harapan Bangsa</h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">Sistem Evaluasi Literasi Inkata.</p>
             </div>
          </div>
          <div className="text-right">
             <h2 className="text-3xl font-extrabold tracking-tighter text-[#1D4ED8]">Inkata<span className="text-slate-900 text-sm align-super ml-1">.v2.2</span></h2>
          </div>
        </div>

        {/* Info Siswa Metadata */}
        <div className="px-12 py-10">
          <div className="flex justify-between items-end mb-8 border-b border-slate-50 pb-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                 <UserCircle2 className="w-8 h-8 text-slate-300" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">{result.studentName}</h2>
                <div className="flex gap-4">
                  <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-md">ID: {result.nis}</span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-md">{result.classGroup}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Tanggal Evaluasi</p>
              <p className="text-sm font-bold text-slate-800">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <p className="text-center text-[10px] uppercase tracking-[0.3em] font-extrabold text-slate-400 mt-12 mb-8">Hasil Diagnostik Utama</p>

          {/* Nilai Utama Scorecard */}
          <div className="flex gap-6 mb-12">
            <div className="flex-1 bg-[#F0F5FF]/50 border border-blue-50 rounded-[2rem] p-8 text-center print:bg-[#F0F5FF]">
               <p className="text-[10px] font-extrabold tracking-widest uppercase text-[#1D4ED8]/60 mb-2">Nilai Akurasi Optik</p>
               <h3 className="text-6xl font-extrabold tracking-tighter text-[#1D4ED8]">{result.score}<span className="text-2xl text-[#1D4ED8]/50">%</span></h3>
            </div>
            <div className="flex-[1.5] bg-slate-50 rounded-[2rem] p-8 flex flex-col justify-center border border-slate-100 print:bg-slate-50">
               <p className="text-[10px] font-extrabold tracking-widest uppercase text-slate-400 mb-2">Fase Kemampuan Literasi</p>
               <h3 className="text-4xl font-extrabold tracking-tight text-slate-900">{result.phase}</h3>
               
               <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-6 flex">
                 <div className="h-full bg-slate-300 w-1/3"></div>
                 <div className="h-full bg-slate-400 w-1/3"></div>
                 <div className="h-full bg-[#1D4ED8] w-[25%] relative shadow-[0_0_10px_rgba(29,78,216,0.5)]"></div>
               </div>
            </div>
          </div>

          {/* Rincian Evaluasi Sistem */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <BrainCircuit className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-extrabold text-slate-900">Umpan Balik Intelegensi Eksekutif</h3>
            </div>
            
            <div className="space-y-4">
              {result.feedback && result.feedback.map((feed: string, idx: number) => (
                <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
                   <div className="w-8 h-8 rounded-full bg-[#F0F5FF] text-[#1D4ED8] flex shrink-0 items-center justify-center font-extrabold text-xs">
                     {idx + 1}
                   </div>
                   <p className="text-sm text-slate-600 font-medium leading-relaxed pt-1.5">{feed}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Status Penilaian */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-center justify-between mt-12 print:bg-emerald-50">
             <div className="flex items-center gap-4">
               <CheckCircle2 className="w-8 h-8 text-emerald-500" />
               <div>
                  <h4 className="text-emerald-900 font-extrabold">Terverifikasi Mesin Pusat</h4>
                  <p className="text-emerald-700/70 text-xs font-medium mt-1">Dokumen ini dikeluarkan oleh Sistem Intelegensi Inkata. sah secara komputasi algoritmik.</p>
               </div>
             </div>
             
             {result.score >= 80 && (
               <Link href="/dashboard/awards" className="print:hidden">
                 <button className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 px-6 py-3 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2">
                   Cetak Sertifikat
                   <ChevronRight className="w-3 h-3" />
                 </button>
               </Link>
             )}
          </div>

        </div>
        
        {/* Footer Area Laporan */}
        <div className="absolute bottom-10 left-12 right-12 z-10 border-t border-slate-100 pt-6 flex justify-between items-center print:border-slate-200">
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Dicetak otomatis dari Lensa Inkata.</p>
           <div className="flex gap-1.5">
             <div className="w-6 h-1 bg-[#1D4ED8] rounded-full"></div>
             <div className="w-2 h-1 bg-slate-300 rounded-full"></div>
             <div className="w-2 h-1 bg-slate-300 rounded-full"></div>
           </div>
        </div>

        {/* Ambient Decorative Graphic Print Safe */}
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#1D4ED8]/[0.02] rounded-full pointer-events-none z-0 print:hidden"></div>

      </div>
    </div>
  )
}
