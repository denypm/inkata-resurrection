'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const AWARD_DATA = [
  { name: 'Alexander Miller', init: 'AM', classGroup: 'Kelas A', phase: 'Fase Wacana', score: 98 },
  { name: 'Sophia Chen', init: 'SC', classGroup: 'Kelas A', phase: 'Fase Wacana', score: 95 },
  { name: 'Liam Rodriguez', init: 'LR', classGroup: 'Kelas B', phase: 'Fase Komunikasi', score: 92 },
  { name: 'Emma Thompson', init: 'ET', classGroup: 'Kelas C', phase: 'Fase Wacana', score: 94 },
  { name: 'Jordan King', init: 'JK', classGroup: 'Kelas A', phase: 'Fase Komunikasi', score: 91 },
  { name: 'Olivia Adams', init: 'OA', classGroup: 'Kelas D', phase: 'Fase Wacana', score: 99 },
  { name: 'Ethan Park', init: 'EP', classGroup: 'Kelas B', phase: 'Fase Wacana', score: 88 },
  { name: 'Ava Nguyen', init: 'AN', classGroup: 'Kelas C', phase: 'Fase Komunikasi', score: 85 },
  { name: 'Noah Williams', init: 'NW', classGroup: 'Kelas D', phase: 'Fase Wacana', score: 96 },
]

export default function AwardsPage() {
  const [activeClass, setActiveClass] = useState('Semua Kelas')

  const filtered = activeClass === 'Semua Kelas'
    ? AWARD_DATA
    : AWARD_DATA.filter(s => s.classGroup === activeClass)

  const phaseColor = (phase: string) => {
    if (phase === 'Fase Wacana') return 'bg-primary-fixed text-primary'
    if (phase === 'Fase Komunikasi') return 'bg-[#ffbf12]/15 text-[#7a5900]'
    return 'bg-secondary-fixed text-secondary'
  }

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-10 pb-32">
        {/* Header */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-label text-[11px] font-semibold uppercase tracking-wider text-primary mb-2 block">Siklus Sertifikasi: Kuartal Ganjil</span>
              <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface">Eksibisi Pencapaian Literasi.</h2>
              <p className="text-on-surface-variant text-lg mt-4 max-w-2xl">Institusi Anda mencatat eskalasi performa luar biasa. Tinjau rekapitulasi peserta didik terpilih yang diotentikasi oleh Mesin Sentral Inkata. untuk Sertifikat Ekselensi Literasi.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => alert('Batch Sertifikat PDF sedang diproses oleh Mesin Inkata...')}
                className="bg-gradient-to-r from-[#2333e7] to-[#4353ff] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                Otorisasi Sertifikat Otomatis
              </button>
            </div>
          </div>
        </section>

        {/* Class Filter Tabs */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            {['Semua Kelas', 'Kelas A', 'Kelas B', 'Kelas C', 'Kelas D'].map(cls => (
              <button
                key={cls}
                onClick={() => setActiveClass(cls)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeClass === cls ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                {cls === 'Semua Kelas' ? 'Seluruh Institusi' : `Grup ${cls}`}
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Stats Summary */}
          <div className="md:col-span-4 bg-surface-container-low rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <h3 className="font-headline text-xl font-bold mb-6">Distribusi Kelayakan</h3>
              <div className="space-y-8">
                <div>
                  <p className="font-label text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant opacity-60">Rasio Ketuntasan Akumulatif</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline text-5xl font-extrabold text-primary">94%</span>
                    <span className="text-on-surface-variant font-medium">Terevaluasi</span>
                  </div>
                </div>
                <div>
                  <p className="font-label text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant opacity-60">Klasifikasi Puncak Kelas</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline text-5xl font-extrabold text-secondary">A+</span>
                    <span className="text-on-surface-variant font-medium">Predikat Paripurna</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 p-6 bg-surface-container-lowest rounded-2xl outline outline-1 outline-[#c5c5d9]/15">
              <p className="text-sm italic text-on-surface-variant">"Peningkatan signifikansi terekam secara konkret pada analisis leksikal dan sintaksis integratif di keseluruhan grup evaluasi."</p>
              <p className="text-xs font-bold mt-3 uppercase text-primary">— Laporan Diagnostik Sentral Inkata.</p>
            </div>
          </div>

          {/* Right: Certificate Preview */}
          <div className="md:col-span-8 bg-surface-container rounded-3xl p-1 overflow-hidden relative min-h-[400px] flex items-center justify-center">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #2333e7 1px, transparent 0)", backgroundSize: "24px 24px" }}></div>
            <div className="relative z-10 w-full max-w-2xl bg-white aspect-[1.414/1] shadow-2xl rounded-sm p-12 flex flex-col items-center text-center border-[12px] border-surface-container-high m-4">
              <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-secondary-fixed">
                <span className="material-symbols-outlined text-secondary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
              </div>
              <h4 className="font-headline text-3xl font-bold tracking-tight text-on-surface uppercase mb-2">Sertifikasi Kehormatan</h4>
              <p className="font-label text-sm text-on-surface-variant tracking-[0.2em] uppercase mb-10">Eksekusi Literasi Lanjutan</p>
              <div className="w-full h-px bg-outline-variant/30 mb-8"></div>
              <p className="text-on-surface-variant italic mb-1">Dianugerahkan secara eksklusif kepada</p>
              <p className="font-headline text-4xl font-extrabold text-primary mb-10">{filtered[0]?.name || 'Peserta Didik'}</p>
              <div className="flex justify-between w-full mt-auto pt-8">
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant">Tanggal Ekstraksi</p>
                  <p className="text-sm font-semibold">17 Agustus 2024</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant">Otentikasi Oleh</p>
                  <p className="text-sm font-semibold">Sistem Sentral Inkata.</p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-6 right-6 flex gap-3">
              <button 
                onClick={() => alert('PDF Generator Service diinisiasi...')} 
                className="bg-white/90 backdrop-blur-xl px-5 py-2.5 rounded-full text-xs font-bold text-primary shadow-sm hover:shadow-md outline outline-1 outline-primary/20 hover:bg-primary/5 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span> Ekstrak PDF
              </button>
              <button 
                onClick={() => window.open(`https://wa.me/?text=Halo%20Bapak%2FIbu%2C%20berikut%20adalah%20Sertifikat%20Ekselensi%20Literasi%20dari%20Sistem%20Sentral%20Inkata%20untuk%20ananda.%20Link%3A%20%5BPDF_URL%5D`, '_blank')} 
                className="bg-[#25D366]/10 backdrop-blur-xl px-5 py-2.5 rounded-full text-xs font-bold text-[#1DA851] shadow-sm hover:shadow-md outline outline-1 outline-[#25D366]/30 hover:bg-[#25D366]/20 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">share</span> Transmisi WA
              </button>
            </div>
          </div>

          {/* Bottom: Grid Buffet of All Awards */}
          <div className="md:col-span-12 bg-surface-container-lowest rounded-3xl p-8 mt-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
              <h3 className="font-headline text-2xl font-bold">Bufet Prestasi {activeClass === 'Semua Kelas' ? 'Seluruh Institusi' : `Grup ${activeClass}`}</h3>
              <span className="bg-primary-fixed text-on-primary-fixed px-4 py-1 rounded-full text-xs font-bold">{filtered.length} Profil Tervalidasi</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(s => (
                <div key={s.name} className="flex items-center gap-4 p-5 rounded-2xl bg-surface-container-low/50 hover:bg-white border border-transparent hover:border-[#c5c5d9]/20 hover:shadow-sm transition-all group cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center font-bold text-primary text-lg transition-transform group-hover:scale-110 shrink-0">
                    {s.init}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-headline font-bold text-on-surface truncate">{s.name}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${phaseColor(s.phase)}`}>
                        {s.phase}
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-medium">{s.classGroup}</span>
                    </div>
                    <div className="mt-2.5 flex items-center gap-2.5">
                      <div className="flex-1 h-1.5 bg-[#e2e2e5] rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${s.score}%` }}></div>
                      </div>
                      <span className="text-xs font-extrabold text-on-surface">{s.score}%</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-secondary shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <button className="text-primary font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                Ekspansi Keseluruhan Profil Penghargaan
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
