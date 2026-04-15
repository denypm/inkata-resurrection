'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/ui/sidebar'
import { Building2, CreditCard, Zap, TrendingUp, Plus, Activity, Cpu, Loader2, Globe, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

export default function OwnerDashboardPage() {
  const [stats, setStats] = useState({ schools: 128, assessments: '48.2k' })
  const supabase = createClient()

  useEffect(() => {
    async function fetchStats() {
      const { count: sCount } = await supabase.from('schools').select('*', { count: 'exact', head: true })
      const { count: aCount } = await supabase.from('assessments').select('*', { count: 'exact', head: true })
      if (sCount !== null && aCount !== null) setStats({ schools: sCount || 128, assessments: aCount > 0 ? `${(aCount/1000).toFixed(1)}k` : '0k' })
    }
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-[#f9f9fc] selection:bg-[#2333e7]/10 overflow-hidden">
      <Sidebar />
      <main className="pt-40 px-32 pb-48 max-w-[1700px] mx-auto relative">
        <div className="fixed top-[-10%] left-[-10%] w-[800px] h-[800px] bg-[#2333e7]/[0.01] rounded-full blur-[150px] pointer-events-none" />

        <div className="grid grid-cols-12 gap-24 items-start pr-8">
           
           {/* OWNER HEADER & PRIMARY ACTION */}
           <motion.div 
             initial={{ opacity: 0, x: -50 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8 }}
             className="col-span-12 lg:col-span-10 space-y-12 mb-20"
           >
              <div className="flex items-center gap-6">
                 <span className="font-sans text-[11px] font-black uppercase tracking-[0.5em] text-[#2333e7]">INFRASTRUCTURE COMMANDER v5.0</span>
              </div>
              <h2 className="font-display text-[120px] font-black leading-[0.82] tracking-[-0.04em] text-slate-900">
                 Sentral <br /> <span className="text-[#2333e7] relative px-4">Komando.<div className="absolute inset-0 bg-[#2333e7]/5 -skew-x-12 -z-10" /></span>
              </h2>
              <div className="flex items-center gap-16 pt-8">
                 <p className="font-sans text-xl text-[#44474e] leading-relaxed max-w-2xl border-l-8 border-[#2333e7]/10 pl-16">
                    "Visualisasi real-time dari penyerapan platform Inkata di seluruh wilayah kedaulatan digital Indonesia. Mengarahkan kordinat pertumbuhan institusi."
                 </p>
                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="h-32 px-20 rounded-2xl bg-[#2333e7] text-white text-3xl font-black shadow-[0_30px_60px_rgba(35,51,231,0.3)] group relative overflow-hidden border-none">
                       <Plus size={40} className="mr-6 transition-transform group-hover:rotate-180 duration-1000" strokeWidth={3} />
                       REGISTRASI MITRA
                    </Button>
                 </motion.div>
              </div>
           </motion.div>

           {/* FLOOR STATS: FLOATING GROWTH CELLS */}
           <div className="col-span-12 grid grid-cols-4 gap-12 mb-32 items-start">
              {[
                { label: 'INSTITUSI', val: stats.schools, icon: Building2, color: '#2333e7', shadow: 'rgba(35,51,231,0.3)' },
                { label: 'PENDAPATAN', val: 'Rp 482M', icon: CreditCard, color: '#059669', shadow: 'rgba(5,150,105,0.3)' },
                { label: 'SESI DATA', val: stats.assessments, icon: Zap, color: '#d97706', shadow: 'rgba(217,119,6,0.3)' },
                { label: 'PERTUMBUHAN', val: '+12.4%', icon: TrendingUp, color: '#2563eb', shadow: 'rgba(37,99,235,0.3)' },
              ].map((st, i) => (
                 <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * i, duration: 1 }}
                    whileHover={{ y: -15, boxShadow: `0 30px 60px ${st.shadow}` }}
                    className="bg-white p-14 h-[440px] rounded-[4rem] flex flex-col justify-between group transition-all duration-700 relative overflow-hidden border border-slate-50"
                 >
                    <div className="absolute top-[-20%] right-[-20%] w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: st.color }} />
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-white shadow-ambient transition-all group-hover:scale-110" style={{ color: st.color }}>
                       <st.icon size={44} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-4">
                       <p className="font-sans text-[11px] font-black uppercase tracking-[0.4em] text-slate-300">{st.label}</p>
                       <h3 className="font-display text-[72px] font-black leading-none text-slate-900 tracking-tighter">{st.val}</h3>
                    </div>
                    <div className="w-full h-1 bg-[#f3f3f6] rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2, delay: 1 }} className="h-full" style={{ background: st.color }} />
                    </div>
                 </motion.div>
              ))}
           </div>

           {/* INTELLIGENCE MAP & AI CORE MODULES */}
           <div className="col-span-12 grid grid-cols-12 gap-16 items-stretch">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="col-span-12 lg:col-span-8 bg-white/70 backdrop-blur-[30px] p-20 rounded-[5rem] flex flex-col justify-between min-h-[640px] relative overflow-hidden border border-white shadow-[0_40px_120px_rgba(0,0,0,0.03)]"
              >
                 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2333e7]/[0.02] rounded-bl-[30rem] -z-10" />
                 <div className="flex justify-between items-start mb-16 px-8">
                    <div className="space-y-4">
                       <h4 className="font-display text-5xl font-black text-slate-900 tracking-tight leading-none">Peta Adopsi Nasional.</h4>
                       <div className="flex items-center gap-4 text-[#2333e7]">
                          <Globe className="animate-spin-slow" size={24} />
                          <span className="font-sans text-[10px] font-black uppercase tracking-[0.4em] opacity-40">NODAL AKTIF: 1,240 TITIK</span>
                       </div>
                    </div>
                    <Activity className="text-[#2333e7] w-14 h-14 animate-pulse" strokeWidth={3} />
                 </div>
                 
                 <div className="flex-1 w-full bg-[#f3f3f6]/50 rounded-[4rem] flex items-center justify-center relative group-hover:bg-white transition-all shadow-inner border border-white/40 overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500/[0.03] animate-pulse" />
                    <div className="font-display font-black text-5xl text-slate-100 uppercase tracking-[0.6em] relative z-10">
                       [INFRASTRUCTURE LENS ACTIVE]
                    </div>
                 </div>
              </motion.div>

              <div className="col-span-12 lg:col-span-4 flex flex-col gap-12">
                 <motion.div 
                   whileHover={{ scale: 1.02 }}
                   className="p-16 bg-[#2333e7] text-white rounded-[4rem] shadow-[0_40px_100px_rgba(35,51,231,0.4)] relative overflow-hidden h-[380px] flex flex-col justify-between group"
                 >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-bl-[10rem] group-hover:scale-125 transition-transform duration-1000" />
                    <div className="flex items-center gap-4 border-b border-white/20 pb-8">
                       <Shield size={32} />
                       <span className="font-sans text-[11px] font-black uppercase tracking-[0.4em] opacity-60">AI NEURAL REPORT v5.1</span>
                    </div>
                    <p className="font-sans text-2xl font-black leading-relaxed pr-6">
                       "Deteksi percepatan 24% di wilayah <span className="text-emerald-300 underline underline-offset-8">Sumatera Utara</span>."
                    </p>
                 </motion.div>

                 <motion.div 
                   whileHover={{ backgroundColor: '#000' }}
                   className="bg-slate-900 p-12 flex items-center gap-12 h-[240px] rounded-[4rem] transition-all group overflow-hidden relative shadow-2xl"
                 >
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-[#2333e7]/50 shadow-[0_0_20px_rgba(35,51,231,1)]" />
                    <div className="w-28 h-28 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 border border-white/10 group-hover:bg-emerald-400 group-hover:text-black transition-all duration-700">
                       <Cpu size={56} strokeWidth={2.5} className="animate-pulse" />
                    </div>
                    <div className="space-y-2">
                       <h5 className="font-display text-4xl font-black text-emerald-400 leading-none">AI CORE v5.9</h5>
                       <p className="font-sans text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">OPTIMAL STATUS</p>
                    </div>
                 </motion.div>
              </div>
           </div>

        </div>

        {/* Global Floating Branding */}
        <div className="fixed top-[50%] right-[-140px] -rotate-90 whitespace-nowrap opacity-[0.015] font-display text-[300px] font-black tracking-tighter pointer-events-none select-none">
           INKATA NATIONAL COMMAND
        </div>
      </main>
    </div>
  )
}
