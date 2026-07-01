-- Migrasi V7: Penambahan Sistem Kuota Virtual AI (Token Pulsa)

-- 1. Tambahkan kolom batas kuota dan pemakaian pada tabel schools
-- Default limit adalah 0 (tidak ada kuota awal) agar aman
ALTER TABLE public.schools 
ADD COLUMN IF NOT EXISTS api_tokens_limit INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS api_tokens_used INTEGER DEFAULT 0;

-- 2. Fungsi RPC (Remote Procedure Call) untuk increment kuota yang aman (mencegah race conditions)
CREATE OR REPLACE FUNCTION public.increment_api_usage(p_school_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.schools
  SET api_tokens_used = api_tokens_used + 1
  WHERE id = p_school_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Fungsi RPC untuk Superadmin melakukan Top-Up (Tambah/Set Kuota)
CREATE OR REPLACE FUNCTION public.topup_api_quota(p_school_id UUID, p_amount INTEGER)
RETURNS void AS $$
BEGIN
  -- Pastikan hanya super_admin yang bisa memanggil fungsi ini
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Akses ditolak: Hanya Superadmin yang bisa melakukan Top-Up.';
  END IF;

  UPDATE public.schools
  SET api_tokens_limit = api_tokens_limit + p_amount
  WHERE id = p_school_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
