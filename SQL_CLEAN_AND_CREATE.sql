-- ═══════════════════════════════════════════════════════════
-- حذف الجداول القديمة وإنشاء جداول جديدة صحيحة
-- انسخ هذا الكود بالكامل والصقه في Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- حذف الجداول القديمة (CASCADE سيحذف كل السياسات تلقائياً)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS cancelled_days CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS journal CASCADE;
DROP TABLE IF EXISTS income CASCADE;
DROP TABLE IF EXISTS debt CASCADE;

-- ═══════════════════════════════════════════════════════════
-- إنشاء الجداول بأسماء أعمدة صحيحة (camelCase مع اقتباس مزدوج)
-- ═══════════════════════════════════════════════════════════

-- 1. جدول الحجوزات
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

-- 2. جدول الأيام الملغاة
CREATE TABLE cancelled_days (
  id TEXT PRIMARY KEY,
  "dayKey" TEXT NOT NULL UNIQUE,
  ts TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  bookings JSONB DEFAULT '[]'::jsonb
);

-- 3. جدول الإعلانات
CREATE TABLE announcements (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  type TEXT DEFAULT 'user',
  ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_announcements_ts ON announcements(ts DESC);

-- 4. جدول السجل
CREATE TABLE journal (
  id TEXT PRIMARY KEY,
  msg TEXT NOT NULL,
  ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_journal_ts ON journal(ts DESC);

-- 5. جدول الدخل
CREATE TABLE income (
  id TEXT PRIMARY KEY,
  "clientName" TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_income_ts ON income(ts DESC);

-- 6. جدول الديون
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
-- تفعيل Row Level Security
-- ═══════════════════════════════════════════════════════════

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cancelled_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE debt ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════
-- سياسات الأمان (أسماء جديدة لتجنب التكرار)
-- ═══════════════════════════════════════════════════════════

-- Bookings
CREATE POLICY "public_read_bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "public_insert_bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_bookings" ON bookings FOR UPDATE USING (true);
CREATE POLICY "public_delete_bookings" ON bookings FOR DELETE USING (true);

-- Cancelled Days
CREATE POLICY "public_read_cancelled" ON cancelled_days FOR SELECT USING (true);
CREATE POLICY "public_insert_cancelled" ON cancelled_days FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_cancelled" ON cancelled_days FOR UPDATE USING (true);
CREATE POLICY "public_delete_cancelled" ON cancelled_days FOR DELETE USING (true);

-- Announcements
CREATE POLICY "public_read_announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "public_insert_announcements" ON announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_announcements" ON announcements FOR UPDATE USING (true);
CREATE POLICY "public_delete_announcements" ON announcements FOR DELETE USING (true);

-- Journal
CREATE POLICY "public_read_journal" ON journal FOR SELECT USING (true);
CREATE POLICY "public_insert_journal" ON journal FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_journal" ON journal FOR UPDATE USING (true);
CREATE POLICY "public_delete_journal" ON journal FOR DELETE USING (true);

-- Income
CREATE POLICY "public_read_income" ON income FOR SELECT USING (true);
CREATE POLICY "public_insert_income" ON income FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_income" ON income FOR UPDATE USING (true);
CREATE POLICY "public_delete_income" ON income FOR DELETE USING (true);

-- Debt
CREATE POLICY "public_read_debt" ON debt FOR SELECT USING (true);
CREATE POLICY "public_insert_debt" ON debt FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_debt" ON debt FOR UPDATE USING (true);
CREATE POLICY "public_delete_debt" ON debt FOR DELETE USING (true);

-- ═══════════════════════════════════════════════════════════
-- ✅ تم! الجداول جاهزة بأسماء أعمدة صحيحة
-- ═══════════════════════════════════════════════════════════
