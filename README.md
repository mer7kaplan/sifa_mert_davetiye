# Şifa & Mert - Düğün Davetiyesi

GitHub Pages üzerinde yayınlanmaya hazır statik düğün davetiyesi sitesi.

## Yayınlama
1. Bu klasördeki dosyaları bir GitHub reposuna yükleyin (bu klasörde artık
   bir **`CNAME`** dosyası da var — onu da diğerleriyle birlikte, kök dizine
   yüklemeyi unutmayın).
2. GitHub'da **Settings → Pages** bölümüne girin.
3. **Deploy from a branch** seçin.
4. Branch olarak `main`, klasör olarak `/ (root)` seçin.
5. Kaydedin. GitHub birkaç dakika içinde size web adresini oluşturacaktır.

## Özel alan adı: sifamert.com.tr

Site artık `sifamert.com.tr` adresine bağlanacak şekilde hazırlandı (`CNAME`
dosyası ve `karekod.html` içindeki varsayılan adres bu alan adını içeriyor).
Adresin gerçekten çalışması için alan adını aldığınız firmanın (Turhost,
Natro, İsimtescil, GoDaddy vb.) **DNS yönetim paneline** şu kayıtları
eklemeniz gerekiyor:

| Tür | Host/Ad | Değer |
|---|---|---|
| A | @ (veya boş) | 185.199.108.153 |
| A | @ (veya boş) | 185.199.109.153 |
| A | @ (veya boş) | 185.199.110.153 |
| A | @ (veya boş) | 185.199.111.153 |
| CNAME | www | kullaniciadi.github.io *(kendi GitHub kullanıcı adınızla)* |

Sonra GitHub'da **Settings → Pages → Custom domain** kutusuna
`sifamert.com.tr` yazıp kaydedin ve DNS yayıldıktan sonra (birkaç dakika –
birkaç saat) **Enforce HTTPS** kutusunu işaretleyin. Bazı .com.tr
sağlayıcılarında panel "A kaydı" yerine "Host Records" / "DNS Yönetimi"
gibi adlandırılabilir; kayıt tipi ve mantığı aynıdır.

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

> **Script kodunu daha sonra güncellerseniz:** Apps Script editöründe kodu
> değiştirmek tek başına yeterli değildir — mevcut web app adresinin
> yeni kodu çalıştırması için **Dağıt → Dağıtımları yönet (Manage
> deployments)** → kalem/düzenle simgesi → "Sürüm (Version)" alanından
> **Yeni sürüm (New version)** seçip tekrar **Dağıt**'a basmanız gerekir.
> Aksi halde site eski koda istek göndermeye devam eder.

Bundan sonra:
- RSVP formu gönderildiğinde ad, katılım durumu, kişi sayısı ve tarih
  otomatik olarak tablonuzdaki **"RSVP"** sayfasına yeni satır olarak eklenir.
- Bir misafir fotoğraf yüklediğinde, dosya Drive'da otomatik oluşturulan
  **"Düğün Fotoğrafları - Şifa & Mert"** adlı klasöre kaydedilir; ayrıca
  tablonuzdaki **"Fotoğraflar"** sayfasına yükleyenin adı, tarih ve dosyaya
  doğrudan giden bağlantı eklenir.

**Not:** Form ve fotoğraf yükleme, sunucunun yanıtını okuyup gerçek bir
hata varsa bunu doğrudan sitedeki mesaj alanında gösterir — yani bir
şeyler ters giderse "başarılı" gibi görünmez, ekranda hatayı görürsünüz.

### Sorun giderme: "Drive'da klasör oluşmuyor / fotoğraf yüklenmiyor"

Kod güncellemesinden sonra da fotoğraflar Drive'a düşmüyorsa, sırasıyla
şunları kontrol edin:

1. **Yeni sürüm olarak dağıttınız mı?** Kodu değiştirmek tek başına
   yetmez — yukarıdaki uyarıdaki gibi **Dağıt → Dağıtımları yönet →
   düzenle → Yeni sürüm → Dağıt** adımını mutlaka yapın.
2. **Drive izni gerçekten verildi mi?** Script'e Drive kullanımı sonradan
   eklendiyse, Google bunu ayrı bir izin olarak görebilir. Apps Script
   editöründe üstteki fonksiyon açılır menüsünden `doGet` seçip **▶
   Çalıştır (Run)** butonuna basın. Karşınıza bir izin ekranı gelirse
   hesabınızı seçin, "Gelişmiş" → "...'e git (güvenli değil)" deyip
   **hem Sheets hem Drive** için izin verin. Ardından tekrar
   **Dağıt → Dağıtımları yönet → Yeni sürüm → Dağıt** yapın.
3. **Gerçek hata mesajına bakın.** Site artık Apps Script'ten dönen
   gerçek hatayı form altında gösteriyor — fotoğraf yükleme denemesinden
   sonra çıkan kırmızı mesajı okuyun, sorunun ne olduğunu genelde
   doğrudan söyler.
4. **Yürütmeler (Executions) günlüğüne bakın.** Apps Script
   editöründe sol menüdeki saat simgesine (Yürütmeler) tıklayın; başarısız
   `doPost` çağrılarını ve tam hata mesajını burada görebilirsiniz.
5. **Web app erişimi "Herkes (Anyone)" mi?** Dağıtım ayarlarında
   "Erişimi olanlar" **Herkes** olarak seçili değilse, tarayıcıdan gelen
   istekler bir Google giriş sayfasına yönlendirilir ve fotoğraf hiç
   kaydedilmez.

## Düğünde okutulacak karekod (QR kod) kartı

`karekod.html` dosyası, misafirlerin telefonlarıyla okutup doğrudan
fotoğraf yükleme sayfanıza gidebilecekleri, kesilip masalara konulabilen
4'lü bir kart sayfası oluşturur.

1. `karekod.html` dosyasını tarayıcıda açın; adres olarak
   `https://sifamert.com.tr` önceden tanımlı olduğu için karekod sayfa
   açılır açılmaz otomatik oluşur, ekstra bir şey yapmanıza gerek yok.
   (Adresi değiştirmeniz gerekirse üstteki kutuya yazıp **KAREKODU
   OLUŞTUR**'a tıklamanız yeterli.)
2. Tarayıcınızın **Yazdır (Ctrl/Cmd+P)** özelliğini kullanın; ayar
   paneli yazdırırken otomatik gizlenir, sadece 4 kart basılır.
   İstediğiniz sayıda masa için sayfayı birden fazla kez yazdırabilirsiniz.
3. Çıktıyı kesip masalara, fotoğraf köşesine veya davetiye standına
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
