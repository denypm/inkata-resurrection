'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Award, Download, Printer, Medal, Sparkles, ChevronLeft } from 'lucide-react'

export default function AwardsPage() {
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const certificateRef = useRef<HTMLDivElement>(null)

  const [awardedStudents, setAwardedStudents] = useState<any[]>([])

  React.useEffect(() => {
    const fetchAwarded = async () => {
       const { createClient } = await import('@/lib/supabase/client')
       const supabase = createClient()
       const { data: students } = await supabase.from('students').select(`
         *,
         assessments:assessments(score, insights, created_at)
       `)
       if (students) {
         const formatted = students.map(s => {
            const hasAssessment = s.assessments && s.assessments.length > 0;
            const latest = hasAssessment ? s.assessments[s.assessments.length - 1] : null;
            return {
               id: s.id,
               name: s.name,
               grade: s.grade,
               score: latest ? latest.score : 0,
               phase: latest ? (latest.insights?.fase_saat_ini || 'Belum Dinilai') : 'Belum Dinilai',
               date: latest ? new Date(latest.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'
            }
         }).filter(s => s.phase !== 'Belum Dinilai')
         setAwardedStudents(formatted)
       }
    }
    fetchAwarded()
  }, [])

  const printCertificate = () => {
    window.print()
  }

  return (
    <div className="bg-[#F8FAFC]/50 min-h-screen font-manrope selection:bg-[#1D4ED8]/10 text-slate-800 flex flex-col print:bg-white print:overflow-hidden">
      <main className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-12 pb-24 w-full flex-grow print:p-0 print:border-none print:shadow-none print:max-w-none">
        
        {/* Header App Print Hidden */}
        <div className="flex justify-between items-end mb-12 print:hidden">
          <div>
            <Link href="/dashboard" className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 hover:text-[#1D4ED8] flex items-center gap-1 mb-4 transition-colors">
              <ChevronLeft className="w-3 h-3" /> Beranda Dasbor
            </Link>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-4">
              Brankas Penghargaan <Medal className="w-8 h-8 text-amber-500 fill-amber-500/20" />
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Otomatisasi pembuatan sertifikat untuk peserta didik dengan fase literasi memadai.</p>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
           
           {/* Sidebar List (Browser View Only) */}
           <div className="lg:col-span-4 space-y-4 print:hidden">
             
             <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-50 mb-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                     <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">Portofolio Siswa</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Seluruh Level Kompetensi</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {awardedStudents.map((student, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedStudent(student)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all border ${selectedStudent?.id === student.id ? 'bg-[#F0F5FF] border-[#1D4ED8]/20 shadow-sm' : 'bg-slate-50 border-transparent hover:bg-slate-100 hover:border-slate-200'}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                         <h4 className={`font-extrabold text-sm ${selectedStudent?.id === student.id ? 'text-[#1D4ED8]' : 'text-slate-800'}`}>{student.name}</h4>
                         <span className="text-xs font-black text-amber-500">{student.score}</span>
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{student.date} • {student.phase}</p>
                    </div>
                  ))}
                </div>
             </div>

           </div>

           {/* Canvas Sertifikat (Print View / Preview) */}
           <div className="lg:col-span-8">
              {selectedStudent ? (
                <div className="flex flex-col items-center">
                  <div className="w-full flex justify-end gap-3 mb-6 print:hidden">
                    <button onClick={printCertificate} className="bg-[#1D4ED8] text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all font-extrabold text-[10px] uppercase tracking-widest flex items-center gap-2 active:scale-95">
                       <Printer className="w-4 h-4" /> Export & Cetak
                    </button>
                  </div>

                  {/* Canvas Sertifikat Real A4 Horizontal Frame */}
                  <div ref={certificateRef} className="w-full xl:w-[1050px] aspect-[1.414/1] bg-white rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.1)] print:shadow-none print:w-[1050px] print:h-[742px] print:rounded-none relative overflow-hidden flex flex-col justify-center items-center text-center p-16 print:border-none print:p-16 border border-slate-100">
                     
                     {/* Decorative Borders Modern Abstract */}
                     <div className="absolute top-0 left-0 w-full h-4 bg-[#1D4ED8] z-0"></div>
                     <div className="absolute top-0 right-0 w-4 h-full bg-[#1D4ED8] z-0"></div>
                     <div className="absolute bottom-0 right-0 w-full h-4 bg-amber-500 z-0"></div>
                     <div className="absolute bottom-0 left-0 w-4 h-full bg-amber-500 z-0"></div>

                     {/* Subtle Watermark Drop */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[40px] border-[#F0F5FF]/50 rounded-full z-0 flex items-center justify-center opacity-70">
                       <div className="w-[450px] h-[450px] border-[20px] border-[#F0F5FF]/60 rounded-full"></div>
                     </div>
                     <Sparkles className="absolute top-20 right-20 w-32 h-32 text-amber-50 opacity-50 z-0 rotate-12" />

                     {/* Content Foreground */}
                     <div className="relative z-10 w-full max-w-3xl flex flex-col items-center">
                       
                        <div className="mt-6 mb-16">
                           <img src="/inkata-logo.png" alt="Inkata. Logo" className="h-14 w-auto object-contain" />
                        </div>

                       <h1 className="text-[54px] font-black text-slate-900 tracking-tighter uppercase mb-6 drop-shadow-sm leading-none">
                         Sertifikat Penghargaan
                       </h1>
                       <p className="text-[14px] font-bold uppercase tracking-[0.4em] text-amber-500 mb-12">Level {selectedStudent.phase}</p>

                       <p className="text-slate-500 font-medium text-lg mb-6">Diberikan secara resmi kepada:</p>
                       <h2 className="text-[64px] font-extrabold text-[#1D4ED8] leading-none mb-10 tracking-tight drop-shadow-sm border-b-2 border-slate-200 pb-4 px-12">
                         {selectedStudent.name}
                       </h2>
                       
                       <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed mb-20">
                         Telah menyelesaikan proses pemindaian dan evaluasi literasi cerdas, serta diidentifikasi memiliki 
                         tingkat kompetensi membaca pada <span className="font-extrabold text-slate-800">{selectedStudent.phase}</span>.
                       </p>

                       <div className="flex justify-between items-end w-full px-12 border-t border-slate-100 pt-8 mt-auto">
                          <div className="text-left">
                            <p className="text-sm font-extrabold text-slate-900 mb-1">{selectedStudent.date}</p>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Tanggal Pengesahan Inkata.</p>
                          </div>
                          
                          <div className="w-24 h-24 absolute right-1/4 bottom-14 opacity-90 overflow-hidden transform rotate-[-15deg]">
                            <div className="w-full h-full border-4 border-red-500/80 rounded-full text-red-500/80 flex items-center justify-center flex-col shadow-inner">
                               <p className="text-[8px] font-black uppercase tracking-widest">Validasi</p>
                               <span className="material-symbols-outlined text-xl">verified</span>
                            </div>
                          </div>

                          <div className="text-center w-48">
                            <div className="h-10 border-b-2 border-slate-300 mb-2 content-end">
                               <p className="text-xl text-slate-600 signature-font translate-y-3 font-semibold">System Diagnostics</p>
                            </div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Lensa Intelijen Sistem</p>
                          </div>
                       </div>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-[600px] bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 print:hidden">
                   <Award className="w-16 h-16 text-slate-300 mb-4" />
                   <p className="font-extrabold tracking-tight text-lg text-slate-500">Pilih Peserta Didik</p>
                   <p className="text-sm">Pilih nama di sisi kiri untuk mencetak Sertifikat.</p>
                </div>
              )}
           </div>

        </div>
      </main>
    </div>
  )
}
