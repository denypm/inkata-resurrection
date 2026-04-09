'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function SuperAdminDashboard() {
  const [schools, setSchools] = useState([
    {
      id: 'LITS-2024-001',
      name: 'SMA Nusantara Gemilang',
      location: 'Jakarta Selatan',
      students: 1240,
      plan: 'Enterprise',
      isActive: true,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJz3j6N1IZCtLi_Yi8FosEIHx7KGKmC0WfB04Aq81PC9STmfQF9pIiO8jqp9lnhknJFZijfiYQJ1CBelp0a15RvDkPx3tnGnQttSNU07AWQ53TkZ1kyKois17LkSXGnlc8Wx-iKPqWS-ujQahiIUgr-lrvWjDZaaQuDqfMZUyE3zPbxStmAz6bt3wNxumOmjp7v0NbqZN2u-GwIw86nC4Rb3L__nmbv6eiq7xIXl74U6oy7xuQDuMjuFbGVXk1UY23MXAkvSivMS8"
    },
    {
      id: 'LITS-2024-042',
      name: 'SD Pelita Harapan',
      location: 'Surabaya',
      students: 850,
      plan: 'Standard',
      isActive: false,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsaf5fJi1NLDuPwIgZvanSsW_xPWeGLRe3KzDLOdla1A9Nuo8IypQ2mdrS6IWwtFb-WkYep457-YnGLD_aHbb3pk612yRRiR-wzs3gulO09Fj5kQL5jjgI8Cszi38uwMLXHInEv2naPWsIynBkNO9s5Fcba4cXS0UoJqk3CzIBUe-4VOJwEmqc5PwxO9rDxqovu5MJlYrhtvQg1qjmxktMCyje0qerSpdEXg754wDZTwikqEEhCCKMYCVxeleukCJfCkYiThp9MYs"
    },
    {
      id: 'LITS-2024-105',
      name: 'SMK Bakti Luhur',
      location: 'Bandung',
      students: 2100,
      plan: 'Enterprise',
      isActive: true,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiTShiERANFBQHCJP4dOod-1N0yk3yWzMbgbnUWXifIB1Re50JM9MM1hTi08v3W97E5cLZHGdcioKImwVM1tytVLd_EE7zRC0Nh2X3tZLt88B3HnF2mjwZ4DM1pDoJ1yTiG6Ys28q0QuXjEhgR_vW-3KQ5MgCzp1o9i8smY8P-OfQRYD_8iL53-Oo5ZJmnSLhd7SQ4AWztXAlcd2nd91nxC1CUuTH2i1-eKBR2GeHADeE1KluTjzHfE-x1xrNw9AGWforLqr82mC8"
    }
  ])

  const toggleSchoolStatus = (id: string) => {
    setSchools(schools.map(school => 
      school.id === id ? { ...school, isActive: !school.isActive } : school
    ))
    // Dalam skenario sebenarnya: Trigger API Route ke Supabase untuk Update is_active
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-24 font-body antialiased">
      <Navbar />

      <main className="pt-28 px-6 max-w-7xl mx-auto space-y-12">
        {/* Header Section (Asymmetrical Editorial Style) */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <span className="font-label font-bold text-primary tracking-widest uppercase text-xs mb-2 block">Owner Overview</span>
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">Kontrol Super Admin</h2>
            <p className="mt-4 text-on-surface-variant max-w-xl font-body leading-relaxed">
              Sentralisasi manajemen infrastruktur pendidikan. Awasi pertumbuhan ekosistem Inkata. dan kendalikan akses institusi dalam pengawasan penuh.
            </p>
          </div>
          <div className="md:col-span-4 flex justify-end">
            <button className="bg-gradient-to-r from-[#2333e7] to-[#4353ff] text-white px-6 py-3 rounded-xl font-headline font-bold shadow-[0_0_12px_rgba(35,51,231,0.3)] hover:scale-105 active:scale-95 transition-transform flex items-center gap-2">
              <span className="material-symbols-outlined">add</span>
              Daftarkan Institusi Baru
            </button>
          </div>
        </section>

        {/* Owner Metrics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm outline outline-1 outline-outline-variant/15 flex flex-col gap-2 group transition-all hover:bg-primary-container hover:text-on-primary-container">
            <span className="material-symbols-outlined text-primary group-hover:text-on-primary-container">apartment</span>
            <p className="text-sm font-label font-medium opacity-70">Total Institusi</p>
            <h3 className="text-3xl font-headline font-extrabold">128</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm outline outline-1 outline-outline-variant/15 flex flex-col gap-2 group transition-all">
            <span className="material-symbols-outlined text-tertiary">payments</span>
            <p className="text-sm font-label font-medium opacity-70 text-on-surface-variant">Sirkulasi Lisensi</p>
            <h3 className="text-3xl font-headline font-extrabold text-on-surface">Rp 482.5M</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm outline outline-1 outline-outline-variant/15 flex flex-col gap-2 group transition-all">
            <span className="material-symbols-outlined text-secondary">flash_on</span>
            <p className="text-sm font-label font-medium opacity-70 text-on-surface-variant">Sesi Kognitif Aktif</p>
            <h3 className="text-3xl font-headline font-extrabold text-on-surface">12.4k</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm outline outline-1 outline-outline-variant/15 flex flex-col gap-2 group transition-all">
            <span className="material-symbols-outlined text-primary-container">analytics</span>
            <p className="text-sm font-label font-medium opacity-70 text-on-surface-variant">Momentum Pertumbuhan</p>
            <h3 className="text-3xl font-headline font-extrabold text-on-surface">+12.4%</h3>
          </div>
        </section>

        {/* Active Schools List with Kill-Switch */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-headline font-bold text-on-surface">Daftar Klien Institusi Eksekutif</h3>
            <div className="flex gap-2">
              <div className="bg-surface-container-low px-4 py-2 rounded-lg flex items-center gap-2 border border-outline-variant/20">
                <span className="material-symbols-outlined text-sm text-on-surface-variant">search</span>
                <input className="bg-transparent border-none focus:ring-0 text-sm font-body outline-none text-on-surface w-40 md:w-64" placeholder="Identifikasi institusi..." type="text"/>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/10">
            <div className="grid grid-cols-1 gap-[2px]">
              
              {schools.map(school => (
                <div key={school.id} className="bg-surface-container-lowest p-6 flex flex-col xl:flex-row items-center justify-between gap-6 hover:bg-surface-container-low/50 transition-colors">
                  <div className="flex items-center gap-4 w-full xl:w-auto">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm">
                      <img alt={school.name} className="w-full h-full object-cover" src={school.image} />
                    </div>
                    <div>
                      <h4 className="text-lg font-headline font-bold text-on-surface">{school.name}</h4>
                      <p className="text-sm text-on-surface-variant">ID: {school.id} • {school.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-6 md:gap-14 w-full xl:w-auto justify-between border-t xl:border-none pt-4 xl:pt-0">
                    <div className="text-center">
                      <p className="text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-1">Entitas Siswa</p>
                      <p className="font-headline font-bold text-lg">{school.students.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-1">Skala Lisensi</p>
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${school.plan === 'Enterprise' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container-high text-on-surface'}`}>
                        {school.plan}
                      </span>
                    </div>
                    
                    {/* Toggle Kill Switch (Absolute Lock) */}
                    <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all ${school.isActive ? 'bg-[#25D366]/5 border-[#25D366]/20' : 'bg-secondary/5 border-secondary/20'}`}>
                      <span className={`text-[11px] font-headline font-extrabold tracking-white ${school.isActive ? 'text-[#1DA851]' : 'text-secondary'}`}>
                        {school.isActive ? 'OTORISASI: BERJALAN' : 'OTORISASI: TERKUNCI'}
                      </span>
                      <button 
                        onClick={() => toggleSchoolStatus(school.id)}
                        className={`relative w-12 h-6 rounded-full p-1 cursor-pointer transition-colors outline-none focus:ring-2 focus:ring-offset-2 ${school.isActive ? 'bg-[#25D366] focus:ring-[#25D366]' : 'bg-secondary focus:ring-secondary'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${school.isActive ? 'right-1' : 'left-1'}`}></div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
            </div>
          </div>
        </section>

        {/* Asymmetric Analytics Preview */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-outline-variant/10 relative overflow-hidden">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h4 className="text-xl font-headline font-bold">Saturasi Platform</h4>
                <p className="text-sm text-on-surface-variant">Pertumbuhan adopsi institusi Inkata. per kuartal</p>
              </div>
              <span className="material-symbols-outlined text-primary">trending_up</span>
            </div>
            {/* Mock Chart Placeholder */}
            <div className="h-56 flex items-end gap-3 mx-4">
              <div className="flex-1 bg-surface-container-highest rounded-t-lg h-[40%] hover:h-[45%] transition-all"></div>
              <div className="flex-1 bg-surface-container-highest rounded-t-lg h-[60%] hover:h-[65%] transition-all"></div>
              <div className="flex-1 bg-surface-container-highest rounded-t-lg h-[50%] hover:h-[55%] transition-all"></div>
              <div className="flex-1 rounded-t-lg h-[85%] relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-[#2333e7]"></div>
                 <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] py-1 px-3 rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Q3 Peak</div>
              </div>
              <div className="flex-1 bg-surface-container-highest rounded-t-lg h-[70%] hover:h-[75%] transition-all"></div>
              <div className="flex-1 bg-surface-container-highest rounded-t-lg h-[95%] hover:h-[100%] transition-all relative group">
                 <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#bc000a] text-white text-[10px] py-1 px-3 rounded font-bold opacity-0 group-hover:opacity-100 shadow-[0_0_12px_rgba(188,0,10,0.5)] transition-opacity whitespace-nowrap">Tertinggi</div>
                 <div className="absolute inset-0 bg-[#bc000a]/10 hover:bg-[#bc000a]/20 transition-all rounded-t-lg border-x border-t border-[#bc000a]/30"></div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1 bg-[#1a1c1e] text-white p-8 rounded-3xl flex flex-col justify-between shadow-2xl relative overflow-hidden">
             <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-primary opacity-20 blur-[50px] rounded-full pointer-events-none"></div>
            <div>
              <h4 className="text-xl font-headline font-bold mb-3 text-primary-fixed">Diagnostik Sentral Owner</h4>
               <div className="w-8 h-1 bg-primary/40 rounded-full mb-4"></div>
              <p className="text-sm leading-relaxed text-slate-300 font-medium">
                "Data satelit mendeteksi lonjakan masif evaluasi dokumen pada area <span className="text-white font-bold px-1 py-0.5 bg-primary/20 rounded">Fase Wacana</span> sebesar 24% pada seluruh klien Enterprise minggu ini."
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-4">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center border-[3px] border-[#1a1c1e] shadow-lg">
                  <span className="material-symbols-outlined text-[16px] text-white">bolt</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-[3px] border-[#1a1c1e] shadow-lg">
                  <span className="material-symbols-outlined text-[16px] text-white">memory</span>
                </div>
              </div>
              <span className="text-[11px] font-label tracking-widest uppercase font-extrabold text-primary-fixed ml-2">Mesin Inkata. Aktif</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
