let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');

function addBooking(name, surname, phone) {
    let day = getNextAvailableDay();
    bookings.push({name, surname, phone, day, inProgress: false});
    localStorage.setItem('bookings', JSON.stringify(bookings));
    alert('تم تسجيل الحجز يوم ' + day);
}

function setInProgress(index) {
    bookings.forEach(b => b.inProgress = false);
    bookings[index].inProgress = true;
    localStorage.setItem('bookings', JSON.stringify(bookings));
    renderAdminList();
}

function getNextAvailableDay() {
    const days = ['Sunday','Tuesday','Thursday','Friday'];
    let dayBookings = {};
    bookings.forEach(b => dayBookings[b.day] = (dayBookings[b.day] || 0) + 1);
    let today = new Date();
    for (let i=0;i<14;i++) {
        let nextDay = new Date(today);
        nextDay.setDate(today.getDate() + i);
        let dayName = days[nextDay.getDay()]; 
        if(!dayName) continue;
        if((dayBookings[dayName] || 0) < 5) return dayName + ' ' + nextDay.toLocaleDateString();
    }
    return 'Full';
}

function renderList() {
    let table = document.getElementById('bookingTable');
    table.innerHTML = '<tr><th>الاسم</th><th>اللقب</th><th>اليوم</th></tr>';
    bookings.forEach(b => {
        let row = table.insertRow();
        row.insertCell(0).innerText = b.name;
        row.insertCell(1).innerText = b.surname;
        row.insertCell(2).innerText = b.day;
    });
}

function renderAdminList() {
    let table = document.getElementById('adminTable');
    table.innerHTML = '<tr><th>الاسم</th><th>اللقب</th><th>اليوم</th><th>تحديد كقيد الحلاقة</th></tr>';
    bookings.forEach((b,i) => {
        let row = table.insertRow();
        row.insertCell(0).innerText = b.name;
        row.insertCell(1).innerText = b.surname;
        row.insertCell(2).innerText = b.day;
        let btn = document.createElement('button');
        btn.innerText = 'حلق الآن';
        btn.onclick = ()=> setInProgress(i);
        row.insertCell(3).appendChild(btn);
        if(b.inProgress) row.classList.add('active');
    });
}

window.onload = ()=>{
    if(document.getElementById('bookingTable')) renderList();
    if(document.getElementById('adminTable')) renderAdminList();
}
