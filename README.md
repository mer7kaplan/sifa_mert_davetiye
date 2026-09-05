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
- `script.js`: düğün saati, geri sayım, RSVP ve fotoğraf yükleme ayarları
- `karekod.html`: masalara konulacak karekod kartı (site adresini burada girersiniz)
- `assets/`: fotoğraflar

## RSVP yanıtlarını ve misafir fotoğraflarını Google'a bağlama

Site artık iki şeyi otomatik olarak Google hesabınıza kaydedebilir:
- Misafirlerin "Katılacağım / Katılamayacağım" RSVP yanıtlarını bir **Google
  Sheets** tablosuna,
- Düğün sırasında misafirlerin yüklediği fotoğrafları bir **Google Drive**
  klasörüne (ve bir kayıt satırı olarak yine tabloya).

GitHub Pages statik olduğundan (kendi sunucusu yoktur), bunun için ücretsiz
bir **Google Apps Script** "Web App" kullanılır — tek bir script hem RSVP'yi
hem fotoğraf yüklemeyi yönetir. Kurulumu 5-10 dakika sürer.

1. **Yeni bir Google Sheets tablosu açın** (sheets.new). İsterseniz adını
   "Düğün RSVP ve Fotoğraflar" yapın.
2. Tablonun içinde üst menüden **Uzantılar → Apps Script** seçin.
3. Açılan editördeki mevcut kodu silin ve bu klasördeki
   `google-apps-script.gs` dosyasının tüm içeriğini yapıştırın.
4. Sağ üstteki **Dağıt (Deploy) → Yeni dağıtım (New deployment)** butonuna
   tıklayın.
   - Tür olarak **Web uygulaması (Web app)** seçin.
   - "Yürüten kişi (Execute as)": **Ben (Me)**
   - "Erişimi olanlar (Who has access)": **Herkes (Anyone)**
   - **Dağıt (Deploy)**'a tıklayın. İzin isteyen ekranda hem **Sheets** hem
     **Drive** erişimine "İzin ver" deyin (fotoğrafları Drive'a
     kaydedebilmesi için ikisi de gereklidir). İlk seferde "Google
     doğrulamadı" uyarısı çıkabilir; "Gelişmiş" → "...'e git (güvenli
     değil)" diyerek devam edebilirsiniz — script kendi hesabınızda
     çalıştığı için güvenlidir.
5. Size verilen **Web app URL**'sini kopyalayın (`.../exec` ile biter).
6. `script.js` dosyasını açın ve şu satırı bulun:
   ```js
   const RSVP_SCRIPT_URL = 'https://script.google.com/macros/s/BURAYA_KENDI_APPS_SCRIPT_URLINIZI_YAPISTIRIN/exec';
   ```
   `BURAYA_KENDI_APPS_SCRIPT_URLINIZI_YAPISTIRIN/exec` kısmını, 5. adımda
   kopyaladığınız kendi URL'niz ile değiştirin. (Bu tek adres hem RSVP hem
   fotoğraf yükleme için kullanılır, ayrıca bir ayar gerekmez.)
7. Değişikliği kaydedip siteyi (GitHub Pages) yeniden yayınlayın.

Bundan sonra:
- RSVP formu gönderildiğinde ad, katılım durumu, kişi sayısı ve tarih
  otomatik olarak tablonuzdaki **"RSVP"** sayfasına yeni satır olarak eklenir.
- Bir misafir fotoğraf yüklediğinde, dosya Drive'da otomatik oluşturulan
  **"Düğün Fotoğrafları - Şifa & Mert"** adlı klasöre kaydedilir; ayrıca
  tablonuzdaki **"Fotoğraflar"** sayfasına yükleyenin adı, tarih ve dosyaya
  doğrudan giden bağlantı eklenir.

**Not:** Form ve fotoğraf yükleme, tarayıcıdan Apps Script'e `no-cors`
modunda istek gönderir; bu nedenle site tarafında sunucunun yanıtı
okunamaz, ancak istek başarıyla ulaştığında satır/dosya yine de
kaydedilir. `RSVP_SCRIPT_URL` doğru girildiği sürece bu güvenilir şekilde
çalışır.

## Düğünde okutulacak karekod (QR kod) kartı

`karekod.html` dosyası, misafirlerin telefonlarıyla okutup doğrudan
fotoğraf yükleme sayfanıza gidebilecekleri, kesilip masalara konulabilen
4'lü bir kart sayfası oluşturur.

1. Siteniz GitHub Pages'te yayınlandıktan sonra adresini kopyalayın
   (ör. `https://kullaniciadi.github.io/dugun-sitesi/`).
2. `karekod.html` dosyasını tarayıcıda açın, üstteki kutuya bu adresi
   yapıştırıp **KAREKODU OLUŞTUR**'a tıklayın — 4 kartın karekodu da
   otomatik güncellenir. (İsterseniz dosyanın içindeki
   `DEFAULT_SITE_URL` değişkenine adresi yazıp kaydederseniz, sayfa her
   açıldığında karekod otomatik oluşur.)
3. Tarayıcınızın **Yazdır (Ctrl/Cmd+P)** özelliğini kullanın; ayar
   paneli yazdırırken otomatik gizlenir, sadece 4 kart basılır.
   İstediğiniz sayıda masa için sayfayı birden fazla kez yazdırabilirsiniz.
4. Çıktıyı kesip masalara, fotoğraf köşesine veya davetiye standına
   yerleştirebilirsiniz.

Karekod görseli internet üzerinden ücretsiz bir servisle (api.qrserver.com)
oluşturulur; bu yüzden karekodu oluştururken/yazdırırken internete bağlı
olmanız yeterlidir, misafirlerin okuttuğu an ayrıca bir bağlantıya
ihtiyaç duyulmaz.

## Diğer notlar
- Nikah saati bilgisi kaldırıldı; sadece düğün başlangıç saati (19.00)
  gösteriliyor.
- Salon konumu **Rose Wedding Hall, İvedik / Ankara** olarak güncellendi;
  "Yol Tarifi Al" butonu bu konuma göre Google Haritalar'ı açar.
- "Hikayemiz" bölümündeki fotoğraflara tıklandığında (veya klavyeyle Enter/
  boşluk ile) tam ekran bir büyütme (lightbox) açılır; kapatmak için
  sağ üstteki ✕ butonuna, dışarıya veya Esc tuşuna basmanız yeterli.
- Sitede yeni bir **"Anılarımızı Paylaşın"** bölümü var (`#fotograf-paylas`);
  misafirler burada isim (opsiyonel) girip birden fazla fotoğraf seçip
  yükleyebilir.
