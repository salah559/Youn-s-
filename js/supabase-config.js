// js/supabase-config.js
// إعدادات الاتصال بقاعدة بيانات Supabase

const SUPABASE_CONFIG = {
  // ⚠️ مهم: استبدل هذه القيم بقيم مشروعك من Supabase
  // احصل عليها من: https://app.supabase.com/project/YOUR_PROJECT/settings/api
  
  url: 'https://scjguaiaiwharucnpgfv.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjamd1YWlhaXdoYXJ1Y25wZ2Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxODc2NjIsImV4cCI6MjA3NTc2MzY2Mn0.r29GzVNYpWQsT1JRo_WPt9ZeHuQmz5JLrUwAsaiSZZw',
  
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
