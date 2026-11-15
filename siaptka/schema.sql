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

-- 5) Fitur bimbel: Mega Tryout, rangkuman, orang tua, premium, Tanya Soal
create table if not exists public.events (
  id text primary key,
  judul text not null,
  jenjang text not null default 'sd',
  mapel text[] not null,
  mulai timestamptz not null,
  selesai timestamptz not null,
  umum timestamptz not null,            -- waktu pengumuman hasil
  soal jsonb not null,                  -- { "mat": [id soal], "bind": [...] }
  menit jsonb,                          -- opsional { "mat": 75 }
  premium boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.event_results (
  event_id text not null references public.events(id) on delete cascade,
  uid uuid not null references auth.users(id) on delete cascade,
  data jsonb not null,                  -- { "mat": {benar,n,skor,durasi,selesai}, ... }
  total numeric not null default 0,
  updated_at timestamptz not null default now(),
  primary key (event_id, uid)
);
create table if not exists public.rangkuman (
  id text primary key,                  -- "<mapel>-<bab>", mis. mat-kpk
  mapel text, bab text, html text not null,
  updated_at timestamptz not null default now()
);
create table if not exists public.link_codes (
  code text primary key,
  child uuid not null references auth.users(id) on delete cascade,
  expires timestamptz not null
);
create table if not exists public.links (
  parent uuid not null references auth.users(id) on delete cascade,
  child uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (parent, child)
);
create table if not exists public.paket (
  id text primary key,
  nama text not null,
  keterangan text,
  harga integer not null,               -- rupiah, dibaca server saat membuat pembayaran
  harga_coret integer,
  hari integer,                         -- masa aktif (hari), atau
  sampai date,                          -- tanggal berakhir tetap
  populer boolean not null default false
);
create table if not exists public.subscriptions (
  uid uuid primary key references auth.users(id) on delete cascade,
  plan text, until timestamptz not null,
  updated_at timestamptz not null default now()
);
create table if not exists public.orders (
  order_id text primary key,
  uid uuid not null references auth.users(id) on delete cascade,
  paket text not null, amount integer not null,
  status text not null default 'pending',
  raw jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.tanya (
  id bigint generated always as identity primary key,
  uid uuid not null references auth.users(id) on delete cascade,
  mapel text, teks text, gambar text,   -- gambar: data URL JPEG kecil
  jawaban text, koreksi text,
  status text not null default 'ai',    -- 'ai' | 'diverifikasi'
  created_at timestamptz not null default now()
);
create index if not exists tanya_uid_time on public.tanya(uid, created_at desc);

alter table public.events        enable row level security;
alter table public.event_results enable row level security;
alter table public.rangkuman     enable row level security;
alter table public.link_codes    enable row level security;
alter table public.links         enable row level security;
alter table public.paket         enable row level security;
alter table public.subscriptions enable row level security;
alter table public.orders        enable row level security;
alter table public.tanya         enable row level security;

drop policy if exists ev_read on public.events;   drop policy if exists ev_write on public.events;
create policy ev_read  on public.events for select using (true);
create policy ev_write on public.events for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists er_read on public.event_results; drop policy if exists er_ins on public.event_results; drop policy if exists er_upd on public.event_results;
create policy er_read on public.event_results for select to authenticated using (
  uid = auth.uid() or public.is_admin()
  or exists (select 1 from public.events e where e.id = event_id and now() >= e.umum));
create policy er_ins on public.event_results for insert to authenticated with check (
  uid = auth.uid() and exists (select 1 from public.events e where e.id = event_id and now() between e.mulai and e.selesai + interval '3 hours'));
create policy er_upd on public.event_results for update to authenticated using (uid = auth.uid()) with check (
  uid = auth.uid() and exists (select 1 from public.events e where e.id = event_id and now() between e.mulai and e.selesai + interval '3 hours'));

drop policy if exists rg_read on public.rangkuman; drop policy if exists rg_write on public.rangkuman;
create policy rg_read  on public.rangkuman for select using (true);
create policy rg_write on public.rangkuman for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists lc_own on public.link_codes;
create policy lc_own on public.link_codes for all to authenticated using (child = auth.uid()) with check (child = auth.uid());
drop policy if exists ln_read on public.links; drop policy if exists ln_del on public.links;
create policy ln_read on public.links for select to authenticated using (parent = auth.uid() or child = auth.uid());
create policy ln_del  on public.links for delete to authenticated using (parent = auth.uid() or child = auth.uid());

-- orang tua boleh membaca data belajar anak yang terhubung
drop policy if exists ud_parent on public.user_docs;
create policy ud_parent on public.user_docs for select to authenticated using (
  exists (select 1 from public.links l where l.parent = auth.uid() and l.child = user_docs.uid));

create or replace function public.claim_link(p_code text) returns uuid
language plpgsql security definer set search_path = public as $$
declare c uuid;
begin
  if auth.uid() is null then return null; end if;
  select child into c from public.link_codes where code = upper(p_code) and expires > now();
  if c is null or c = auth.uid() then return null; end if;
  insert into public.links(parent, child) values (auth.uid(), c) on conflict do nothing;
  delete from public.link_codes where code = upper(p_code);
  return c;
end $$;
grant execute on function public.claim_link(text) to authenticated;

drop policy if exists pk_read on public.paket; drop policy if exists pk_write on public.paket;
create policy pk_read  on public.paket for select using (true);
create policy pk_write on public.paket for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists sub_read on public.subscriptions;
create policy sub_read on public.subscriptions for select to authenticated using (uid = auth.uid());   -- ditulis hanya oleh webhook (service role)
drop policy if exists ord_read on public.orders;
create policy ord_read on public.orders for select to authenticated using (uid = auth.uid() or public.is_admin());

drop policy if exists tq_read on public.tanya; drop policy if exists tq_upd on public.tanya;
create policy tq_read on public.tanya for select to authenticated using (uid = auth.uid() or public.is_admin() or status = 'diverifikasi');
create policy tq_upd  on public.tanya for update to authenticated using (public.is_admin()) with check (public.is_admin());
-- insert hanya lewat Edge Function "tanya" (service role) supaya kuota harian tidak bisa diakali

-- Contoh paket (ubah harga sesuai keinginan; harga ini yang ditagihkan)
insert into public.paket(id, nama, keterangan, harga, harga_coret, hari, sampai, populer) values
  ('bulan', 'Premium 1 Bulan', 'Akses Premium 30 hari', 49000, null, 30, null, false),
  ('tka2027', 'Premium sampai TKA 2027', 'Akses Premium sampai 30 April 2027', 199000, 300000, null, '2027-04-30', true)
on conflict (id) do nothing;

-- 6) Daftarkan email Google Anda sebagai admin (ganti dengan email Anda, huruf kecil semua):
-- insert into public.admins(email) values ('email-anda@gmail.com') on conflict do nothing;
