// js/main.js - French version with full features required
// Data structures in localStorage:
// - barberCreds: {user, pass}
// - bookings: array of {id, name, surname, phone, dayKey, dayLabel, inProgress}
// - cancelledDays: array of {dayKey, bookings: [booking objects in order]}
// - annonces: array of {id, text, ts, type}  (type: 'user' or 'system')

function nowTs(){ return new Date().toISOString(); }

function ensureDefaults(){
  if(!localStorage.getItem('barberCreds')) localStorage.setItem('barberCreds', JSON.stringify({user:'younes', pass:'younes'}));
  if(!localStorage.getItem('bookings')) localStorage.setItem('bookings', JSON.stringify([]));
  if(!localStorage.getItem('cancelledDays')) localStorage.setItem('cancelledDays', JSON.stringify([]));
  if(!localStorage.getItem('annonces')) localStorage.setItem('annonces', JSON.stringify([]));
}
ensureDefaults();

function getCreds(){ return JSON.parse(localStorage.getItem('barberCreds')); }
function login(u,p){ const c=getCreds(); return u===c.user && p===c.pass; }
function changeCredentials(){ const nu=document.getElementById('newUser').value.trim(); const np=document.getElementById('newPass').value.trim(); if(!nu||!np){ alert('Remplissez les champs'); return; } localStorage.setItem('barberCreds', JSON.stringify({user:nu, pass:np})); alert('Compte mis à jour'); }

function uid(){ return 'id_'+Math.random().toString(36).slice(2,9); }

// Working days: Sunday(0)=Dimanche, Tuesday(2)=Mardi, Thursday(4)=Jeudi, Friday(5)=Vendredi
function dayName(d){ const names={0:'Dimanche',2:'Mardi',4:'Jeudi',5:'Vendredi'}; return names[d.getDay()]||d.toLocaleDateString(); }
function formatKey(d){ const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const day=String(d.getDate()).padStart(2,'0'); return y+'-'+m+'-'+day; }
function labelFromKey(key){ const d=new Date(key+'T00:00:00'); const datePart = ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear(); return dayName(d)+' '+datePart; }

function getWorkingDaysArray(nextDays=30){
  const arr=[]; const today=new Date();
  for(let i=0;i<nextDays;i++){ const d=new Date(); d.setDate(today.getDate()+i); if([0,2,4,5].includes(d.getDay())) arr.push(formatKey(d)); }
  return arr;
}

function capacityForDay(key){ const d=new Date(key+'T00:00:00'); return d.getDay()===5?3:5; }

function loadBookings(){ return JSON.parse(localStorage.getItem('bookings')||'[]'); }
function saveBookings(b){ localStorage.setItem('bookings', JSON.stringify(b)); }
function loadCancelled(){ return JSON.parse(localStorage.getItem('cancelledDays')||'[]'); }
function saveCancelled(c){ localStorage.setItem('cancelledDays', JSON.stringify(c)); }
function loadAnnonces(){ return JSON.parse(localStorage.getItem('annonces')||'[]'); }
function saveAnnonces(a){ localStorage.setItem('annonces', JSON.stringify(a)); }

function pushAnnonce(text, type='user'){ const a=loadAnnonces(); a.unshift({id:uid(), text, ts:nowTs(), type}); saveAnnonces(a); renderAnnonces(); }

// When cancelling/restoring day, create system annonces
function systemAnnonce(msg){ pushAnnonce(msg, 'system'); }

// Add booking: accept empty phone
function addBooking(name, surname, phone){
  if(!name||!surname){ alert('Nom et prénom requis'); return; }
  const bookings=loadBookings();
  const counts={};
  bookings.forEach(b=> counts[b.dayKey]=(counts[b.dayKey]||0)+1);
  const days = getWorkingDaysArray(30);
  for(const key of days){
    const cap = capacityForDay(key);
    if((counts[key]||0) < cap){
      const b={id:uid(), name, surname, phone: phone||'', dayKey:key, dayLabel: labelFromKey(key), inProgress:false};
      bookings.push(b); saveBookings(bookings);
      alert('Réservation enregistrée: '+b.dayLabel);
      return;
    }
  }
  alert('Aucun créneau disponible dans les 30 prochains jours');
}

// Render public list (no phone)
function renderList(){
  const table=document.getElementById('bookingTable'); if(!table) return;
  const bookings=loadBookings();
  table.innerHTML = '<tr><th>Nom</th><th>Prénom</th><th>Jour</th></tr>';
  bookings.forEach(b=>{ const row=table.insertRow(); row.insertCell(0).innerText=b.name; row.insertCell(1).innerText=b.surname; row.insertCell(2).innerText=b.dayLabel; });
}

// Admin table (phone visible here), with actions: delete, promote, setInProgress
function renderAdminList(){
  const table=document.getElementById('adminTable'); if(!table) return;
  const bookings=loadBookings();
  table.innerHTML = '<tr><th>Nom</th><th>Prénom</th><th>Jour</th><th>Téléphone</th><th>État</th><th>Actions</th></tr>';
  bookings.forEach((b,i)=>{
    const row=table.insertRow(); row.insertCell(0).innerText=b.name; row.insertCell(1).innerText=b.surname; row.insertCell(2).innerText=b.dayLabel; row.insertCell(3).innerText=b.phone||'---';
    row.insertCell(4).innerHTML = b.inProgress?'<span class="badge">En cours</span>':'--';
    const actionsCell=row.insertCell(5);
    const btnDel=document.createElement('button'); btnDel.innerText='Supprimer'; btnDel.onclick=()=>{ if(confirm('Supprimer?')){ deleteBooking(b.id); } };
    const btnProm=document.createElement('button'); btnProm.innerText='Promouvoir'; btnProm.onclick=()=>{ promote(b.id); };
    const btnIn=document.createElement('button'); btnIn.innerText='En cours'; btnIn.onclick=()=>{ setInProgress(b.id); };
    actionsCell.appendChild(btnDel); actionsCell.appendChild(btnProm); actionsCell.appendChild(btnIn);
    if(b.inProgress) row.classList.add('highlight');
  });
}

// delete booking by id
function deleteBooking(id){ let bookings=loadBookings(); bookings=bookings.filter(b=>b.id!==id); saveBookings(bookings); renderAdminList(); pushAnnonce('Suppression: réservation supprimée (id:'+id+')','system'); }

// promote: move that booking earlier within same day (swap with previous in same day)
function promote(id){
  const bookings=loadBookings();
  // get indices of same-day bookings in order
  const b = bookings.find(x=>x.id===id);
  if(!b) return;
  const same = bookings.map((x,i)=> ({x,i})).filter(o=> o.x.dayKey===b.dayKey).sort((a,c)=> a.i - c.i);
  const idx = same.findIndex(o=> o.x.id===id);
  if(idx>0){
    const iGlobal = same[idx].i; const prevGlobal = same[idx-1].i;
    // swap positions in bookings array
    const tmp = bookings[prevGlobal]; bookings[prevGlobal]=bookings[iGlobal]; bookings[iGlobal]=tmp;
    saveBookings(bookings); renderAdminList(); pushAnnonce('Promotion: '+b.name+' '+b.surname+' promu dans la liste','system');
  } else alert('Déjà en première position ce jour-là');
}

// setInProgress by id
function setInProgress(id){
  const bookings=loadBookings(); bookings.forEach(b=> b.inProgress=false); const b=bookings.find(x=>x.id===id); if(b) b.inProgress=true; saveBookings(bookings); renderAdminList(); pushAnnonce('État: '+(b? b.name+' en cours de coupe':'') ,'system'); }

// cancelDay: move all bookings of a day to next available days preserving order, but also save snapshot to cancelledDays for restore
function cancelDay(){
  const sel=document.getElementById('daySelect'); if(!sel) return; const dayKey=sel.value; if(!dayKey) { alert('Choisir un jour'); return; }
  let bookings=loadBookings();
  const toMove = bookings.filter(b=> b.dayKey===dayKey);
  if(toMove.length===0){ alert('Aucune réservation ce jour'); return; }
  // save snapshot
  const cancelled = loadCancelled(); cancelled.unshift({dayKey, bookings: JSON.parse(JSON.stringify(toMove)), ts: nowTs()}); saveCancelled(cancelled);
  // remove them from bookings (but we'll reassign new days)
  bookings = bookings.filter(b=> b.dayKey!==dayKey);
  // now reinsert each in order to next available days
  const days = getWorkingDaysArray(60); // search further to fit
  for(const original of toMove){
    // find next day after original.dayKey with capacity
    const startIndex = days.indexOf(original.dayKey);
    let placed=false;
    for(let i = (startIndex+1); i<days.length; i++){
      const key = days[i]; const cap = capacityForDay(key);
      const count = bookings.filter(bb=> bb.dayKey===key).length;
      if(count < cap){ // assign
        const copy = Object.assign({}, original); copy.dayKey=key; copy.dayLabel=labelFromKey(key); bookings.push(copy); placed=true; break;
      }
    }
    if(!placed){ alert('Impossible de reprogrammer toutes les réservations, annulez manuellement'); break; }
  }
  saveBookings(bookings); renderAdminList(); pushAnnonce('Annulation: le jour '+labelFromKey(dayKey)+' a été annulé et reprogrammé','system'); populateDaySelect();
}

// restoreDay: pop last cancelled matching selected dayKey and restore bookings back to that day (if capacity allows)
function restoreDay(){
  const sel=document.getElementById('daySelect'); if(!sel) return; const key=sel.value; if(!key) { alert('Choisir un jour'); return; }
  let cancelled = loadCancelled();
  const idx = cancelled.findIndex(c=> c.dayKey===key);
  if(idx===-1){ alert('Aucun jour annulé correspondant'); return; }
  const snapshot = cancelled[idx];
  // check capacity: ensure target day currently has 0 bookings (or enough space) - we'll try to put back in order, but if not enough space abort
  const bookings=loadBookings();
  const existingCount = bookings.filter(b=> b.dayKey===key).length;
  const cap = capacityForDay(key);
  if(existingCount + snapshot.bookings.length > cap){ alert('Pas assez de place pour restaurer'); return; }
  // remove snapshot from cancelled and add bookings back (preserve original order)
  cancelled.splice(idx,1);
  for(const b of snapshot.bookings){
    const copy = Object.assign({}, b);
    // ensure same id uniqueness
    copy.id = uid();
    bookings.push(copy);
  }
  saveBookings(bookings); saveCancelled(cancelled); renderAdminList(); pushAnnonce('Restauration: le jour '+labelFromKey(key)+' a été restauré','system'); populateDaySelect();
}

// populate day select with upcoming working days and cancelled days
function populateDaySelect(){
  const sel=document.getElementById('daySelect'); if(!sel) return;
  sel.innerHTML='';
  const days = getWorkingDaysArray(60);
  days.forEach(d=>{ const opt=document.createElement('option'); opt.value=d; opt.innerText=labelFromKey(d); sel.appendChild(opt); });
  // also add cancelled days at top
  const cancelled=loadCancelled();
  for(const c of cancelled){ const opt=document.createElement('option'); opt.value=c.dayKey; opt.innerText=labelFromKey(c.dayKey)+' (annulé)'; sel.insertBefore(opt, sel.firstChild); }
}

// create annonce from admin
function createAnnonce(){
  const text = document.getElementById('annText').value.trim(); if(!text){ alert('Texte requis'); return; }
  pushAnnonce(text,'user'); document.getElementById('annText').value=''; alert('Annonce envoyée'); renderAnnonces();
}

// render annonces list
function renderAnnonces(){
  const list = document.getElementById('annList'); if(!list) return;
  const anns = loadAnnonces();
  list.innerHTML = '';
  anns.forEach(a=>{
    const d = new Date(a.ts);
    const node = document.createElement('div'); node.className='card'; node.innerHTML = '<strong>'+ (a.type==='system' ? '[SYSTEM] ':'') + d.toLocaleString() + '</strong><p>'+a.text+'</p>';
    list.appendChild(node);
  });
}

// initial rendering and helpers
window.addEventListener('DOMContentLoaded', ()=>{
  if(document.getElementById('bookingTable')) renderList();
  if(document.getElementById('adminTable')) renderAdminList();
  populateDaySelect();
  // set admin creds fields if present
  const creds = getCreds(); const nu=document.getElementById('newUser'); const np=document.getElementById('newPass');
  if(nu) nu.value = creds.user; if(np) np.value = creds.pass;
});

