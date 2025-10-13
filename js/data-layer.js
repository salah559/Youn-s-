// js/data-layer.js
// طبقة البيانات - تستبدل localStorage بـ Supabase

// Cache للبيانات
let dataCache = {
  bookings: [],
  cancelled: [],
  annonces: [],
  journal: [],
  income: [],
  debt: [],
  workdays: [],
  creds: {user: 'younes', pass: 'younes'} // تبقى في localStorage
};

let isInitialized = false;

// تهيئة البيانات من Supabase
async function initData() {
  if (isInitialized) return;
  
  try {
    console.log('📥 جاري تحميل البيانات من Supabase...');
    
    // تحميل جميع البيانات بشكل متوازي
    const [bookings, cancelled, annonces, journal, income, debt] = await Promise.all([
      getAllBookings(),
      getAllCancelledDays(),
      getAllAnnouncements(),
      getAllJournal(),
      getAllIncome(),
      getAllDebt()
    ]);
    
    dataCache.bookings = bookings;
    dataCache.cancelled = cancelled;
    dataCache.annonces = annonces;
    dataCache.journal = journal;
    dataCache.income = income;
    dataCache.debt = debt;
    
    // تحميل الاعتمادات من localStorage
    const storedCreds = localStorage.getItem('bp_creds');
    if (storedCreds) {
      dataCache.creds = JSON.parse(storedCreds);
    }
    
    isInitialized = true;
    console.log('✅ تم تحميل البيانات بنجاح');
    
    // تحديث العرض
    setTimeout(() => {
      if (typeof renderList === 'function') renderList();
      if (typeof renderAnnonces === 'function') renderAnnonces();
      if (typeof renderAdminDays === 'function') renderAdminDays();
      if (typeof renderDebts === 'function') renderDebts();
      if (typeof renderAccounting === 'function') renderAccounting();
    }, 100);
    
  } catch (error) {
    console.error('❌ خطأ في تحميل البيانات:', error);
    // في حالة الخطأ، نستخدم القيم الافتراضية
    isInitialized = true;
  }
}

// دالة load بديلة - تدعم async
const LS_KEYS = {
  CRED:'bp_creds', 
  BOOK:'bp_bookings', 
  CAN:'bp_cancelled', 
  ANN:'bp_annonces', 
  JOUR:'bp_journal', 
  INCOME:'bp_income', 
  DEBT:'bp_debt',
  WORKDAYS:'bp_workdays'
};

function load(key) {
  const keyMap = {
    'bp_bookings': 'bookings',
    'bp_cancelled': 'cancelled',
    'bp_annonces': 'annonces',
    'bp_journal': 'journal',
    'bp_income': 'income',
    'bp_debt': 'debt',
    'bp_creds': 'creds',
    'bp_workdays': 'workdays'
  };
  
  const dataKey = keyMap[key];
  if (dataKey === 'creds') {
    return dataCache.creds;
  }
  
  // أيام العمل تُقرأ من localStorage مباشرة
  if (dataKey === 'workdays') {
    const stored = localStorage.getItem('bp_workdays');
    return stored ? JSON.parse(stored) : [];
  }
  
  return dataCache[dataKey] || [];
}

// دالة save بديلة - تحفظ في Supabase
function save(key, value) {
  const keyMap = {
    'bp_bookings': 'bookings',
    'bp_cancelled': 'cancelled',
    'bp_annonces': 'annonces',
    'bp_journal': 'journal',
    'bp_income': 'income',
    'bp_debt': 'debt',
    'bp_creds': 'creds'
  };
  
  const dataKey = keyMap[key];
  
  if (dataKey === 'creds') {
    dataCache.creds = value;
    localStorage.setItem('bp_creds', JSON.stringify(value));
    return;
  }
  
  // تحديث الكاش مباشرة
  dataCache[dataKey] = value;
  
  // حفظ في Supabase بشكل غير متزامن (fire and forget)
  (async () => {
    try {
      if (dataKey === 'bookings') {
        await saveAllBookings(value);
        console.log('💾 تم حفظ الحجوزات في Supabase');
      } else if (dataKey === 'annonces') {
        await saveAllAnnouncements(value);
        console.log('💾 تم حفظ الإعلانات في Supabase');
      } else if (dataKey === 'journal') {
        await saveAllJournal(value);
        console.log('💾 تم حفظ السجل في Supabase');
      } else if (dataKey === 'income') {
        await saveAllIncome(value);
        console.log('💾 تم حفظ الدخل في Supabase');
      } else if (dataKey === 'debt') {
        await saveAllDebt(value);
        console.log('💾 تم حفظ الديون في Supabase');
      }
    } catch (error) {
      console.error('خطأ في حفظ البيانات:', error);
    }
  })();
}

function creds() {
  return dataCache.creds;
}

function saveCreds(value) {
  dataCache.creds = value;
  localStorage.setItem('bp_creds', JSON.stringify(value));
}

// دوال مساعدة للحجوزات
async function saveBooking(booking) {
  try {
    const result = await addBooking(booking);
    dataCache.bookings.push(result);
    return result;
  } catch (error) {
    console.error('خطأ في حفظ الحجز:', error);
    throw error;
  }
}

async function updateBookingData(id, updates) {
  try {
    const result = await updateBooking(id, updates);
    const index = dataCache.bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      dataCache.bookings[index] = {...dataCache.bookings[index], ...updates};
    }
    return result;
  } catch (error) {
    console.error('خطأ في تحديث الحجز:', error);
    throw error;
  }
}

async function removeBooking(id) {
  try {
    await deleteBooking(id);
    dataCache.bookings = dataCache.bookings.filter(b => b.id !== id);
  } catch (error) {
    console.error('خطأ في حذف الحجز:', error);
    throw error;
  }
}

// دوال للإعلانات
async function saveAnnouncement(announcement) {
  try {
    const result = await addAnnouncement(announcement);
    dataCache.annonces.unshift(result);
    return result;
  } catch (error) {
    console.error('خطأ في حفظ الإعلان:', error);
    throw error;
  }
}

// حفظ جميع الإعلانات
async function saveAllAnnouncements(announcements) {
  const client = initSupabase();
  await client.from(SUPABASE_CONFIG.tables.annonces).delete().neq('id', '');
  if (announcements.length > 0) {
    await client.from(SUPABASE_CONFIG.tables.annonces).insert(announcements);
  }
}

// دوال للسجل
async function saveJournal(entry) {
  try {
    const result = await addJournalEntry(entry);
    dataCache.journal.unshift(result);
    return result;
  } catch (error) {
    console.error('خطأ في حفظ السجل:', error);
    throw error;
  }
}

// حفظ جميع سجلات الجورنال
async function saveAllJournal(journal) {
  const client = initSupabase();
  await client.from(SUPABASE_CONFIG.tables.journal).delete().neq('id', '');
  if (journal.length > 0) {
    await client.from(SUPABASE_CONFIG.tables.journal).insert(journal);
  }
}

// دوال للدخل
async function saveIncome(income) {
  try {
    const result = await addIncome(income);
    dataCache.income.push(result);
    return result;
  } catch (error) {
    console.error('خطأ في حفظ الدخل:', error);
    throw error;
  }
}

// حفظ جميع الدخل
async function saveAllIncome(income) {
  const client = initSupabase();
  await client.from(SUPABASE_CONFIG.tables.income).delete().neq('id', '');
  if (income.length > 0) {
    await client.from(SUPABASE_CONFIG.tables.income).insert(income);
  }
}

// دوال للديون
async function saveDebtData(debt) {
  try {
    const result = await addDebt(debt);
    dataCache.debt.push(result);
    return result;
  } catch (error) {
    console.error('خطأ في حفظ الدين:', error);
    throw error;
  }
}

// حفظ جميع الديون
async function saveAllDebt(debt) {
  const client = initSupabase();
  await client.from(SUPABASE_CONFIG.tables.debt).delete().neq('id', '');
  if (debt.length > 0) {
    await client.from(SUPABASE_CONFIG.tables.debt).insert(debt);
  }
}

// دوال للأيام الملغاة
async function saveCancelledDay(cancelledDay) {
  try {
    const result = await addCancelledDay(cancelledDay);
    dataCache.cancelled.push(result);
    return result;
  } catch (error) {
    console.error('خطأ في حفظ اليوم الملغى:', error);
    throw error;
  }
}

async function removeCancelledDay(dayKey) {
  try {
    await deleteCancelledDay(dayKey);
    dataCache.cancelled = dataCache.cancelled.filter(c => c.dayKey !== dayKey);
  } catch (error) {
    console.error('خطأ في حذف اليوم الملغى:', error);
    throw error;
  }
}

// الاشتراك في التحديثات الفورية
function setupRealtimeSubscriptions() {
  // الاشتراك في تحديثات الحجوزات
  subscribeToBookings(async (payload) => {
    console.log('تحديث فوري - حجوزات:', payload.eventType);
    // إعادة تحميل الحجوزات
    dataCache.bookings = await getAllBookings();
    if (typeof renderList === 'function') renderList();
    if (typeof renderAdminDays === 'function') renderAdminDays();
  });
  
  // الاشتراك في تحديثات الإعلانات
  subscribeToAnnouncements(async (payload) => {
    console.log('تحديث فوري - إعلانات:', payload.eventType);
    // إعادة تحميل الإعلانات
    dataCache.annonces = await getAllAnnouncements();
    if (typeof renderAnnonces === 'function') renderAnnonces();
  });
}

// تهيئة فورية عند تحميل السكريبت
(async function() {
  await initData();
  setupRealtimeSubscriptions();
  console.log('✅ طبقة البيانات جاهزة وتم تحميل البيانات من Supabase');
})();

console.log('📊 تم تحميل طبقة البيانات (Supabase)');
