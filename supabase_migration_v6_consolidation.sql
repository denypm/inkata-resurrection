-- Migrasi Gelombang 6: Konsolidasi Skema Inkata v6.0
-- Jalankan kode ini di SQL Editor Supabase SETELAH backup.
-- Perubahan: grade_level+room → grade, tambah teacher_id di assessments

-- 1. Cek apakah kolom grade_level dan room masih ada, lalu migrasi
DO $$
BEGIN
  -- Jika kolom grade_level ada, gabungkan ke kolom grade
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='grade_level') THEN
    -- Tambah kolom grade jika belum ada
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='grade') THEN
      ALTER TABLE public.students ADD COLUMN grade TEXT;
    END IF;
    -- Migrasi data: gabungkan grade_level dan room
    UPDATE public.students SET grade = COALESCE(grade_level, '') || ' - ' || COALESCE(room, '') WHERE grade IS NULL;
    -- Hapus kolom lama (opsional, uncomment jika yakin)
    -- ALTER TABLE public.students DROP COLUMN IF EXISTS grade_level;
    -- ALTER TABLE public.students DROP COLUMN IF EXISTS room;
  END IF;
END $$;

-- 2. Pastikan kolom grade NOT NULL
ALTER TABLE public.students ALTER COLUMN grade SET NOT NULL;

-- 3. Tambah teacher_id ke assessments jika belum ada
ALTER TABLE public.assessments 
  ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL;

-- 4. Pastikan invite_code dan max_students ada di schools
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS invite_code TEXT UNIQUE;
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS max_students INTEGER DEFAULT 40;

-- 5. Generate invite_code untuk sekolah yang belum punya
UPDATE public.schools 
  SET invite_code = 'INK-' || UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 4))
  WHERE invite_code IS NULL;

-- 6. Buat fungsi helper super_admin jika belum ada
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.teachers WHERE id = auth.uid() AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 7. Verifikasi
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'students';
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'assessments';
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'schools';
