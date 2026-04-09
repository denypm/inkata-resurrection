'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    
    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          school_name: schoolName,
        }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen relative overflow-hidden flex items-center justify-center py-12">
      {/* Editorial Decorative Backgrounds */}
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-5%] left-[10%] w-[400px] h-[400px] bg-tertiary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-[40%] left-[-10%] w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glass Authentication Wrapper */}
      <div className="w-full max-w-5xl mx-auto px-6 relative z-10 flex flex-col md:flex-row-reverse gap-12 items-center">
        
        {/* Right Tonal Pillar (Brand Identity) */}
        <div className="flex-1 space-y-10 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
             <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white overflow-hidden shadow-lg shadow-primary/20">
               <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
             </div>
             <div>
               <h1 className="text-2xl font-black text-[#2333e7] font-headline tracking-tighter">Inkata</h1>
             </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface leading-[1.1]">
              Katalisator <br />
              <span className="text-gradient">Masa Depan.</span>
            </h2>
            <p className="text-on-surface-variant text-lg font-medium max-w-md mx-auto md:mx-0 leading-relaxed">
              Bergabunglah bersama pionir arsitek edukasi. Daftarkan institusi Anda untuk memulai pemetaan literasi tingkat lanjut.
            </p>
          </div>
          
          <div className="pt-4 border-t border-[#ebe7e7] max-w-sm mx-auto md:mx-0">
             <div className="flex items-start gap-4">
               <span className="material-symbols-outlined text-[#006022] bg-[#bdf0c6] p-2 rounded-full">security</span>
               <div>
                  <p className="text-sm font-bold text-on-surface">Data Institusi Terenkripsi</p>
                  <p className="text-xs text-[#757688]">Kami mematuhi regulasi perundangan keamanan data privasi pendidikan nomor 1.</p>
               </div>
             </div>
          </div>
        </div>

        {/* Left Registration Panel */}
        <div className="w-full max-w-[420px]">
          <div className="bg-white/70 backdrop-blur-3xl p-10 rounded-[2.5rem] shadow-glass border border-white/60">
            
            {success ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-[#bdf0c6] rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon-green">
                  <span className="material-symbols-outlined text-[#006022] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
                </div>
                <h3 className="font-headline text-2xl font-extrabold tracking-tight text-on-surface mb-4">Periksa Inbox Anda</h3>
                <p className="text-on-surface-variant text-sm font-medium leading-relaxed mb-8">
                  Tautan keamanan otorisasi akses institut telah dikirimkan ke <strong>{email}</strong>. Harap lakukan konfirmasi sebelum memulai misi Anda.
                </p>
                <Link href="/auth">
                  <button className="w-full py-4 bg-surface-container-high text-on-surface rounded-xl font-bold hover:bg-surface-container-highest transition-colors">
                    Kembali ke Gerbang Login
                  </button>
                </Link>
              </div>
            ) : (
              <React.Fragment>
                <div className="mb-8">
                  <h3 className="font-headline text-2xl font-extrabold tracking-tight text-on-surface mb-2">Registrasi Inkata</h3>
                  <p className="text-on-surface-variant text-sm font-medium">Lengkapi manifes identitas untuk mengkalibrasi akses.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  
                  {/* Intelligent Input Wrappers */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-[#c5c5d9] group-focus-within:text-primary transition-colors">person</span>
                    </div>
                    <input 
                      type="text" 
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nama Lengkap Anda"
                      className="w-full bg-[#f6f3f2] pl-12 pr-4 py-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white text-on-surface font-semibold placeholder:font-normal placeholder:text-[#757688] transition-all shadow-sm"
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-[#c5c5d9] group-focus-within:text-primary transition-colors">apartment</span>
                    </div>
                    <input 
                      type="text" 
                      required
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="Nama Sekolah / Institusi"
                      className="w-full bg-[#f6f3f2] pl-12 pr-4 py-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white text-on-surface font-semibold placeholder:font-normal placeholder:text-[#757688] transition-all shadow-sm"
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-[#c5c5d9] group-focus-within:text-primary transition-colors">alternate_email</span>
                    </div>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Aktif Institusi"
                      className="w-full bg-[#f6f3f2] pl-12 pr-4 py-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white text-on-surface font-semibold placeholder:font-normal placeholder:text-[#757688] transition-all shadow-sm"
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-[#c5c5d9] group-focus-within:text-primary transition-colors">lock</span>
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Sandikan Proteksi"
                      className="w-full bg-[#f6f3f2] pl-12 pr-12 py-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white text-on-surface font-semibold placeholder:font-normal placeholder:text-[#757688] transition-all shadow-sm"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#757688] hover:text-primary transition-colors focus:outline-none">
                        <span className="material-symbols-outlined">{showPassword ? 'visibility' : 'visibility_off'}</span>
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-[#ffdad6] text-[#93000a] text-xs font-bold rounded-xl flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">error</span>
                      {error}
                    </div>
                  )}

                  <div className="pt-6">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full py-4 btn-gradient text-white rounded-xl font-bold shadow-neon-primary hover:shadow-[0_0_25px_0_rgba(67,83,255,0.6)] active:scale-[0.98] transition-all flex justify-center items-center gap-3 disabled:opacity-70"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                          Validasi Pendaftaran <span className="material-symbols-outlined">how_to_reg</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-8 text-center border-t border-[#ebe7e7] pt-6">
                  <p className="text-xs font-semibold text-on-surface-variant">
                    Sudah pernah mendaftar ekosistem ini? <br />
                    <Link href="/auth" className="text-primary font-bold hover:underline mt-2 inline-block">Kembali ke Gerbang Login</Link>
                  </p>
                </div>
              </React.Fragment>
            )}
            
          </div>
        </div>
      </div>
    </div>
  )
}
