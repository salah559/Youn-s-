# 🚀 دليل إعداد قاعدة البيانات Supabase

هذا الدليل يشرح لك خطوة بخطوة كيفية إعداد قاعدة بيانات مجانية على Supabase لتشغيل نظام حجز صالون الحلاقة على GitHub Pages.

---

## 📋 الخطوات

### 1️⃣ إنشاء حساب على Supabase

1. اذهب إلى: [https://supabase.com](https://supabase.com)
2. اضغط على **"Start your project"** أو **"Sign Up"**
3. سجل الدخول باستخدام GitHub (الأسهل) أو البريد الإلكتروني
4. ✅ **مجاني 100%** - لا يطلب بطاقة ائتمان

---

### 2️⃣ إنشاء مشروع جديد

1. بعد تسجيل الدخول، اضغط على **"New Project"**
2. املأ المعلومات:
   - **Name**: `salon-booking` (أو أي اسم تريده)
   - **Database Password**: اختر كلمة مرور قوية (احفظها!)
   - **Region**: اختر أقرب منطقة لك (مثلاً: **Europe** للجزائر)
   - **Pricing Plan**: اختر **Free** (مجاني)
3. اضغط **"Create new project"**
4. انتظر 1-2 دقيقة حتى يتم إنشاء المشروع ✅

---

### 3️⃣ إنشاء الجداول في قاعدة البيانات

1. بعد إنشاء المشروع، اذهب إلى القائمة الجانبية واضغط على **"SQL Editor"**
2. اضغط على **"New query"**
3. انسخ **كامل محتوى** ملف `database-schema.sql` (من مجلد المشروع)
4. الصق المحتوى في SQL Editor
5. اضغط **"Run"** أو اضغط `Ctrl+Enter`
6. ستظهر رسالة **"Success"** ✅
7. اذهب إلى **"Table Editor"** وتأكد من وجود الجداول:
   - ✅ `bookings`
   - ✅ `cancelled_days`
   - ✅ `announcements`
   - ✅ `journal`
   - ✅ `income`
   - ✅ `debt`

---

### 4️⃣ الحصول على مفاتيح الاتصال (API Keys)

1. اذهب إلى **"Settings"** من القائمة الجانبية
2. اختر **"API"** من القائمة الفرعية
3. ستجد هنا معلومتين مهمتين:
   - **Project URL**: مثل `https://xxxxx.supabase.co`
   - **anon public key**: مفتاح طويل يبدأ بـ `eyJhbGc...`

📋 **انسخ هذين المفتاحين** - ستحتاجهما في الخطوة التالية!

---

### 5️⃣ تعديل ملف الإعدادات في المشروع

1. افتح ملف `js/supabase-config.js` في محرر الأكواد
2. استبدل القيم التالية:

```javascript
const SUPABASE_CONFIG = {
  // 👇 ضع Project URL هنا
  url: 'https://xxxxx.supabase.co', 
  
  // 👇 ضع anon public key هنا
  anonKey: 'eyJhbGc...', 
  
  // الباقي لا تغيره!
  tables: {
    bookings: 'bookings',
    cancelled: 'cancelled_days',
    annonces: 'announcements',
    journal: 'journal',
    income: 'income',
    debt: 'debt'
  }
};
```

3. احفظ الملف ✅

---

### 6️⃣ اختبار الاتصال

1. افتح ملف `index.html` في المتصفح
2. افتح **Console** في أدوات المطور (F12)
3. يجب أن ترى رسالة: `✅ تم الاتصال بقاعدة البيانات Supabase`
4. إذا ظهرت أخطاء، تأكد من:
   - ✅ نسخت URL والمفتاح بشكل صحيح
   - ✅ نفذت سكريبت SQL بنجاح
   - ✅ حملت مكتبة Supabase في HTML

---

### 7️⃣ نشر الموقع على GitHub Pages

#### أ. رفع المشروع إلى GitHub

1. افتح Terminal/CMD في مجلد المشروع
2. نفذ الأوامر التالية:

```bash
# تهيئة Git (إذا لم يكن موجوداً)
git init

# إضافة جميع الملفات
git add .

# عمل Commit
git commit -m "Initial commit - Salon booking system with Supabase"

# إنشاء Repository على GitHub (افتح github.com وأنشئ repo جديد)
# ثم ربطه:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# رفع الملفات
git branch -M main
git push -u origin main
```

#### ب. تفعيل GitHub Pages

1. اذهب إلى Repository على GitHub
2. اضغط **"Settings"** > **"Pages"**
3. في **"Source"**، اختر `main` branch
4. اختر `/root` كمجلد
5. اضغط **"Save"**
6. انتظر 1-2 دقيقة وستحصل على رابط مثل:
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
   ```

---

## 🎉 تهانينا! الموقع جاهز

افتح الرابط وستجد:
- ✅ صفحة الاتصال (Contact) - الصفحة الرئيسية
- ✅ صفحة الحجز (Reservation) - للعملاء
- ✅ صفحة القائمة (Liste) - لعرض الحجوزات
- ✅ صفحة الإدارة (Admin) - للحلاق (اضغط على الشعار)

### 🔐 معلومات الدخول للإدارة:
- **اسم المستخدم**: `younes`
- **كلمة المرور**: `younes`

⚠️ **مهم**: غيّر كلمة المرور من لوحة الإدارة!

---

## 📊 ماذا تحصل مجاناً؟

| الميزة | الحد المجاني |
|--------|--------------|
| التخزين | 500 MB |
| الطلبات (Requests) | بدون حد! |
| المستخدمين النشطين | 50,000/شهر |
| Real-time Updates | ✅ مفعل |
| الأمان (RLS) | ✅ مفعل |

---

## 🐛 حل المشاكل الشائعة

### المشكلة: "Failed to fetch" أو "Network Error"
✅ **الحل**: 
- تأكد من URL والمفتاح صحيحين في `supabase-config.js`
- تأكد من تنفيذ SQL script بنجاح

### المشكلة: "Row Level Security policy violation"
✅ **الحل**:
- تأكد من تنفيذ جميع الـ Policies في SQL script
- الجداول يجب أن تسمح بالقراءة والكتابة العامة

### المشكلة: الحجوزات لا تظهر
✅ **الحل**:
- افتح Console (F12) وابحث عن أخطاء
- تأكد من تحميل جميع ملفات JavaScript بالترتيب الصحيح

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. راجع **Console** في المتصفح (F12) للأخطاء
2. تأكد من اتباع جميع الخطوات
3. راجع [توثيق Supabase](https://supabase.com/docs)

---

## 🔄 التحديثات المستقبلية

عند تحديث الموقع:
```bash
git add .
git commit -m "وصف التحديث"
git push
```

GitHub Pages سيحدث الموقع تلقائياً في 1-2 دقيقة ✅

---

**مبروك! موقعك الآن على الإنترنت ويعمل 24/7 مجاناً! 🎉**
