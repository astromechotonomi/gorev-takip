-- ============================================================
-- Astromech Otonomi · Görev Takip — Takım atamaları
-- Üyeler Supabase Authentication panelinden kayıt olup giriş yaptıktan
-- SONRA çalıştırın (profiles satırları ancak o zaman oluşur).
--
-- v1'deki assign_data.sql görevleri TITLE'a (başlık metnine) göre
-- eşleştiriyordu: başlıkta tek bir karakter hatası ya da iki görevin aynı
-- başlığı paylaşması durumunda sessizce yanlış kişiye atama yapılabiliyordu.
-- Burada onun yerine seed_demo.sql'deki sabit order_index numarasını
-- kullanıyoruz — daha güvenli ve okunması daha kolay.
-- ============================================================

update profiles set display_name = 'Yusuf Kaptan', department = 'Genel Koordinasyon' where username = 'yusufkaptan';
update profiles set display_name = 'Dilruba', department = 'Mekanik' where username = 'dilruba';
update profiles set display_name = 'Büşra', department = 'Mekanik' where username = 'busra';
update profiles set display_name = 'Simay', department = 'Mekanik' where username = 'simay';
update profiles set display_name = 'Emincan', department = 'Mekanik' where username = 'emincan';
update profiles set display_name = 'Berat', department = 'Aviyonik' where username = 'berat';
update profiles set display_name = 'Burak', department = 'Yazılım' where username = 'burak';
update profiles set display_name = 'Selimcan', department = 'Yazılım' where username = 'selimcan';
update profiles set display_name = 'Emirhan', department = 'Yazılım (PO)' where username = 'emirhan';
update profiles set display_name = 'Ömer', department = 'Yazılım' where username = 'omer';

-- order_index -> username eşlemesi (tek tablo, okumak ve düzeltmek kolay)
with mapping (order_index, username) as (
  values
    (1, 'busra'), (2, 'dilruba'), (3, 'emincan'), (4, 'simay'),
    (5, 'emincan'), (6, 'emincan'), (7, 'dilruba'), (8, 'yusufkaptan'),
    (9, 'emincan'), (10, 'berat'), (11, 'selimcan'), (12, 'omer'),
    (13, 'berat'), (14, 'berat'), (15, 'berat'), (16, 'berat'),
    (17, 'burak'), (18, 'selimcan'), (19, 'emirhan'), (20, 'omer'),
    (21, 'yusufkaptan'), (22, 'yusufkaptan'), (23, 'yusufkaptan'), (24, 'yusufkaptan')
)
update tasks
set assignee_id = profiles.id
from mapping
join profiles on profiles.username = mapping.username
where tasks.order_index = mapping.order_index;
