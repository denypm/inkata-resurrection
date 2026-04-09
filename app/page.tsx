import React from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, BrainCircuit, ShieldCheck, Globe, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="bg-[#FBFCFF] min-h-screen font-sans selection:bg-primary/10">
      {/* Navigation */}
      <nav className="fixed top-0 w-full p-8 px-16 flex justify-between items-center z-50 backdrop-blur-md bg-white/40 border-b border-slate-50">
        <div className="flex items-center gap-4 group cursor-pointer transition-all hover:scale-110">
          <img src="/logo.png" alt="Inkata Logo" className="w-16 h-16 object-contain shadow-2xl rounded-2xl bg-white border-2 border-white p-1" />
          <div className="flex flex-col -gap-0.5">
             <h1 className="text-2xl font-black text-[#1D4ED8] tracking-tighter leading-none italic">inkata.</h1>
             <p className="text-[7.5px] font-black uppercase text-slate-300 tracking-[0.4em] leading-none">Aplikasi Evaluasi Literasi</p>
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/auth">
            <Button variant="ghost" className="font-black text-slate-400 hover:text-primary tracking-[0.4em] text-[9px] uppercase">LOGIN</Button>
          </Link>
          <div className="w-px h-6 bg-slate-100 mx-2" />
          <Link href="/auth">
             <Button className="bg-[#1D4ED8] hover:bg-[#1E40AF] h-14 rounded-full px-12 font-black uppercase tracking-widest text-[10px] shadow-[0_20px_40px_-10px_rgba(40,80,237,0.4)] transition-all active:scale-95">DAFTAR SEKARANG</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-56 px-16 pb-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="flex items-center gap-4 mb-12 px-8 py-3 bg-white rounded-full border border-slate-100 shadow-xl shadow-black/5 animate-in slide-in-from-top-10 duration-1000">
           <Sparkles className="w-5 h-5 text-[#1D4ED8] animate-pulse" />
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Transformasi Platform Literasi v2.2</p>
        </div>
        
        <h1 className="text-[120px] font-black tracking-tighter text-slate-900 mb-14 leading-[0.8] max-w-6xl italic animate-in slide-in-from-bottom-20 duration-1000 drop-shadow-sm px-4">
          Ubah <br /> <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#1D4ED8] via-[#1E40AF] to-emerald-500">Tulisan Tangan</span> <br /> menjadi Data.
        </h1>
        
        <p className="text-2xl font-bold text-slate-400 max-w-3xl mb-20 leading-relaxed italic animate-in slide-in-from-bottom-24 duration-1000 delay-200">
          Inkata. adalah penyedia infrastruktur asesmen literasi cerdas berbasis AI untuk institusi pendidikan modern di Indonesia. Deteksi hambatan belajar secara prediktif dalam hitungan detik.
        </p>

        <div className="flex gap-8 mb-40 animate-in slide-in-from-bottom-20 duration-1000 delay-500">
           <Link href="/auth">
              <Button className="h-24 px-16 rounded-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-2xl font-black shadow-[0_40px_80px_-20px_rgba(40,80,237,0.5)] gap-6 group transition-all active:scale-95 italic tracking-tighter">
                MULAI ASESMEN SEKARANG <ArrowRight className="w-8 h-8 transition-transform group-hover:translate-x-4 stroke-[3px]" />
              </Button>
           </Link>
        </div>

        {/* Feature Grid with higher fidelity */}
        <div className="grid grid-cols-3 gap-16 text-left w-full mb-32">
           {[
             { label: 'Gemini 1.5 Pro Engine', icon: BrainCircuit, color: 'text-primary', bg: 'bg-primary/5', desc: 'Visi komputer tercanggih untuk akurasi pendeteksian pola tulisan tangan yang belum pernah ada sebelumnya.' },
             { label: 'Infrastruktur Aman', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50', desc: 'Keamanan data murid sekelas perbankan dengan otentikasi multi-tenant yang ketat, terenkripsi, dan berdaulat.' },
             { label: 'Analisis Kolektif', icon: Users, color: 'text-orange-400', bg: 'bg-orange-50', desc: 'Lihat tren literasi tingkat sekolah atau kelas secara utuh untuk pengambilan kebijakan yang lebih objektif.' },
           ].map((feature, i) => (
             <div key={i} className="lumina-card p-14 bg-white flex flex-col justify-between h-[460px] group transition-all hover:bg-white hover:translate-y-[-16px] hover:shadow-[0_80px_120px_-30px_rgba(0,0,0,0.1)] border-none shadow-xl shadow-black/[0.03]">
                <div className={cn("w-20 h-20 rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-2xl transition-all duration-700 group-hover:rotate-12 group-hover:scale-110", feature.bg, feature.color)}>
                   <feature.icon size={42} strokeWidth={2.5} />
                </div>
                <div>
                   <h3 className="text-3xl font-black text-slate-900 mb-8 italic tracking-tighter group-hover:text-primary transition-colors">{feature.label}</h3>
                   <p className="text-slate-400 font-bold leading-relaxed text-lg italic">{feature.desc}</p>
                </div>
             </div>
           ))}
        </div>
      </main>

      {/* Footer Branding with Logo */}
      <footer className="px-16 py-32 border-t border-slate-50 flex flex-col items-center gap-16 bg-white shadow-inner">
         <div className="flex items-center gap-6 group cursor-pointer transition-all hover:scale-110">
            <img src="/logo.png" alt="Inkata Logo" className="w-20 h-20 object-contain shadow-2xl rounded-3xl" />
            <div className="flex flex-col -gap-1">
               <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic leading-none group-hover:text-primary transition-colors">inkata.</h1>
               <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.5em] leading-none pt-4">Aplikasi Evaluasi Literasi Nasional</p>
            </div>
         </div>
         <div className="w-20 h-1.5 bg-primary/20 rounded-full animate-pulse" />
         <p className="text-slate-300 font-black uppercase text-[10px] tracking-[0.8em] text-center px-4">Penyedia Infrastruktur Asesmen Literasi Premium v2.2</p>
         <div className="flex gap-12 font-black text-slate-400 text-[9px] uppercase tracking-widest border-t border-slate-50 pt-16 w-full justify-center">
            <Link href="#" className="hover:text-primary transition-colors shadow-sm">Keamanan</Link>
            <Link href="#" className="hover:text-primary transition-colors shadow-sm">Privasi</Link>
            <Link href="#" className="hover:text-primary transition-colors shadow-sm italic">Copyright © 2026 Inkata Education Technologies</Link>
         </div>
      </footer>
    </div>
  )
}
