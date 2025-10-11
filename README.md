# 💈 نظام حجز صالون الحلاقة

نظام احترافي لإدارة حجوزات صالون الحلاقة مع واجهة ثنائية اللغة (عربي/فرنسي) وقاعدة بيانات مجانية.

## ✨ المميزات

### للعملاء:
- ✅ حجز موعد بسهولة (الاسم والهاتف اختياري)
- ✅ عرض قائمة جميع الحجوزات مرتبة حسب الأيام
- ✅ معرفة الدور الحالي ("En cours")
- ✅ قراءة إعلانات الصالون
- ✅ معلومات الاتصال وأيام العمل

### للحلاق (لوحة الإدارة):
- ✅ إدارة الحجوزات: ترقية، تعديل، حذف
- ✅ تعيين حالة "قيد القص"
- ✅ تسجيل الدفع والديون
- ✅ إلغاء أيام بالكامل (مع إمكانية الاسترجاع)
- ✅ نشر إعلانات عامة
- ✅ عرض السجل والمحاسبة

## 🚀 النشر على GitHub Pages + Supabase

### المتطلبات:
- حساب GitHub (مجاني)
- حساب Supabase (مجاني)

### خطوات النشر:

#### 1. إعداد قاعدة البيانات Supabase

اتبع الخطوات في ملف [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md) لإنشاء قاعدة البيانات المجانية.

#### 2. تعديل ملف الإعدادات

افتح ملف `js/supabase-config.js` واستبدل:

```javascript
const SUPABASE_CONFIG = {
  url: 'YOUR_SUPABASE_URL',        // ← ضع رابط مشروعك هنا
  anonKey: 'YOUR_SUPABASE_ANON_KEY', // ← ضع المفتاح العام هنا
  // ...
};
```

#### 3. رفع المشروع إلى GitHub

```bash
# تهيئة Git
git init
git add .
git commit -m "Initial commit - Salon booking system"

# إنشاء Repository على GitHub ثم:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

#### 4. تفعيل GitHub Pages

1. اذهب إلى **Settings** > **Pages** في Repository
2. اختر `main` branch
3. احفظ وانتظر 1-2 دقيقة
4. افتح الرابط: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## 📁 هيكل المشروع

```
├── index.html              # يعيد التوجيه إلى contact.html
├── contact.html            # الصفحة الرئيسية (معلومات الاتصال)
├── reservation.html        # صفحة الحجز
├── list.html               # قائمة الحجوزات العامة
├── annoncent.html          # صفحة الإعلانات
├── admin.html              # لوحة الإدارة
│
├── css/
│   └── style.css           # تصميم ذهبي احترافي
│
├── js/
│   ├── supabase-config.js  # إعدادات Supabase ⚙️
│   ├── supabase-client.js  # عميل قاعدة البيانات
│   ├── data-layer.js       # طبقة البيانات
│   ├── main.js             # منطق التطبيق الرئيسي
│   └── translations.js     # الترجمة (عربي/فرنسي)
│
├── database-schema.sql     # سكريبت إنشاء الجداول
├── SUPABASE_SETUP.md       # دليل الإعداد الكامل
└── README.md              # هذا الملف
```

## 🔐 تسجيل الدخول للإدارة

- **اسم المستخدم**: `younes`
- **كلمة المرور**: `younes`

⚠️ **مهم**: غيّر كلمة المرور من لوحة الإدارة بعد أول دخول!

## 📊 منطق العمل

- **أيام العمل**: الأحد (0)، الثلاثاء (2)، الخميس (4)، الجمعة (5)
- **السعة**: الجمعة = 3 عملاء، الأيام الأخرى = 5 عملاء
- **الجدولة التلقائية**: يتم توزيع الحجوزات على أول يوم متاح
- **التقديم التلقائي**: عند حذف حجز، جميع الحجوزات التالية تتقدم يوماً
- **الحجوزات المكتملة**: تبقى في النظام لكن مخفية (تحتفظ بالمكان)

## 🌐 اللغات المدعومة

- 🇫🇷 الفرنسية (افتراضي)
- 🇸🇦 العربية (مع دعم RTL)

## 🛠️ التقنيات المستخدمة

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **قاعدة البيانات**: Supabase (PostgreSQL)
- **استضافة**: GitHub Pages (مجاني)
- **التحديثات الفورية**: Supabase Realtime
- **التصميم**: Gold on Black theme مع تأثيرات احترافية

## 💰 التكلفة

**100% مجاني!**

- ✅ GitHub Pages: مجاني للأبد
- ✅ Supabase: 500MB مجانية + طلبات غير محدودة
- ✅ لا تحتاج بطاقة ائتمان

## 🐛 حل المشاكل

### المشكلة: "تحذير: لم يتم تعيين إعدادات Supabase"
**الحل**: افتح `js/supabase-config.js` وضع URL والمفتاح الصحيحين

### المشكلة: الحجوزات لا تظهر
**الحل**: 
1. افتح Console (F12) وابحث عن أخطاء
2. تأكد من تنفيذ `database-schema.sql` في Supabase
3. تأكد من صحة مفاتيح API

### المشكلة: "Failed to fetch"
**الحل**:
1. تأكد من تفعيل RLS Policies في Supabase
2. راجع ملف `database-schema.sql` وتأكد من تنفيذه بالكامل

## 📝 التطوير المحلي

لتشغيل المشروع محلياً (للتطوير):

```bash
# استخدم Python HTTP Server
python3 -m http.server 5000

# أو استخدم Live Server في VS Code
```

افتح: `http://localhost:5000`

## 🔄 التحديثات

لتحديث الموقع بعد التعديلات:

```bash
git add .
git commit -m "وصف التحديث"
git push
```

GitHub Pages سيحدث الموقع تلقائياً في 1-2 دقيقة.

## 📄 الترخيص

هذا المشروع مفتوح المصدر ومتاح للاستخدام الشخصي والتجاري.

## 👤 المطور

**Younes Ouladnoui** - Coiffeur Professionnel

- 📞 الهاتف: 0776 798 751
- 📧 البريد: younesouladnoui@gmaul.com
- 📘 فيسبوك: [Younes Ouladnoui](https://www.facebook.com/share/17T52Ajojx/)
- 📷 إنستغرام: [@younes_ouladnoui](https://www.instagram.com/younes_ouladnoui)

---

**🎉 مبروك! موقعك الآن على الإنترنت ويعمل 24/7 مجاناً!**

*للمساعدة أو الاستفسارات، راجع ملف [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md)*
