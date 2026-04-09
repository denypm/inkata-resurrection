'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [csvStudents, setCsvStudents] = useState<{name: string, grade: string, classGroup: string, phase: string, score: number}[]>([
    { name: 'Alexander Miller', grade: '4', classGroup: 'Kelas A', phase: 'Fase Wacana', score: 98 },
    { name: 'Sarah Connor', grade: '4', classGroup: 'Kelas B', phase: 'Fase Komunikasi', score: 72 },
    { name: 'Jordan King', grade: '4', classGroup: 'Kelas A', phase: 'Fase Bunyi', score: 35 },
    { name: 'Emma Thompson', grade: '4', classGroup: 'Kelas C', phase: 'Fase Wacana', score: 94 },
  ]);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Akses Ditolak: Hanya format .csv yang diizinkan untuk sinkronisasi.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;
      
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        alert('Format CSV tidak valid. Minimum harus memiliki baris header dan 1 baris data.');
        return;
      }
      
      const parsed = lines.slice(1).map(line => {
        const cols = line.split(',').map(c => c.trim());
        return {
          name: cols[0] || 'Nama Tidak Diketahui',
          grade: cols[1] || '4',
          classGroup: `Kelas ${cols[2] || 'A'}`,
          phase: 'Belum Dinilai',
          score: 0,
        };
      }).filter(s => s.name !== 'Nama Tidak Diketahui');
      
      if (parsed.length > 0) {
        setCsvStudents(parsed);
        setUploadedFileName(file.name);
      } else {
        alert('Tidak ada data valid yang dapat diekstrak dari file CSV.');
      }
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const csvContent = "Nama,Jenjang,Kelas\nAhmad Rizky Pratama,4,A\nSiti Nurhaliza,4,A\nMuhammad Fauzan,4,B\nDewi Anggraini,4,B\nRahmat Hidayat,4,C\nNurul Aini,4,C\nBudi Santoso,4,D\nAnisa Putri,4,D";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'template_peserta_didik_inkata.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-surface font-body pt-16 pb-32 px-8 flex justify-center relative overflow-hidden text-on-surface">
      {/* Lumina Signature Glassmorphism/Neon Backgrounds */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-primary-fixed/30 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary-fixed/20 blur-[140px]"></div>
      </div>
      
      <div className="max-w-[1050px] w-full relative z-10">
        {/* Header Region */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12">
          <div className="bg-white/40 backdrop-blur-3xl p-6 rounded-[2rem] outline outline-1 outline-white/70 shadow-glass inline-block">
            <p className="text-primary font-bold text-[11px] tracking-[0.2em] mb-4 uppercase">Intisari Keberhasilan Inkata.</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface leading-tight font-headline">
              Selamat datang,<br />
              <span className="text-gradient">Mitra Inkata.</span>
            </h1>
          </div>
          <div className="flex flex-wrap gap-4 mb-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
            />
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-3 cursor-pointer ${isDragOver ? 'bg-primary/10 border-primary' : 'bg-white/60'} backdrop-blur-xl hover:bg-white text-on-surface font-bold px-6 py-4 rounded-full text-sm transition-all shadow-sm outline outline-1 outline-[#c5c5d9]/20 border-2 border-dashed ${isDragOver ? 'border-primary' : 'border-transparent'}`}
            >
              <span className="material-symbols-outlined text-[20px] text-primary">data_object</span>
              {isDragOver ? 'LEPASKAN DATASETS' : uploadedFileName ? `✓ ${uploadedFileName}` : 'IMPOR DATASETS CSV'}
            </div>
            
            <button 
              onClick={downloadTemplate}
              className="flex items-center gap-2 bg-white/60 backdrop-blur-xl hover:bg-white text-on-surface-variant font-bold px-5 py-4 rounded-full text-sm transition-all shadow-sm outline outline-1 outline-[#c5c5d9]/20"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              UNDUH TEMPLAT
            </button>

            <Link href="/assessment">
              <button className="flex items-center gap-2 btn-gradient text-white font-bold px-8 py-4 rounded-full text-sm transition-all shadow-[0_8px_32px_rgba(67,83,255,0.4)] hover:shadow-[0_12px_40px_rgba(67,83,255,0.6)] hover:-translate-y-1 h-full">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>document_scanner</span>
                EKSTRAKSI MANUSKRIP
              </button>
            </Link>
          </div>
        </div>

        {/* Top 3 Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/60 backdrop-blur-2xl rounded-[2rem] p-8 shadow-glass outline outline-1 outline-white/80 flex flex-col justify-between group hover:-translate-y-1 transition-transform">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
              </div>
              <p className="text-on-surface-variant font-bold text-[10px] tracking-widest">INDEKS KEFASIHAN INSTITUSI</p>
            </div>
            <div className="mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-extrabold text-gradient leading-none mb-6">80</span>
                <span className="text-2xl font-extrabold text-[#2333e7]/60 leading-none">%</span>
              </div>
            </div>
            <div className="w-10/12 bg-surface-container-high/50 h-2.5 rounded-full overflow-hidden mt-auto">
              <div className="btn-gradient h-full rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-2xl rounded-[2rem] p-8 shadow-glass outline outline-1 outline-white/80 flex flex-col justify-between group hover:-translate-y-1 transition-transform">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
                </div>
                <p className="text-on-surface-variant font-bold text-[10px] tracking-widest">PESERTA DIDIK TERDAFTAR</p>
              </div>
              <div className="text-6xl font-extrabold text-on-surface leading-none mb-6">{csvStudents.length}</div>
            </div>
            <p className="text-on-surface-variant/80 font-medium italic text-[13px] mt-auto">Total populasi peserta didik aktif.</p>
          </div>

          <div className="bg-white/60 backdrop-blur-2xl rounded-[2rem] p-8 shadow-glass outline outline-1 outline-white/80 flex flex-col justify-between group hover:-translate-y-1 transition-transform">
             <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#ffebee] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#ba1a1a] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                </div>
                <p className="text-on-surface-variant font-bold text-[10px] tracking-widest">INTERVENSI PRIORITAS</p>
              </div>
              <div className="text-[3.5rem] font-extrabold text-[#ba1a1a] leading-none mb-6">{csvStudents.filter(s => s.score < 50).length}</div>
            </div>
            <p className="text-on-surface-variant/80 font-medium italic text-[13px] mt-auto">Membutuhkan eskalasi bimbingan segera.</p>
          </div>
        </div>

        {/* Real-time Tracking Panel (CSV Data Live) */}
        <div className="bg-white/70 backdrop-blur-3xl rounded-[2rem] p-8 outline outline-1 outline-[#c5c5d9]/15 shadow-glass mb-10 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed/20 rounded-bl-full blur-3xl z-0"></div>
           <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary shadow-sm border border-[#c5c5d9]/30">
                    <span className="material-symbols-outlined text-[24px]">troubleshoot</span>
                  </div>
                  <div>
                    <h2 className="text-[19px] font-extrabold text-on-surface font-headline">Personalisasi Capaian Eksekutif</h2>
                    <p className="text-xs text-on-surface-variant font-medium mt-1">Sinkronisasi Waktu Nyata dari Induk Data CSV (ABCD)</p>
                  </div>
                </div>
                <Link href="/dashboard/students">
                   <button className="text-[11px] font-bold tracking-widest text-[#2333e7] hover:text-[#4353ff] transition-colors uppercase bg-[#e0e0ff] px-4 py-2 rounded-xl">Lihat Seluruh Populasi</button>
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
                {csvStudents.slice(0, 6).map((student, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-surface-container-lowest/50 p-4 rounded-2xl border border-white hover:bg-white transition-colors cursor-pointer group">
                     <div className="flex items-center gap-4 mb-4 sm:mb-0">
                       <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-primary text-xs shadow-inner">
                         {student.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                       </div>
                       <div>
                         <p className="font-extrabold text-sm text-on-surface">{student.name}</p>
                         <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mt-1">{student.classGroup} • Jenjang {student.grade}</p>
                       </div>
                     </div>
                     <div className="w-full sm:w-1/2">
                       <div className="flex justify-between items-end mb-2">
                         <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${student.phase === 'Fase Wacana' ? 'bg-[#e0e0ff] text-primary' : student.phase === 'Fase Komunikasi' ? 'bg-[#ffdad5] text-secondary' : student.phase === 'Belum Dinilai' ? 'bg-[#fff3e0] text-[#e65100]' : 'bg-[#e2e2e5] text-on-surface-variant'}`}>
                           {student.phase}
                         </span>
                         <span className="font-extrabold text-sm">{student.score > 0 ? `${student.score}%` : '—'}</span>
                       </div>
                       <div className="w-full bg-[#e2e2e5] h-1.5 rounded-full overflow-hidden">
                         <div className={`h-full rounded-full ${student.phase === 'Fase Wacana' ? 'bg-primary' : student.phase === 'Fase Komunikasi' ? 'bg-secondary' : student.score === 0 ? 'bg-[#e65100]/40' : 'bg-outline-variant'}`} style={{ width: `${student.score}%` }}></div>
                       </div>
                     </div>
                  </div>
                ))}
              </div>
              {csvStudents.length > 6 && (
                <div className="mt-6 text-center">
                  <Link href="/dashboard/students" className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">
                    + {csvStudents.length - 6} Entitas Lainnya
                  </Link>
                </div>
              )}
           </div>
        </div>

        {/* Bottom 2 Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/dashboard/students" className="block transform transition-transform hover:-translate-y-1 active:translate-y-0">
            <div className="bg-surface-container-low/80 backdrop-blur-3xl rounded-[2rem] p-8 outline outline-1 outline-[#c5c5d9]/15 shadow-glass h-full flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed/30 rounded-bl-full blur-2xl z-0"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center shadow-neon-yellow">
                    <span className="material-symbols-outlined text-secondary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                  </div>
                  <h2 className="text-[19px] font-extrabold text-on-surface font-headline">Distribusi Resolusi Kognitif</h2>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur font-extrabold text-[#7a5900] flex items-center justify-center text-lg shadow-sm outline outline-1 outline-[#c5c5d9]/20">1</div>
                    <div>
                      <p className="font-extrabold text-on-surface text-[15px]">Kelas Peringkat Tinggi</p>
                      <p className="text-on-surface-variant font-medium text-[12px] mt-0.5">100% Peserta telah dipindai</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-gradient text-xl">80.5%</p>
                    <p className="text-on-surface-variant/60 font-bold text-[10px] tracking-widest mt-1">PRESISI MESIN</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/assessment/analysis" className="block transform transition-transform hover:-translate-y-1 active:translate-y-0">
            <div className="bg-surface-container-low/80 backdrop-blur-3xl rounded-[2rem] p-8 outline outline-1 outline-[#c5c5d9]/15 shadow-glass h-full flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/40 rounded-bl-full blur-2xl z-0"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center shadow-neon-primary">
                    <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                  <h2 className="text-[19px] font-extrabold text-on-surface font-headline">Pemantauan Ekstraksi Asesmen</h2>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <span className="font-extrabold text-on-surface text-[15px]">Infrastruktur Sentral</span>
                    <span className="text-on-surface-variant font-bold text-[13px]">Validasi Terselesaikan</span>
                  </div>
                  <div className="w-full bg-[#c5c5d9]/30 h-[10px] rounded-full overflow-hidden">
                    <div className="btn-gradient h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
