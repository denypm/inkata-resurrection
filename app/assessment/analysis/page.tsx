'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export default function LiteracyAnalysisPage() {
  const [totalStudents, setTotalStudents] = useState(24)
  const [activeClass, setActiveClass] = useState('Semua Kelas')

  return (
    <div className="bg-surface font-body text-on-surface antialiased pb-32 min-h-screen">
      <main className="max-w-7xl mx-auto px-6 pt-8">
        <section className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="max-w-2xl">
              <span className="font-label text-sm font-semibold uppercase tracking-wider text-primary mb-2 block">Laporan Deskriptif Sentral</span>
              <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight text-on-background mb-6">Analitik Komprehensif <span className="text-primary-container">Inkata.</span></h1>
              
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-sm text-outline-variant">Ruang Analisis:</span>
                <select 
                  value={activeClass}
                  onChange={(e) => {
                    setActiveClass(e.target.value)
                    setTotalStudents(e.target.value === 'Kelas A' ? 24 : e.target.value === 'Kelas B' ? 21 : e.target.value === 'Kelas C' ? 28 : e.target.value === 'Kelas D' ? 25 : 98)
                  }}
                  className="bg-surface-container text-on-surface font-bold text-sm px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer border border-transparent focus:border-primary/20 transition-all appearance-none pr-10 relative bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke-width=\'2.5\' stroke=\'%236c6b75\'%3e%3cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19.5 8.25l-7.5 7.5-7.5-7.5\' /%3e%3c/svg%3e')] bg-no-repeat bg-[center_right_1rem] bg-[length:1rem_1rem]"
                >
                  <option value="Semua Kelas">Seluruh Institusi</option>
                  <option value="Kelas A">Grup Kelas 4-A</option>
                  <option value="Kelas B">Grup Kelas 4-B</option>
                  <option value="Kelas C">Grup Kelas 4-C</option>
                  <option value="Kelas D">Grup Kelas 4-D</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => alert('Batch PDF Request dikirim ke Node...')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-container-low text-on-surface-variant font-semibold hover:bg-surface-container transition-all"
              >
                <span className="material-symbols-outlined">picture_as_pdf</span> Ekstrak Rekap PDF
              </button>
              <button 
                onClick={() => window.open(`https://wa.me/?text=Halo%20Bapak%2FIbu%2C%20ini%20adalah%20Laporan%20Kolektif%20Analisa%20Sistem%20Inkata%20dari%20sekolah.%20%5BLink_Laporan%5D`, '_blank')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366]/10 text-[#1DA851] font-bold shadow-[0_4px_14px_rgba(37,211,102,0.15)] hover:bg-[#25D366]/20 transition-all border border-[#25D366]/30"
              >
                <span className="material-symbols-outlined">share</span> Transmisi Masif via WA
              </button>
            </div>
          </div>
        </section>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-surface-container rounded-3xl p-8 transition-transform">
              <h3 className="font-headline text-xl mb-8">Distribusi Kefasihan Literasi</h3>
              <div className="relative w-full aspect-square flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[24px] border-surface-container-high transition-all"></div>
                <div className="absolute inset-0 rounded-full border-[24px] border-primary border-r-transparent border-b-transparent border-l-transparent rotate-[45deg] transition-all"></div>
                <div className="absolute inset-0 rounded-full border-[24px] border-secondary-container border-t-transparent border-r-transparent border-b-transparent rotate-[160deg] transition-all"></div>
                <div className="text-center">
                  <span className="block font-headline text-5xl text-on-background">{totalStudents}</span>
                  <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Populasi Filter</span>
                </div>
              </div>
              <div className="mt-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-on-surface-variant font-medium">Fase Wacana</span>
                  </div>
                  <span className="font-headline text-on-background">42%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-secondary-container"></div>
                    <span className="text-on-surface-variant font-medium">Fase Komunikasi</span>
                  </div>
                  <span className="font-headline text-on-background">35%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-surface-container-high"></div>
                    <span className="text-on-surface-variant font-medium">Fase Bunyi</span>
                  </div>
                  <span className="font-headline text-on-background">23%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/10 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-secondary-fixed rounded-2xl text-on-secondary-container">
                  <span className="material-symbols-outlined">lightbulb</span>
                </div>
                <h3 className="font-headline text-xl">Diagnostik Sistem Sentral</h3>
              </div>
              <p className="text-on-surface-variant leading-relaxed mb-6">
                Akuisisi struktural wacana telah mencapai lonjakan komprehensif sebesar <span className="text-primary font-bold">12%</span> pada siklus {activeClass}. Mesin Inkata. merekomendasikan manuver eskalatif untuk para Peserta pada diagnostik "Fase Bunyi".
              </p>
              <Link href="/dashboard/students" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                Rekomendasi Intervensi Eksklusif <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-container-low p-6 rounded-3xl transition-all hover:bg-surface-container-high">
                <span className="font-label text-[10px] font-extrabold uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Matriks Ekstraksi Logis</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-headline text-4xl text-on-background">118</span>
                  <span className="font-label text-sm text-on-surface-variant">WPM</span>
                </div>
                <div className="mt-4 h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full w-[78%] bg-gradient-to-r from-[#ffbf12] to-[#2333e7]"></div>
                </div>
              </div>
              <div className="bg-surface-container-low p-6 rounded-3xl transition-all hover:bg-surface-container-high">
                <span className="font-label text-[10px] font-extrabold uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Intelegensi Reseptif</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-headline text-4xl text-on-background">84</span>
                  <span className="font-label text-sm text-on-surface-variant">%</span>
                </div>
                <div className="mt-4 h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full w-[84%] bg-gradient-to-r from-[#ffbf12] to-[#2333e7]"></div>
                </div>
              </div>
              <div className="bg-surface-container-low p-6 rounded-3xl transition-all hover:bg-surface-container-high">
                <span className="font-label text-[10px] font-extrabold uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Inventaris Kosakata</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-headline text-4xl text-on-background">92</span>
                  <span className="font-label text-sm text-on-surface-variant">%</span>
                </div>
                <div className="mt-4 h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full w-[92%] bg-gradient-to-r from-[#ffbf12] to-[#2333e7]"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/10">
              <div className="px-8 py-6 flex justify-between items-center border-b border-surface-container flex-wrap gap-4">
                <h3 className="font-headline text-xl">Laporan Matriks Performa Individu ({activeClass})</h3>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed text-xs font-bold rounded-full">Distribusi Kohort Tertinggi</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left font-label text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/60 border-b border-surface-container">
                      <th className="px-8 py-4">Identitas Peserta Didik</th>
                      <th className="px-6 py-4">Kecepatan Resolusi</th>
                      <th className="px-6 py-4">Pemahaman Struktural</th>
                      <th className="px-6 py-4">Distribusi Leksikal</th>
                      <th className="px-8 py-4 text-right">Penilaian Inkata</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="hover:bg-surface-container-low transition-colors group border-b border-surface">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-xs text-primary">AJ</div>
                          <span className="font-bold text-on-background">Alex Johnson</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 font-headline text-on-surface-variant">142 WPM</td>
                      <td className="px-6 py-6 font-headline text-on-surface-variant">96%</td>
                      <td className="px-6 py-6 font-headline text-on-surface-variant">98%</td>
                      <td className="px-8 py-6 text-right">
                        <span className="px-3 py-1 bg-primary-fixed text-primary font-bold rounded-full text-[10px] uppercase tracking-wider">Fase Wacana</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors group border-b border-surface">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-xs text-secondary">SM</div>
                          <span className="font-bold text-on-background">Sarah Miller</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 font-headline text-on-surface-variant">94 WPM</td>
                      <td className="px-6 py-6 font-headline text-on-surface-variant">72%</td>
                      <td className="px-6 py-6 font-headline text-on-surface-variant">80%</td>
                      <td className="px-8 py-6 text-right">
                        <span className="px-3 py-1 bg-secondary-fixed text-secondary font-bold rounded-full text-[10px] uppercase tracking-wider">Fase Bunyi</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-xs">LT</div>
                          <span className="font-bold text-on-background">Leo Thompson</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 font-headline text-on-surface-variant">128 WPM</td>
                      <td className="px-6 py-6 font-headline text-on-surface-variant">88%</td>
                      <td className="px-6 py-6 font-headline text-on-surface-variant">90%</td>
                      <td className="px-8 py-6 text-right">
                        <span className="px-3 py-1 bg-[#ffbf12]/20 text-[#7a5900] font-bold rounded-full text-[10px] uppercase tracking-wider">Fase Komunikasi</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-surface-container-low text-center">
                <button className="text-on-surface-variant font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors">Ekspansi {totalStudents} Metrik {activeClass}</button>
              </div>
            </div>
            
            <div className="pt-4">
              <button className="w-full bg-gradient-to-r from-[#2333e7] to-[#4353ff] text-white py-6 rounded-3xl font-headline text-xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-primary/40 active:scale-[0.98] transition-all group">
                Otorisasi Rekapitulasi Sinkronik
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
