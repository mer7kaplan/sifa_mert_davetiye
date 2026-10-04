/**
 * Şifa & Mert - RSVP + Misafir Fotoğrafları Entegrasyonu
 *
 * Bu tek script iki işi birden yapar:
 *  1) RSVP formundan gelen yanıtları bir Google Sheets sayfasına satır olarak ekler.
 *  2) Misafirlerin yüklediği fotoğrafları otomatik oluşturulan bir Google Drive
 *     klasörüne kaydeder ve bir kayıt satırı ekler.
 *
 * Site artık iki ayrı düğün sayfası (Ankara ve Mersin) gönderiyor. Her istek
 * hangi etkinliğe ait olduğunu "etkinlik" alanıyla belirtir ("Ankara" olan
 * eski Ankara sitesinde boş/"" gönderilir, Mersin sayfası "Mersin" gönderir).
 * Bu sayede:
 *  - etkinlik boşsa (Ankara, eski davranış): "RSVP" sayfası ve
 *    "Düğün Fotoğrafları - Şifa & Mert" klasörü kullanılır (değişmedi).
 *  - etkinlik doluysa (ör. "Mersin"): "RSVP - Mersin" sayfası ve
 *    "Düğün Fotoğrafları - Şifa & Mert - Mersin" klasörü otomatik oluşturulur.
 *
 * KURULUM ADIMLARI İÇİN README.md dosyasına bakın.
 */

var PHOTO_FOLDER_NAME = 'Düğün Fotoğrafları - Şifa & Mert';

function doPost(e) {
  try {
    // Fotoğraf yükleme isteği JSON gövde olarak gelir (tarayıcı CORS ön
    // kontrolünü (preflight) tetiklememek için 'text/plain' başlığıyla
    // gönderir, bu yüzden başlığa değil doğrudan içeriğin JSON olup
    // olmadığına bakıyoruz).
    if (e.postData && e.postData.contents) {
      try {
        var payload = JSON.parse(e.postData.contents);
        if (payload && payload.type === 'photo') {
          return handlePhotoUpload(payload);
        }
      } catch (parseErr) {
        // JSON değil -> normal RSVP form verisi, aşağıda işlenecek.
      }
    }
    // RSVP isteği: application/x-www-form-urlencoded form verisi.
    return handleRsvp(e.parameter);
  } catch (err) {
    return jsonOutput({ result: 'error', message: String(err) });
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('RSVP / Fotoğraf script çalışıyor. İstekler yalnızca POST ile kabul edilir.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function handleRsvp(params) {
  var sheetName = params.etkinlik ? ('RSVP - ' + params.etkinlik) : 'RSVP';
  var sheet = getOrCreateSheet(sheetName, ['Tarih', 'Ad Soyad', 'Katılım Durumu', 'Kişi Sayısı']);
  sheet.appendRow([
    params.tarih || new Date().toLocaleString('tr-TR'),
    params.ad || '',
    params.durum || '',
    params.kisi || ''
  ]);
  return jsonOutput({ result: 'success' });
}

function handlePhotoUpload(payload) {
  var suffix = payload.etkinlik ? (' - ' + payload.etkinlik) : '';
  var folder = getOrCreatePhotoFolder(PHOTO_FOLDER_NAME + suffix);
  var bytes = Utilities.base64Decode(payload.veri);
  var fileName = payload.dosyaAdi || ('misafir-fotografi-' + new Date().getTime() + '.jpg');
  var blob = Utilities.newBlob(bytes, payload.mimeTuru || 'image/jpeg', fileName);
  var file = folder.createFile(blob);
  file.setDescription('Yükleyen: ' + (payload.ad || 'İsimsiz misafir'));

  var sheet = getOrCreateSheet('Fotoğraflar' + suffix, ['Tarih', 'Ad Soyad', 'Dosya Adı', 'Bağlantı']);
  sheet.appendRow([new Date().toLocaleString('tr-TR'), payload.ad || '', file.getName(), file.getUrl()]);

  return jsonOutput({ result: 'success', url: file.getUrl() });
}

function getOrCreateSheet(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
  }
  return sheet;
}

function getOrCreatePhotoFolder(folderName) {
  var folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(folderName);
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
