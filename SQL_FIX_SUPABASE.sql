-- ═══════════════════════════════════════════════════════════
-- إصلاح قاعدة البيانات - حذف الجداول القديمة وإنشاء جداول جديدة صحيحة
-- انسخ هذا الكود بالكامل والصقه في Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- حذف السياسات أولاً
DROP POLICY IF EXISTS "Allow public read access on bookings" ON bookings;
DROP POLICY IF EXISTS "Allow public insert on bookings" ON bookings;
DROP POLICY IF EXISTS "Allow public update on bookings" ON bookings;
DROP POLICY IF EXISTS "Allow public delete on bookings" ON bookings;

DROP POLICY IF EXISTS "Allow public read access on cancelled_days" ON cancelled_days;
DROP POLICY IF EXISTS "Allow public insert on cancelled_days" ON cancelled_days;
DROP POLICY IF EXISTS "Allow public update on cancelled_days" ON cancelled_days;
DROP POLICY IF EXISTS "Allow public delete on cancelled_days" ON cancelled_days;

DROP POLICY IF EXISTS "Allow public read access on announcements" ON announcements;
DROP POLICY IF EXISTS "Allow public insert on announcements" ON announcements;
DROP POLICY IF EXISTS "Allow public update on announcements" ON announcements;
DROP POLICY IF EXISTS "Allow public delete on announcements" ON announcements;

DROP POLICY IF EXISTS "Allow public read access on journal" ON journal;
DROP POLICY IF EXISTS "Allow public insert on journal" ON journal;
DROP POLICY IF EXISTS "Allow public update on journal" ON journal;
DROP POLICY IF EXISTS "Allow public delete on journal" ON journal;

DROP POLICY IF EXISTS "Allow public read access on income" ON income;
DROP POLICY IF EXISTS "Allow public insert on income" ON income;
DROP POLICY IF EXISTS "Allow public update on income" ON income;
DROP POLICY IF EXISTS "Allow public delete on income" ON income;

DROP POLICY IF EXISTS "Allow public read access on debt" ON debt;
DROP POLICY IF EXISTS "Allow public insert on debt" ON debt;
DROP POLICY IF EXISTS "Allow public update on debt" ON debt;
DROP POLICY IF EXISTS "Allow public delete on debt" ON debt;

-- حذف الجداول القديمة
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS cancelled_days CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS journal CASCADE;
DROP TABLE IF EXISTS income CASCADE;
DROP TABLE IF EXISTS debt CASCADE;

-- ═══════════════════════════════════════════════════════════
-- إنشاء الجداول بأسماء أعمدة صحيحة (مع الاقتباس المزدوج)
-- ═══════════════════════════════════════════════════════════

-- 1. جدول الحجوزات (Bookings)
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  phone TEXT DEFAULT '',
  "dayKey" TEXT NOT NULL,
  "dayLabel" TEXT NOT NULL,
  "inProgress" BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bookings_daykey ON bookings("dayKey");
CREATE INDEX idx_bookings_completed ON bookings(completed);

-- 2. جدول الأيام الملغاة (Cancelled Days)
CREATE TABLE cancelled_days (
  id TEXT PRIMARY KEY,
  "dayKey" TEXT NOT NULL UNIQUE,
  ts TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  bookings JSONB DEFAULT '[]'::jsonb
);

-- 3. جدول الإعلانات (Announcements)
CREATE TABLE announcements (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  type TEXT DEFAULT 'user',
  ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_announcements_ts ON announcements(ts DESC);

-- 4. جدول السجل (Journal)
CREATE TABLE journal (
  id TEXT PRIMARY KEY,
  msg TEXT NOT NULL,
  ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_journal_ts ON journal(ts DESC);

-- 5. جدول الدخل (Income)
CREATE TABLE income (
  id TEXT PRIMARY KEY,
  "clientName" TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_income_ts ON income(ts DESC);

-- 6. جدول الديون (Debt)
CREATE TABLE debt (
  id TEXT PRIMARY KEY,
  "clientName" TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  paid BOOLEAN DEFAULT FALSE,
  ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_debt_paid ON debt(paid);
CREATE INDEX idx_debt_ts ON debt(ts DESC);

-- ═══════════════════════════════════════════════════════════
-- تفعيل Row Level Security (RLS)
-- ═══════════════════════════════════════════════════════════

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cancelled_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE debt ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════
-- سياسات الأمان (Security Policies)
-- ═══════════════════════════════════════════════════════════

-- سياسات للقراءة والكتابة لجميع الجداول
CREATE POLICY "Allow public read on bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert on bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on bookings" ON bookings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on bookings" ON bookings FOR DELETE USING (true);

CREATE POLICY "Allow public read on cancelled_days" ON cancelled_days FOR SELECT USING (true);
CREATE POLICY "Allow public insert on cancelled_days" ON cancelled_days FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on cancelled_days" ON cancelled_days FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on cancelled_days" ON cancelled_days FOR DELETE USING (true);

CREATE POLICY "Allow public read on announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Allow public insert on announcements" ON announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on announcements" ON announcements FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on announcements" ON announcements FOR DELETE USING (true);

CREATE POLICY "Allow public read on journal" ON journal FOR SELECT USING (true);
CREATE POLICY "Allow public insert on journal" ON journal FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on journal" ON journal FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on journal" ON journal FOR DELETE USING (true);

CREATE POLICY "Allow public read on income" ON income FOR SELECT USING (true);
CREATE POLICY "Allow public insert on income" ON income FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on income" ON income FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on income" ON income FOR DELETE USING (true);

CREATE POLICY "Allow public read on debt" ON debt FOR SELECT USING (true);
CREATE POLICY "Allow public insert on debt" ON debt FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on debt" ON debt FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on debt" ON debt FOR DELETE USING (true);

-- ═══════════════════════════════════════════════════════════
-- تم الانتهاء! الجداول جاهزة الآن بأسماء أعمدة صحيحة ✅
-- ═══════════════════════════════════════════════════════════
