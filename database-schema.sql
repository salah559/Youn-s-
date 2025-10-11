-- database-schema.sql
-- سكريبت إنشاء قاعدة البيانات لنظام حجز صالون الحلاقة
-- استخدم هذا السكريبت في Supabase SQL Editor

-- 1. جدول الحجوزات (Bookings)
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  phone TEXT DEFAULT '',
  dayKey TEXT NOT NULL,
  dayLabel TEXT NOT NULL,
  inProgress BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- فهرس لتسريع البحث
CREATE INDEX IF NOT EXISTS idx_bookings_daykey ON bookings(dayKey);
CREATE INDEX IF NOT EXISTS idx_bookings_completed ON bookings(completed);

-- 2. جدول الأيام الملغاة (Cancelled Days)
CREATE TABLE IF NOT EXISTS cancelled_days (
  id TEXT PRIMARY KEY,
  dayKey TEXT NOT NULL UNIQUE,
  ts TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  bookings JSONB DEFAULT '[]'::jsonb
);

-- 3. جدول الإعلانات (Announcements)
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  type TEXT DEFAULT 'user', -- 'user' أو 'system'
  ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- فهرس لتسريع البحث
CREATE INDEX IF NOT EXISTS idx_announcements_ts ON announcements(ts DESC);

-- 4. جدول السجل (Journal)
CREATE TABLE IF NOT EXISTS journal (
  id TEXT PRIMARY KEY,
  msg TEXT NOT NULL,
  ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- فهرس لتسريع البحث
CREATE INDEX IF NOT EXISTS idx_journal_ts ON journal(ts DESC);

-- 5. جدول الدخل (Income)
CREATE TABLE IF NOT EXISTS income (
  id TEXT PRIMARY KEY,
  clientName TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- فهرس لتسريع البحث
CREATE INDEX IF NOT EXISTS idx_income_ts ON income(ts DESC);

-- 6. جدول الديون (Debt)
CREATE TABLE IF NOT EXISTS debt (
  id TEXT PRIMARY KEY,
  clientName TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  paid BOOLEAN DEFAULT FALSE,
  ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- فهرس لتسريع البحث
CREATE INDEX IF NOT EXISTS idx_debt_paid ON debt(paid);
CREATE INDEX IF NOT EXISTS idx_debt_ts ON debt(ts DESC);

-- =====================================
-- تفعيل Row Level Security (RLS)
-- =====================================

-- تفعيل RLS لكل الجداول
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cancelled_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE debt ENABLE ROW LEVEL SECURITY;

-- =====================================
-- سياسات الأمان (Security Policies)
-- =====================================

-- سياسة القراءة: الجميع يمكنهم القراءة
CREATE POLICY "Allow public read access on bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Allow public read access on cancelled_days" ON cancelled_days FOR SELECT USING (true);
CREATE POLICY "Allow public read access on announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Allow public read access on journal" ON journal FOR SELECT USING (true);
CREATE POLICY "Allow public read access on income" ON income FOR SELECT USING (true);
CREATE POLICY "Allow public read access on debt" ON debt FOR SELECT USING (true);

-- سياسة الكتابة: الجميع يمكنهم الكتابة (للتطبيقات العامة)
-- ملاحظة: في بيئة الإنتاج، يفضل تقييد هذا باستخدام auth
CREATE POLICY "Allow public insert on bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on bookings" ON bookings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on bookings" ON bookings FOR DELETE USING (true);

CREATE POLICY "Allow public insert on cancelled_days" ON cancelled_days FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete on cancelled_days" ON cancelled_days FOR DELETE USING (true);

CREATE POLICY "Allow public insert on announcements" ON announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete on announcements" ON announcements FOR DELETE USING (true);

CREATE POLICY "Allow public insert on journal" ON journal FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert on income" ON income FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert on debt" ON debt FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on debt" ON debt FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on debt" ON debt FOR DELETE USING (true);

-- =====================================
-- تفعيل Realtime (التحديثات الفورية)
-- =====================================

-- تفعيل التحديثات الفورية للجداول الرئيسية
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE cancelled_days;

-- =====================================
-- دوال مساعدة (Helper Functions)
-- =====================================

-- دالة لتحديث updatedAt تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- تطبيق الدالة على جدول الحجوزات
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================
-- بيانات تجريبية (اختياري - للاختبار فقط)
-- =====================================

-- يمكنك حذف هذا القسم بعد الاختبار
-- INSERT INTO bookings (id, name, surname, phone, dayKey, dayLabel, createdAt)
-- VALUES 
--   ('test1', 'أحمد', 'محمد', '0555123456', '2025-10-13', 'Dimanche 13/10/2025', NOW()),
--   ('test2', 'فاطمة', 'علي', '0666789012', '2025-10-13', 'Dimanche 13/10/2025', NOW());

-- INSERT INTO announcements (id, text, type, ts)
-- VALUES ('ann1', 'مرحباً بكم في نظام الحجز الجديد!', 'system', NOW());

COMMENT ON TABLE bookings IS 'جدول الحجوزات - يحتوي على جميع حجوزات العملاء';
COMMENT ON TABLE cancelled_days IS 'جدول الأيام الملغاة - للأيام التي تم إلغاؤها مع إمكانية استرجاعها';
COMMENT ON TABLE announcements IS 'جدول الإعلانات - للإعلانات العامة والنظامية';
COMMENT ON TABLE journal IS 'جدول السجل - لتتبع جميع العمليات';
COMMENT ON TABLE income IS 'جدول الدخل - لتسجيل المدفوعات';
COMMENT ON TABLE debt IS 'جدول الديون - لتتبع الديون المستحقة';
