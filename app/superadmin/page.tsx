'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Shield, Building2, Users, ToggleLeft, ToggleRight, Search, TrendingUp, Activity } from 'lucide-react'
import PulseLogo from '@/components/ui/pulse-logo'

export default function SuperAdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [schools, setSchools] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      // RBAC: Hanya Super Admin (cek DB role + metadata)
      if (!user) {
        router.push('/dashboard')
        return
      }
      
      const { data: teacherRole } = await supabase.from('teachers').select('role').eq('id', user.id).single()
      const hasDbSuperAdmin = teacherRole?.role === 'super_admin'
      const hasMetaSuperAdmin = user.user_metadata?.role === 'superadmin' || user.user_metadata?.role === 'super_admin'
      
      if (!hasDbSuperAdmin && !hasMetaSuperAdmin) {
        router.push('/dashboard')
        return
      }

      // Baca tabel schools (bypass RLS menggunakan service role idealnya, tapi kita coba dulu)
      const { data: schoolsData } = await supabase.from('schools').select('*')
      const { data: teachersData } = await supabase.from('teachers').select('*')
      
      if (schoolsData) setSchools(schoolsData)
      if (teachersData) setTeachers(teachersData)
      
      setLoading(false)
    }
    init()
  }, [router])

  const toggleSchoolStatus = async (id: string) => {
    const target = schools.find(s => s.id === id)
    if (!target) return

    const newStatus = !target.is_active
    const supabase = createClient()
    
    await supabase
      .from('schools')
      .update({ is_active: newStatus, status: newStatus ? 'active' : 'locked' })
      .eq('id', id)

    setSchools(schools.map(school => 
      school.id === id ? { ...school, is_active: newStatus, status: newStatus ? 'active' : 'locked' } : school
    ))
  }

  const toggleSchoolPlan = async (id: string) => {
    const target = schools.find(s => s.id === id)
    if (!target) return

    const newPlan = target.plan?.toLowerCase() === 'enterprise' ? 'standard' : 'enterprise'
    const newMaxStudents = newPlan === 'enterprise' ? 99999 : 40
    
    const supabase = createClient()
    await supabase
      .from('schools')
      .update({ plan: newPlan, max_students: newMaxStudents })
      .eq('id', id)

    setSchools(schools.map(school => 
      school.id === id ? { ...school, plan: newPlan, max_students: newMaxStudents } : school
    ))
  }

  const topUpQuota = async (id: string) => {
    const target = schools.find(s => s.id === id)
    if (!target) return
    const amount = parseInt(window.prompt("Masukkan jumlah kuota AI yang ingin ditambahkan (top-up):", "1000") || "0", 10)
    if (isNaN(amount) || amount <= 0) return

    const supabase = createClient()
    // Call RPC
    const { error } = await supabase.rpc('topup_api_quota', { p_school_id: id, p_amount: amount })
    if (!error) {
      setSchools(schools.map(school => 
        school.id === id ? { ...school, api_tokens_limit: (school.api_tokens_limit || 0) + amount } : school
      ))
    } else {
      alert("Gagal melakukan Top-Up: " + error.message)
    }
  }

  const filteredSchools = schools.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalStudentEstimate = schools.length * 25 // Estimasi

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-manrope">
         <div className="flex flex-col items-center gap-4">
            <PulseLogo />
            <p className="text-[10px] font-extrabold text-slate-400 tracking-[0.3em] animate-pulse uppercase mt-4">Memverifikasi Otoritas Owner</p>
         </div>
      </div>
    )
  }

  return (
    <div className="bg-white text-slate-900 min-h-screen pb-32 font-manrope antialiased">

      <main className="pt-12 px-8 max-w-[1100px] mx-auto space-y-12">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-[10px] tracking-[0.2em] uppercase text-slate-400">OWNER CONSOLE</span>
            </div>
            <h2 className="text-[40px] font-extrabold text-slate-900 tracking-tight leading-[1.1]">Kontrol Super Admin</h2>
            <p className="mt-3 text-slate-500 max-w-xl font-medium leading-relaxed text-sm">
              Sentralisasi manajemen dan pengawasan infrastruktur pendidikan. Kendali penuh atas ekosistem multi-tenant Inkata.
            </p>
          </div>
        </section>

        {/* Metric Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col gap-3 hover:-translate-y-0.5 transition-transform">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#F0F5FF] text-[#1D4ED8]">
              <Building2 className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mt-2">Total Institusi</p>
            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tighter">{schools.length}</h3>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col gap-3 hover:-translate-y-0.5 transition-transform">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mt-2">Total Guru</p>
            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tighter">{teachers.length}</h3>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col gap-3 hover:-translate-y-0.5 transition-transform">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-50 text-orange-500">
              <Activity className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mt-2">Sesi Aktif</p>
            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tighter">{schools.filter(s => s.is_active).length}</h3>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col gap-3 hover:-translate-y-0.5 transition-transform">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600">
               <Shield className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mt-2">Klien Enterprise</p>
            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tighter">
              {schools.filter(s => s.plan?.toLowerCase() === 'enterprise').length}
            </h3>
          </div>
        </section>

        {/* Schools Table with Kill-Switch */}
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden mt-8">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Klien Institusi Terdaftar</h3>
              <p className="text-xs text-slate-500 mt-1">Kelola status akses dan lisensi setiap sekolah.</p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Cari institusi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-full text-xs font-bold w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 transition-all text-slate-800"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredSchools.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm font-bold">
                {schools.length === 0 
                  ? 'Belum ada institusi yang terdaftar di Inkata.' 
                  : 'Tidak ada institusi yang cocok dengan pencarian.'}
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Institusi</th>
                    <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Lisensi</th>
                    <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Kuota AI</th>
                    <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Didaftarkan</th>
                    <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-right">Kill Switch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredSchools.map((school) => (
                    <tr key={school.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#F0F5FF] text-[#1D4ED8] flex items-center justify-center font-extrabold text-[10px]">
                            {school.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-extrabold text-sm text-slate-800 block">{school.name}</span>
                            <span className="text-[10px] font-bold text-slate-400">{school.id.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <button 
                          onClick={() => toggleSchoolPlan(school.id)}
                          className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all hover:scale-105 ${school.plan?.toLowerCase() === 'enterprise' ? 'bg-[#1D4ED8] text-white' : 'bg-slate-100 text-slate-600'}`}
                        >
                          {school.plan || 'Standard'}
                        </button>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">
                            {Math.max(0, (school.api_tokens_limit || 0) - (school.api_tokens_used || 0))} sisa
                          </span>
                          <button 
                            onClick={() => topUpQuota(school.id)}
                            className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                          >
                            + Top Up
                          </button>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full ${school.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                          {school.is_active ? 'Aktif' : 'Terkunci'}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-bold text-slate-500">
                          {new Date(school.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => toggleSchoolStatus(school.id)}
                          className="inline-flex items-center gap-2 transition-colors"
                        >
                          {school.is_active ? (
                            <ToggleRight className="w-8 h-8 text-emerald-500 hover:text-emerald-600" />
                          ) : (
                            <ToggleLeft className="w-8 h-8 text-slate-300 hover:text-slate-400" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Teachers Section */}
        {teachers.length > 0 && (
          <section className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Guru Terdaftar di Sistem</h3>
              <p className="text-xs text-slate-500 mt-1">Pemetaan akun edukator yang terhubung dengan institusi.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Guru</th>
                    <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Email</th>
                    <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Role</th>
                    <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">School ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {teachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <span className="font-extrabold text-sm text-slate-800">{teacher.name}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-bold text-slate-500">{teacher.email}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full ${teacher.role === 'super_admin' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                          {teacher.role}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[10px] font-bold text-slate-400 font-mono">{teacher.school_id ? teacher.school_id.slice(0, 12) + '...' : '—'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Diagnostik Card Bawah */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
          <div className="lg:col-span-2 bg-slate-50 p-10 rounded-[2rem] border border-slate-100 relative overflow-hidden">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">Saturasi Platform</h4>
                <p className="text-xs text-slate-500 font-medium mt-1">Pertumbuhan adopsi institusi Inkata per kuartal</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-100">
                <TrendingUp className="w-5 h-5 text-[#1D4ED8]" />
              </div>
            </div>
            {/* Bar Chart Visual */}
            <div className="h-44 flex items-end gap-3 lg:gap-5">
              {[40, 60, 50, 85, 70, 95].map((h, i) => (
                <div key={i} className={`flex-1 rounded-t-xl transition-colors ${i === 3 || i === 5 ? 'bg-[#1D4ED8]' : 'bg-slate-200 hover:bg-slate-300'}`} style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1 bg-slate-900 text-white p-10 rounded-[2rem] flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-lg font-extrabold mb-4 text-slate-100 tracking-tight">Diagnostik Owner</h4>
              <p className="text-sm leading-relaxed text-slate-400 font-medium">
                Sistem multi-tenant aktif mengayomi <span className="text-white font-extrabold">{schools.length}</span> institusi dengan <span className="text-white font-extrabold">{teachers.length}</span> edukator terdaftar di jaringan Inkata.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3 border-t border-slate-700/50 pt-6 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-slate-500">Mesin Inkata Aktif</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
