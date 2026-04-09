'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()

  useEffect(() => {
    const savedEmail = localStorage.getItem('inkata_saved_email')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      if (rememberMe) {
        localStorage.setItem('inkata_saved_email', email)
      } else {
        localStorage.removeItem('inkata_saved_email')
      }
      router.push('/dashboard')
    }
  }

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Editorial Decorative Backgrounds (Neon Physics) */}
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-5%] left-[10%] w-[400px] h-[400px] bg-tertiary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-[40%] left-[-10%] w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glass Authentication Wrapper */}
      <div className="w-full max-w-5xl mx-auto px-6 relative z-10 flex flex-col md:flex-row gap-12 items-center">
        
        {/* Left Tonal Pillar (Brand Identity) */}
        <div className="flex-1 space-y-10 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
             <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white overflow-hidden shadow-lg shadow-primary/20">
               <img alt="School Logo" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQgTLB3neLWqa8sWSKhvFhRwLvTI-AjE0icWFrEy5IHAHbSmqSJ3WuMcXAbPFliTnH-7GXb-yACz_jshdUIY88Y0wOx4xB_TxFb8hxClaaAh4Jdp02Dne3SkuHfEB-UqN-3AONRjtR8EJcgLfivaBB3ei8T_5TEXNGZDyD8yKZ3rhPbAdIlldsBvgo7YjNBW7zdHVL4sL5HL3q0ErVxWgA30_jawJAn3dHDZjooDTp9lif8JXtehMiVlDGX7oDqbVAmvXhTLD8LDY"/>
             </div>
             <div>
               <h1 className="text-2xl font-black text-[#2333e7] font-headline tracking-tighter">Inkata.</h1>
             </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface leading-[1.1]">
              Gerbang <br />
              <span className="text-gradient">Evolusi Edukasi.</span>
            </h2>
            <p className="text-on-surface-variant text-lg font-medium max-w-md mx-auto md:mx-0 leading-relaxed">
              Otentikasi kredensial Anda untuk mengakses Mesin Utama Inkata. v5.0 dan mulai pantau asimilasi kognitif peserta didik dalam hitungan detik.
            </p>
          </div>
          
          <div className="hidden md:flex gap-4">
             <div className="flex items-center -space-x-4">
                <img className="w-10 h-10 rounded-full border-2 border-surface object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzje1A_paSe6R41lHqdlRAzBRCccS-oApszYrcCGd9dNJtVYjKZcmL9saOHDwCtI9qARuj6B4yYnhCRjGeIclzvqIIyUJ3szVXmT7JXlRNd3asFe4QsHDnjJXzRKXZL5SmkUJzKwfVkeEiRgRSoDy75lWBPiAc98DHzCsH7VyyeWKJ_XgzVJusDt2MtwQ6ffTU48gz2OSogCL2W_2gxwU0OWfGFgnA7mgVeVjUkMVfqfamNuaeEY7ezhkn_Y0Dk4sn9WjO1n8pWeo" />
                <img className="w-10 h-10 rounded-full border-2 border-surface object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlRyhBeoPtLZ3MA0ZyzlYOQgklWdpYXa3oO7eLkQtKMrfllLXzTMlLfNmwpZnXCFg9Rk1ZGIvR-Es94mK6z1zFAuPiJfkpUOmBK_8SyjZTJr64954ONrtAHs1U9O1XTun6PmVG0as0mfV6rxwquD8C0fvVK6ViSiL7OmC_hulX-ahvZEXwnD2GO66flwVlszqeWrLPyLZ_V3Shdm4I1csvl9hbsmYUJyl0avJCjDPOtJ9cy3-7bBxJPefeVVohLS145hT7CNBD_Sc" />
                <img className="w-10 h-10 rounded-full border-2 border-surface object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIDVWBz5VOW3Uj4rsxCYCuxo4B_2Qevj_5rTTr_H084j5yeIjsw-hiuKG8zQw5TT-S-8S7_WnEvRoWGBsmOTobyE4l5rUlp6UkxM7f6b32-KmspY9XGKFuFRq365jbSOqK8-D8WmMvZGEp00whqGMYhgi6-tWhPpGx9PV76-QsSQQ_n_B11CJzRNUGWVuaa5EnsLtiFExL1gwzTkmLukUCpt-cuOg69q54C4z-Bf-e14w-UGdcUh2tO-3Jg6UCckQUat-SkT1hNHA" />
             </div>
             <p className="text-[11px] font-bold uppercase tracking-widest text-[#757688] flex items-center">Bergabung dengan 12.000+ Guru lainnya</p>
          </div>
        </div>

        {/* Right Authentication Panel (Interactive Glassmorphism) */}
        <div className="w-full max-w-[420px]">
          <div className="bg-white/70 backdrop-blur-3xl p-10 rounded-[2.5rem] shadow-glass border border-white/60">
            
            <div className="mb-10">
              <h3 className="font-headline text-2xl font-extrabold tracking-tight text-on-surface mb-2">Login Institusi</h3>
              <p className="text-on-surface-variant text-sm font-medium">Masukkan kredensial sekolah yang terdaftar.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Intelligent Input Wrapper */}
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-[#c5c5d9] group-focus-within:text-primary transition-colors">alternate_email</span>
                  </div>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Alamat Email Pintar"
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
                    placeholder="Sandi Pengaman"
                    className="w-full bg-[#f6f3f2] pl-12 pr-12 py-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white text-on-surface font-semibold placeholder:font-normal placeholder:text-[#757688] transition-all shadow-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#757688] hover:text-primary transition-colors focus:outline-none">
                      <span className="material-symbols-outlined">{showPassword ? 'visibility' : 'visibility_off'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-[#ffdad6] text-[#93000a] text-xs font-bold rounded-xl flex items-center gap-2">
                   <span className="material-symbols-outlined text-sm">error</span>
                   {error}
                </div>
              )}

              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#757688] text-primary focus:ring-primary/20 bg-[#f6f3f2]" 
                  />
                  <span className="text-xs font-bold text-on-surface-variant group-hover:text-primary transition-colors">Ingat Email</span>
                </label>
                <Link href="#" className="flex-shrink-0 text-xs font-bold text-primary hover:text-primary-container transition-colors">
                  Lupa Sandi?
                </Link>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 btn-gradient text-white rounded-xl font-bold shadow-neon-primary hover:shadow-[0_0_25px_0_rgba(67,83,255,0.6)] active:scale-[0.98] transition-all flex justify-center items-center gap-3 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      Buka Gerbang Inkata. <span className="material-symbols-outlined">exit_to_app</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center border-t border-[#ebe7e7] pt-6">
              <p className="text-xs font-semibold text-on-surface-variant">
                Belum mendaftarkan institusi Anda? <br />
                <Link href="/auth/register" className="text-primary font-bold hover:underline mt-2 inline-block">Daftar Akun Baru (Gratis)</Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
