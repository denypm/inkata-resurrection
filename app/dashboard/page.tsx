'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { FileUp, Users, AlertCircle, Trophy, BarChart3, Search, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function DashboardPage() {
  const [userName, setUserName] = useState('Edukator')
  const [dbStudents, setDbStudents] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initDashboard = async () => {
      const supabase = createClient()
      
      // 1. Ekstrak User Name dari Email
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.email) {
        setUserName(user.email.split('@')[0])
      }

      // 2. Tarik Data Nyata Siswa
      const { data: students } = await supabase.from('students').select(`
        *,
        assessments:assessments(score, literacy_phase)
      `)
      
      if (students) {
         // Flatten data agar rapi
         const formatted = students.map(s => {
            const hasAssessment = s.assessments && s.assessments.length > 0;
            const latest = hasAssessment ? s.assessments[s.assessments.length - 1] : null;
            return {
               id: s.id,
               name: s.name,
               grade: s.grade_level,
               room: s.room,
               score: latest ? latest.score : 0,
               phase: latest ? latest.literacy_phase : 'Belum Dinilai'
            }
         })
         setDbStudents(formatted)
      }
      setLoading(false)
    }
    initDashboard()
  }, [])

  // Fungsi Filter
  const filteredStudents = dbStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.room.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeStudentsCount = dbStudents.length
  const atRiskCount = dbStudents.filter(s => s.score < 50 && s.score > 0).length
  const classAvg = activeStudentsCount > 0 
    ? Math.round(dbStudents.reduce((acc, curr) => acc + curr.score, 0) / activeStudentsCount)
    : 0;

  return (
    <div className="min-h-screen bg-white font-manrope pt-12 pb-32 px-8 flex justify-center relative">
      <div className="max-w-[1100px] w-full relative z-10">
        
        {/* Header Region */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12">
          <div>
            <p className="text-slate-400 font-extrabold text-[10px] tracking-[0.2em] mb-2 uppercase">LITERACY SNAPSHOT</p>
            <h1 className="text-[40px] font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Selamat datang,<br />
              <span className="text-[#1D4ED8]">{userName}.</span>
            </h1>
          </div>
          
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-6 py-4 rounded-2xl text-xs uppercase tracking-widest transition-colors border border-slate-200">
              <FileUp className="w-4 h-4" /> CSV IMPORT
            </button>
            <Link href="/assessment">
              <button className="flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold px-8 py-4 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>document_scanner</span> 
                MULAI ASESMEN
              </button>
            </Link>
          </div>
        </div>

        {/* 3 Top Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <p className="text-slate-500 font-extrabold text-[10px] uppercase tracking-widest mb-6">PROFISIENSI KELAS</p>
            <div className="flex items-baseline gap-1 mb-6">
               <span className="text-6xl font-extrabold text-[#1D4ED8] tracking-tighter">{classAvg}</span>
               <span className="text-2xl font-bold text-slate-400">%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
               <div className="bg-[#1D4ED8] h-full rounded-full" style={{ width: `${classAvg}%` }}></div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <p className="text-slate-500 font-extrabold text-[10px] uppercase tracking-widest mb-6">SISWA AKTIF</p>
            <div className="text-6xl font-extrabold text-[#1D4ED8] tracking-tighter mb-4">{activeStudentsCount}</div>
            <p className="text-slate-400 font-medium text-xs mt-auto">Total siswa yang terdaftar di sistem.</p>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <p className="text-slate-500 font-extrabold text-[10px] uppercase tracking-widest mb-6">BUTUH BANTUAN</p>
            <div className="text-6xl font-extrabold text-emerald-600 tracking-tighter mb-4">{atRiskCount}</div>
            <p className="text-slate-400 font-medium text-xs mt-auto">Siswa yang butuh perhatian khusus.</p>
          </div>
        </div>

        {/* 2 Wide Middle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Peringkat Literasi Kelas</h3>
            </div>
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
               <div className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-extrabold flex items-center justify-center text-xs">1</div>
                 <div>
                   <p className="text-sm font-extrabold text-slate-900">Grade 4</p>
                   <p className="text-[10px] text-slate-500 font-medium">20 dari 20 siswa selesai</p>
                 </div>
               </div>
               <div className="text-right">
                 <p className="text-[#1D4ED8] font-extrabold text-lg">80%</p>
                 <p className="text-[8px] font-extrabold text-slate-400 tracking-widest uppercase">Accuracy</p>
               </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-full bg-[#E0E7FF] text-[#1D4ED8] flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Monitor Unggahan Kelas</h3>
            </div>
            <div>
               <div className="flex justify-between items-end mb-3">
                 <p className="text-xs font-extrabold text-slate-900">Grade 4</p>
                 <p className="text-[10px] text-slate-500">100% Selesai</p>
               </div>
               <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                 <div className="bg-[#1D4ED8] h-full rounded-full" style={{ width: '100%' }}></div>
               </div>
            </div>
          </div>
        </div>

        {/* Database Siswa Bawah */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
           <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                 <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Daftar Siswa Lengkap</h2>
                 <p className="text-xs text-slate-500 mt-1">Mengelola repositori penilaian kelas.</p>
              </div>
              
              <div className="relative">
                 <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                 <input 
                   type="text" 
                   placeholder="Cari nama atau kelas..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-full text-xs font-bold w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 transition-all text-slate-800"
                 />
              </div>
           </div>

           <div className="overflow-x-auto">
             {loading ? (
               <div className="p-12 text-center text-slate-400 text-sm font-bold animate-pulse">Memuat data dari brankas...</div>
             ) : filteredStudents.length === 0 ? (
               <div className="p-12 text-center text-slate-400 text-sm font-bold">Tidak ada entitas siswa yang ditemukan.</div>
             ) : (
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-slate-50/50">
                     <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Siswa</th>
                     <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Kelas</th>
                     <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Fase Diagnostik</th>
                     <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Skor</th>
                     <th className="px-8 py-4"></th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {filteredStudents.map((student) => (
                     <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                       <td className="px-8 py-5">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-[#1D4ED8]/10 text-[#1D4ED8] flex items-center justify-center font-extrabold text-[10px]">
                             {student.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                           </div>
                           <span className="font-extrabold text-sm text-slate-800">{student.name}</span>
                         </div>
                       </td>
                       <td className="px-8 py-5">
                         <span className="text-xs font-bold text-slate-500">{student.grade} - {student.room}</span>
                       </td>
                       <td className="px-8 py-5">
                         <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${student.phase === 'Belum Dinilai' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600'}`}>
                           {student.phase}
                         </span>
                       </td>
                       <td className="px-8 py-5">
                         <span className="font-extrabold text-sm text-slate-800">{student.score > 0 ? `${student.score}%` : '—'}</span>
                       </td>
                       <td className="px-8 py-5 text-right">
                         <button className="text-slate-300 hover:text-[#1D4ED8] transition-colors">
                            <ChevronRight className="w-5 h-5" />
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             )}
           </div>
        </div>

      </div>
    </div>
  )
}
