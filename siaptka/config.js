/* Isi dua nilai ini dari Supabase: Project Settings → API.
   "anon public key" memang aman ditaruh di halaman publik; keamanan data diatur oleh RLS di schema.sql.
   JANGAN pernah menaruh "service_role key" di file ini. */
window.SIAPTKA_CONFIG = {
  supabaseUrl: "https://PROJECT-ANDA.supabase.co",
  supabaseAnonKey: "ISI-ANON-KEY-ANDA"
};
