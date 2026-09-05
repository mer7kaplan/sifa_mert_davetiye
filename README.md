# Şifa & Mert - Düğün Davetiyesi

GitHub Pages üzerinde yayınlanmaya hazır statik düğün davetiyesi sitesi.

## Yayınlama
1. Bu klasördeki dosyaları bir GitHub reposuna yükleyin.
2. GitHub'da **Settings → Pages** bölümüne girin.
3. **Deploy from a branch** seçin.
4. Branch olarak `main`, klasör olarak `/ (root)` seçin.
5. Kaydedin. GitHub birkaç dakika içinde size web adresini oluşturacaktır.

## Düzenlenebilir bilgiler
- `index.html`: salon, tarih, metin ve davet bilgileri
- `script.js`: düğün saati, geri sayım ve RSVP ayarları
- `assets/`: fotoğraflar

## RSVP yanıtlarını Google Sheets'e bağlama

Site artık misafirlerin "Katılacağım / Katılamayacağım" seçimlerini otomatik
olarak bir Google Sheets tablosuna kaydedebilir. GitHub Pages statik
olduğundan (kendi sunucusu yoktur), bunun için ücretsiz bir **Google Apps
Script** "Web App" kullanılır — kurulumu 5 dakika sürer.

1. **Yeni bir Google Sheets tablosu açın** (sheets.new). İsterseniz adını
   "Düğün RSVP Yanıtları" yapın.
2. Tablonun içinde üst menüden **Uzantılar → Apps Script** seçin.
3. Açılan editördeki mevcut kodu silin ve bu klasördeki
   `google-apps-script.gs` dosyasının tüm içeriğini yapıştırın.
4. Sağ üstteki **Dağıt (Deploy) → Yeni dağıtım (New deployment)** butonuna
   tıklayın.
   - Tür olarak **Web uygulaması (Web app)** seçin.
   - "Yürüten kişi (Execute as)": **Ben (Me)**
   - "Erişimi olanlar (Who has access)": **Herkes (Anyone)**
   - **Dağıt (Deploy)**'a tıklayın ve Google hesabınızla izin verin
     (ilk seferde "Google doğrulamadı" uyarısı çıkabilir; "Gelişmiş" →
     "...'e git (güvenli değil)" diyerek devam edebilirsiniz — script
     kendi hesabınızda çalıştığı için güvenlidir).
5. Size verilen **Web app URL**'sini kopyalayın (`.../exec` ile biter).
6. `script.js` dosyasını açın ve şu satırı bulun:
   ```js
   const RSVP_SCRIPT_URL = 'https://script.google.com/macros/s/BURAYA_KENDI_APPS_SCRIPT_URLINIZI_YAPISTIRIN/exec';
   ```
   `BURAYA_KENDI_APPS_SCRIPT_URLINIZI_YAPISTIRIN/exec` kısmını, 5. adımda
   kopyaladığınız kendi URL'niz ile değiştirin.
7. Değişikliği kaydedip siteyi (GitHub Pages) yeniden yayınlayın.

Bundan sonra bir misafir formu gönderdiğinde, adı, katılım durumu, kişi
sayısı ve tarih otomatik olarak Google Sheets tablonuza yeni bir satır
olarak eklenir. Tabloyu istediğiniz zaman açıp yanıtları görebilir,
filtreleyebilir veya dışa aktarabilirsiniz.

**Not:** Form, tarayıcıdan Apps Script'e `no-cors` modunda istek gönderir;
bu nedenle site tarafında sunucunun yanıtı okunamaz, ancak istek
başarıyla ulaştığında satır yine de tabloya eklenir. `RSVP_SCRIPT_URL`
doğru girildiği sürece bu güvenilir şekilde çalışır.

## Diğer notlar
- Nikah saati bilgisi kaldırıldı; sadece düğün başlangıç saati (19.00)
  gösteriliyor.
- Salon konumu **Rose Wedding Hall, İvedik / Ankara** olarak güncellendi;
  "Yol Tarifi Al" butonu bu konuma göre Google Haritalar'ı açar.
- "Hikayemiz" bölümündeki fotoğraflara tıklandığında (veya klavyeyle Enter/
  boşluk ile) tam ekran bir büyütme (lightbox) açılır; kapatmak için
  sağ üstteki ✕ butonuna, dışarıya veya Esc tuşuna basmanız yeterli.
