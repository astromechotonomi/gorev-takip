-- ============================================================
-- Astromech Otonomi · Görev Takip — Supabase şeması (v2, temiz sürüm)
-- Sıfırdan bir Supabase projesi kuruyorsanız bu dosyayı SQL Editor'e
-- yapıştırıp çalıştırın. Demo veri YOK — onun için seed_demo.sql kullanın.
--
-- v1'den farkları:
--   - start_date artık tasks tablosunun aslî parçası (sonradan eklenen
--     migration_add_start_date.sql ortadan kalktı)
--   - order_index: görevleri Gantt/listede istediğiniz sırada tutmanızı
--     sağlar (önceden created_at sırasına bağımlıydık)
--   - updated_at + otomatik trigger: bir görev son ne zaman değişti, görülür
--   - tasks.cluster_id / assignee_id üzerinde index: sorgular hızlanır
--   - RLS politikaları tek seferde tanımlanıyor (v1'de önce geniş bir
--     politika yazılıp dosyanın sonunda DROP + tekrar CREATE edilerek
--     daraltılıyordu — okuyan biri için kafa karıştırıcıydı)
-- ============================================================

-- 1) Profiller: her takım üyesinin görünen adı + departmanı.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text not null,
  department text
);

-- 2) Görev kümeleri (Kanat & Gövde, Mancınık, İKA, Aviyonik, Yazılım & Otonomi, Dokümantasyon...)
create table if not exists clusters (
  id text primary key,
  title text not null,
  icon text not null default 'file',
  sort_order int not null default 0
);

-- 3) Görevler
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  cluster_id text references clusters(id) on delete cascade,
  title text not null,
  assignee_id uuid references profiles(id) on delete set null,
  status text not null default 'planlandi' check (status in ('planlandi', 'devam', 'tamamlandi')),
  start_date date,
  due_date date,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tasks_dates_valid check (start_date is null or due_date is null or start_date <= due_date)
);

create index if not exists idx_tasks_cluster_id on tasks (cluster_id);
create index if not exists idx_tasks_assignee_id on tasks (assignee_id);
create index if not exists idx_tasks_status on tasks (status);

-- updated_at'i her UPDATE'te otomatik yenile.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_tasks_updated_at on tasks;
create trigger trg_tasks_updated_at
  before update on tasks
  for each row execute procedure set_updated_at();

-- ------------------------------------------------------------
-- Row Level Security: takım küçük ve güvenilir olduğu için kural basit —
-- giriş yapmış (authenticated) herkes okuyabilir; görev durumunu sadece
-- atanan kişi güncelleyebilir; atama/tarih gibi alanları admin SQL Editor
-- üzerinden ya da ileride eklenecek bir "yönetici" rolünden değiştirir.
-- ------------------------------------------------------------
alter table profiles enable row level security;
alter table clusters enable row level security;
alter table tasks enable row level security;

create policy "Herkes profilleri görebilir" on profiles for select to authenticated using (true);
create policy "Kullanıcı kendi profilini güncelleyebilir" on profiles for update to authenticated using (auth.uid() = id);

create policy "Herkes kümeleri görebilir" on clusters for select to authenticated using (true);

create policy "Herkes görevleri görebilir" on tasks for select to authenticated using (true);
create policy "Herkes görev ekleyebilir" on tasks for insert to authenticated with check (true);
create policy "Sadece atanan kişi görevi güncelleyebilir" on tasks
  for update to authenticated
  using (auth.uid() = assignee_id);

-- Yeni bir kullanıcı kayıt olduğunda profiles tablosuna otomatik satır aç.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name, department)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'department', 'Belirtilmedi')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- 2026-05-30 sonrası oluşturulan Supabase projelerinde RLS politikaları
-- yetmiyor, PostgREST erişimi için ayrıca tablo bazlı GRANT gerekiyor.
grant usage on schema public to authenticated, anon;
grant select, insert, update on profiles to authenticated;
grant select on clusters to authenticated;
grant select, insert, update on tasks to authenticated;
grant usage, select on all sequences in schema public to authenticated;
