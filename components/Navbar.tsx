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
    { href: '/assessment', label: 'Identifikasi Manuskrip' },
    { href: '/assessment/analysis', label: 'Analisis' },
    { href: '/dashboard/awards', label: 'Eksibisi' },
  ]

  return (
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

      {/* Mobile Flat Navigation Bottom Drawer Replica */}
      <div className="lg:hidden flex overflow-x-auto hide-scrollbar border-t border-[#f0edec] py-2 px-4 gap-2 bg-[#fcf9f8]/95 backdrop-blur-md">
        {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-all ${isActive ? 'bg-[#e0e0ff] text-[#2333e7]' : 'text-stone-500 hover:bg-[#f6f3f2]'}`}
              >
                {link.label}
              </Link>
            )
          })}
          {isSuperAdmin && (
             <Link href="/superadmin" className="whitespace-nowrap px-4 py-2 rounded-lg text-xs font-black bg-secondary/10 text-secondary border border-secondary/20">
               Otoritas Owner
             </Link>
          )}
      </div>
    </header>
  )
}
