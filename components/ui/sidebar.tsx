'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Users, 
  BarChart3, 
  Award, 
  ShieldCheck, 
  Settings, 
  Search,
  Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Beranda', icon: Home, href: '/dashboard' },
    { label: 'Murid', icon: Users, href: '/dashboard/students' },
    { label: 'Analisis', icon: BarChart3, href: '/insights' },
    { label: 'Sertifikat', icon: Award, href: '/dashboard/awards' },
    { label: 'Admin', icon: ShieldCheck, href: '/admin' },
  ]

  return (
    <>
      {/* Top Desktop Nav */}
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-md h-24 px-12 flex justify-between items-center z-50 border-b border-slate-50">
        <div className="flex items-center gap-10">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <img 
               src="/logo.png" 
               alt="Inkata Logo" 
               className="w-14 h-14 object-contain group-hover:scale-110 transition-transform duration-500" 
            />
            <div className="flex flex-col -gap-1">
               <h1 className="text-xl font-black text-primary tracking-tighter leading-none">Inkata.</h1>
               <p className="text-[7px] font-black uppercase text-slate-300 tracking-widest">Aplikasi Evaluasi Literasi</p>
            </div>
          </Link>
          <div className="hidden lg:flex gap-10 ml-6">
            {navItems.slice(0, 4).map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "text-xs font-black transition-all hover:text-primary uppercase tracking-[0.3em]",
                  pathname === item.href ? "text-primary border-b-2 border-primary pb-1" : "text-slate-300"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-8 text-slate-400">
           <Search size={22} className="cursor-pointer hover:text-primary transition-colors" />
           <Bell size={22} className="cursor-pointer hover:text-primary transition-colors" />
           <Settings size={22} className="cursor-pointer hover:text-primary transition-colors" />
           <div className="w-12 h-12 bg-slate-100 rounded-2xl border-4 border-white shadow-2xl overflow-hidden ring-8 ring-primary/5">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=TeacherDeny" alt="User" />
           </div>
        </div>
      </nav>

      {/* Mobile/Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-white h-20 flex justify-around items-center z-50 border-t border-slate-50 lg:hidden px-4">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1.5 min-w-[60px]">
            <item.icon size={22} className={pathname === item.href ? "text-primary" : "text-slate-200"} />
            <span className={cn("text-[8px] font-black uppercase tracking-widest", pathname === item.href ? "text-primary" : "text-slate-300")}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </>
  )
}
