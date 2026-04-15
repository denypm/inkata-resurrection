'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Navbar() {
  const pathname = usePathname()
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const checkRole = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user && (user.email === 'denydenary@gmail.com' || user.user_metadata?.role === 'superadmin')) {
        setIsSuperAdmin(true)
      }
    }
    checkRole()
  }, [])

  const navLinks = [
    { href: '/dashboard', label: 'Beranda' },
    { href: '/dashboard/students', label: 'Peserta Didik' },
    { href: '/assessment', label: 'Identifikasi Teks' },
    { href: '/assessment/analysis', label: 'Performa' },
    { href: '/dashboard/awards', label: 'Portofolio' },
  ]

  return (
    <>
    <header className="bg-white/85 dark:bg-stone-950/85 backdrop-blur-xl border-b border-[#c5c5d9]/20 sticky top-0 z-50 transition-all">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1400px] mx-auto">
        
        {/* Brand Identity */}
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-primary shadow-sm shadow-primary/20 group-hover:shadow-[0_0_15px_0_rgba(67,83,255,0.4)] transition-all">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          </div>
          <h1 className="text-2xl font-black text-[#2333e7] dark:text-[#5c6aff] tracking-tighter font-headline">Inkata.</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-primary-fixed text-on-primary-fixed-variant shadow-sm' : 'text-stone-500 hover:bg-[#f6f3f2] hover:text-[#2333e7]'}`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* User Actions & Superadmin Gateway */}
        <div className="flex items-center gap-4">
          
          {isSuperAdmin && (
            <Link href="/superadmin" className="hidden md:flex items-center gap-2 px-4 py-2 bg-secondary/10 hover:bg-secondary/20 border border-secondary/20 rounded-xl text-xs font-black text-secondary transition-colors shadow-sm outline-none">
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              Super Admin
            </Link>
          )}

          <div className="hidden md:flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-xl transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 border-transparent focus-within:border-primary/10 border">
            <span className="material-symbols-outlined text-stone-400 text-[18px]">search</span>
            <input 
              type="text" 
              placeholder="Cari entitas..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm outline-none w-32 focus:w-48 transition-all font-semibold text-on-surface placeholder:font-normal"
            />
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-surface-container bg-surface-container-high cursor-pointer hover:border-primary transition-all ml-1">
            <img alt="Profil Pengajar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4qYGXpFufMuM8q4uz0krMPxOM_fwh2guFy15WJwMXJzG15KMaHDUfzRmzSFjbeKe1anRpF5ccUSRPvbCw0vz9yMkpUF11gbJlz4JVMKM1TX04wF3Vqkfe8jh1r8fsnMvPX2xoQ2K3bq1NfQ9J_di-iOP5o_5tsG7JrpXJcxsyy4vugJ_qYijoZ_49kErpCq0KBnIKrGRslaNNIqw-1ADHryKUATWAhX3zWeTPoqLQJShdO_b8orQkUkrnfait6gdDpr0g-oli-Rk"/>
          </div>
        </div>

      </div>
    </header>
    
    {/* Mobile App-Style Bottom Navigation */}
    <div className="lg:hidden fixed bottom-1 left-2 right-2 z-[100] bg-white/85 dark:bg-stone-900/90 backdrop-blur-2xl border border-[#c5c5d9]/30 px-4 py-3 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-[2rem] border-b-0 mb-2">
      <nav className="flex items-center justify-around max-w-md mx-auto">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          let iconName = 'home';
          if (link.href.includes('students')) iconName = 'groups';
          if (link.href === '/assessment') iconName = 'document_scanner';
          if (link.href.includes('analysis')) iconName = 'analytics';
          if (link.href.includes('awards')) iconName = 'emoji_events';

          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-primary scale-110' : 'text-stone-400 active:scale-95'}`}
            >
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {iconName}
              </span>
              <span className={`text-[10px] font-bold tracking-tight ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {link.label === 'Identifikasi Teks' ? 'Scan' : link.label === 'Peserta Didik' ? 'Murid' : link.label}
              </span>
            </Link>
          )
        })}
        {isSuperAdmin && (
          <Link 
            href="/superadmin" 
            className={`flex flex-col items-center gap-1 transition-all ${pathname === '/superadmin' ? 'text-secondary font-black' : 'text-stone-400'}`}
          >
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: pathname === '/superadmin' ? "'FILL' 1" : "'FILL' 0" }}>
              shield_person
            </span>
            <span className="text-[10px] font-bold opacity-60">Owner</span>
          </Link>
        )}
      </nav>
    </div>
    </>
  )
}
