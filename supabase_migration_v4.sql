-- Migrasi Gelombang 4: Penambahan Kuota Paket Standard vs Enterprise
-- Jalankan kode ini di SQL Editor Supabase Anda.

-- 1. Tambah kolom max_students ke tabel schools
ALTER TABLE public.schools 
  ADD COLUMN IF NOT EXISTS max_students INTEGER DEFAULT 40;

-- 2. Update status sekolah yang sudah ada
-- Pastikan sekolah yang sudah ada mendapatkan paket enterprise (tanpa batas)
UPDATE public.schools 
  SET plan = 'enterprise', max_students = 99999 
  WHERE plan ILIKE 'enterprise';

UPDATE public.schools 
  SET plan = 'standard', max_students = 40 
  WHERE plan ILIKE 'standard' OR plan IS NULL;

-- 3. Verifikasi struktur
-- SELECT name, plan, max_students FROM public.schools;
