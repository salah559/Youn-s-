// bookings structure: {name, surname, phone, dayKey, dayLabel, inProgress}
// dayKey is ISO date string (yyyy-mm-dd), dayLabel is Arabic label like "Sunday 7/10/2025"

// Credentials stored in localStorage as {user, pass}; defaults to younes/younes
function ensureDefaults(){
    if(!localStorage.getItem('barberCreds')){
        localStorage.setItem('barberCreds', JSON.stringify({user:'younes', pass:'younes'}));
    }
    if(!localStorage.getItem('bookings')) localStorage.setItem('bookings', JSON.stringify([]));
}
ensureDefaults();

function getCreds(){ return JSON.parse(localStorage.getItem('barberCreds')); }

function login(u,p){
    const c = getCreds();
    return u===c.user && p===c.pass;
}

function changeCredentials(){
    const nu = document.getElementById('newUser').value.trim();
    const np = document.getElementById('newPass').value.trim();
    if(!nu || !np){ alert('اسم المستخدم وكلمة المرور لا يمكن أن يكونا فارغين'); return; }
    localStorage.setItem('barberCreds', JSON.stringify({user:nu, pass:np}));
    alert('تم تحديث بيانات الدخول');
}

// WORKFLOW: working days are Sunday(0), Tuesday(2), Thursday(4), Friday(5)
// capacities: Friday = 3, others = 5
function getWorkingDays(){
    // return array of day labels (ISO date) that currently have or may have bookings in next 30 days
    const today = new Date();
    const days = [];
    for(let i=0;i<30;i++){
        const d = new Date();
        d.setDate(today.getDate()+i);
        const wd = d.getDay();
        if([0,2,4,5].includes(wd)){
            days.push(formatDayKey(d));
        }
    }
    return days;
}

function formatDayKey(d){
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const day = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
}

function dayLabelFromKey(key){
    const d = new Date(key);
    const names = {0:'الأحد',2:'الثلاثاء',4:'الخميس',5:'الجمعة'};
    return (names[d.getDay()] || d.toLocaleDateString()) + ' ' + d.toLocaleDateString();
}

function loadBookings(){ return JSON.parse(localStorage.getItem('bookings') || '[]'); }
function saveBookings(b){ localStorage.setItem('bookings', JSON.stringify(b)); }

function capacityForDayKey(key){
    const d = new Date(key);
    if(d.getDay()===5) return 3; // Friday
    return 5; // others
}

// add booking: find next available dayKey based on capacities
function addBooking(name, surname, phone){
    if(!name||!surname||!phone){ alert('املأ كل الحقول'); return; }
    const bookings = loadBookings();
    // count per dayKey
    const counts = {};
    bookings.forEach(b => counts[b.dayKey] = (counts[b.dayKey]||0)+1);
    const today = new Date();
    for(let i=0;i<30;i++){
        const d = new Date();
        d.setDate(today.getDate()+i);
        if(![0,2,4,5].includes(d.getDay())) continue;
        const key = formatDayKey(d);
        const cap = capacityForDayKey(key);
        if((counts[key]||0) < cap){
            bookings.push({name, surname, phone, dayKey: key, dayLabel: dayLabelFromKey(key), inProgress:false});
            saveBookings(bookings);
            alert('تم تسجيل الحجز: ' + dayLabelFromKey(key));
            return;
        }
    }
    alert('لا يوجد مواعيد متاحة في الـ 30 يوم المقبلة');
}

// render public list (shows phone too)
function renderList(){
    const table = document.getElementById('bookingTable');
    if(!table) return;
    const bookings = loadBookings();
    table.innerHTML = '<tr><th>الاسم</th><th>اللقب</th><th>اليوم</th><th>الهاتف</th></tr>';
    bookings.forEach(b => {
        const row = table.insertRow();
        row.insertCell(0).innerText = b.name;
        row.insertCell(1).innerText = b.surname;
        row.insertCell(2).innerText = b.dayLabel;
        row.insertCell(3).innerText = b.phone;
    });
}

// admin render (hides phone)
function renderAdminList(){
    const table = document.getElementById('adminTable');
    if(!table) return;
    const bookings = loadBookings();
    table.innerHTML = '<tr><th>الاسم</th><th>اللقب</th><th>اليوم</th><th>حالة</th><th>تعديل</th><th>حذف</th></tr>';
    bookings.forEach((b,i) => {
        const row = table.insertRow();
        row.insertCell(0).innerText = b.name;
        row.insertCell(1).innerText = b.surname;
        row.insertCell(2).innerText = b.dayLabel;
        row.insertCell(3).innerHTML = b.inProgress?'<span class="active">يعمل الآن</span>':'--';
        // تعديل
        const editBtn = document.createElement('button');
        editBtn.innerText = 'تعديل';
        editBtn.onclick = ()=> editBooking(i);
        row.insertCell(4).appendChild(editBtn);
        // حذف
        const delBtn = document.createElement('button');
        delBtn.innerText = 'حذف';
        delBtn.onclick = ()=> { if(confirm('حذف الحجز؟')){ deleteBooking(i); } };
        row.insertCell(5).appendChild(delBtn);
        if(b.inProgress) row.classList.add('active');
    });
}

// edit booking by index (admin only) - cannot see/change phone here to respect الخصوصية، لكن يمكن حذف أو تغيير الاسم/لقب/اليوم
function editBooking(index){
    const bookings = loadBookings();
    const b = bookings[index];
    const newName = prompt('الاسم', b.name);
    if(newName===null) return;
    const newSurname = prompt('اللقب', b.surname);
    if(newSurname===null) return;
    // اختيار نقل لليوم مختلف: نعرض قائمة الأيام المتاحة
    const days = getWorkingDays();
    let dayChoice = prompt('أدخل رقم اليوم الجديد (1..'+days.length+'):\n' + days.map((d,i)=> (i+1)+'. '+dayLabelFromKey(d)).join('\n'), '1');
    if(dayChoice===null) return;
    dayChoice = parseInt(dayChoice);
    if(isNaN(dayChoice) || dayChoice<1 || dayChoice>days.length){ alert('اختيار غير صالح'); return; }
    const newDayKey = days[dayChoice-1];
    // check capacity
    const cap = capacityForDayKey(newDayKey);
    const counts = {};
    bookings.forEach((bb,ii)=>{ if(ii!==index) counts[bb.dayKey] = (counts[bb.dayKey]||0)+1; });
    if((counts[newDayKey]||0) >= cap){ alert('اليوم ممتلئ'); return; }
    // update
    bookings[index].name = newName.trim();
    bookings[index].surname = newSurname.trim();
    bookings[index].dayKey = newDayKey;
    bookings[index].dayLabel = dayLabelFromKey(newDayKey);
    saveBookings(bookings);
    renderAdminList();
    alert('تم التعديل');
}

function deleteBooking(index){
    const bookings = loadBookings();
    bookings.splice(index,1);
    saveBookings(bookings);
    renderAdminList();
}

// set in progress
function setInProgress(index){
    const bookings = loadBookings();
    bookings.forEach(b=> b.inProgress=false);
    bookings[index].inProgress = true;
    saveBookings(bookings);
    renderAdminList();
}

// skip day: move all bookings of a chosen dayKey to the next working day that has capacity
function skipDay(){
    const sel = document.getElementById('skipDaySelect');
    if(!sel) return;
    const dayKey = sel.value;
    if(!dayKey){ alert('اختر يوماً'); return; }
    const bookings = loadBookings();
    // collect indices of bookings with this dayKey
    const toMove = bookings.reduce((acc,b,i)=> { if(b.dayKey===dayKey) acc.push({b,i}); return acc; }, []);
    if(toMove.length===0){ alert('لا توجد حجوزات في ذلك اليوم'); return; }
    // for each booking, find next available dayKey
    for(const item of toMove){
        const b = item.b;
        const idx = item.i;
        // find next day after current dayKey within 30 days
        const start = new Date(dayKey);
        let moved = false;
        for(let i=1;i<30;i++){
            const d = new Date(start);
            d.setDate(start.getDate()+i);
            if(![0,2,4,5].includes(d.getDay())) continue;
            const key = formatDayKey(d);
            const cap = capacityForDayKey(key);
            const counts = bookings.reduce((acc,bb,ii)=> { if(bb.dayKey===key) acc++; return acc; }, 0);
            if(counts < cap){
                // move this booking to key
                b.dayKey = key;
                b.dayLabel = dayLabelFromKey(key);
                moved = true;
                break;
            }
        }
        if(!moved){ alert('لم أجد مكان لنقل بعض الحجوزات — تحقق يدوياً'); break; }
    }
    saveBookings(bookings);
    renderAdminList();
    alert('تم نقل حجوزات اليوم إلى الأيام القادمة المتاحة');
}

// Utilities on load
window.onload = ()=>{
    if(document.getElementById('bookingTable')) renderList();
    if(document.getElementById('adminTable')) renderAdminList();
    // Expose setInProgress globally for possible use (e.g., future button)
    window.setInProgress = setInProgress;
    // Populate admin new cred fields with current creds
    const creds = getCreds();
    const nu = document.getElementById('newUser');
    const np = document.getElementById('newPass');
    if(nu) nu.value = creds.user;
    if(np) np.value = creds.pass;
    // populate skip select if present
    const sel = document.getElementById('skipDaySelect');
    if(sel){
        const days = getWorkingDays();
        sel.innerHTML='';
        days.forEach(d=>{ const opt = document.createElement('option'); opt.value=d; opt.text = dayLabelFromKey(d); sel.appendChild(opt); });
    }
};
