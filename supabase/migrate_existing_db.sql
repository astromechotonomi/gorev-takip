-- ============================================================
-- Astromech Otonomi · Görev Takip — Mevcut (canlı) veritabanını
-- v2 yapısına yükselt. Hiçbir tabloyu silmez/yeniden oluşturmaz,
-- sadece eksik kolon/index/trigger'ları ekler. Var olan veriniz korunur.
--
-- Supabase Dashboard > SQL Editor'e yapıştırıp çalıştırmanız yeterli.
-- ============================================================

-- order_index: yoksa ekle, mevcut görevlere created_at sırasına göre
-- otomatik bir başlangıç değeri ver (sonradan dilediğiniz gibi değiştirin).
alter table tasks add column if not exists order_index int not null default 0;

with ranked as (
  select id, row_number() over (order by created_at) as rn
  from tasks
)
update tasks
set order_index = ranked.rn
from ranked
where tasks.id = ranked.id and tasks.order_index = 0;

-- updated_at: yoksa ekle + her güncellemede otomatik yenilensin.
alter table tasks add column if not exists updated_at timestamptz not null default now();

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

-- Tarih sırası bozuk girilmiş görev olmasın diye basit bir kontrol.
alter table tasks drop constraint if exists tasks_dates_valid;
alter table tasks add constraint tasks_dates_valid
  check (start_date is null or due_date is null or start_date <= due_date);

-- Sorgu hızlandırıcı index'ler (foreign key kolonlarında Postgres bunları
-- otomatik oluşturmaz).
create index if not exists idx_tasks_cluster_id on tasks (cluster_id);
create index if not exists idx_tasks_assignee_id on tasks (assignee_id);
create index if not exists idx_tasks_status on tasks (status);
