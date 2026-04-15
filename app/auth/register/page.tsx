'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, Building2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!schoolName.trim()) {
      setError('Nama Institusi wajib diisi untuk memastikan isolasi data multi-tenant.')
      setLoading(false)
      return
    }

    const supabase = createClient()

    // 1. Daftarkan akun Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          role: 'teacher',
          school_name: schoolName.trim(),
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    const userId = signUpData.user?.id

    if (userId) {
      // 2. Buat entri Sekolah baru di tabel `schools`
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .insert({ name: schoolName.trim() })
        .select('id')
        .single()

      if (schoolError) {
        console.error('Gagal membuat sekolah:', schoolError.message)
        // Tetap lanjutkan — user bisa disetup manual oleh superadmin
      }

      // 3. Buat entri Guru di tabel `teachers` dan tautkan ke sekolah
      if (schoolData) {
        const { error: teacherError } = await supabase
          .from('teachers')
          .insert({
            id: userId,
            school_id: schoolData.id,
            name: email.split('@')[0],
            email: email,
            role: 'teacher',
          })

        if (teacherError) {
          console.error('Gagal menyisipkan guru:', teacherError.message)
        }
      }
    }

    alert('Pendaftaran berhasil! Silakan periksa email Anda untuk verifikasi, lalu masuk ke sistem.')
    router.push('/auth')
    setLoading(false)
  }

  return (
    <div className="min-h-screen font-manrope bg-[#F8FAFC]/50 flex items-center justify-center p-6 relative">
       
       {/* Background Glow */}
       <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex justify-center items-center">
          <div className="w-[600px] h-[600px] bg-white opacity-60 blur-[100px] rounded-full"></div>
       </div>

       {/* Auth Card */}
       <div className="bg-white w-full max-w-[420px] rounded-[3rem] px-10 py-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 relative z-10 flex flex-col items-center">
          
          <h1 className="text-[28px] font-extrabold text-[#1D4ED8] tracking-tighter mb-8">
             inkata.
          </h1>

          <div className="text-center mb-10 w-full space-y-2">
             <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Daftar Akun Edukator</h2>
             <p className="text-sm font-medium text-slate-500">Mulai langkah presisi asesmen literasi.</p>
          </div>

          <form onSubmit={handleRegister} className="w-full">
             {error && (
               <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 text-center">
                 {error}
               </div>
             )}

             <div className="space-y-5">
                {/* Nama Institusi / Sekolah */}
                <div>
                   <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Nama Institusi</label>
                   <div className="relative">
                     <Building2 className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                     <input
                       type="text"
                       required
                       value={schoolName}
                       onChange={(e) => setSchoolName(e.target.value)}
                       className="w-full bg-slate-50 border-none outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 pl-11 pr-5 py-4 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium transition-all"
                       placeholder="SD Nusantara Gemilang"
                     />
                   </div>
                </div>

                <div>
                   <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Email Valid</label>
                   <input
                     type="email"
                     required
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full bg-slate-50 border-none outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 px-5 py-4 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium transition-all"
                     placeholder="nama@sekolah.sch.id"
                   />
                </div>

                <div>
                   <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Password Baru</label>
                   <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 border-none outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 px-5 py-4 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium transition-all"
                        placeholder="Minimal 6 karakter"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors h-full flex items-center"
                      >
                         {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                   </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-[#1746C7] hover:bg-[#1E40AF] disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium py-4 rounded-2xl text-[13px] tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {loading ? 'MEMPROSES KREDENSIAL...' : (
                    <>DAFTARKAN <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
             </div>
          </form>

          <div className="w-full mt-10 text-center space-y-4">
             <p className="text-xs font-medium text-slate-500">Sudah punya akun Inkata?</p>
             <Link href="/auth" className="block w-full">
                <button className="w-full bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-4 rounded-2xl text-[11px] uppercase tracking-widest transition-all">
                  MASUK KE SISTEM
                </button>
             </Link>
          </div>

          <div className="mt-12 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
            © 2026 INKATA EDUCATION TECHNOLOGIES
          </div>
       </div>
    </div>
  )
}
