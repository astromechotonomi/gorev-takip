# Astromech Otonomi · Görev Takip

TEKNOFEST İleri Otonom Sistemler ekibi için uzay temalı görev takip uygulaması.
React + Vite + Supabase ile yapıldı, GitHub Pages üzerinde tamamen ücretsiz barındırılabilir.

Şu an **demo modda** çalışıyor (örnek verilerle, Supabase'e henüz bağlı değil).
Aşağıdaki adımları takip ederek gerçek, kalıcı bir veritabanına bağlayabilirsiniz.

---

## 0) Yerelde çalıştırma (deploy etmeden önce göz atmak için)

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173/gorev-takip/` açılır. Bu aşamada Supabase
bağlı olmadığı için herhangi bir e-posta/şifreyle "demo modda" giriş yapabilirsiniz.

---

## 1) Supabase kurulumu (gerçek giriş + veritabanı)

1. [supabase.com](https://supabase.com) -> ücretsiz hesap açın -> **New Project**.
2. Proje oluşunca sol menüden **SQL Editor**'a girin, bu projedeki
   `supabase/schema.sql` dosyasının tüm içeriğini yapıştırıp **Run**'a basın.
   Bu, `profiles` / `clusters` / `tasks` tablolarını ve örnek görevleri oluşturur.
3. Sol menüden **Authentication -> Users -> Add user** ile takım üyelerini ekleyin
   (e-posta + şifre). Her kullanıcı eklendiğinde `profiles` tablosuna otomatik satır açılır
   (trigger sayesinde) -- ekledikten sonra **Table Editor -> profiles** kısmından
   `display_name` ve `department` alanlarını düzenleyin.
4. Görevlerin gerçek kişilere atanması için **Table Editor -> tasks** içinde
   her satırın `assignee_id` hücresine ilgili kişinin `profiles.id`'sini yazın
   (profiles tablosundan kopyalayabilirsiniz).
5. Sol menüden **Project Settings -> API** sayfasına gidin, şu ikisini not alın:
   - **Project URL**
   - **anon public** key

---

## 2) Yerel ortamda Supabase'i bağlama (opsiyonel, test için)

Proje köküne `.env.local` adında bir dosya oluşturun (bu dosya git'e gönderilmez):

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

`npm run dev` ile yeniden başlatınca demo modu kalkar, gerçek verilerle çalışır.

---

## 3) GitHub'a yükleme ve Pages ile yayınlama

1. GitHub'da yeni bir **repo** oluşturun (örn. `gorev-takip`).
   - **Repo adınız `gorev-takip` değilse**: `vite.config.js` içindeki
     `base: '/gorev-takip/'` satırını kendi repo adınızla değiştirin.
2. Bu proje klasörünü o repoya push edin:
   ```bash
   git init
   git add .
   git commit -m "İlk sürüm"
   git branch -M main
   git remote add origin https://github.com/KULLANICI_ADIN/gorev-takip.git
   git push -u origin main
   ```
3. Repo sayfasında **Settings -> Secrets and variables -> Actions -> New repository secret**
   ile şu iki gizli değişkeni ekleyin (Supabase'den aldığınız değerler):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. **Settings -> Pages** sayfasında **Source** kısmını **GitHub Actions** olarak seçin.
5. `main` branch'e her push'ta `.github/workflows/deploy.yml` otomatik olarak
   projeyi derler ve yayınlar. İlk push sonrası **Actions** sekmesinden ilerlemeyi
   izleyebilirsiniz. Birkaç dakika sonra siteniz
   `https://KULLANICI_ADIN.github.io/gorev-takip/` adresinde canlı olur.

---

## Notlar

- **Supabase ücretsiz projesi 7 gün hiç istek almazsa "duraklatılır."** Veri silinmez,
  Supabase dashboard'undan tek tıkla uyandırılır. Önemli bir demo/sunumdan önce
  siteyi bir kez açıp kontrol edin.
- Durum etiketine (Planlandı/Devam Ediyor/Tamamlandı) tıklayarak veya görev kartını
  açıp "DURUMU GÜNCELLE" kısmından görev durumunu değiştirebilirsiniz.
- "Bu Hafta" sekmesi, teslim tarihi 7 gün içinde olan ve tamamlanmamış tüm görevleri
  kümeden bağımsız şekilde listeler.
- Yeni bir görev kümesi veya görev eklemek için Supabase **Table Editor**'ı
  kullanabilirsiniz; arayüzde "görev ekle" düğmesi şu an yok (istenirse eklenebilir).
