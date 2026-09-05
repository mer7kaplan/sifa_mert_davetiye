/**
 * Şifa & Mert - RSVP + Misafir Fotoğrafları Entegrasyonu
 *
 * Bu tek script iki işi birden yapar:
 *  1) RSVP formundan gelen yanıtları bu tabloya ("RSVP" sayfası) satır olarak ekler.
 *  2) Misafirlerin yüklediği fotoğrafları otomatik oluşturulan bir Google Drive
 *     klasörüne kaydeder ve "Fotoğraflar" sayfasına bir kayıt satırı ekler.
 *
 * KURULUM ADIMLARI İÇİN README.md dosyasına bakın.
 */

var PHOTO_FOLDER_NAME = 'Düğün Fotoğrafları - Şifa & Mert';

function doPost(e) {
  try {
    // Fotoğraf yükleme isteği: tarayıcı bunu 'text/plain' içerik türüyle JSON olarak gönderir
    // (Apps Script'in CORS ön kontrolünü (preflight) tetiklememek için).
    if (e.postData && e.postData.type === 'text/plain') {
      var payload = JSON.parse(e.postData.contents);
      if (payload.type === 'photo') {
        return handlePhotoUpload(payload);
      }
    }
    // RSVP isteği: normal application/x-www-form-urlencoded form verisi.
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
  var sheet = getOrCreateSheet('RSVP', ['Tarih', 'Ad Soyad', 'Katılım Durumu', 'Kişi Sayısı']);
  sheet.appendRow([
    params.tarih || new Date().toLocaleString('tr-TR'),
    params.ad || '',
    params.durum || '',
    params.kisi || ''
  ]);
  return jsonOutput({ result: 'success' });
}

function handlePhotoUpload(payload) {
  var folder = getOrCreatePhotoFolder();
  var bytes = Utilities.base64Decode(payload.veri);
  var fileName = payload.dosyaAdi || ('misafir-fotografi-' + new Date().getTime() + '.jpg');
  var blob = Utilities.newBlob(bytes, payload.mimeTuru || 'image/jpeg', fileName);
  var file = folder.createFile(blob);
  file.setDescription('Yükleyen: ' + (payload.ad || 'İsimsiz misafir'));

  var sheet = getOrCreateSheet('Fotoğraflar', ['Tarih', 'Ad Soyad', 'Dosya Adı', 'Bağlantı']);
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

function getOrCreatePhotoFolder() {
  var folders = DriveApp.getFoldersByName(PHOTO_FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(PHOTO_FOLDER_NAME);
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
