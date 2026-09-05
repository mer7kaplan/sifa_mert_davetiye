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

document.getElementById('rsvpForm').addEventListener('submit',e=>{
  e.preventDefault();
  const data=new FormData(e.currentTarget);
  const name=data.get('ad'); const status=data.get('durum'); const people=data.get('kisi');
  document.getElementById('formMessage').textContent=`Teşekkürler ${name}! Katılım durumunuz: ${status}${status==='Katılacağım' ? ` (${people})` : ''}.`;
  // GitHub Pages statik olduğu için form verisini bir sunucuya kaydetmez.
  // Formspree/Google Apps Script bağlamak için burası kolayca genişletilebilir.
});
