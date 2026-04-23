'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Trash2 } from 'lucide-react'

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    let schoolId = null;
    if (user) {
      const { data: teacher } = await supabase.from('teachers').select('school_id').eq('id', user.id).single()
      if (teacher) schoolId = teacher.school_id;
    }

    let query = supabase
       .from('students')
       .select(`*, assessments:assessments(score)`)
       .order('created_at', { ascending: false })
       
    if (schoolId) query = query.eq('school_id', schoolId)
    
    const { data: dbStudents, error } = await query
    
    if (dbStudents) {
       const mapped = dbStudents.map(s => {
          const score = (s.assessments && s.assessments.length > 0) ? s.assessments[s.assessments.length-1].score : 0;
          return {
             ...s,
             proficiency: score,
             classGroup: `Kelas ${s.room}`
          }
       })
       setStudents(mapped)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Peringatan Eksekutif: Anda yakin ingin menghapus data siswa ${name}? Data penilaian yang terkait akan musnah selamanya.`)) {
      setLoading(true)
      const supabase = createClient()
      const { error } = await supabase.from('students').delete().eq('id', id)
      if (!error) {
         setStudents(students.filter(s => s.id !== id))
         alert("Data berhasil terhapus dari Brankas Nasional.")
      } else {
         alert("Terjadi kesalahan penghapusan.")
      }
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(s => 
     s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     s.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="bg-[#F8FAFC]/50 min-h-screen font-manrope pt-20 pb-24 md:pb-0">
      <main className="max-w-[1200px] mx-auto px-8 py-10">
        {/* Header Section */}
        <section className="mb-10">
          <p className="text-[#1D4ED8] font-extrabold text-[10px] tracking-[0.2em] mb-2 uppercase">Manajemen Data Inkata.</p>
          <h2 className="text-4xl md:text-[40px] font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-3">Profil Peserta Didik</h2>
          <p className="text-slate-500 text-sm font-medium max-w-2xl">Pantau progresi literasi secara waktu nyata dan kategorisasikan hasil evaluasi institusi Anda.</p>
        </section>

        {/* Search and Filter Bar */}
        <section className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 shadow-[0_10px_20px_rgba(0,0,0,0.02)] rounded-[1.5rem] focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition-all text-sm font-bold text-slate-800 placeholder:text-slate-400 outline-none" 
               placeholder="Cari berdasarkan nama atau NIS identitas..." 
               type="text"
            />
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-100 shadow-[0_10px_20px_rgba(0,0,0,0.02)] rounded-[1.5rem] text-slate-700 text-[10px] font-extrabold uppercase tracking-widest hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-lg">filter_list</span>
              Semua Kelas
            </button>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Student List */}
          <div className="lg:col-span-8 space-y-4">
            
            {loading ? (
               <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm text-center font-bold text-slate-400 animate-pulse">Menghubungkan Jaringan Inkata...</div>
            ) : filteredStudents.length === 0 ? (
               <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm text-center font-bold text-slate-400">Tidak ada data peserta didik yang cocok.</div>
            ) : filteredStudents.map((student: any) => {
              const isFluent = student.proficiency >= 80;
              const isDeveloping = student.proficiency >= 50 && student.proficiency < 80;
              
              const bgContainer = isFluent ? "bg-[#F0F5FF] text-[#1D4ED8]" : isDeveloping ? "bg-orange-50 text-orange-600" : "bg-slate-50 text-slate-500";
              const statusText = student.proficiency === 0 ? "Belum Dinilai" : (isFluent ? "Fase Wacana" : isDeveloping ? "Fase Komunikasi" : "Fase Bunyi");
              const barColor = isFluent ? "bg-[#1D4ED8]" : isDeveloping ? "bg-orange-500" : "bg-slate-300";

              return (
                <div key={student.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_15px_30px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center font-extrabold text-[#1D4ED8] uppercase text-sm">
                      {student.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-lg text-slate-900 leading-tight mb-2">{student.name}</h4>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 ${bgContainer} rounded-full text-[9px] font-extrabold uppercase tracking-widest`}>{statusText}</span>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{student.classGroup}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                    <div className="flex items-end gap-1 h-8">
                       {student.proficiency > 0 ? (
                         <>
                           <div className={`w-1.5 ${barColor} rounded-full h-3`}></div>
                           <div className={`w-1.5 ${barColor} rounded-full h-5`}></div>
                           <div className={`w-1.5 ${barColor} rounded-full h-4`}></div>
                           <div className={`w-1.5 ${barColor} rounded-full h-7`}></div>
                           <div className={`w-1.5 ${barColor} rounded-full h-8`}></div>
                         </>
                       ) : (
                         <div className="text-xs font-bold text-slate-300 h-8 flex items-center">Belum ada data</div>
                       )}
                      <span className="text-xs font-extrabold text-slate-700 ml-3">Skor {student.proficiency}%</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDelete(student.id, student.name)}
                        className="px-5 py-2.5 bg-red-50 hover:bg-red-100 rounded-xl text-red-500 transition-colors flex items-center justify-center"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                      <Link href="/assessment">
                        <button className="px-5 py-2.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-xl text-[10px] font-extrabold uppercase tracking-widest shadow-[0_5px_15px_rgba(29,78,216,0.2)] transition-colors">Tes Baru</button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column: Analysis & Actions */}
          <div className="lg:col-span-4 space-y-6">
            {/* Session Quick Categorization */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-slate-100">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                     <span className="material-symbols-outlined">warning</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Atensi Khusus</h3>
               </div>
               
               <p className="text-xs font-bold text-slate-500 leading-relaxed mb-6">Inkata merekomendasikan intervensi literasi pada anak-anak berikut karena berada di ambang batas minimum:</p>
               
               <div className="space-y-4">
                  {students.filter(s => s.proficiency < 50 && s.proficiency > 0).slice(0, 3).map(student => (
                     <div key={student.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex flex-col">
                           <span className="text-sm font-extrabold text-slate-800">{student.name}</span>
                           <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Kelas {student.room}</span>
                        </div>
                        <span className="text-red-500 font-extrabold">{student.proficiency}</span>
                     </div>
                  ))}
               </div>
            </div>

            {/* Insights Bento Card */}
            <div className="bg-[#1D4ED8] p-8 rounded-[2.5rem] text-white overflow-hidden relative group shadow-[0_20px_40px_rgba(29,78,216,0.3)]">
              <div className="relative z-10">
                <img src="/inkata-logo.png" alt="Inkata. Logo" className="h-7 w-auto object-contain mb-3 brightness-0 invert" />
                <p className="text-white/80 text-[13px] font-medium leading-relaxed mb-8">Pemantauan progres dan modifikasi Tabel terhubung dan tersimpan waktu nyata pada Supabase Database.</p>
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl">
                    <span className="material-symbols-outlined text-[24px]">leaderboard</span>
                  </div>
                  <Link href="/assessment/analysis">
                     <button className="text-[10px] font-extrabold uppercase tracking-widest border-b-2 border-white/40 hover:border-white transition-all pb-0.5">Tinjau Analitik Server</button>
                  </Link>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
