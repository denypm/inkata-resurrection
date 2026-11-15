-- SiapTKA × Supabase — jalankan sekali di Supabase: SQL Editor → New query → Run.
-- Aman dijalankan ulang.

-- 1) Tabel
create table if not exists public.bank (
  id text primary key,                 -- mis. sd-d-2026-11-15 (harian), sd-m-2026-11-15 (manual)
  tanggal date,
  jenjang text,
  sumber text,                         -- 'harian' | 'manual'
  soal jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.admins (
  email text primary key               -- email Google pemilik/guru yang boleh Kelola Soal
);
create table if not exists public.profiles (
  uid uuid primary key references auth.users(id) on delete cascade,
  name text,
  updated_at timestamptz not null default now()
);
create table if not exists public.scores (
  uid uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
create table if not exists public.user_docs (
  uid uuid not null references auth.users(id) on delete cascade,
  doc_id text not null,                -- t-<timestamp> (tryout) | h-YYYY-MM-DD (harian)
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (uid, doc_id)
);

-- 2) Fungsi admin
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where email = lower(coalesce(auth.jwt() ->> 'email','')));
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- 3) Row Level Security
alter table public.bank      enable row level security;
alter table public.admins    enable row level security;
alter table public.profiles  enable row level security;
alter table public.scores    enable row level security;
alter table public.user_docs enable row level security;

drop policy if exists bank_read  on public.bank;
drop policy if exists bank_write on public.bank;
create policy bank_read  on public.bank for select using (true);                       -- semua orang boleh melihat soal
create policy bank_write on public.bank for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists prof_read on public.profiles;
drop policy if exists prof_ins  on public.profiles;
drop policy if exists prof_upd  on public.profiles;
create policy prof_read on public.profiles for select to authenticated using (true);  -- nama hanya terlihat oleh yang sudah masuk
create policy prof_ins  on public.profiles for insert to authenticated with check (uid = auth.uid());
create policy prof_upd  on public.profiles for update to authenticated using (uid = auth.uid()) with check (uid = auth.uid());

drop policy if exists sc_read on public.scores;
drop policy if exists sc_ins  on public.scores;
drop policy if exists sc_upd  on public.scores;
create policy sc_read on public.scores for select to authenticated using (true);
create policy sc_ins  on public.scores for insert to authenticated with check (uid = auth.uid());
create policy sc_upd  on public.scores for update to authenticated using (uid = auth.uid()) with check (uid = auth.uid());

drop policy if exists ud_own on public.user_docs;
create policy ud_own on public.user_docs for all to authenticated using (uid = auth.uid()) with check (uid = auth.uid());

-- 4) Realtime (ranking & bank soal ikut berubah tanpa reload)
do $$ begin
  begin alter publication supabase_realtime add table public.bank;      exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.scores;    exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.user_docs; exception when duplicate_object then null; end;
end $$;

-- 5) Daftarkan email Google Anda sebagai admin (ganti dengan email Anda, huruf kecil semua):
-- insert into public.admins(email) values ('email-anda@gmail.com') on conflict do nothing;
