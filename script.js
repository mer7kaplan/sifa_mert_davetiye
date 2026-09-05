const weddingDate = new Date('2026-10-24T19:00:00+03:00');
function updateCountdown(){
  const diff=Math.max(0,weddingDate-new Date());
  const d=Math.floor(diff/86400000);
  const h=Math.floor(diff%86400000/3600000);
  const m=Math.floor(diff%3600000/60000);
  const s=Math.floor(diff%60000/1000);
  [['days',d],['hours',h],['minutes',m],['seconds',s]].forEach(([id,val])=>document.getElementById(id).textContent=String(val).padStart(2,'0'));
}
updateCountdown();setInterval(updateCountdown,1000);

document.querySelector('.menu-toggle').addEventListener('click',()=>document.querySelector('.nav nav').classList.toggle('open'));
document.querySelectorAll('.nav nav a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.nav nav').classList.remove('open')));

document.querySelectorAll('.choice').forEach(choice=>choice.addEventListener('click',()=>{
  document.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected'));
  choice.classList.add('selected');
}));

/* ---------- Hikayemiz galerisi: fotoğrafa tıklayınca büyüt ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

function openLightbox(imgEl){
  lightboxImg.src = imgEl.src;
  lightboxImg.alt = imgEl.alt || '';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

document.querySelectorAll('.gallery .photo img').forEach(img=>{
  img.addEventListener('click',()=>openLightbox(img));
  img.addEventListener('keydown',e=>{
    if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openLightbox(img); }
  });
});
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e=>{ if(e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e=>{ if(e.key === 'Escape') closeLightbox(); });

/* ---------- RSVP formu: yanıtları Google Sheets'e gönder ---------- */
// Aşağıdaki adrese kendi Google Apps Script "Web App" URL'inizi yapıştırın.
// Kurulum adımları README.md dosyasındadır.
const RSVP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby96xkRrVqdKx1TdSi3bb82A6OBWZTRgZuZyTzNnqvEnTKsu7pTDkCy_gMB_6RZwO9e/exec';

const rsvpForm = document.getElementById('rsvpForm');
const formMessage = document.getElementById('formMessage');
const submitButton = rsvpForm.querySelector('button[type="submit"]');

rsvpForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const name = data.get('ad');
  const status = data.get('durum');
  const people = data.get('kisi');

  if (!name || !name.trim()) {
    formMessage.textContent = 'Lütfen adınızı ve soyadınızı girin.';
    formMessage.classList.add('error');
    return;
  }

  formMessage.classList.remove('error');

  if (RSVP_SCRIPT_URL.includes('BURAYA_KENDI_APPS_SCRIPT_URLINIZI_YAPISTIRIN')) {
    formMessage.textContent = 'RSVP sistemi henüz bağlanmadı: script.js içindeki RSVP_SCRIPT_URL değerini kendi Google Apps Script adresinizle değiştirin (bkz. README.md).';
    formMessage.classList.add('error');
    return;
  }

  submitButton.disabled = true;
  const originalLabel = submitButton.textContent;
  submitButton.textContent = 'GÖNDERİLİYOR...';
  formMessage.textContent = '';

  try {
    await fetch(RSVP_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Apps Script CORS başlığı döndürmediği için 'no-cors' kullanılır
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        ad: name,
        durum: status,
        kisi: status === 'Katılacağım' ? people : '-',
        tarih: new Date().toLocaleString('tr-TR')
      })
    });

    // 'no-cors' modunda yanıt gövdesi okunamaz; istek başarıyla gönderildiğinde
    // burası çalışır ve tabloya satır eklenmiş olur.
    formMessage.textContent = `Teşekkürler ${name}! Katılım durumunuz kaydedildi: ${status}${status === 'Katılacağım' ? ` (${people})` : ''}.`;
    rsvpForm.reset();
    document.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected'));
    document.querySelector('.choice input[value="Katılacağım"]').closest('.choice').classList.add('selected');
    document.querySelector('.choice input[value="Katılacağım"]').checked = true;
  } catch (err) {
    formMessage.textContent = 'Bir sorun oluştu, lütfen tekrar deneyin veya bize doğrudan ulaşın.';
    formMessage.classList.add('error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalLabel;
  }
});
