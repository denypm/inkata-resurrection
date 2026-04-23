'use client'

import React from 'react'
import { Crown, Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UpgradeOverlayProps {
  title?: string
  description?: string
}

export default function UpgradeOverlay({ 
  title = "Fitur Enterprise Eksklusif", 
  description = "Akses analisis data kolektif secara mendalam dan laporan institusi dengan paket Enterprise." 
}: UpgradeOverlayProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
      {/* Blur Background */}
      <div className="absolute inset-0 backdrop-blur-[12px] bg-white/40"></div>
      
      {/* Content Card */}
      <div className="relative bg-white rounded-[2.5rem] p-12 shadow-[0_30px_70px_rgba(0,0,0,0.15)] border border-slate-100 max-w-md text-center flex flex-col items-center">
        <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center mb-8 shadow-sm">
          <Crown size={40} className="stroke-[2.5px]" />
        </div>
        
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">{title}</h2>
        <p className="text-slate-500 font-medium leading-relaxed mb-10">
          {description}
        </p>
        
        <div className="flex flex-col w-full gap-4">
          <Button className="w-full h-16 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-extrabold rounded-2xl text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
            Hubungi Tim Sales Inkata
            <ArrowRight className="w-4 h-4" />
          </Button>
          <button className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest hover:text-[#1D4ED8] transition-colors py-2">
            Lihat Detail Keuntungan Paket
          </button>
        </div>
        
        <div className="mt-8 flex items-center gap-2 text-slate-300">
           <Lock size={12} />
           <span className="text-[10px] font-extrabold uppercase tracking-widest">Secure Institutional Access</span>
        </div>
      </div>
    </div>
  )
}
