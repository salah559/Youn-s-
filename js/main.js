// js/main.js - final pro build: gold theme, modal login, admin tabs, announcements filtered
const LS_KEYS = {CRED:'bp_creds', BOOK:'bp_bookings', CAN:'bp_cancelled', ANN:'bp_annonces', JOUR:'bp_journal'};

function nowISO(){ return new Date().toISOString(); }
function uid(){ return 'id_' + Math.random().toString(36).slice(2,9); }

function ensureDefaults(){
  if(!localStorage.getItem(LS_KEYS.CRED)) localStorage.setItem(LS_KEYS.CRED, JSON.stringify({user:'younes', pass:'younes'}));
  if(!localStorage.getItem(LS_KEYS.BOOK)) localStorage.setItem(LS_KEYS.BOOK, JSON.stringify([]));
  if(!localStorage.getItem(LS_KEYS.CAN)) localStorage.setItem(LS_KEYS.CAN, JSON.stringify([]));
  if(!localStorage.getItem(LS_KEYS.ANN)) localStorage.setItem(LS_KEYS.ANN, JSON.stringify([]));
  if(!localStorage.getItem(LS_KEYS.JOUR)) localStorage.setItem(LS_KEYS.JOUR, JSON.stringify([]));
}
ensureDefaults();

// DATA helpers
function load(k){ return JSON.parse(localStorage.getItem(k) || '[]'); }
function save(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
function creds(){ return JSON.parse(localStorage.getItem(LS_KEYS.CRED)); }
function saveCreds(x){ localStorage.setItem(LS_KEYS.CRED, JSON.stringify(x)); }

// Days: 0=Dimanche,2=Mardi,4=Jeudi,5=Vendredi
function dayLabelFromKey(key){ const d=new Date(key+'T00:00:00'); const names={0:'Dimanche',2:'Mardi',4:'Jeudi',5:'Vendredi'}; const nm = names[d.getDay()]||d.toLocaleDateString(); const date = ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear(); return nm + ' ' + date; }
function dayKeyFromDate(d){ const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const day=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${day}`; }
function getWorkingDays(next=180){ const res=[]; const t=new Date(); for(let i=0;i<next;i++){ const d=new Date(); d.setDate(t.getDate()+i); if([0,2,4,5].includes(d.getDay())) res.push(dayKeyFromDate(d)); } return res; }
function capacity(key){ const d=new Date(key+'T00:00:00'); return d.getDay()===5?3:5; }

// Announcements: only show admin-created and system (cancel/restore) on public page
function pushAnnonce(text,type='user'){ const a=load(LS_KEYS.ANN); a.unshift({id:uid(), text, ts:nowISO(), type}); save(LS_KEYS.ANN,a); log('Annonce: '+text); renderAnnonces(); }
function log(msg){ const j=load(LS_KEYS.JOUR); j.unshift({id:uid(), msg, ts:nowISO()}); save(LS_KEYS.JOUR,j); }

// BOOKINGS
function addBooking(name,surname,phone){
  if(!name||!surname){ alert('Nom et Prénom requis'); return; }
  const bks = load(LS_KEYS.BOOK);
  const counts = {}; bks.forEach(b=> counts[b.dayKey]=(counts[b.dayKey]||0)+1);
  const days = getWorkingDays(180);
  for(const k of days){ if((counts[k]||0) < capacity(k)){ const nb={id:uid(), name, surname, phone: phone||'', dayKey:k, dayLabel:dayLabelFromKey(k), inProgress:false, createdAt:nowISO()}; bks.push(nb); save(LS_KEYS.BOOK,bks); document.getElementById('resInfo') && (document.getElementById('resInfo').innerText='Réservé: '+nb.dayLabel); return; } }
  alert('Aucun créneau disponible');
}

// RENDER PUBLIC LIST grouped by day, show En cours badge
function renderList(){
  const container=document.getElementById('publicDays'); if(!container) return;
  const bks = load(LS_KEYS.BOOK).slice().sort((a,b)=> a.dayKey.localeCompare(b.dayKey) || a.createdAt.localeCompare(b.createdAt));
  const days = [...new Set(bks.map(x=>x.dayKey))];
  container.innerHTML='';
  days.forEach(k=>{
    const dayBlock = document.createElement('div'); dayBlock.className='day-block';
    const title = document.createElement('div'); title.className='day-title'; title.innerHTML = `<strong>${dayLabelFromKey(k)}</strong><span class="muted">Capacité: ${capacity(k)}</span>`;
    dayBlock.appendChild(title);
    bks.filter(x=>x.dayKey===k).forEach(c=>{
      const row=document.createElement('div'); row.className='client-row' + (c.inProgress? ' highlight':''); row.innerHTML = `<div class="client-name">${c.name} ${c.surname}</div><div class="client-actions">${c.inProgress? '<span class="badge">En cours</span>':''}</div>`;
      dayBlock.appendChild(row);
    });
    container.appendChild(dayBlock);
  });
  if(days.length===0) container.innerHTML='<p class="muted">Aucune réservation pour l’instant.</p>';
}

// ADMIN helpers render days with actions, phone visible here
function renderAdminDays(){
  const container=document.getElementById('adminDays'); if(!container) return;
  const bks = load(LS_KEYS.BOOK).slice().sort((a,b)=> a.dayKey.localeCompare(b.dayKey) || a.createdAt.localeCompare(b.createdAt));
  const days = getWorkingDays(90);
  container.innerHTML='';
  days.forEach(k=>{
    const items = bks.filter(x=>x.dayKey===k);
    const block=document.createElement('div'); block.className='day-block';
    const title=document.createElement('div'); title.className='day-title'; title.innerHTML=`<strong>${dayLabelFromKey(k)}</strong><div><button onclick="cancelDayByKey('${k}')"><span>Annuler jour</span></button></div>`;
    block.appendChild(title);
    if(items.length===0){ const p=document.createElement('p'); p.className='muted'; p.innerText='Aucun client'; block.appendChild(p); }
    items.forEach((c,idx)=>{
      const row=document.createElement('div'); row.className='client-row' + (c.inProgress? ' highlight':'');
      const nameDiv=document.createElement('div'); nameDiv.className='client-name'; nameDiv.innerText = (idx+1) + '. ' + c.name + ' ' + c.surname + (c.phone? ' • ' + c.phone : ' • ---');
      const actionsDiv=document.createElement('div'); actionsDiv.className='client-actions';
      const btnProm=document.createElement('button'); btnProm.innerHTML='<span>Promouvoir</span>'; btnProm.onclick=()=> promoteBooking(c.id);
      const btnIn=document.createElement('button'); btnIn.innerHTML='<span>En cours</span>'; btnIn.onclick=()=> setInProgress(c.id);
      const btnDel=document.createElement('button'); btnDel.innerHTML='<span>Supprimer</span>'; btnDel.onclick=()=> { if(confirm('Supprimer?')) deleteBooking(c.id); };
      const btnEdit=document.createElement('button'); btnEdit.innerHTML='<span>Éditer</span>'; btnEdit.onclick=()=> editBooking(c.id);
      actionsDiv.appendChild(btnProm); actionsDiv.appendChild(btnIn); actionsDiv.appendChild(btnEdit); actionsDiv.appendChild(btnDel);
      row.appendChild(nameDiv); row.appendChild(actionsDiv); block.appendChild(row);
    });
    container.appendChild(block);
  });
}

// delete booking
function deleteBooking(id){ let bks = load(LS_KEYS.BOOK); const b = bks.find(x=>x.id===id); bks = bks.filter(x=>x.id!==id); save(LS_KEYS.BOOK,bks); pushSystem('Suppression: réservation supprimée (' + (b? b.name+' '+b.surname : id) + ')'); renderAdminDays(); renderList(); renderAnnonces(); log('Suppression reservation '+id); }

// promote - move earlier in array among same-day entries
function promoteBooking(id){
  const bks = load(LS_KEYS.BOOK);
  const idx = bks.findIndex(x=>x.id===id); if(idx===-1) return;
  // find previous index with same dayKey
  let prev = -1;
  for(let i=0;i<idx;i++) if(bks[i].dayKey === bks[idx].dayKey) prev = i;
  if(prev === -1) return alert('Déjà premier de la journée');
  // swap positions
  const tmp = bks[prev]; bks[prev] = bks[idx]; bks[idx] = tmp; save(LS_KEYS.BOOK,bks); pushSystem('Promotion: ' + bks[prev].name + ' promu'); renderAdminDays(); renderList();
}

// edit booking (name/surname and optionally move day)
function editBooking(id){
  const bks = load(LS_KEYS.BOOK);
  const i = bks.findIndex(x=>x.id===id); if(i===-1) return;
  const b = bks[i];
  const nn = prompt('Nom', b.name); if(nn===null) return;
  const ns = prompt('Prénom', b.surname); if(ns===null) return;
  const days = getWorkingDays(120); const opt = days.map((d,idx)=> (idx+1)+'. '+dayLabelFromKey(d)).join('\n');
  const choice = prompt('Choisir numéro du jour (0 garder le même)\n'+opt, '0'); if(choice===null) return;
  let newKey = b.dayKey; const num = parseInt(choice);
  if(!isNaN(num) && num>0 && num<=days.length) newKey = days[num-1];
  // capacity check excluding self
  const counts={}; bks.forEach((bb,ii)=> { if(ii!==i) counts[bb.dayKey] = (counts[bb.dayKey]||0)+1; });
  if((counts[newKey]||0) >= capacity(newKey)) return alert('Le jour choisi est plein');
  bks[i].name = nn.trim(); bks[i].surname = ns.trim(); bks[i].dayKey = newKey; bks[i].dayLabel = dayLabelFromKey(newKey); save(LS_KEYS.BOOK,bks); pushSystem('Modification: réservation modifiée ('+bks[i].name+')'); renderAdminDays(); renderList();
}

// set in progress
function setInProgress(id){ const bks = load(LS_KEYS.BOOK); const b = bks.find(x=>x.id===id); if(!b) return; bks.forEach(x=> x.inProgress=false); b.inProgress = true; save(LS_KEYS.BOOK,bks); pushSystem('État: '+b.name+' en cours de coupe'); renderAdminDays(); renderList(); renderAnnonces(); }

// cancel day: snapshot and reassign
function cancelDayByKey(dayKey){
  let bks = load(LS_KEYS.BOOK);
  const toMove = bks.filter(x=> x.dayKey===dayKey);
  if(toMove.length===0) return alert('Aucune réservation pour ce jour');
  const cancelled = load(LS_KEYS.CAN); cancelled.unshift({dayKey, bookings: JSON.parse(JSON.stringify(toMove)), ts: nowISO()}); save(LS_KEYS.CAN, cancelled);
  // remove original
  bks = bks.filter(x=> x.dayKey !== dayKey);
  // reassign each in order to next available day
  const days = getWorkingDays(365);
  for(const orig of toMove){
    const start = days.indexOf(dayKey);
    let placed=false;
    for(let i=start+1;i<days.length;i++){
      const k = days[i]; const cap = capacity(k); const cnt = bks.filter(bb=>bb.dayKey===k).length;
      if(cnt < cap){ const copy = Object.assign({}, orig); copy.id = uid(); copy.dayKey = k; copy.dayLabel = dayLabelFromKey(k); copy.inProgress=false; bks.push(copy); placed=true; break; }
    }
    if(!placed){ alert('Impossible de reprogrammer certains clients automatiquement'); break; }
  }
  save(LS_KEYS.BOOK,bks); pushSystem('Annulation: jour ' + dayLabelFromKey(dayKey) + ' annulé et reprogrammé'); renderAdminDays(); renderList(); renderAnnonces(); populateDaySelect();
}

// restore day (if capacity allows)
function restoreDayByKey(dayKey){
  let cancelled = load(LS_KEYS.CAN);
  const idx = cancelled.findIndex(x=> x.dayKey === dayKey);
  if(idx === -1) return alert('Aucun jour annulé trouvé');
  const snapshot = cancelled[idx];
  const bks = load(LS_KEYS.BOOK);
  const existing = bks.filter(x=> x.dayKey === dayKey).length;
  if(existing + snapshot.bookings.length > capacity(dayKey)) return alert('Pas assez de place pour restaurer');
  // restore with new ids
  snapshot.bookings.forEach(ob => { const copy = Object.assign({}, ob); copy.id = uid(); copy.inProgress = false; bks.push(copy); });
  cancelled.splice(idx,1); save(LS_KEYS.CAN, cancelled); save(LS_KEYS.BOOK, bks); pushSystem('Restauration: jour ' + dayLabelFromKey(dayKey) + ' restauré'); renderAdminDays(); renderList(); renderAnnonces(); populateDaySelect();
}

// create annonce (admin)
function createAnnonce(){ const t = document.getElementById('annText').value.trim(); if(!t) return alert('Texte vide'); pushAnnonce(t,'user'); document.getElementById('annText').value=''; alert('Annonce publiée'); renderAdminAnns(); }

// system annonce helper
function pushSystem(text){ pushAnnonce(text,'system'); log('SYS: '+text); }

// render annonces (public page shows only type user and system)
function renderAnnonces(){
  const list = document.getElementById('annList'); if(!list) return;
  const anns = load(LS_KEYS.ANN).filter(a=> a.type==='user' || a.type==='system');
  list.innerHTML='';
  if(anns.length===0){ list.innerHTML='<p class="muted">Aucune annonce</p>'; return; }
  anns.forEach(a=>{ const node=document.createElement('div'); node.className='card'; const d=new Date(a.ts); node.innerHTML = `<div style="font-size:13px;color:var(--muted)">${(a.type==='system'?'[SYSTEM] ':'')}${d.toLocaleString()}</div><p>${a.text}</p>`; list.appendChild(node); });
}

// render admin-only annonces (all user created)
function renderAdminAnns(){
  const el = document.getElementById('adminAnns'); if(!el) return;
  const anns = load(LS_KEYS.ANN).filter(a=> a.type==='user');
  el.innerHTML='';
  anns.forEach(a=>{ const node=document.createElement('div'); node.className='card'; const d=new Date(a.ts); node.innerHTML = `<div style="font-size:13px;color:var(--muted)">${d.toLocaleString()}</div><p>${a.text}</p>`; el.appendChild(node); });
}

// populate day select for admin restore/cancel lists
function populateDaySelect(){
  const sel = document.getElementById('daySelect'); if(!sel) return;
  sel.innerHTML='';
  const cancelled = load(LS_KEYS.CAN);
  cancelled.forEach(c=>{ const opt=document.createElement('option'); opt.value=c.dayKey; opt.innerText=dayLabelFromKey(c.dayKey) + ' (annulé)'; sel.appendChild(opt); });
  const days = getWorkingDays(180);
  days.forEach(d=>{ const opt=document.createElement('option'); opt.value=d; opt.innerText=dayLabelFromKey(d); sel.appendChild(opt); });
}

// login modal functions (shared across pages)
function openLoginModal(){ document.getElementById('loginModal') && document.getElementById('loginModal').classList.remove('hidden'); }
function closeLoginModal(){ document.getElementById('loginModal') && document.getElementById('loginModal').classList.add('hidden'); }
function doModalLogin(){
  const u = document.getElementById('modalUser').value.trim(); const p = document.getElementById('modalPass').value.trim();
  const c = creds();
  if(u === c.user && p === c.pass){ // success
    closeLoginModal(); activateAdminArea(); } else { document.getElementById('modalMsg').innerText = 'Identifiants incorrects'; }
}
function activateAdminArea(){
  // show admin area on admin page if present
  const area = document.getElementById('adminArea'); if(area) area.classList.remove('hidden');
  // if on admin.html, also open first tab and render data
  setupTabs();
  renderAdminDays(); renderAdminAnns(); renderJournal(); populateDaySelect();
  alert('Bienvenue, vous êtes connecté en tant que coiffeur');
}

// setup tabs handlers
function setupTabs(){
  const btns = document.querySelectorAll('.tab-btn'); btns.forEach(b=> b.onclick = function(){ document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active')); this.classList.add('active'); const t=this.dataset.tab; document.querySelectorAll('.tab.panel').forEach(p=>p.classList.add('hidden')); document.getElementById(t).classList.remove('hidden'); });
}

function wrapNavLinks(){
  document.querySelectorAll('.nav a').forEach(link => {
    if (!link.querySelector('span')) {
      link.innerHTML = '<span>' + link.textContent + '</span>';
    }
  });
}
window.addEventListener('DOMContentLoaded', wrapNavLinks);

// change credentials
function changeCredentials(){ const nu=document.getElementById('newUser').value.trim(); const np=document.getElementById('newPass').value.trim(); if(!nu||!np) return alert('Remplir'); saveCreds({user:nu, pass:np}); alert('Identifiants mis à jour'); log('Changement cred'); }

// render journal (admin)
function renderJournal(){ const el = document.getElementById('journalList'); if(!el) return; const j = load(LS_KEYS.JOUR); el.innerHTML = ''; j.forEach(it=>{ const d=new Date(it.ts); const node=document.createElement('div'); node.className='card'; node.innerHTML=`<div style="font-size:13px;color:var(--muted)">${d.toLocaleString()}</div><p>${it.msg}</p>`; el.appendChild(node); }); if(j.length===0) el.innerHTML='<p class="muted">Journal vide</p>'; }

// reset all storage (admin)
function resetAll(){ if(!confirm('Réinitialiser toutes les données?')) return; localStorage.removeItem(LS_KEYS.BOOK); localStorage.removeItem(LS_KEYS.CAN); localStorage.removeItem(LS_KEYS.ANN); localStorage.removeItem(LS_KEYS.JOUR); ensureDefaults(); renderList(); renderAdminDays(); renderAnnonces(); renderAdminAnns(); renderJournal(); populateDaySelect(); alert('Réinitialisé'); }

// initial renderers for pages
window.addEventListener('DOMContentLoaded', ()=>{ renderList(); renderAnnonces(); setupTabs(); try{ renderAdminDays(); renderAdminAnns(); populateDaySelect(); }catch(e){} });
