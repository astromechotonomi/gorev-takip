// Gerçek takım yapısına dayanan demo veri seti.
// Supabase bağlandığında bu veriler yerini gerçek veritabanı sorgularına bırakır;
// bağlantı kurulana kadar arayüzü önizlemek için kullanılır.

export const DEMO_CLUSTERS = [
  { id: "kanat-govde", title: "Kanat & Gövde", icon: "plane", color: "accent" },
  { id: "mancinik", title: "Mancınık", icon: "target", color: "accent" },
  { id: "ika", title: "İKA", icon: "robot", color: "accent" },
  { id: "aviyonik", title: "Aviyonik", icon: "chip", color: "accent" },
  { id: "yazilim", title: "Yazılım & Otonomi", icon: "code", color: "accent" },
  { id: "dokumantasyon", title: "Dokümantasyon", icon: "file", color: "accent" },
];

export const DEMO_PROFILES = [
  { id: "kaptan", username: "kaptan", display_name: "Yusuf Kaptan", department: "Genel Koordinasyon" },
  { id: "dilruba", username: "dilruba", display_name: "Dilruba", department: "Mekanik" },
  { id: "busra", username: "busra", display_name: "Büşra", department: "Mekanik" },
  { id: "simay", username: "simay", display_name: "Simay", department: "Mekanik" },
  { id: "emincan", username: "emincan", display_name: "Emincan", department: "Mekanik" },
  { id: "berat", username: "berat", display_name: "Berat", department: "Aviyonik" },
  { id: "burak", username: "burak", display_name: "Burak", department: "Yazılım" },
  { id: "selimcan", username: "selimcan", display_name: "Selimcan", department: "Yazılım" },
  { id: "emirhan", username: "emirhan", display_name: "Emirhan", department: "Yazılım (PO)" },
  { id: "omer", username: "omer", display_name: "Ömer", department: "Yazılım" },
];

export const DEMO_TASKS = [
  // Kanat & Gövde
  { id: "t1", cluster_id: "kanat-govde", title: "Kanat / gövde / kuyruk geometrisi", assignee_id: "busra", status: "devam", start_date: "2026-06-22", due_date: "2026-06-27" },
  { id: "t2", cluster_id: "kanat-govde", title: "Ağırlık-denge & kısıt diyagramı", assignee_id: "dilruba", status: "devam", start_date: "2026-06-25", due_date: "2026-07-01" },
  { id: "t3", cluster_id: "kanat-govde", title: "Yapısal analiz (ANSYS)", assignee_id: "emincan", status: "devam", start_date: "2026-06-25", due_date: "2026-07-01" },
  { id: "t4", cluster_id: "kanat-govde", title: "Kararlılık & uçuş zarfı", assignee_id: "simay", status: "planlandi", start_date: "2026-07-02", due_date: "2026-07-08" },
  // Mancınık
  { id: "t5", cluster_id: "mancinik", title: "Fırlatma mekanizması tasarımı", assignee_id: "emincan", status: "tamamlandi", start_date: "2026-06-22", due_date: "2026-06-25" },
  { id: "t6", cluster_id: "mancinik", title: "Çift kademeli emniyet sistemi", assignee_id: "emincan", status: "tamamlandi", start_date: "2026-06-22", due_date: "2026-06-28" },
  { id: "t7", cluster_id: "mancinik", title: "Enerji / gerilim hesabı", assignee_id: "dilruba", status: "planlandi", start_date: "2026-06-29", due_date: "2026-07-05" },
  { id: "t8", cluster_id: "mancinik", title: "Saha kurulum prosedürü", assignee_id: "kaptan", status: "planlandi", start_date: "2026-07-04", due_date: "2026-07-10" },
  // İKA
  { id: "t9", cluster_id: "ika", title: "4WD / Skid-steer şase tasarımı", assignee_id: "emincan", status: "devam", start_date: "2026-06-27", due_date: "2026-07-03" },
  { id: "t10", cluster_id: "ika", title: "Sensör entegrasyonu (LIDAR + stereo)", assignee_id: "berat", status: "planlandi", start_date: "2026-07-02", due_date: "2026-07-08" },
  { id: "t11", cluster_id: "ika", title: "Otonom navigasyon yazılımı", assignee_id: "selimcan", status: "planlandi", start_date: "2026-07-04", due_date: "2026-07-10" },
  { id: "t12", cluster_id: "ika", title: "Saha testi", assignee_id: "omer", status: "planlandi", start_date: "2026-07-06", due_date: "2026-07-12" },
  // Aviyonik
  { id: "t13", cluster_id: "aviyonik", title: "Donanım BOM & seçimi", assignee_id: "berat", status: "devam", start_date: "2026-06-22", due_date: "2026-06-26" },
  { id: "t14", cluster_id: "aviyonik", title: "Kablaj & güç dağıtımı", assignee_id: "berat", status: "devam", start_date: "2026-06-26", due_date: "2026-07-02" },
  { id: "t15", cluster_id: "aviyonik", title: "Pixhawk / Jetson entegrasyonu", assignee_id: "berat", status: "planlandi", start_date: "2026-07-03", due_date: "2026-07-09" },
  { id: "t16", cluster_id: "aviyonik", title: "Telemetri modülü", assignee_id: "berat", status: "planlandi", start_date: "2026-07-03", due_date: "2026-07-09" },
  // Yazılım & Otonomi
  { id: "t17", cluster_id: "yazilim", title: "Görüntü işleme algoritması", assignee_id: "burak", status: "devam", start_date: "2026-06-28", due_date: "2026-07-04" },
  { id: "t18", cluster_id: "yazilim", title: "ROS 2 haberleşme mimarisi", assignee_id: "selimcan", status: "planlandi", start_date: "2026-06-30", due_date: "2026-07-06" },
  { id: "t19", cluster_id: "yazilim", title: "Gereksinim izleme matrisi (196 madde)", assignee_id: "emirhan", status: "tamamlandi", start_date: "2026-06-22", due_date: "2026-06-27" },
  { id: "t20", cluster_id: "yazilim", title: "Test planı & senaryoları", assignee_id: "omer", status: "planlandi", start_date: "2026-07-01", due_date: "2026-07-07" },
  // Dokümantasyon
  { id: "t21", cluster_id: "dokumantasyon", title: "DDR rapor derleme", assignee_id: "kaptan", status: "devam", start_date: "2026-07-07", due_date: "2026-07-13" },
  { id: "t22", cluster_id: "dokumantasyon", title: "Sprint planlama & takvim", assignee_id: "kaptan", status: "tamamlandi", start_date: "2026-06-22", due_date: "2026-06-24" },
  { id: "t23", cluster_id: "dokumantasyon", title: "Bütçe takibi", assignee_id: "kaptan", status: "tamamlandi", start_date: "2026-06-23", due_date: "2026-06-29" },
  { id: "t24", cluster_id: "dokumantasyon", title: "Sunum hazırlığı", assignee_id: "kaptan", status: "planlandi", start_date: "2026-07-06", due_date: "2026-07-12" },
];

export const STATUS_LABELS = {
  tamamlandi: "Tamamlandı",
  devam: "Devam Ediyor",
  planlandi: "Planlandı",
};

export const STATUS_COLORS = {
  tamamlandi: "var(--green)",
  devam: "var(--accent)",
  planlandi: "var(--gray-status)",
};
