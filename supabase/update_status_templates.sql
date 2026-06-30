-- ============================================================
-- Görev durumu güncelleme şablonu
-- Önce SELECT ile mevcut durumu gör, sonra ilgili UPDATE satırının
-- başındaki "--" işaretini kaldırıp status değerini değiştirip çalıştır.
-- status değerleri: 'planlandi' | 'devam' | 'tamamlandi'
-- ============================================================

-- 1) Şu an her görevin durumu ne? (önce buna bak)
select title, status, start_date, due_date
from tasks
order by start_date;

-- 2) Her görev için hazır şablon — istediğini aç, status'u değiştir, çalıştır.

-- update tasks set status = 'devam' where title = 'Kanat / gövde / kuyruk geometrisi';
-- update tasks set status = 'devam' where title = 'Ağırlık-denge & kısıt diyagramı';
-- update tasks set status = 'devam' where title = 'Yapısal analiz (ANSYS)';
-- update tasks set status = 'devam' where title = 'Kararlılık & uçuş zarfı';
-- update tasks set status = 'devam' where title = 'Fırlatma mekanizması tasarımı';
-- update tasks set status = 'devam' where title = 'Çift kademeli emniyet sistemi';
-- update tasks set status = 'devam' where title = 'Enerji / gerilim hesabı';
-- update tasks set status = 'devam' where title = 'Saha kurulum prosedürü';
-- update tasks set status = 'devam' where title = '4WD / Skid-steer şase tasarımı';
-- update tasks set status = 'devam' where title = 'Sensör entegrasyonu (LIDAR + stereo)';
-- update tasks set status = 'devam' where title = 'Otonom navigasyon yazılımı';
-- update tasks set status = 'devam' where title = 'Saha testi';
-- update tasks set status = 'devam' where title = 'Donanım BOM & seçimi';
-- update tasks set status = 'devam' where title = 'Kablaj & güç dağıtımı';
-- update tasks set status = 'devam' where title = 'Pixhawk / Jetson entegrasyonu';
-- update tasks set status = 'devam' where title = 'Telemetri modülü';
-- update tasks set status = 'devam' where title = 'Görüntü işleme algoritması';
-- update tasks set status = 'devam' where title = 'ROS 2 haberleşme mimarisi';
-- update tasks set status = 'devam' where title = 'Gereksinim izleme matrisi (196 madde)';
-- update tasks set status = 'devam' where title = 'Test planı & senaryoları';
-- update tasks set status = 'devam' where title = 'DDR rapor derleme';
-- update tasks set status = 'devam' where title = 'Sprint planlama & takvim';
-- update tasks set status = 'devam' where title = 'Bütçe takibi';
-- update tasks set status = 'devam' where title = 'Sunum hazırlığı';

-- 3) Birden fazla görevi aynı anda taşımak istersen (örnek: bir kümenin
--    tamamı planlandı -> devam):
-- update tasks set status = 'devam' where cluster_id = 'aviyonik' and status = 'planlandi';

-- 4) Tarih değiştirmek istersen aynı mantık:
-- update tasks set start_date = '2026-07-01', due_date = '2026-07-08'
-- where title = 'Kararlılık & uçuş zarfı';
