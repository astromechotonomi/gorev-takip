-- ============================================================
-- assign_team.sql sonrası kontrol sorguları
-- Bunları Supabase SQL Editor'de çalıştır, sonuçları bana yapıştır,
-- birlikte yorumlayalım (ben canlı veritabanına bağlı değilim, bu yüzden
-- doğrudan kontrol edemiyorum).
-- ============================================================

-- 1) Atanmamış (assignee_id boş) görev var mı? Olmaması beklenir.
select id, title, cluster_id, status
from tasks
where assignee_id is null
order by order_index;

-- 2) Her takım üyesine kaç görev düşmüş? (dağılım dengeli mi diye bak)
select p.display_name, p.department, count(t.id) as gorev_sayisi
from profiles p
left join tasks t on t.assignee_id = p.id
group by p.id, p.display_name, p.department
order by gorev_sayisi desc;

-- 3) username'i olup profiles'ta hiç görev ataması olmayan biri var mı?
select username, display_name
from profiles
where id not in (select assignee_id from tasks where assignee_id is not null);

-- 4) order_index tekrar eden ya da boşluklu mı? (seed_demo.sql ile
--    assign_team.sql'in eşleştiği numaralar tutarlı mı)
select order_index, count(*) 
from tasks
group by order_index
having count(*) > 1;

-- 5) Tarih sırası ters olan görev var mı (start_date > due_date)?
select title, start_date, due_date
from tasks
where start_date is not null and due_date is not null and start_date > due_date;
