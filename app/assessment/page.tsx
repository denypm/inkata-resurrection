'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function InputAsesmenPage() {
  const router = useRouter()
  const [analyzePhase, setAnalyzePhase] = useState(0)
  const [search, setSearch] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAnalyze = async (file: File) => {
    setAnalyzePhase(1)
    
    // Auto-progress the UI phases for realistic psychological wait time
    const interval = setInterval(() => {
      setAnalyzePhase(prev => {
        if (prev < 4) return prev + 1
        return prev
      })
    }, 1500)

    const reader = new FileReader(); 
    reader.readAsDataURL(file)
    reader.onload = async () => {
      try {
        const res = await fetch('/api/analyze', { 
          method: 'POST', 
          body: JSON.stringify({ image: reader.result }), 
          headers: { 'Content-Type': 'application/json' } 
        })
        const data = await res.json()
        clearInterval(interval)
        sessionStorage.setItem('inkata_latest_result', JSON.stringify(data))
        router.push('/assessment/analysis')
      } catch (error) {
        console.error(error)
        clearInterval(interval)
        setAnalyzePhase(0)
      }
    }
  }

  const getPhaseText = () => {
    if (analyzePhase === 0) return 'Perekaman Manuskrip Literasi';
    if (analyzePhase === 1) return 'Mengekstraksi Morfologi...';
    if (analyzePhase === 2) return 'Menyidik Struktur Fase Bunyi...';
    if (analyzePhase === 3) return 'Menganalisa Keterhubungan Fase Komunikasi...';
    return 'Mengkalibrasi Koherensi Fase Wacana...';
  }

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen">
      <main className="pt-12 pb-32 px-6 max-w-4xl mx-auto space-y-12">
        {/* Global Progress Stepper */}
        <section className="relative">
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-xs font-bold font-label uppercase tracking-widest text-primary">Identitas Spesifik</span>
            <span className="text-xs font-bold font-label uppercase tracking-widest text-outline-variant">Tinjau Rekapitulasi</span>
          </div>
          <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden flex">
            <div className="h-full w-1/2 bg-primary relative">
              <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-r from-transparent to-white/20"></div>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-primary rounded-full border-4 border-surface flex items-center justify-center shadow-[0_0_15px_rgba(35,51,231,0.4)] scale-110">
            <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>document_scanner</span>
          </div>
        </section>

        {/* Main Content Canvas */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Search and Identity */}
          <div className="md:col-span-7 space-y-8">
            <header>
              <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">Transmisi Hasil Literasi</h2>
              <p className="text-on-surface-variant mt-2 max-w-md">Inisiasikan pendeteksian portofolio untuk melakukan analisis manufaktur optik (OCR) tersentralisasi.</p>
            </header>
            
            {/* Smart Student Search Container */}
            <div className="relative group">
              <div className="flex items-center bg-surface-container-low rounded-2xl p-2 transition-all group-focus-within:bg-surface-container-lowest group-focus-within:ring-2 group-focus-within:ring-primary/20">
                <span className="material-symbols-outlined ml-4 text-outline">person_search</span>
                <input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:ring-0 font-medium text-on-surface px-4 py-3 outline-none placeholder:text-outline/60" 
                  placeholder="Pindai NIS atau ketikkan identitas entitas..." 
                  type="text"
                />
                <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 bg-surface-container-high rounded-lg text-[10px] font-bold text-outline mr-2 border border-outline-variant/20">
                    CMD + K
                </kbd>
              </div>
              
              {/* Stylized Floating Suggestion Box */}
              {search.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-3 bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl z-40 overflow-hidden border border-white/40">
                  <div className="p-2 space-y-1">
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-primary/5 border-l-4 border-primary">
                      <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-on-surface">Ahmad Rizky Pratama</p>
                        <p className="text-[10px] font-medium text-outline">NIS: 2024001 • Kelas 4-A</p>
                      </div>
                      <span className="material-symbols-outlined text-primary">check_circle</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Identity Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-surface-container-low flex flex-col justify-between h-32 relative overflow-hidden">
                <span className="text-xs font-bold font-label uppercase tracking-widest text-outline">Grup Sasaran</span>
                <p className="text-2xl font-headline font-extrabold text-on-surface">Kelas 4-A</p>
                <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12">
                  <span className="material-symbols-outlined text-8xl">local_library</span>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-surface-container-low flex flex-col justify-between h-32 relative overflow-hidden">
                <span className="text-xs font-bold font-label uppercase tracking-widest text-outline">Sisa Lisensi Ekstraksi</span>
                <p className="text-2xl font-headline font-extrabold text-primary">12 Entitas</p>
                <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12">
                  <span className="material-symbols-outlined text-8xl">group</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column: Glass Camera (Scanning Interface) */}
          <div className="md:col-span-5 h-full">
            <div className={`h-full flex flex-col items-center justify-center p-8 bg-white/70 backdrop-blur-xl rounded-[2rem] border relative transition-all duration-700 ${analyzePhase > 0 ? 'shadow-[0_0_40px_rgba(67,83,255,0.25)] border-primary/50' : 'shadow-[0_0_20px_rgba(35,51,231,0.15)] border-white/50'}`}>
              <div className={`absolute inset-4 rounded-[1.5rem] bg-[url('data:image/svg+xml,%3csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3crect width=\'100%25\' height=\'100%25\' fill=\'none\' rx=\'24\' ry=\'24\' stroke=\'%234353ffFF\' stroke-width=\'3\' stroke-dasharray=\'12%2c 12\' stroke-dashoffset=\'0\' stroke-linecap=\'square\'/%3e%3c/svg%3e')] ${analyzePhase > 0 ? 'opacity-80 animate-pulse' : 'opacity-40'}`}></div>
              
              <div className="relative group cursor-pointer text-center py-12 w-full flex flex-col items-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 relative">
                    {analyzePhase > 0 ? (
                      <Loader2 className="animate-spin text-white w-8 h-8" />
                    ) : (
                      <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>document_scanner</span>
                    )}
                    {analyzePhase > 0 && <div className="absolute inset-0 border-t-2 border-l-2 border-white rounded-full animate-ping opacity-30"></div>}
                  </div>
                </div>
                
                <h3 className={`text-xl font-headline font-bold mb-2 transition-colors duration-300 ${analyzePhase > 0 ? 'text-primary' : 'text-on-surface'}`}>
                  {getPhaseText()}
                </h3>
                
                {/* Visual Tracker Hint when idle vs analyzing */}
                {analyzePhase === 0 ? (
                  <p className="text-sm text-outline-variant max-w-[200px] mx-auto">Demi akurasi konklusi Inkata. pastikan pencahayaan optimal dan kaligrafi terbingkai penuh.</p>
                ) : (
                  <div className="flex gap-2.5 mt-2 transition-opacity duration-500">
                    <span className={`w-2 h-2 rounded-full ${analyzePhase >= 2 ? 'bg-[#e2241f] shadow-neon-red shadow-sm' : 'bg-[#c5c5d9]'}`}></span>
                    <span className={`w-2 h-2 rounded-full ${analyzePhase >= 3 ? 'bg-[#ffbf12] shadow-sm' : 'bg-[#c5c5d9]'}`}></span>
                    <span className={`w-2 h-2 rounded-full ${analyzePhase >= 4 ? 'bg-[#006022] shadow-neon-green shadow-sm' : 'bg-[#c5c5d9]'}`}></span>
                  </div>
                )}
                
                <div className="mt-10 flex flex-col gap-3 w-full justify-center px-4 relative z-10">
                   <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && handleAnalyze(e.target.files[0])} className="hidden" accept="image/*" />
                   
                   <button 
                     disabled={analyzePhase > 0} 
                     onClick={() => fileInputRef.current?.click()} 
                     className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-primary/40 active:scale-95 transition-all text-sm w-full disabled:opacity-50 disabled:active:scale-100"
                   >
                       {analyzePhase > 0 ? 'Mengunci Resolusi...' : 'Aktifkan Lensa Inkata.'}
                   </button>
                   
                   <button 
                     disabled={analyzePhase > 0} 
                     onClick={() => fileInputRef.current?.click()} 
                     className="px-4 py-3 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-colors text-sm w-full flex items-center justify-center gap-2 disabled:opacity-50"
                   >
                       <span className="material-symbols-outlined">upload_file</span> Transmisi Dokumen Eksterior
                   </button>
                </div>
              </div>
              
              {/* Category Hint Badges */}
              <div className="absolute bottom-6 flex gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/10 text-secondary text-[10px] font-bold uppercase tracking-wider shadow-sm border border-secondary/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Bunyi
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffbf12]/10 text-[#7a5900] text-[10px] font-bold uppercase tracking-wider shadow-sm border border-[#ffbf12]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffbf12]"></span> Komunikasi
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-container/10 text-tertiary text-[10px] font-bold uppercase tracking-wider shadow-sm border border-tertiary/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Wacana
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Background Glows */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="fixed top-1/2 -right-48 w-[500px] h-[500px] bg-tertiary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed -bottom-24 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
    </div>
  )
}
