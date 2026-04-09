-- Skema Transaksional Kontrol Super Admin Inkata (Execute in Supabase SQL Editor)

-- 1. Buat tabel master institusi (Klien SaaS)
CREATE TABLE public.institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    display_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'LITS-2024-001'
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    license_plan VARCHAR(50) DEFAULT 'Standard',
    is_active BOOLEAN DEFAULT true,
    total_students INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Memastikan keamanan RLS (Row Level Security) pada tabel institusi
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS: Superadmin dapat melihat/mengedit semuanya, Admin Institusi hanya melihat milik mereka
CREATE POLICY "Superadmin Full Access Institutions"
ON public.institutions
FOR ALL USING (
    (auth.jwt() ->> 'email') LIKE '%admin@inkata%' OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin'
);

-- 3. (OPSIONAL) Menambahkan kolom institution_id pada tabel profiles untuk mengunci akses guru per institusi
-- ALTER TABLE public.profiles ADD COLUMN institution_id UUID REFERENCES public.institutions(id);
