-- Migrasi Gelombang 5: Kode Undangan Sekolah (Multi-Tenant)
-- Jalankan kode ini di SQL Editor Supabase Anda.

-- 1. Tambah kolom invite_code ke tabel schools
ALTER TABLE public.schools 
  ADD COLUMN IF NOT EXISTS invite_code TEXT UNIQUE;

-- 2. Generate kode untuk sekolah yang sudah ada
UPDATE public.schools 
  SET invite_code = 'INK-' || UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 4))
  WHERE invite_code IS NULL;

-- 3. Verifikasi
SELECT id, name, invite_code FROM public.schools;
