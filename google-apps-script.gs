/**
 * Şifa & Mert - RSVP Google Sheets Entegrasyonu
 *
 * Bu dosyayı bir Google Apps Script projesine yapıştırıp "Web App" olarak
 * yayınladığınızda, davetiye sitesindeki RSVP formu buraya veri gönderir
 * ve yanıtlar otomatik olarak bağlı Google Sheets tablosuna satır olarak eklenir.
 *
 * KURULUM ADIMLARI İÇİN README.md dosyasına bakın.
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // İlk satırda başlık yoksa ekle
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Tarih', 'Ad Soyad', 'Katılım Durumu', 'Kişi Sayısı']);
  }

  var params = e.parameter;
  sheet.appendRow([
    params.tarih || new Date().toLocaleString('tr-TR'),
    params.ad || '',
    params.durum || '',
    params.kisi || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput('RSVP script çalışıyor. Formlar yalnızca POST ile kabul edilir.')
    .setMimeType(ContentService.MimeType.TEXT);
}
