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
        <div className="w-full flex justify-between items-center mb-24 px-4 bg-slate-50/50 backdrop-blur-md p-6 rounded-[2rem] border border-slate-100 shadow-sm animate-in slide-in-from-top-10 duration-700">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1D4ED8] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-black">L</div>
              <span className="font-extrabold text-slate-800 tracking-tight">Litera-Sync</span>
           </div>
           <Button variant="outline" className="h-12 rounded-2xl bg-white border-2 border-slate-100 font-extrabold text-slate-500 gap-3 hover:text-primary transition-all uppercase tracking-widest text-xs px-8">
              <X className="w-4 h-4 text-slate-300" /> TUTUP MODE PRESENTASI
           </Button>
        </div>

        {/* Hero Report Header */}
        <div className="w-full flex justify-between items-end mb-24 px-4">
           <div className="space-y-6">
              <p className="text-[10px] font-black uppercase text-[#1D4ED8] tracking-[0.4em] mb-4">LAPORAN PERKEMBANGAN SISWA</p>
              <h1 className="text-[120px] font-black text-slate-900 leading-[0.85] tracking-tighter italic">
                Andi <br />
                <span className="text-[#1D4ED8]">Pratama</span>
              </h1>
           </div>

           {/* Score Gauge Card */}
           <div className="lumina-card p-12 bg-white flex items-center gap-10 border-none shadow-2xl shadow-blue-500/10">
              <div className="relative w-40 h-40 flex items-center justify-center rotate-[-120deg]">
                 <svg className="w-full h-full">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="#F1F5F9" strokeWidth="12" strokeDasharray="440" strokeLinecap="round" />
                    <circle cx="80" cy="80" r="70" fill="none" stroke="#1D4ED8" strokeWidth="12" strokeDasharray="374 440" strokeLinecap="round" className="drop-shadow-lg" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center rotate-[120deg]">
                    <h3 className="text-5xl font-black text-slate-900">85</h3>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">SKOR</p>
                 </div>
              </div>
              <div className="space-y-4 max-w-xs">
                 <h4 className="text-3xl font-black text-slate-900 italic tracking-tight">Sangat Baik</h4>
                 <p className="text-slate-400 font-bold leading-relaxed">Andi menunjukkan kemajuan luar biasa dalam struktur kalimat dan artikulasi vokal.</p>
              </div>
           </div>
        </div>

        {/* Metrics Triple Grid */}
        <div className="w-full grid grid-cols-3 gap-10 mb-20 px-4">
           {metrics.map((m, i) => (
              <div key={i} className="lumina-card p-12 bg-white flex flex-col justify-between h-[520px] group transition-all hover:translate-y-[-10px] hover:shadow-2xl hover:shadow-blue-500/5 cursor-default relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/20 rounded-bl-[6rem] -z-10 group-hover:scale-110 transition-transform" />
                 
                 <div className="flex justify-between items-start">
                    <div className={cn("w-20 h-20 rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-xl transition-all duration-500 group-hover:rotate-6", m.bg, m.color)}>
                       <m.icon className="w-10 h-10" />
                    </div>
                    <h4 className={cn("text-6xl font-black italic tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity", m.color)}>{m.score}%</h4>
                 </div>

                 <div className="space-y-6">
                    <h5 className="text-4xl font-black text-slate-900 tracking-tighter italic">{m.label}</h5>
                    <p className="text-slate-400 font-bold text-lg leading-relaxed">{m.desc}</p>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
                       <div className={cn("h-full rounded-full transition-all duration-1000", m.color.replace('text', 'bg'))} style={{width: `${m.score}%`}} />
                    </div>
                 </div>
              </div>
           ))}
        </div>

        {/* Footer Insight & Info */}
        <div className="w-full px-4 mb-32 grid grid-cols-3 gap-12 items-stretch">
           <div className="col-span-2 lumina-card p-12 bg-primary flex items-start gap-10 relative overflow-hidden group shadow-2xl shadow-primary/30 border-none">
              <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-[100px]" />
              <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center text-white shadow-xl border border-white/5 group-hover:scale-110 transition-transform">
                 <Lightbulb className="w-10 h-10 animate-pulse" />
              </div>
              <div className="flex-1 space-y-4">
                 <h4 className="text-3xl font-black text-white italic tracking-tighter">Fokus Bulan Depan</h4>
                 <p className="text-white/80 font-bold text-xl leading-relaxed italic">"Peningkatan kompleksitas kalimat majemuk."</p>
              </div>
           </div>

           <div className="lumina-card p-12 bg-white flex flex-col justify-between border-2 border-slate-50">
              <div className="space-y-8">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">TANGGAL EVALUASI</p>
                    <p className="text-lg font-black text-slate-800">24 Oktober 2023</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">GURU PEMBIMBING</p>
                    <p className="text-lg font-black text-slate-800 italic underline decoration-primary/20 decoration-4 underline-offset-4">Siti Aminah, M.Pd</p>
                 </div>
              </div>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] self-end flex items-center gap-2">
                 <div className="w-2 h-2 bg-primary/30 rounded-full" /> HALAMAN 1 DARI 4
              </p>
           </div>
        </div>
      </main>
    </div>
  )
}
