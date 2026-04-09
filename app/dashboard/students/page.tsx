import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const MOCK_STUDENTS = [
  { id: 1, name: 'Julian Alvarez', status: 'Fase Wacana', proficiency: 94, classGroup: 'Kelas A', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3USM3-uKnVVjYMVHrgaODpJEG6hl30GcdyIPCowrLt4zot4gwYoC5Llr_WnGZXinhi8KZVtS9pFHBjNMpBZ8l0-uxttCaI8W9o6Vg9z-tuP_bObSPB6iMvX2iOZ3cDHzfCH_Jjl1AzIGdK2MR2xU1xEvZj3gb2NgZkjOE2WFmcvMMx77LUPMVRCj29gMwDrpZix8dGhGRdmqE-EUGcbFh-P6Sn85xsPv3bFzkt1E1a-nnfnV0K19gcZwpoSo1DDj_ZPB3jMWG0zw' },
  { id: 2, name: 'Elena Rodriguez', status: 'Fase Komunikasi', proficiency: 68, classGroup: 'Kelas B', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBy7ojibxR_CoDzJG3WN3xrG9vUdJpSTM67rwSuVvv69ckncsJXwC5T-1mA1sMH2Csmel05Yru0rIaqZKNmk0sj7qpGSsIpE5ckJSbmfkmia8GozcbG4g8jb8b0iBptaK7M2Dk7F-QBDINE1oNXQsdjZrN5mBg7MV6WCalYrQJ-1zgCystGtLMYcoA5pDUfPQHAQ5B_9O4czpYbuV3UyC4inOFMe625VlitUjSE1UFtcHL3b3HD1FN-MOK2EFVr6K1BmIfrgqkkqU' },
  { id: 3, name: 'Marcus Chen', status: 'Fase Bunyi', proficiency: 32, classGroup: 'Kelas A', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4JWRM4W_3SEYORsi_iOJ4zVz8RT_9mNZ2yud10T0G3BE2r6w-Rd_TEXH7dPKZyNUypUPbU4VO4oaJ7JWQ_PhyHSAPnOJg6n0PYWT2JQG5LEyqMI_zgXs0qpppbVkNlYkimR1plfEeIAquV-7SrAvoFceT0uUsOs2S-z90nOoSIpbGniQ8EvNCWtFQBUhj-wrkIo4DMEfkKinS02q6taFegNePQ8FWX_ENEyy6yUlIC8tqNLLPxyduU_W9o9iXMDVDjGbhJyvwuZY' },
]

export default async function StudentsPage() {
  const supabase = createClient()
  const { data: dbStudents, error } = await supabase.from('students').select('*').order('proficiency', { ascending: false }).limit(20)
  const students = dbStudents && dbStudents.length > 0 ? dbStudents : MOCK_STUDENTS

  return (
    <div className="bg-background text-on-background font-body min-h-screen pb-24 md:pb-0">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <section className="mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Profil Peserta Didik</h2>
          <p className="text-on-surface-variant text-lg max-w-2xl">Pantau progresi literasi secara waktu nyata dan kategorisasikan hasil evaluasi kelas Anda.</p>
        </section>

        {/* Search and Filter Bar */}
        <section className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:bg-surface-container-lowest focus:ring-0 transition-all border-b-2 border-transparent focus:border-primary text-on-surface outline-none" placeholder="Cari berdasarkan nama atau identitas..." type="text"/>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-6 py-4 bg-surface-container-low rounded-xl text-on-surface font-semibold hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-xl">filter_list</span>
              Kelas 4-A
            </button>
            <button className="flex items-center gap-2 px-6 py-4 bg-surface-container-low rounded-xl text-on-surface font-semibold hover:bg-surface-container-high transition-colors">
              Semua Fase
              <span className="material-symbols-outlined text-xl">expand_more</span>
            </button>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Student List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-surface-container rounded-3xl p-1">
              <div className="max-h-[700px] overflow-y-auto custom-scrollbar p-5 space-y-4">
                {students.map((student: any) => {
                  const isFluent = student.proficiency >= 80;
                  const isDeveloping = student.proficiency >= 50 && student.proficiency < 80;
                  
                  const bgContainer = isFluent ? "bg-primary-fixed text-on-primary-fixed-variant" : isDeveloping ? "bg-secondary-fixed text-on-secondary-fixed-variant" : "bg-surface-container-high text-tertiary-container";
                  const statusText = isFluent ? "Fase Wacana" : isDeveloping ? "Fase Komunikasi" : "Fase Bunyi";
                  const barColor = isFluent ? "bg-primary" : isDeveloping ? "bg-secondary-container" : "bg-tertiary-container";

                  return (
                    <div key={student.id} className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-shadow group">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-surface-container">
                          <img alt="Student Avatar" className="w-full h-full object-cover" src={student.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuDHdx1Bzh4IZYMOHubmgbF4GxuyELcKYvQsoSgNL4gzG1tDDnsB85EZuenFLG6uOxUIGmx7ooSgUpMnoDiA75TT4v26AsckbW2LR5AuJ4FOiQ8D3BtAf_tGw2CGjmXLgZxpNo4kA0QjrnU6R6dazEBeHHUd1UUZF-w451jfx7eEqzS-FIiUxaUuvcx47mMETpkkYNUPVeTGWaRE7RzdSMnFm4tuFSYvgMlK5jfqNeynNE0w_ZV32D76TBaAnBH2y867PA4RU4pfP-4"}/>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg font-headline text-on-surface">{student.name}</h4>
                          <span className={`px-3 py-1 ${bgContainer} rounded-full text-xs font-bold uppercase tracking-wider`}>{statusText}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                        <div className="flex items-end gap-1 h-8 items-center">
                          <div className={`w-1.5 ${barColor} rounded-full h-3`}></div>
                          <div className={`w-1.5 ${barColor} rounded-full h-5`}></div>
                          <div className={`w-1.5 ${barColor} rounded-full h-4`}></div>
                          <div className={`w-1.5 ${barColor} rounded-full h-7`}></div>
                          <div className={`w-1.5 ${barColor} rounded-full h-8`}></div>
                          <span className="text-xs font-bold text-on-surface-variant ml-3">Kefasihan {student.proficiency}%</span>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/dashboard/students/${student.id}`}>
                              <button className="px-4 py-2 bg-surface-container-low hover:bg-surface-container-high rounded-lg text-xs font-bold text-on-surface transition-colors">Data Detail</button>
                          </Link>
                          <button className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold shadow-sm hover:opacity-90 transition-opacity">Penugasan Evaluasi</button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Analysis & Actions */}
          <div className="lg:col-span-4 space-y-6">
            {/* Session Quick Categorization */}
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_4px_40px_rgba(28,27,27,0.04)] border border-outline-variant/15">
              <h3 className="text-xl font-bold font-headline text-on-surface mb-6">Sesi Evaluasi Aktif</h3>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-surface-container-high overflow-hidden">
                  <img alt="Active Student" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuArG2GoM1KdVHX-XTejNlxqtxbIY6dC72ZrHRG4p66fwwLAYft3bNGxqyvWnwm9Kmg9IEhBejloFTHl-E3lPx2KPxtklKstnLxkk0ub50W86hSy34qAIovI1ps2uHC7OkYiBUeQYWCug8WQirsadTCFBTTp4EK0gBhWLooCLQkp6roaidA2gfrCry645mIGBG__8qV28GEO6dDt5OG8dyVLw_NgqrIH5B7FP1erSf8V5PNOPIZjriqP7wRl7XMZV0ySilp0I6s6_KI"/>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Sedang Dinilai</p>
                  <h4 className="text-lg font-extrabold text-on-surface leading-tight">Julian Alvarez</h4>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-semibold text-on-surface-variant">Keputusan Penilaian Sistem:</p>
                <button className="w-full flex items-center justify-between p-4 bg-primary-fixed text-on-primary-fixed-variant rounded-2xl hover:scale-[0.98] transition-transform">
                  <span className="font-bold">Penguasaan Sempurna</span>
                  <span className="material-symbols-outlined">check_circle</span>
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-secondary-fixed text-on-secondary-fixed-variant rounded-2xl hover:scale-[0.98] transition-transform">
                  <span className="font-bold">Kemajuan Parsial</span>
                  <span className="material-symbols-outlined">trending_up</span>
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-surface-container-high text-tertiary-container rounded-2xl hover:scale-[0.98] transition-transform">
                  <span className="font-bold">Diperlukan Peninjauan</span>
                  <span className="material-symbols-outlined">assignment_late</span>
                </button>
              </div>
              <div className="mt-8 pt-8 border-t border-outline-variant/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-on-surface">Target Kurikulum Nasional</span>
                  <span className="text-sm font-bold text-primary">85%</span>
                </div>
                <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-secondary-container to-primary w-[85%] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Insights Bento Card */}
            <div className="bg-primary p-8 rounded-3xl text-white overflow-hidden relative group">
              <div className="relative z-10">
                <h3 className="text-2xl font-extrabold font-headline mb-2">Laporan Inkata.</h3>
                <p className="text-primary-fixed/80 text-sm mb-6">Kesadaran fonemik struktural pada Grup 4-A meningkat drastis sebesar 12% dalam ekuinoks minggu ini.</p>
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                  </div>
                  <button className="text-sm font-bold border-b-2 border-white/40 hover:border-white transition-all">Tinjau Data Integral</button>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-28 right-6 md:bottom-10 md:right-10 w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl hover:scale-105 active:scale-95 transition-all z-40 group">
        <span className="material-symbols-outlined text-3xl">add</span>
        <span className="absolute right-full mr-4 bg-inverse-surface text-inverse-on-surface text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Daftarkan Peserta Didik Baru</span>
      </button>
    </div>
  )
}
