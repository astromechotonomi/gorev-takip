-- ============================================================
-- Astromech Otonomi · Görev Takip — Demo/başlangıç verisi
-- schema.sql çalıştırıldıktan SONRA bir kere çalıştırın.
-- order_index'i ekledik ki assign_team.sql görevleri başlığa göre değil,
-- bu sabit numaraya göre eşleştirsin (başlık değişse de kırılmaz).
-- ============================================================

insert into clusters (id, title, icon, sort_order) values
  ('kanat-govde', 'Kanat & Gövde', 'plane', 1),
  ('mancinik', 'Mancınık', 'target', 2),
  ('ika', 'İKA', 'robot', 3),
  ('aviyonik', 'Aviyonik', 'chip', 4),
  ('yazilim', 'Yazılım & Otonomi', 'code', 5),
  ('dokumantasyon', 'Dokümantasyon', 'file', 6)
on conflict (id) do nothing;

insert into tasks (cluster_id, title, status, start_date, due_date, order_index) values
  ('kanat-govde', 'Kanat / gövde / kuyruk geometrisi', 'devam', '2026-06-22', '2026-06-27', 1),
  ('kanat-govde', 'Ağırlık-denge & kısıt diyagramı', 'devam', '2026-06-25', '2026-07-01', 2),
  ('kanat-govde', 'Yapısal analiz (ANSYS)', 'devam', '2026-06-25', '2026-07-01', 3),
  ('kanat-govde', 'Kararlılık & uçuş zarfı', 'planlandi', '2026-07-02', '2026-07-08', 4),
  ('mancinik', 'Fırlatma mekanizması tasarımı', 'tamamlandi', '2026-06-22', '2026-06-25', 5),
  ('mancinik', 'Çift kademeli emniyet sistemi', 'tamamlandi', '2026-06-22', '2026-06-28', 6),
  ('mancinik', 'Enerji / gerilim hesabı', 'planlandi', '2026-06-29', '2026-07-05', 7),
  ('mancinik', 'Saha kurulum prosedürü', 'planlandi', '2026-07-04', '2026-07-10', 8),
  ('ika', '4WD / Skid-steer şase tasarımı', 'devam', '2026-06-27', '2026-07-03', 9),
  ('ika', 'Sensör entegrasyonu (LIDAR + stereo)', 'planlandi', '2026-07-02', '2026-07-08', 10),
  ('ika', 'Otonom navigasyon yazılımı', 'planlandi', '2026-07-04', '2026-07-10', 11),
  ('ika', 'Saha testi', 'planlandi', '2026-07-06', '2026-07-12', 12),
  ('aviyonik', 'Donanım BOM & seçimi', 'devam', '2026-06-22', '2026-06-26', 13),
  ('aviyonik', 'Kablaj & güç dağıtımı', 'devam', '2026-06-26', '2026-07-02', 14),
  ('aviyonik', 'Pixhawk / Jetson entegrasyonu', 'planlandi', '2026-07-03', '2026-07-09', 15),
  ('aviyonik', 'Telemetri modülü', 'planlandi', '2026-07-03', '2026-07-09', 16),
  ('yazilim', 'Görüntü işleme algoritması', 'devam', '2026-06-28', '2026-07-04', 17),
  ('yazilim', 'ROS 2 haberleşme mimarisi', 'planlandi', '2026-06-30', '2026-07-06', 18),
  ('yazilim', 'Gereksinim izleme matrisi (196 madde)', 'tamamlandi', '2026-06-22', '2026-06-27', 19),
  ('yazilim', 'Test planı & senaryoları', 'planlandi', '2026-07-01', '2026-07-07', 20),
  ('dokumantasyon', 'DDR rapor derleme', 'devam', '2026-07-07', '2026-07-13', 21),
  ('dokumantasyon', 'Sprint planlama & takvim', 'tamamlandi', '2026-06-22', '2026-06-24', 22),
  ('dokumantasyon', 'Bütçe takibi', 'tamamlandi', '2026-06-23', '2026-06-29', 23),
  ('dokumantasyon', 'Sunum hazırlığı', 'planlandi', '2026-07-06', '2026-07-12', 24);
