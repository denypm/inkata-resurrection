-- Skema Relasional Klasik: Inkata. v6.0
-- Schools -> Teachers -> Students -> Assessments
-- CHANGELOG v6: Konsolidasi grade, invite_code, max_students, teacher_id di assessments

-- 1. Tabel Schools / Institusi
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active', -- 'active' atau 'locked' (Kill Switch)
    plan TEXT DEFAULT 'standard',
    max_students INTEGER DEFAULT 40,
    invite_code TEXT UNIQUE,
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
    grade TEXT NOT NULL, -- e.g., 'SD - A', '1 SD', 'Kelas 2 - B'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabel Assessments
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
    score INTEGER NOT NULL,
    insights JSONB,
    narrative_feedback TEXT,
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

-- Fungsi Helper: Cek apakah user adalah super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.teachers WHERE id = auth.uid() AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 1. Kebijakan Tabel Schools
CREATE POLICY "Tinjauan Sekolah Tertutup" 
ON public.schools FOR SELECT USING (
  id = public.get_my_school_id() OR public.is_super_admin()
);

CREATE POLICY "Superadmin Update Schools"
ON public.schools FOR UPDATE USING (public.is_super_admin());

-- 2. Kebijakan Tabel Teachers
CREATE POLICY "Tinjauan Sejawat Guru" 
ON public.teachers FOR SELECT USING (
  school_id = public.get_my_school_id() OR public.is_super_admin()
);

CREATE POLICY "Registrasi Guru Baru" 
ON public.teachers FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Kebijakan Tabel Students: Isolasi Data per-Sekolah
CREATE POLICY "Sekolah CRUD Siswanya Sendiri" 
ON public.students FOR ALL USING (school_id = public.get_my_school_id());

-- 4. Kebijakan Tabel Assessments: Isolasi dengan subquery
CREATE POLICY "Penilaian Dibatasi Skala Sekolah" 
ON public.assessments FOR ALL USING (
  student_id IN (SELECT id FROM public.students WHERE school_id = public.get_my_school_id())
);
