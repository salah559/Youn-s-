// js/supabase-config.js
// إعدادات الاتصال بقاعدة بيانات Supabase

const SUPABASE_CONFIG = {
  // ⚠️ مهم: استبدل هذه القيم بقيم مشروعك من Supabase
  // احصل عليها من: https://app.supabase.com/project/YOUR_PROJECT/settings/api
  
  url: 'YOUR_SUPABASE_URL', // مثال: https://xxxxx.supabase.co
  anonKey: 'YOUR_SUPABASE_ANON_KEY', // المفتاح العام (آمن للاستخدام في المتصفح)
  
  // اسم الجداول في قاعدة البيانات
  tables: {
    bookings: 'bookings',
    cancelled: 'cancelled_days',
    annonces: 'announcements',
    journal: 'journal',
    income: 'income',
    debt: 'debt'
  }
};

// تحذير إذا لم يتم تعيين الإعدادات
if (SUPABASE_CONFIG.url === 'YOUR_SUPABASE_URL') {
  console.warn('⚠️ تحذير: لم يتم تعيين إعدادات Supabase! اقرأ ملف SUPABASE_SETUP.md');
}
