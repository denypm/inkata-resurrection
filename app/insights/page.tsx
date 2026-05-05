'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/ui/sidebar'
import { 
  Download, 
  ArrowRight, 
  BarChart3, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  CircleDot,
  FileText,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSubscription } from '@/lib/hooks/useSubscription'
import UpgradeOverlay from '@/components/ui/upgrade-overlay'
import PulseLogo from '@/components/ui/pulse-logo'
import { createClient } from '@/lib/supabase/client'

type StudentInsight = {
  id: string
  name: string
  initials: string
  score: number
  phase: string
  vokal: number
  diksi: number
  sintaksis: number
  coherence: string
  comprehension: string
  vocabulary: string
  status: string
  color: string
  bg: string
}

export default function InsightsSnapshotPage() {
  const { isEnterprise, loading: subLoading } = useSubscription()
  const [students, setStudents] = useState<StudentInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [totalStudents, setTotalStudents] = useState(0)
  const [assessedCount, setAssessedCount] = useState(0)
  const [avgCoherence, setAvgCoherence] = useState(0)
  const [avgComprehension, setAvgComprehension] = useState(0)
  const [avgVocabulary, setAvgVocabulary] = useState(0)
  const [pctMaher, setPctMaher] = useState(0)
  const [pctFasih, setPctFasih] = useState(0)
  const [pctBerkembang, setPctBerkembang] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: teacher } = await supabase.from('teachers').select('school_id').eq('id', user.id).single()
      if (!teacher?.school_id) { setLoading(false); return }

      const { data: studentsData } = await supabase
        .from('students')
        .select(`*, assessments:assessments(score, insights)`)
        .eq('school_id', teacher.school_id)

      if (studentsData) {
        const total = studentsData.length
        setTotalStudents(total)

        const formatted: StudentInsight[] = studentsData.map((s: any) => {
          const hasAssessment = s.assessments && s.assessments.length > 0
          const latest = hasAssessment ? s.assessments[s.assessments.length - 1] : null
          const insights = latest?.insights || {}
          const score = latest?.score || 0

          const vokal = insights.vokal ?? 0
          const diksi = insights.diksi ?? 0
          const sintaksis = insights.sintaksis ?? 0
          const logika = insights.logika ?? 0
          const ejaan = insights.ejaan ?? 0

          // Compute readable metrics
          const coherence = sintaksis > 0 ? sintaksis : 0
          const comprehension = logika > 0 ? logika : 0
          const vocabulary = diksi > 0 ? diksi : 0

          const isFasih = score >= 80
          const isDeveloping = score >= 50 && score < 80

          return {
            id: s.id,
            name: s.name,
            initials: s.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
            score,
            phase: insights.fase_saat_ini || 'Belum Dinilai',
            vokal, diksi, sintaksis,
            coherence: coherence > 0 ? `${coherence}%` : '—',
            comprehension: comprehension > 0 ? `${comprehension}%` : '—',
            vocabulary: vocabulary > 0 ? `${vocabulary}%` : '—',
            status: score === 0 ? 'BELUM DINILAI' : (isFasih ? 'FASIH' : isDeveloping ? 'BUTUH TINDAKAN' : 'KRITIS'),
            color: score === 0 ? 'text-slate-400' : (isFasih ? 'text-[#1D4ED8]' : isDeveloping ? 'text-orange-500' : 'text-red-500'),
            bg: score === 0 ? 'bg-slate-50' : (isFasih ? 'bg-[#1D4ED8]/5' : isDeveloping ? 'bg-orange-50' : 'bg-red-50'),
          }
        })

        setStudents(formatted)

        // Calculate aggregates
        const assessed = formatted.filter(s => s.score > 0)
        setAssessedCount(assessed.length)

        if (assessed.length > 0) {
          const avgC = Math.round(assessed.reduce((sum, s) => sum + s.sintaksis, 0) / assessed.length)
          const avgCo = Math.round(assessed.reduce((sum, s) => sum + (s.score), 0) / assessed.length)
          const avgV = Math.round(assessed.reduce((sum, s) => sum + s.diksi, 0) / assessed.length)
          setAvgCoherence(avgC)
          setAvgComprehension(avgCo)
          setAvgVocabulary(avgV)

          const maher = assessed.filter(s => s.score >= 80).length
          const fasih = assessed.filter(s => s.score >= 50 && s.score < 80).length
          const berkembang = assessed.filter(s => s.score < 50).length
          setPctMaher(Math.round((maher / total) * 100))
          setPctFasih(Math.round((fasih / total) * 100))
          setPctBerkembang(Math.round((berkembang / total) * 100))
        }
      }

      setLoading(false)
    }
    fetchData()
  }, [])

  // Top 3 assessed students for detailed view
  const topStudents = students.filter(s => s.score > 0).slice(0, 3)

  return (
    <div className="min-h-screen bg-[#FBFCFF]">
      <Sidebar />
      <main className="pt-32 px-12 pb-24 max-w-7xl mx-auto relative min-h-screen">
        {(loading || subLoading) ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
            <PulseLogo />
          </div>
        ) : !isEnterprise ? (
          <UpgradeOverlay />
        ) : null}

        <div className={cn("transition-all duration-1000", (!isEnterprise && !loading && !subLoading) && "blur-md pointer-events-none opacity-50 grayscale")}>
          {/* Header Section */}
          <div className="flex justify-between items-end mb-24 px-2">
            <div className="space-y-6">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.5em] mb-4">ASESMEN TENGAH SEMESTER</p>
              <h2 className="text-[110px] font-black text-slate-900 mb-6 tracking-tighter leading-[0.8]">Potret <br /> <span className="text-[#1D4ED8]">Literasi Kelas.</span></h2>
            </div>
            <Button variant="outline" className="h-20 rounded-[3rem] bg-white border-2 border-slate-50 font-black text-xs gap-4 shadow-sm hover:text-primary transition-all px-14 uppercase tracking-[0.3em] active:scale-95 group">
               <Download className="w-5 h-5 text-slate-300 group-hover:animate-bounce" /> EKSPOR PDF
            </Button>
          </div>

          {/* Global Metrics Column Grid */}
          <div className="grid grid-cols-12 gap-16 mb-24 items-stretch">
             {/* Left: Distribution Circle */}
             <div className="col-span-4 lumina-card p-14 bg-white flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl shadow-black/5">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/[0.02] rounded-bl-[10rem] -z-10 group-hover:scale-110 transition-transform" />
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] mb-16 self-start px-2">CAPAIAN LITERASI SISWA</h3>
                
                <div className="relative w-80 h-80 flex items-center justify-center mb-16 group transition-all duration-1000 rotate-0 hover:rotate-12 cursor-default">
                   <div className="absolute inset-0 rounded-full border-[12px] border-slate-50 shadow-inner" />
                   {pctMaher > 0 && <div className="absolute inset-0 rounded-full border-[12px] border-primary border-r-transparent border-b-transparent -rotate-45 shadow-lg shadow-blue-500/10" />}
                   {pctFasih > 0 && <div className="absolute inset-0 rounded-full border-[12px] border-orange-400 border-l-transparent border-t-transparent rotate-45" />}
                   <div className="text-center">
                      <h4 className="text-8xl font-black text-slate-900 leading-none mb-1 tracking-tighter">{totalStudents}</h4>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">TOTAL SISWA</p>
                   </div>
                </div>

                <div className="w-full space-y-8 px-10">
                   <div className="flex justify-between items-center group/row">
                      <div className="flex items-center gap-4">
                         <div className="w-4 h-4 bg-primary rounded-full group-hover/row:scale-125 transition-transform" />
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Maher (Lanjutan)</span>
                      </div>
                      <span className="text-xl font-black text-slate-900 tracking-tighter">{pctMaher}%</span>
                   </div>
                   <div className="flex justify-between items-center group/row">
                      <div className="flex items-center gap-4">
                         <div className="w-4 h-4 bg-orange-400 rounded-full group-hover/row:scale-125 transition-transform" />
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fasih (Cakap)</span>
                      </div>
                      <span className="text-xl font-black text-slate-900 tracking-tighter">{pctFasih}%</span>
                   </div>
                   <div className="flex justify-between items-center opacity-30 group/row">
                      <div className="flex items-center gap-4">
                         <div className="w-4 h-4 bg-slate-200 rounded-full group-hover/row:scale-125 transition-transform" />
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Berkembang</span>
                      </div>
                      <span className="text-xl font-black text-slate-900 tracking-tighter">{pctBerkembang}%</span>
                   </div>
                </div>
             </div>

             {/* Mid: Stats Row + Insight Card */}
             <div className="col-span-8 space-y-12">
                <div className="grid grid-cols-3 gap-10">
                   {[
                     { label: 'Koherensi Teks (Rata)', value: String(avgCoherence), unit: '%', color: 'text-primary', progress: avgCoherence },
                     { label: 'Pemahaman Komprehensif', value: String(avgComprehension), unit: '%', color: 'text-[#1D4ED8]', progress: avgComprehension },
                     { label: 'Penguasaan Kosakata', value: String(avgVocabulary), unit: '%', color: 'text-primary', progress: avgVocabulary },
                   ].map((stat, i) => (
                      <div key={i} className="lumina-card p-12 bg-white group transition-all hover:bg-white hover:translate-y-[-8px] border-none shadow-xl shadow-black/5">
                         <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-10">{stat.label}</p>
                         <div className="flex items-end gap-3 mb-8">
                            <h4 className="text-6xl font-black text-slate-900 leading-none tracking-tighter">{stat.value}</h4>
                            <span className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-2">{stat.unit}</span>
                         </div>
                         <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner ring-4 ring-slate-100/10">
                            <div className={cn("h-full rounded-full transition-all duration-1000 shadow-md", stat.progress >= 90 ? "bg-emerald-500" : "bg-primary")} style={{width: `${stat.progress}%`}} />
                         </div>
                      </div>
                   ))}
                </div>

                <div className="lumina-card p-14 bg-white flex flex-col justify-between h-[420px] border-none shadow-2xl shadow-black/5 group">
                   <div className="flex justify-between items-start mb-12">
                      <div className="space-y-2">
                         <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Laporan Performa Detail</h3>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mt-4 px-1">ANALISIS COHORT UTAMA</p>
                      </div>
                      <div className="bg-primary/5 text-primary text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest border border-primary/10 shadow-sm animate-pulse">AKTIF</div>
                   </div>
                   
                   <div className="flex-1 w-full space-y-10">
                      <div className="grid grid-cols-12 px-6 text-[10px] font-black uppercase text-slate-300 tracking-[0.4em] mb-4">
                         <div className="col-span-4">NAMA SISWA</div>
                         <div className="col-span-3">KOHERENSI</div>
                         <div className="col-span-2">PEMAHAMAN</div>
                         <div className="col-span-2">KOSAKATA</div>
                         <div className="col-span-1 text-right">STATUS</div>
                      </div>
                      {topStudents.length > 0 ? topStudents.map((st, i) => (
                         <div key={i} className="grid grid-cols-12 px-6 items-center group/row transition-all hover:bg-slate-50/50 py-4 rounded-2xl cursor-default">
                            <div className="col-span-4 flex items-center gap-6">
                               <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-300 uppercase tracking-tighter shadow-inner border border-slate-50 group-hover/row:bg-primary group-hover/row:text-white transition-all duration-500">{st.initials}</div>
                               <p className="text-xl font-black text-slate-800 tracking-tight group-hover/row:text-primary transition-colors">{st.name}</p>
                            </div>
                            <div className="col-span-3 text-lg font-black text-slate-500 tracking-tighter">{st.coherence}</div>
                            <div className="col-span-2 text-lg font-black text-slate-500 tracking-tighter">{st.comprehension}</div>
                            <div className="col-span-2 text-lg font-black text-slate-500 tracking-tighter">{st.vocabulary}</div>
                            <div className="col-span-1 text-right">
                               <span className={cn("text-[8px] font-black tracking-widest uppercase px-4 py-1.5 rounded-lg border shadow-sm", st.bg, st.color, "border-current/20")}>{st.status}</span>
                            </div>
                         </div>
                      )) : (
                        <div className="flex items-center justify-center py-12 text-slate-400 font-bold text-sm">
                          Belum ada data asesmen. Mulai pindai tulisan siswa.
                        </div>
                      )}
                   </div>
                   <div className="mt-12 pt-10 border-t border-slate-50 flex justify-center group cursor-pointer hover:text-primary transition-all">
                      <p className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-200 group-hover:text-primary transition-colors">Tampilkan Seluruh {totalStudents} Siswa <ChevronRight size={16} className="inline ml-2" /></p>
                   </div>
                </div>
             </div>
          </div>

          {/* Footer Actions & Insights */}
          <div className="grid grid-cols-3 gap-16 items-stretch">
             <div className="col-span-2 lumina-card p-14 bg-white flex flex-col justify-between border-2 border-slate-50 shadow-2xl shadow-black/5 relative overflow-hidden group">
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-orange-500/[0.03] rounded-full blur-[100px] -z-10" />
                <div className="flex gap-12 items-start mb-10">
                   <div className="w-24 h-24 bg-orange-50 rounded-[3rem] flex items-center justify-center text-orange-500 shadow-2xl border-6 border-white ring-12 ring-orange-100/10 group-hover:rotate-12 transition-all duration-700">
                      <Sparkles size={48} strokeWidth={2.5} />
                   </div>
                   <div className="flex-1 space-y-6 pt-2">
                      <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none px-1">Wawasan Utama</h3>
                      <p className="text-slate-500 font-bold leading-relaxed text-2xl">
                        {assessedCount > 0 ? (
                          <>
                            "Dari <span className="text-primary font-black underline underline-offset-8">{assessedCount} siswa</span> yang telah dinilai, 
                            rata-rata skor komprehensif mencapai <span className="text-primary font-black">{avgComprehension}%</span>. 
                            {pctBerkembang > 0 && <> Fokus intervensi pada grup <span className="text-orange-500 font-black">Berkembang ({pctBerkembang}%)</span>.</>}"
                          </>
                        ) : (
                          "Belum ada data asesmen yang tersedia. Mulai pindai tulisan siswa untuk melihat wawasan di sini."
                        )}
                      </p>
                   </div>
                </div>
                <Button variant="link" className="self-end font-black text-primary text-[11px] uppercase tracking-[0.4em] gap-4 hover:gap-8 transition-all group-hover:text-blue-700">
                   LIHAT RENCANA INTERVENSI <ArrowRight size={24} className="stroke-[3px]" />
                </Button>
             </div>
             
             <Button className="lumina-card p-14 bg-primary h-full flex flex-col items-center justify-center gap-10 group hover:scale-[1.02] shadow-[0_60px_100px_-20px_rgba(40,80,237,0.4)] border-none transition-all duration-700 relative overflow-hidden">
                <div className="absolute top-[-30%] right-[-30%] w-64 h-64 bg-white/5 rounded-full blur-[80px]" />
                <h3 className="text-5xl font-black text-white tracking-tighter leading-none text-center">Finalisasi dan <br /> Ringkasan</h3>
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-white border-2 border-white/20 group-hover:scale-125 transition-all duration-700">
                   <ArrowRight size={42} strokeWidth={4} className="transition-transform group-hover:translate-x-4" />
                </div>
             </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
