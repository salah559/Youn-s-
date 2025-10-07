// js/main.js - Barber management app (French)
// LocalStorage keys
const LS = {
  creds: 'barber_app_creds_v2',
  bookings: 'barber_app_bookings_v2',
  cancelled: 'barber_app_cancelled_v2',
  annonces: 'barber_app_annonces_v2'
};

function nowISO(){ return new Date().toISOString(); }
function uid(){ return 'b_'+Math.random().toString(36).slice(2,9); }

function ensureDefaults(){
  if(!localStorage.getItem(LS.creds)) localStorage.setItem(LS.creds, JSON.stringify({user:'younes', pass:'younes'}));
  if(!localStorage.getItem(LS.bookings)) localStorage.setItem(LS.bookings, JSON.stringify([]));
  if(!localStorage.getItem(LS.cancelled)) localStorage.setItem(LS.cancelled, JSON.stringify([]));
  if(!localStorage.getItem(LS.annonces)) localStorage.setItem(LS.annonces, JSON.stringify([]));
}
ensureDefaults();

function loadCreds(){ return JSON.parse(localStorage.getItem(LS.creds)); }
function saveCreds(x){ localStorage.setItem(LS.creds, JSON.stringify(x)); }
function loadBookings(){ return JSON.parse(localStorage.getItem(LS.bookings) || '[]'); }
function saveBookings(b){ localStorage.setItem(LS.bookings, JSON.stringify(b)); }
function loadCancelled(){ return JSON.parse(localStorage.getItem(LS.cancelled) || '[]'); }
function saveCancelled(c){ localStorage.setItem(LS.cancelled, JSON.stringify(c)); }
function loadAnnonces(){ return JSON.parse(localStorage.getItem(LS.annonces) || '[]'); }
function saveAnnonces(a){ localStorage.setItem(LS.annonces, JSON.stringify(a)); }

// Days mapping: 0=Dimanche,2=Mardi,4=Jeudi,5=Vendredi
function dayNameFromDate(d){ const names={0:'Dimanche',2:'Mardi',4:'Jeudi',5:'Vendredi'}; return names[d.getDay()] || d.toLocaleDateString(); }
function formatKey(d){ const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const da=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${da}`; }
function labelFromKey(key){ const d = new Date(key + 'T00:00:00'); const datePart = ('0'+d.getDate()).slice(-2) + '/' + ('0'+(d.getMonth()+1)).slice(-2) + '/' + d.getFullYear(); return dayNameFromDate(d) + ' ' + datePart; }

function getWorkingDaysArray(daysAhead=180){
  const arr=[]; const today=new Date();
  for(let i=0;i<daysAhead;i++){
    const d=new Date(); d.setDate(today.getDate()+i);
    if([0,2,4,5].includes(d.getDay())) arr.push(formatKey(d));
  }
  return arr;
}
function capacityForDayKey(key){ const d=new Date(key + 'T00:00:00'); return d.getDay()===5 ? 3 : 5; }

// Announcements
function pushAnnonce(text, type='user'){
  const a = loadAnnonces();
  a.unshift({id: uid(), text: text, ts: nowISO(), type});
  saveAnnonces(a);
  renderAnnonces();
}

// Add booking (phone optional)
function addBooking(name, surname, phone){
  if(!name || !surname){ alert('Nom et prénom requis'); return; }
  const bookings = loadBookings();
  const counts = {};
  bookings.forEach(b => counts[b.dayKey] = (counts[b.dayKey]||0)+1);
  const days = getWorkingDaysArray(180);
  for(const key of days){
    if((counts[key]||0) < capacityForDayKey(key)){
      const b = { id: uid(), name, surname, phone: phone||'', dayKey: key, dayLabel: labelFromKey(key), inProgress: false, createdAt: nowISO() };
      bookings.push(b); saveBookings(bookings);
      document.getElementById('resInfo')?.removeAttribute('hidden');
      if(document.getElementById('resInfo')) document.getElementById('resInfo').innerText = 'Réservation: ' + b.dayLabel;
      return;
    }
  }
  alert('Aucun créneau disponible dans les ' + days.length + ' prochains jours');
}

// Render public list (no phone) but show who is "En cours"
function renderList(){
  const table = document.getElementById('bookingTable'); if(!table) return;
  const bookings = loadBookings();
  // stable sort by dayKey then createdAt
  const sorted = bookings.slice().sort((a,b)=> a.dayKey.localeCompare(b.dayKey) || (a.createdAt||'').localeCompare(b.createdAt||''));
  table.innerHTML = '<tr><th>Nom</th><th>Prénom</th><th>Jour</th><th>État</th></tr>';
  sorted.forEach(b => {
    const tr = table.insertRow();
    tr.insertCell(0).innerText = b.name;
    tr.insertCell(1).innerText = b.surname;
    tr.insertCell(2).innerText = b.dayLabel;
    tr.insertCell(3).innerHTML = b.inProgress ? '<span class="badge">En cours</span>' : 'Réservé';
    if(b.inProgress) tr.classList.add('highlight');
  });
}

// Admin render (phone visible)
function renderAdminList(){
  const table = document.getElementById('adminTable'); if(!table) return;
  const bookings = loadBookings();
  const sorted = bookings.slice().sort((a,b)=> a.dayKey.localeCompare(b.dayKey) || (a.createdAt||'').localeCompare(b.createdAt||''));
  table.innerHTML = '<tr><th>Nom</th><th>Prénom</th><th>Jour</th><th>Téléphone</th><th>État</th><th>Actions</th></tr>';
  sorted.forEach(b => {
    const tr = table.insertRow();
    tr.insertCell(0).innerText = b.name;
    tr.insertCell(1).innerText = b.surname;
    tr.insertCell(2).innerText = b.dayLabel;
    tr.insertCell(3).innerText = b.phone || '---';
    tr.insertCell(4).innerHTML = b.inProgress ? '<span class="badge">En cours</span>' : '--';
    const actions = tr.insertCell(5);
    const btnDel = document.createElement('button'); btnDel.innerText='Supprimer'; btnDel.onclick = ()=> { if(confirm('Supprimer cette réservation?')) deleteBooking(b.id); };
    const btnProm = document.createElement('button'); btnProm.innerText='Promouvoir'; btnProm.onclick = ()=> promoteBooking(b.id);
    const btnIn = document.createElement('button'); btnIn.innerText='En cours'; btnIn.onclick = ()=> setInProgress(b.id);
    const btnEdit = document.createElement('button'); btnEdit.innerText='Éditer'; btnEdit.onclick = ()=> editBooking(b.id);
    actions.appendChild(btnDel); actions.appendChild(btnProm); actions.appendChild(btnIn); actions.appendChild(btnEdit);
    if(b.inProgress) tr.classList.add('highlight');
  });
}

// Delete booking
function deleteBooking(id){
  let bookings = loadBookings();
  const b = bookings.find(x=>x.id===id);
  bookings = bookings.filter(x=> x.id !== id);
  saveBookings(bookings);
  pushAnnonce('Suppression: réservation supprimée (' + (b? b.name + ' ' + b.surname : id) + ')', 'system');
  renderAdminList(); renderList();
}

// Promote booking: move up within same day order
function promoteBooking(id){
  const bookings = loadBookings();
  // find indices in original array for same day
  const indices = bookings.map((x,i)=> ({x,i})).filter(o => o.x.dayKey === bookings.find(b=>b.id===id)?.dayKey);
  if(indices.length === 0) return alert('Impossible de promouvoir');
  const idxInAll = bookings.findIndex(x=>x.id===id);
  if(idxInAll === -1) return;
  // find prev index for same day
  let prevIdx = -1;
  for(let i=0;i<bookings.length;i++){
    if(bookings[i].dayKey === bookings[idxInAll].dayKey){
      if(bookings[i].id === id) break;
      prevIdx = i;
    }
  }
  if(prevIdx === -1) return alert('Déjà en première position pour ce jour');
  // swap
  const tmp = bookings[prevIdx]; bookings[prevIdx] = bookings[idxInAll]; bookings[idxInAll] = tmp;
  saveBookings(bookings);
  pushAnnonce('Promotion: ' + bookings[prevIdx].name + ' promu dans la liste', 'system');
  renderAdminList(); renderList();
}

// Edit booking: change name/surname or move to another day
function editBooking(id){
  const bookings = loadBookings();
  const i = bookings.findIndex(b=> b.id===id);
  if(i===-1) return;
  const b = bookings[i];
  const newName = prompt('Nom', b.name); if(newName===null) return;
  const newSurname = prompt('Prénom', b.surname); if(newSurname===null) return;
  // choose new day
  const days = getWorkingDaysArray(120);
  const dayOptions = days.map((d,idx)=> (idx+1) + '. ' + labelFromKey(d)).join('\n');
  const choice = prompt('Choisir le numéro du jour (laisser 0 pour garder le même)\n' + dayOptions, '0');
  if(choice === null) return;
  let newDayKey = b.dayKey;
  const num = parseInt(choice);
  if(!isNaN(num) && num > 0 && num <= days.length) newDayKey = days[num-1];
  // check capacity excluding this booking
  const counts = {};
  bookings.forEach((bb,ii)=> { if(ii !== i) counts[bb.dayKey] = (counts[bb.dayKey]||0)+1; });
  if((counts[newDayKey]||0) >= capacityForDayKey(newDayKey)){ alert('Le jour choisi est plein'); return; }
  bookings[i].name = newName.trim(); bookings[i].surname = newSurname.trim(); bookings[i].dayKey = newDayKey; bookings[i].dayLabel = labelFromKey(newDayKey);
  saveBookings(bookings);
  pushAnnonce('Modification: réservation modifiée (' + bookings[i].name + ')', 'system');
  renderAdminList(); renderList();
}

// Set in progress by id
function setInProgress(id){
  const bookings = loadBookings();
  const b = bookings.find(x=> x.id===id);
  if(!b) return;
  bookings.forEach(x=> x.inProgress = false);
  b.inProgress = true;
  saveBookings(bookings);
  pushAnnonce('État: ' + b.name + ' en cours de coupe', 'system');
  renderAdminList(); renderList();
}

// Cancel day: move all bookings of that day to next available days preserving order; save snapshot for restore
function cancelDay(){
  const sel = document.getElementById('daySelect'); if(!sel) return alert('Choisir un jour');
  const dayKey = sel.value;
  if(!dayKey) return alert('Choisir un jour');
  let bookings = loadBookings();
  const toMove = bookings.filter(b => b.dayKey === dayKey);
  if(toMove.length === 0) return alert('Aucune réservation pour ce jour');
  // snapshot
  const cancelled = loadCancelled();
  cancelled.unshift({ dayKey, bookings: JSON.parse(JSON.stringify(toMove)), ts: nowISO() });
  saveCancelled(cancelled);
  // remove them
  bookings = bookings.filter(b => b.dayKey !== dayKey);
  // reassign each booking to next available day
  const days = getWorkingDaysArray(365);
  for(const original of toMove){
    const startIndex = days.indexOf(dayKey);
    let placed = false;
    for(let i = startIndex + 1; i < days.length; i++){
      const key = days[i];
      const cap = capacityForDayKey(key);
      const count = bookings.filter(bb => bb.dayKey === key).length;
      if(count < cap){
        const newB = Object.assign({}, original);
        newB.id = uid();
        newB.dayKey = key;
        newB.dayLabel = labelFromKey(key);
        newB.inProgress = false;
        bookings.push(newB);
        placed = true;
        break;
      }
    }
    if(!placed){
      alert('Impossible de reprogrammer certaines réservations automatiquement. Annulation partielle.');
      // continue to try others but break to avoid infinite situation
      break;
    }
  }
  saveBookings(bookings);
  pushAnnonce('Annulation: Le jour ' + labelFromKey(dayKey) + ' a été annulé et reprogrammé automatiquement', 'system');
  renderAdminList(); renderList(); populateDaySelect(); renderAnnonces();
}

// Restore day: restore latest cancelled snapshot for that dayKey if capacity available
function restoreDay(){
  const sel = document.getElementById('daySelect'); if(!sel) return alert('Choisir un jour');
  const dayKey = sel.value; if(!dayKey) return alert('Choisir un jour');
  let cancelled = loadCancelled();
  const idx = cancelled.findIndex(c => c.dayKey === dayKey);
  if(idx === -1) return alert('Aucun jour annulé correspondant');
  const snapshot = cancelled[idx];
  const bookings = loadBookings();
  const existing = bookings.filter(b => b.dayKey === dayKey).length;
  const cap = capacityForDayKey(dayKey);
  if(existing + snapshot.bookings.length > cap) return alert('Pas assez de place pour restaurer ce jour');
  // restore (give new ids)
  for(const ob of snapshot.bookings){
    const copy = Object.assign({}, ob);
    copy.id = uid();
    copy.inProgress = false;
    bookings.push(copy);
  }
  // remove snapshot from cancelled
  cancelled.splice(idx, 1);
  saveCancelled(cancelled);
  saveBookings(bookings);
  pushAnnonce('Restauration: Le jour ' + labelFromKey(dayKey) + ' a été restauré', 'system');
  renderAdminList(); renderList(); populateDaySelect(); renderAnnonces();
}

// Populate day select (upcoming working days and cancelled days at top)
function populateDaySelect(){
  const sel = document.getElementById('daySelect'); if(!sel) return;
  sel.innerHTML = '';
  const cancelled = loadCancelled();
  // add cancelled days first
  cancelled.forEach(c => {
    const opt = document.createElement('option'); opt.value = c.dayKey; opt.innerText = labelFromKey(c.dayKey) + ' (annulé)'; sel.appendChild(opt);
  });
  const days = getWorkingDaysArray(180);
  days.forEach(d => { const opt = document.createElement('option'); opt.value = d; opt.innerText = labelFromKey(d); sel.appendChild(opt); });
}

// Create annonce from admin
function createAnnonce(){
  const txt = document.getElementById('annText').value.trim();
  if(!txt) return alert('Écrire un texte');
  pushAnnonce(txt, 'user');
  document.getElementById('annText').value = '';
  alert('Annonce envoyée');
}

// Render annonces
function renderAnnonces(){
  const list = document.getElementById('annList'); if(!list) return;
  const anns = loadAnnonces();
  list.innerHTML = '';
  anns.forEach(a => {
    const d = new Date(a.ts);
    const node = document.createElement('div'); node.className = 'card';
    const header = document.createElement('div'); header.style.fontSize='13px'; header.style.marginBottom='6px'; header.style.color='rgba(255,255,255,0.85)';
    header.innerText = (a.type === 'system' ? '[SYSTEM] ' : '') + d.toLocaleString() ;
    const p = document.createElement('p'); p.innerText = a.text;
    node.appendChild(header); node.appendChild(p); list.appendChild(node);
  });
}

// Login and account management
function login(u,p){ const c = loadCreds(); return u === c.user && p === c.pass; }
function changeCredentials(){ const nu = document.getElementById('newUser').value.trim(); const np = document.getElementById('newPass').value.trim(); if(!nu || !np) return alert('Remplir les champs'); saveCreds({user:nu, pass:np}); alert('Identifiants mis à jour'); }

// Initial rendering on pages
window.addEventListener('DOMContentLoaded', ()=>{
  renderList(); renderAnnonces();
  const creds = loadCreds();
  const nu = document.getElementById('newUser'); const np = document.getElementById('newPass');
  if(nu) nu.value = creds.user; if(np) np.value = creds.pass;
  populateDaySelect();
  // admin list initial if logged in later
});
