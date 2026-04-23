'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, BrainCircuit, ShieldCheck, Users, FileUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]/50 font-manrope selection:bg-[#1D4ED8]/10 selection:text-[#1D4ED8] overflow-x-hidden">
      {/* Navigation - Vercel Clean Style */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-transparent shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-[88px] flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer">
             <Image src="/inkata-logo.png" alt="Inkata. Logo" width={130} height={40} className="h-10 w-auto object-contain" />
          </div>
          
          <div className="flex items-center gap-8">
            <Link href="/auth">
              <span className="text-sm font-extrabold text-slate-900 hover:text-[#1D4ED8] transition-colors uppercase tracking-widest cursor-pointer">
                Login
              </span>
            </Link>
            <Link href="/auth">
              <Button className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-extrabold px-8 py-6 rounded-full text-xs uppercase tracking-widest shadow-[0_8px_30px_rgba(29,78,216,0.3)] hover:shadow-[0_15px_40px_rgba(29,78,216,0.4)] transition-all active:scale-95">
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Elevated Borderless */}
      <main className="max-w-[1440px] mx-auto px-6 md:px-12 pt-44 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-24 items-center">
          
          {/* Left Side: Content */}
          <div className="flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F0F5FF] rounded-full mb-8 shadow-sm">
              <span className="text-[10px] font-extrabold text-[#1D4ED8] uppercase tracking-[0.2em]">Transformasi Platform Literasi v2.2</span>
            </div>
            
            <h1 className="text-[64px] md:text-[88px] font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-8">
              Ubah <br />Tulisan Tangan, <br />
              <span className="text-[#1D4ED8] font-extrabold">menjadi</span> Data.
            </h1>
            
            <p className="text-[22px] text-slate-500 font-medium leading-relaxed max-w-[540px] mb-12">
              Inkata. adalah penyedia infrastruktur asesmen literasi cerdas berbasis algoritma prediktif modern untuk institusi pendidikan di Indonesia. Deteksi hambatan belajar secara presisi dalam hitungan detik.
            </p>
            
            <Link href="/auth">
              <Button className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-extrabold h-16 px-10 rounded-full text-sm transition-all shadow-[0_15px_30px_rgba(29,78,216,0.3)] hover:-translate-y-1 group tracking-widest">
                MULAI ASESMEN SEKARANG
                <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1 stroke-[3px]" />
              </Button>
            </Link>
          </div>

          {/* Right Side: Mockup Visual Borderless */}
          <div className="relative flex justify-center lg:justify-end mt-12 lg:mt-0">
            <div className="w-full max-w-[560px] bg-white rounded-[3.5rem] p-12 shadow-[0_30px_80px_rgba(0,0,0,0.08)] relative">
              <div className="flex items-center gap-5 mb-12">
                <div className="w-14 h-14 rounded-full bg-[#F0F5FF] flex items-center justify-center text-[#1D4ED8] shadow-[0_4px_20px_rgba(29,78,216,0.1)]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xl tracking-tight">Mesin Pemindai Intelijen</h3>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">Active Scanning</p>
                </div>
              </div>

              {/* Mock Content Bars with Scanner Animation */}
              <div className="space-y-4 mb-12 relative overflow-hidden py-2 px-1">
                <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-b from-transparent via-[#1D4ED8]/10 to-transparent animate-[scan_3s_ease-in-out_infinite] z-10 pointer-events-none">
                  <div className="w-full h-px bg-[#1D4ED8]/30"></div>
                </div>
                <div className="h-5 bg-slate-100 rounded-full w-full"></div>
                <div className="h-5 bg-slate-100 rounded-full w-[85%]"></div>
                <div className="h-5 bg-slate-100 rounded-full w-[60%]"></div>
              </div>

              {/* Insight Popup Bubble */}
              <div className="bg-[#F8FAFC] rounded-[2rem] p-8 relative overflow-hidden border border-slate-100">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#1D4ED8]"></div>
                <p className="text-[10px] font-extrabold text-[#1D4ED8] uppercase tracking-[0.2em] mb-3">Insight Detected</p>
                <p className="text-slate-600 font-bold text-[15px] leading-relaxed">
                  "Peserta didik mengalami kendala pada pemahaman spasial antar kalimat (Fase Wacana)..."
                </p>
              </div>

              {/* Floating Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-white border border-slate-100 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.05)] flex items-center justify-center text-[#1D4ED8] animate-pulse">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
          </div>

        </div>
        
        {/* Feature Grid - Borderless Flat */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40">
           {[
             { label: 'Gemini 1.5 Pro Engine', icon: BrainCircuit, color: 'text-[#1D4ED8]', bg: 'bg-[#F0F5FF]', desc: 'Visi komputer tercanggih untuk akurasi pendeteksian pola tulisan tangan yang belum pernah ada sebelumnya.' },
             { label: 'Infrastruktur Aman', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Keamanan data murid sekelas perbankan dengan otentikasi multi-tenant yang ketat, terenkripsi, dan berdaulat.' },
             { label: 'Analisis Kolektif', icon: Users, color: 'text-orange-500', bg: 'bg-orange-50', desc: 'Lihat tren literasi tingkat sekolah atau kelas secara utuh untuk pengambilan kebijakan yang lebih objektif.' },
           ].map((feature, i) => (
             <div key={i} className="bg-white p-12 rounded-[2.5rem] flex flex-col justify-between h-auto min-h-[380px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500 cursor-pointer">
                <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 shadow-sm", feature.bg, feature.color)}>
                   <feature.icon size={40} strokeWidth={2.5} />
                </div>
                <div>
                   <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight">{feature.label}</h3>
                   <p className="text-slate-500 font-medium leading-relaxed text-base">{feature.desc}</p>
                </div>
             </div>
           ))}
        </div>
      </main>

      {/* Template Download Section */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-32 border-t border-slate-100">
        <div className="bg-[#F8FAFC] rounded-[3rem] p-12 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1D4ED8]/[0.02] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="max-w-2xl relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Unduh Template Data Siswa</h2>
            <p className="text-slate-500 font-medium leading-relaxed text-lg">
              Sederhanakan alur kerja Anda. Gunakan template resmi kami untuk memasukkan daftar nama, jenjang, dan kelas agar fitur sinkronisasi data di Inkata. dapat bekerja secara otomatis dan presisi.
            </p>
          </div>
          <div className="relative z-10">
            <a href="/template_asesmen_inkata.xlsx" download>
              <Button className="bg-slate-900 hover:bg-black text-white font-extrabold h-16 px-12 rounded-full text-sm uppercase tracking-widest shadow-2xl transition-all active:scale-95 flex items-center gap-3">
                Unduh Template (.xlsx)
                <FileUp className="w-5 h-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

       <footer className="px-16 py-24 bg-white flex flex-col items-center gap-12 border-t border-slate-100">
         <div className="flex items-center gap-4 group cursor-pointer transition-all hover:scale-105">
           <Image src="/inkata-logo.png" alt="Inkata. Logo" width={150} height={50} className="h-11 w-auto object-contain" />
         </div>
         <p className="text-slate-400 font-extrabold uppercase text-[10px] tracking-[0.5em] text-center px-4">Penyedia Infrastruktur Asesmen Literasi Nasional</p>
         <div className="flex gap-10 font-extrabold text-slate-400 text-[10px] uppercase tracking-widest pt-8 w-full justify-center border-t border-slate-50">
            <Link href="#" className="hover:text-[#1D4ED8] transition-colors">Keamanan</Link>
            <Link href="#" className="hover:text-[#1D4ED8] transition-colors">Privasi</Link>
            <span className="hover:text-[#1D4ED8] transition-colors">© 2026 Sistem Inkata.</span>
         </div>
      </footer>
    </div>
  )
}
