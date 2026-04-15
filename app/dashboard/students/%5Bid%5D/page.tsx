'use client'

import React from 'react'
import Sidebar from '@/components/ui/sidebar'
import { 
  X, 
  Mic, 
  MessageSquare, 
  BookOpen, 
  Lightbulb, 
  Settings,
  ChevronLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function StudentReportPage() {
  const metrics = [
    { label: 'Bunyi', icon: Mic, score: 92, desc: 'Kemampuan artikulasi dan identifikasi fonem berada pada level mahir.', color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Komunikasi', icon: MessageSquare, score: 78, desc: 'Interaksi sosial aktif dengan penggunaan kosakata yang tepat dalam konteks.', color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Wacana', icon: BookOpen, score: 84, desc: 'Pemahaman struktur cerita dan narasi yang koheren mulai berkembang pesat.', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ]

  return (
    <div className="min-h-screen bg-[#FBFCFF]">
      <Sidebar />
      <main className="pt-32 px-12 pb-24 max-w-7xl mx-auto flex flex-col items-center">
        {/* Present Presentation Header */}
        <div className="w-full flex justify-between items-center mb-24 px-6 bg-white/70 backdrop-blur-3xl p-8 rounded-[3.5rem] border-2 border-white shadow-2xl shadow-black/[0.05] animate-in slide-in-from-top-10 duration-700 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.02] rounded-bl-[6rem] -z-10 group-hover:scale-110 transition-transform" />
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white p-1 rounded-2xl shadow-xl border-2 border-white transition-all group-hover:rotate-6">
                 <img src="/logo.png" alt="Inkata Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col -gap-0.5">
                 <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none group-hover:text-primary transition-colors">inkata.</h1>
                 <p className="font-black text-slate-300 uppercase text-[8px] tracking-[0.4em] leading-none pt-2">Laporan Analisis Siswa</p>
              </div>
           </div>
           <Button variant="outline" className="h-14 rounded-2xl bg-white border-2 border-slate-50 font-black text-slate-500 gap-4 hover:border-primary hover:text-primary transition-all uppercase tracking-[0.4em] text-[8px] px-12 shadow-sm group/btn">
              <X className="w-4 h-4 text-slate-300 group-hover/btn:rotate-90 transition-transform duration-500" /> TUTUP MODE PRESENTASI
           </Button>
        </div>

        {/* Hero Report Header */}
        <div className="w-full flex justify-between items-end mb-24 px-4">
           <div className="space-y-8">
              <p className="text-[10px] font-black uppercase text-[#1D4ED8] tracking-[0.6em] mb-6 px-1">LAPORAN PERKEMBANGAN SISWA</p>
              <h1 className="text-[140px] font-black text-slate-900 leading-[0.8] tracking-tighter">
                Andi <br />
                <span className="text-[#1D4ED8]">Pratama</span>
              </h1>
           </div>

           {/* Score Gauge Card */}
           <div className="lumina-card p-14 bg-white flex items-center gap-12 border-none shadow-[0_60px_120px_-30px_rgba(40,80,237,0.2)] relative transition-all hover:scale-[1.02] rounded-[4rem]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.02] rounded-bl-[8rem] -z-10" />
              <div className="relative w-48 h-48 flex items-center justify-center rotate-[-120deg]">
                 <svg className="w-full h-full">
                    <circle cx="96" cy="96" r="85" fill="none" stroke="#F1F5F9" strokeWidth="14" strokeDasharray="540" strokeLinecap="round" />
                    <circle cx="96" cy="96" r="85" fill="none" stroke="#1D4ED8" strokeWidth="14" strokeDasharray="459 540" strokeLinecap="round" className="drop-shadow-2xl shadow-blue-500/20" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center rotate-[120deg]">
                    <h3 className="text-6xl font-black text-slate-900 leading-none">85</h3>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.5em] mt-3">SKOR</p>
                 </div>
              </div>
              <div className="space-y-6 max-w-xs pr-4">
                 <h4 className="text-4xl font-black text-slate-900 tracking-tighter leading-none border-b-4 border-primary/10 pb-4">Sangat Baik</h4>
                 <p className="text-slate-400 font-bold leading-relaxed text-lg">Andi menunjukkan kemajuan luar biasa dalam struktur kalimat dan artikulasi vokal.</p>
              </div>
           </div>
        </div>

        {/* Metrics Triple Grid */}
        <div className="w-full grid grid-cols-3 gap-12 mb-24 px-4">
           {metrics.map((m, i) => (
              <div key={i} className="lumina-card p-14 bg-white flex flex-col justify-between h-[580px] group transition-all hover:translate-y-[-16px] hover:shadow-[0_80px_120px_-40px_rgba(0,0,0,0.08)] cursor-default relative overflow-hidden rounded-[4rem]">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50/30 rounded-bl-[10rem] -z-10 group-hover:scale-110 transition-transform" />
                 
                 <div className="flex justify-between items-start">
                    <div className={cn("w-24 h-24 rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-2xl transition-all duration-700 group-hover:rotate-12 group-hover:scale-110", m.bg, m.color)}>
                       <m.icon size={42} strokeWidth={2.5} />
                    </div>
                    <h4 className={cn("text-7xl font-black tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity drop-shadow-sm", m.color)}>{m.score}%</h4>
                 </div>

                 <div className="space-y-8 px-2">
                    <h5 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{m.label}</h5>
                    <p className="text-slate-400 font-bold text-xl leading-relaxed pr-4">{m.desc}</p>
                    <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner ring-8 ring-slate-100/10">
                       <div className={cn("h-full rounded-full transition-all duration-1000 shadow-lg", m.color.replace('text', 'bg'))} style={{width: `${m.score}%`}} />
                    </div>
                 </div>
              </div>
           ))}
        </div>

        {/* Footer Insight & Info */}
        <div className="w-full px-4 mb-32 grid grid-cols-3 gap-12 items-stretch">
           <div className="col-span-2 lumina-card p-14 bg-primary shadow-[0_60px_100px_-20px_rgba(40,80,237,0.4)] border-none relative overflow-hidden group rounded-[4rem] transition-all hover:translate-y-[-8px]">
              <div className="absolute top-[-30%] right-[-10%] w-80 h-80 bg-white/10 rounded-full blur-[120px]" />
              <div className="w-24 h-24 bg-white/10 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl border border-white/5 group-hover:scale-125 transition-transform duration-1000">
                 <Lightbulb className="w-12 h-12 animate-pulse text-yellow-300" />
              </div>
              <div className="flex-1 space-y-6 pt-2">
                 <h4 className="text-4xl font-black text-white tracking-tighter">Fokus Bulan Depan</h4>
                 <p className="text-white/80 font-extrabold text-2xl leading-relaxed underline decoration-white/20 decoration-4 underline-offset-8">"Peningkatan kompleksitas kalimat majemuk."</p>
              </div>
           </div>

           <div className="lumina-card p-12 bg-white flex flex-col justify-between border-none shadow-2xl shadow-black/5 rounded-[4rem]">
              <div className="space-y-10">
                 <div className="space-y-3">
                    <p className="text-[11px] font-black uppercase text-slate-200 tracking-[0.5em] leading-none">TANGGAL EVALUASI</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">24 Oktober 2023</p>
                 </div>
                 <div className="space-y-3">
                    <p className="text-[11px] font-black uppercase text-slate-200 tracking-[0.5em] leading-none">GURU PEMBIMBING</p>
                    <p className="text-2xl font-black text-slate-900 underline decoration-primary/20 decoration-4 underline-offset-8 tracking-tight">Siti Aminah, M.Pd</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 pt-10 border-t border-slate-50 mt-12 px-2">
                 <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-lg shadow-blue-500/40" />
                 <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.6em]">HALAMAN 1 DARI 4</p>
              </div>
           </div>
        </div>
      </main>
    </div>
  )
}
