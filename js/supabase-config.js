// js/supabase-config.js
// إعدادات الاتصال بقاعدة بيانات Supabase

const SUPABASE_CONFIG = {
  // ⚠️ مهم: استبدل هذه القيم بقيم مشروعك من Supabase
  // احصل عليها من: https://app.supabase.com/project/YOUR_PROJECT/settings/api
  
  url: 'https://fphfwpqxdalhcmcgjawa.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaGZ3cHF4ZGFsaGNtY2dqYXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxODMwOTIsImV4cCI6MjA3NTc1OTA5Mn0.41khEdr66RsdHiXiS9T3vFIDyHFVkN73wINMqe7z5Mw',
  
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
