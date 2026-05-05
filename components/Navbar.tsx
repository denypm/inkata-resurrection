'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut, Settings, HelpCircle, Shield, ChevronDown, UserCircle2 } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkRole = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email ?? null)
        // Cek role di DB
        const { data: teacher } = await supabase.from('teachers').select('role').eq('id', user.id).single()
        if (teacher?.role === 'super_admin' || user.user_metadata?.role === 'superadmin' || user.user_metadata?.role === 'super_admin') {
          setIsSuperAdmin(true)
        }
      }
    }
    checkRole()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth')
    setDropdownOpen(false)
  }

  const navLinks = [
    { href: '/dashboard', label: 'Beranda' },
    { href: '/dashboard/students', label: 'Peserta Didik' },
    { href: '/assessment', label: 'Identifikasi Teks' },
    { href: '/assessment/analysis', label: 'Performa' },
    { href: '/dashboard/awards', label: 'Portofolio' },
  ]

  return (
    <>
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50 transition-all font-manrope">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1440px] mx-auto">
        
        {/* Brand Identity */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-[#1D4ED8] shadow-[0_8px_15px_rgba(29,78,216,0.25)] transition-transform group-hover:scale-105">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1D4ED8] tracking-tighter">inkata.</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-5 py-2.5 rounded-full text-[13px] font-extrabold transition-all tracking-wide ${isActive ? 'bg-[#F0F5FF] text-[#1D4ED8]' : 'text-slate-500 hover:bg-slate-50 hover:text-[#1D4ED8]'}`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* User Actions & Superadmin Gateway */}
        <div className="flex items-center gap-5">
          
          {isSuperAdmin && (
            <Link href="/superadmin" className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-[#F0F5FF] rounded-full text-xs font-extrabold text-[#1D4ED8] transition-colors outline-none border border-transparent hover:border-[#1D4ED8]/20 group">
              <Shield className="w-4 h-4 text-slate-400 group-hover:text-[#1D4ED8] transition-colors" />
              Owner Access
            </Link>
          )}

          {/* Search Bar - Clean Look */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1D4ED8]/20 border border-slate-100 focus-within:border-transparent">
            <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
            <input 
              type="text" 
              placeholder="Cari kelas/murid..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-[13px] outline-none w-36 focus:w-56 transition-all font-semibold text-slate-800 placeholder:font-medium placeholder:text-slate-400"
            />
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:shadow-md transition-shadow ring-4 ring-slate-50">
                <UserCircle2 className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''} hidden sm:block`} />
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-slate-100 py-3 animate-in fade-in slide-in-from-top-2 origin-top-right">
                <div className="px-5 py-3 border-b border-slate-50 mb-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#1D4ED8] mb-1">Akun Aktif</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{userEmail || 'Memuat...'}</p>
                </div>
                
                <div className="flex flex-col px-2">
                  <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-bold text-xs transition-colors text-left w-full">
                    <Settings className="w-4 h-4" /> Pengaturan Profil
                  </button>
                  <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-bold text-xs transition-colors text-left w-full">
                    <HelpCircle className="w-4 h-4" /> Bantuan & Panduan
                  </button>
                  <div className="w-full h-px bg-slate-50 my-2"></div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 font-extrabold text-xs transition-colors text-left w-full"
                  >
                    <LogOut className="w-4 h-4" /> Keluar dari Sistem
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
    
    {/* Mobile App-Style Bottom Navigation */}
    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-[100] bg-white backdrop-blur-2xl px-5 py-4 shadow-[0_20px_40px_rgba(0,0,0,0.08)] rounded-[2.5rem] border border-slate-100">
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
              className={`flex flex-col items-center gap-1.5 transition-all ${isActive ? 'text-[#1D4ED8] -translate-y-1' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {iconName}
              </span>
              <span className={`text-[9px] font-extrabold tracking-widest uppercase ${isActive ? 'opacity-100' : 'opacity-0 h-0 w-0 overflow-hidden'}`}>
                {link.label === 'Identifikasi Teks' ? 'Scan' : link.label === 'Peserta Didik' ? 'Murid' : link.label}
              </span>
            </Link>
          )
        })}
        {isSuperAdmin && (
          <Link 
            href="/superadmin" 
            className={`flex flex-col items-center gap-1.5 transition-all ${pathname === '/superadmin' ? 'text-red-500 -translate-y-1' : 'text-slate-400'}`}
          >
            <Shield className="w-6 h-6" />
            <span className={`text-[9px] font-extrabold tracking-widest uppercase ${pathname === '/superadmin' ? 'opacity-100' : 'opacity-0 h-0 w-0 overflow-hidden'}`}>
              Owner
            </span>
          </Link>
        )}
      </nav>
    </div>
    </>
  )
}
