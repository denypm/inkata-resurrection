'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export default function LiteracyAnalysisPage() {
  const [totalStudents, setTotalStudents] = useState(24)
  const [activeClass, setActiveClass] = useState('Semua Kelas')
  const [isExporting, setIsExporting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert("Pemberitahuan Sistem:\n\nProtokol sinkronisasi diotorisasi. Keseluruhan metrik siswa berhasi didorong ke Brankas Inkata Nasional.");
    }, 2500);
  }

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Laporan_Inkata_${activeClass.replace(' ', '_')}.pdf`);
    } catch (error) {
      console.error("Gagal mengekspor PDF", error);
      alert("Maaf, terjadi kesalahan saat menyusun dokumen PDF.");
    } finally {
      setIsExporting(false);
    }
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
                  onChange={(e) => {
                    setActiveClass(e.target.value)
                    setTotalStudents(e.target.value === 'Kelas A' ? 24 : e.target.value === 'Kelas B' ? 21 : e.target.value === 'Kelas C' ? 28 : e.target.value === 'Kelas D' ? 25 : 98)
                  }}
                  className="bg-white border border-slate-200 text-slate-800 font-extrabold text-[11px] uppercase tracking-widest px-5 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 cursor-pointer hover:border-[#1D4ED8]/30 transition-all appearance-none pr-10 relative shadow-[0_10px_20px_rgba(0,0,0,0.02)]"
                >
                  <option value="Semua Kelas">Seluruh Institusi</option>
                  <option value="Kelas A">Grup Kelas 4-A</option>
                  <option value="Kelas B">Grup Kelas 4-B</option>
                  <option value="Kelas C">Grup Kelas 4-C</option>
                  <option value="Kelas D">Grup Kelas 4-D</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <button 
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex flex-1 md:flex-none items-center justify-center gap-3 px-6 py-4 rounded-full bg-white border border-slate-200 text-slate-600 font-extrabold text-[11px] uppercase tracking-widest hover:bg-slate-50 shadow-[0_10px_20px_rgba(0,0,0,0.02)] transition-all disabled:opacity-50"
              >
                {isExporting ? <span className="material-symbols-outlined text-[18px] animate-spin">sync</span> : <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>} 
                {isExporting ? 'MENYUSUN DOKUMEN...' : 'PDF EKSTRAKSI'}
              </button>
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
            <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-slate-100 transition-transform">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-8">Distribusi Kefasihan Literasi</h3>
              <div className="relative w-full aspect-square flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[24px] border-slate-50 transition-all"></div>
                <div className="absolute inset-0 rounded-full border-[24px] border-[#1D4ED8] border-r-transparent border-b-transparent border-l-transparent rotate-[45deg] transition-all"></div>
                <div className="absolute inset-0 rounded-full border-[24px] border-emerald-500 border-t-transparent border-r-transparent border-b-transparent rotate-[160deg] transition-all"></div>
                <div className="text-center">
                  <span className="block text-6xl font-extrabold text-slate-900 tracking-tighter mb-1">{totalStudents}</span>
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">Populasi Filter</span>
                </div>
              </div>
              <div className="mt-12 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#1D4ED8] shadow-sm"></div>
                    <span className="text-slate-600 font-extrabold text-sm">Fase Wacana</span>
                  </div>
                  <span className="font-extrabold text-slate-900 text-lg">42%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm"></div>
                    <span className="text-slate-600 font-extrabold text-sm">Fase Komunikasi</span>
                  </div>
                  <span className="font-extrabold text-slate-900 text-lg">35%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-3.5 h-3.5 rounded-full bg-slate-300 shadow-sm"></div>
                    <span className="text-slate-600 font-extrabold text-sm">Fase Bunyi</span>
                  </div>
                  <span className="font-extrabold text-slate-900 text-lg">23%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-[2.5rem] p-10 border border-slate-800 shadow-xl overflow-hidden relative group">
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex border border-white/10 items-center justify-center text-white">
                    <span className="material-symbols-outlined text-2xl">lightbulb</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight">Diagnostik Sentral Sistem</h3>
                </div>
                <p className="text-white/80 leading-relaxed mb-8 text-[13px] font-medium">
                  Akuisisi struktural wacana telah mencapai lonjakan komprehensif sebesar <span className="text-white font-extrabold">12%</span> pada siklus {activeClass}. Sistem <span className="text-white font-bold">Inkata.</span> merekomendasikan manuver eskalatif untuk para Peserta pada diagnostik "Fase Bunyi".
                </p>
                <Link href="/dashboard/students" className="inline-flex py-3 px-6 bg-white text-slate-900 items-center justify-center rounded-full text-[10px] font-extrabold uppercase tracking-widest gap-2 hover:bg-slate-100 transition-colors">
                  Rekomendasi Intervensi
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/3 pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>
            </div>
          </div>
          
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2rem] shadow-[0_15px_30px_rgba(0,0,0,0.02)] border border-slate-100 transition-all hover:bg-slate-50/50 hover:-translate-y-1 group">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1D4ED8] block mb-4">Matriks Ekstraksi Logis</span>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-extrabold text-slate-900 tracking-tighter">118</span>
                  <span className="text-sm font-extrabold text-slate-400">WPM</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full w-[78%] bg-gradient-to-r from-[#1D4ED8] to-cyan-500 rounded-full group-hover:w-[85%] transition-all duration-1000 delay-100"></div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-[0_15px_30px_rgba(0,0,0,0.02)] border border-slate-100 transition-all hover:bg-slate-50/50 hover:-translate-y-1 group">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1D4ED8] block mb-4">Intelegensi Reseptif</span>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-extrabold text-slate-900 tracking-tighter">84</span>
                  <span className="text-sm font-extrabold text-slate-400">%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full w-[84%] bg-gradient-to-r from-[#1D4ED8] to-emerald-500 rounded-full group-hover:w-[90%] transition-all duration-1000 delay-200"></div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-[0_15px_30px_rgba(0,0,0,0.02)] border border-slate-100 transition-all hover:bg-slate-50/50 hover:-translate-y-1 group">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1D4ED8] block mb-4">Inventaris Kosakata</span>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-extrabold text-slate-900 tracking-tighter">92</span>
                  <span className="text-sm font-extrabold text-slate-400">%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full w-[92%] bg-gradient-to-r from-[#1D4ED8] to-purple-500 rounded-full group-hover:w-[96%] transition-all duration-1000 delay-300"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
              <div className="px-10 py-8 flex justify-between items-center border-b border-slate-100 flex-wrap gap-4">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Laporan Matriks Performa Individu ({activeClass})</h3>
                <div className="flex gap-2">
                  <span className="px-4 py-2 bg-[#F0F5FF] text-[#1D4ED8] text-[9px] uppercase tracking-widest font-extrabold rounded-full">Distribusi Kohort Tertinggi</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left text-[10px] font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-100 bg-slate-50/50">
                      <th className="px-10 py-6">Identitas Peserta Didik</th>
                      <th className="px-6 py-6">Kecepatan Resolusi</th>
                      <th className="px-6 py-6">Pemahaman Struktural</th>
                      <th className="px-6 py-6">Distribusi Leksikal</th>
                      <th className="px-10 py-6 text-right">Penilaian Sistem Inkata.</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="hover:bg-slate-50 transition-colors group border-b border-slate-100/50">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#1D4ED8] flex items-center justify-center font-extrabold text-[11px] text-white shadow-sm shadow-[#1D4ED8]/20">
                             AA
                          </div>
                          <span className="font-extrabold text-slate-900">Ahmad Ahmad</span>
                        </div>
                      </td>
                      <td className="px-6 py-8 font-extrabold text-slate-600">87 <span className="text-[10px] text-slate-400">Skor</span></td>
                      <td className="px-6 py-8 font-extrabold text-slate-600">90<span className="text-[10px] text-slate-400">%</span></td>
                      <td className="px-6 py-8 font-extrabold text-slate-600">90<span className="text-[10px] text-slate-400">%</span></td>
                      <td className="px-10 py-8 text-right">
                        <span className="px-4 py-2 bg-[#F0F5FF] text-[#1D4ED8] font-extrabold rounded-full text-[9px] uppercase tracking-widest border border-[#1D4ED8]/10">Fase Wacana</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors group border-b border-slate-100/50">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-extrabold text-[11px] text-white shadow-sm shadow-orange-500/20">
                            BB
                          </div>
                          <span className="font-extrabold text-slate-900">Budi Budi</span>
                        </div>
                      </td>
                      <td className="px-6 py-8 font-extrabold text-slate-600">65 <span className="text-[10px] text-slate-400">Skor</span></td>
                      <td className="px-6 py-8 font-extrabold text-slate-600">60<span className="text-[10px] text-slate-400">%</span></td>
                      <td className="px-6 py-8 font-extrabold text-slate-600">55<span className="text-[10px] text-slate-400">%</span></td>
                      <td className="px-10 py-8 text-right">
                        <span className="px-4 py-2 bg-orange-50 text-orange-600 font-extrabold rounded-full text-[9px] uppercase tracking-widest border border-orange-100">Fase Komunikasi</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center font-extrabold text-[11px] text-white shadow-sm shadow-slate-400/20">
                            CC
                          </div>
                          <span className="font-extrabold text-slate-900">Caca Caca</span>
                        </div>
                      </td>
                      <td className="px-6 py-8 font-extrabold text-slate-600">45 <span className="text-[10px] text-slate-400">Skor</span></td>
                      <td className="px-6 py-8 font-extrabold text-slate-600">40<span className="text-[10px] text-slate-400">%</span></td>
                      <td className="px-6 py-8 font-extrabold text-slate-600">20<span className="text-[10px] text-slate-400">%</span></td>
                      <td className="px-10 py-8 text-right">
                        <span className="px-4 py-2 bg-slate-100 text-slate-600 font-extrabold rounded-full text-[9px] uppercase tracking-widest border border-slate-200">Fase Bunyi</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                <button className="text-slate-500 font-extrabold text-[10px] uppercase tracking-widest hover:text-[#1D4ED8] transition-colors">Ekspansi {totalStudents} Metrik {activeClass}</button>
              </div>
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
