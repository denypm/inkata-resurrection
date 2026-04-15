-- Skema Relasional Klasik: Inkata. v5.0
-- Schools -> Teachers -> Students -> Assessments

-- 1. Tabel Schools / Institusi
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active', -- 'active' atau 'locked' (Kill Switch)
    plan TEXT DEFAULT 'Enterprise',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabel Teachers / Guru
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'teacher', -- 'teacher' atau 'super_admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabel Students
CREATE TABLE IF NOT EXISTS public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    grade_level TEXT NOT NULL, -- e.g., '1 SD', '12 SMA'
    room TEXT NOT NULL, -- e.g., 'A', 'B', 'C'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabel Assessments
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    literacy_phase TEXT NOT NULL,
    vowels INTEGER DEFAULT 0,
    diction INTEGER DEFAULT 0,
    syntax INTEGER DEFAULT 0,
    logic INTEGER DEFAULT 0,
    spelling INTEGER DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Keamanan Akses: Row Level Security (RLS) Isolasi Sekolah (Multi-Tenant)
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Fungsi Helper: Mengambil ID Sekolah milik sesi Guru saat ini secara aman
CREATE OR REPLACE FUNCTION public.get_my_school_id() 
RETURNS UUID AS $$
  SELECT school_id FROM public.teachers WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- 1. Kebijakan Tabel Schools: Guru hanya bisa memantau data institusinya
CREATE POLICY "Tinjauan Sekolah Tertutup" 
ON public.schools FOR SELECT USING (id = public.get_my_school_id());

-- 2. Kebijakan Tabel Teachers: Hanya sejawat dalam satu naungan institusi
CREATE POLICY "Tinjauan Sejawat Guru" 
ON public.teachers FOR SELECT USING (school_id = public.get_my_school_id());

-- Khusus untuk bypass Registrasi (Insert pertama), izinkan jika Auth valid.
CREATE POLICY "Registrasi Guru Baru" 
ON public.teachers FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Kebijakan Tabel Students: Isolasi Data Anak mutlak per-Sekolah
CREATE POLICY "Sekolah CRUD Siswanya Sendiri" 
ON public.students FOR ALL USING (school_id = public.get_my_school_id());

-- 4. Kebijakan Tabel Assessments: Isolasi Nilai Rapor dengan subquery
CREATE POLICY "Penilaian Dibatasi Skala Sekolah" 
ON public.assessments FOR ALL USING (
  student_id IN (SELECT id FROM public.students WHERE school_id = public.get_my_school_id())
);

-- 5. Kebijakan Superadmin: Bypass RLS untuk Owner
-- Catatan: Jalankan di Supabase SQL Editor jika belum ada.
-- Superadmin (denydenary@gmail.com) perlu kebijakan terpisah untuk SELECT ALL di tabel schools & teachers.

CREATE POLICY "Superadmin Read All Schools"
ON public.schools FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.teachers WHERE id = auth.uid() AND role = 'super_admin')
  OR auth.uid() IN (SELECT id FROM auth.users WHERE email = 'denydenary@gmail.com')
);

CREATE POLICY "Superadmin Read All Teachers"
ON public.teachers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.teachers WHERE id = auth.uid() AND role = 'super_admin')
  OR auth.uid() IN (SELECT id FROM auth.users WHERE email = 'denydenary@gmail.com')
);

-- 6. Kebijakan untuk UPDATE status sekolah oleh Superadmin
CREATE POLICY "Superadmin Update Schools"
ON public.schools FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.teachers WHERE id = auth.uid() AND role = 'super_admin')
  OR auth.uid() IN (SELECT id FROM auth.users WHERE email = 'denydenary@gmail.com')
);
