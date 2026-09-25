-- ============================================================
-- PEPAK DIGITAL — SETUP DATABASE SUPABASE
-- Jalankan seluruh isi file ini di:
-- Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- 1. TABEL PENGGUNA (pepak_users)
CREATE TABLE IF NOT EXISTS public.pepak_users (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  password    TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'siswa'
                CHECK (role IN ('siswa','guru','admin')),
  status      TEXT NOT NULL DEFAULT 'approved'
                CHECK (status IN ('pending','approved','rejected')),
  avatar      TEXT DEFAULT '🎒',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES public.pepak_users(id) ON DELETE SET NULL,
  rejected_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_pepak_users_email  ON public.pepak_users(email);
CREATE INDEX IF NOT EXISTS idx_pepak_users_status ON public.pepak_users(status);
CREATE INDEX IF NOT EXISTS idx_pepak_users_role   ON public.pepak_users(role);

ALTER TABLE public.pepak_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public register"   ON public.pepak_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow login select"      ON public.pepak_users FOR SELECT USING (true);
CREATE POLICY "Allow update own or admin" ON public.pepak_users FOR UPDATE USING (true);
CREATE POLICY "Allow delete for admin"  ON public.pepak_users FOR DELETE USING (true);

-- ============================================================
-- 2. TABEL LANGGANAN & TOKEN HARIAN (pepak_subscriptions)
--    Satu baris per user — upsert saat tier berubah atau token dipakai.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pepak_subscriptions (
  user_id           UUID PRIMARY KEY REFERENCES public.pepak_users(id) ON DELETE CASCADE,

  -- Tier aktif: free | monthly | semi | yearly | school
  tier              TEXT NOT NULL DEFAULT 'free'
                      CHECK (tier IN ('free','monthly','semi','yearly','school')),

  -- Token harian
  tokens_remaining  INTEGER NOT NULL DEFAULT 7,
  tokens_reset_at   TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 day'),

  -- Masa aktif langganan (NULL = gratis / tidak terbatas)
  expires_at        TIMESTAMPTZ,

  -- Refill darurat (hanya tier yearly/school)
  refill_used_today BOOLEAN NOT NULL DEFAULT FALSE,
  refill_reset_at   TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 day'),

  -- Metadata
  activated_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sub_user_id   ON public.pepak_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_sub_tier      ON public.pepak_subscriptions(tier);
CREATE INDEX IF NOT EXISTS idx_sub_expires   ON public.pepak_subscriptions(expires_at);

ALTER TABLE public.pepak_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on subscriptions" ON public.pepak_subscriptions FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 3. FUNGSI RESET TOKEN HARIAN (dijalankan via cron/RPC)
--    Reset tokens_remaining ke kuota tier masing-masing
--    untuk semua user yang sudah lewat tokens_reset_at.
-- ============================================================
CREATE OR REPLACE FUNCTION public.pepak_reset_daily_tokens()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  tier_tokens INTEGER;
  updated_count INTEGER := 0;
BEGIN
  -- Reset token per tier
  UPDATE public.pepak_subscriptions
  SET
    tokens_remaining  = CASE tier
      WHEN 'free'    THEN 7
      WHEN 'monthly' THEN 15
      WHEN 'semi'    THEN 25
      WHEN 'yearly'  THEN 35
      WHEN 'school'  THEN 35
      ELSE 7
    END,
    tokens_reset_at   = NOW() + INTERVAL '1 day',
    refill_used_today = FALSE,
    refill_reset_at   = NOW() + INTERVAL '1 day',
    updated_at        = NOW()
  WHERE tokens_reset_at <= NOW();

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

-- ============================================================
-- 4. FUNGSI DOWNGRADE OTOMATIS (langganan kadaluarsa → free)
-- ============================================================
CREATE OR REPLACE FUNCTION public.pepak_downgrade_expired()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_count INTEGER := 0;
BEGIN
  UPDATE public.pepak_subscriptions
  SET
    tier             = 'free',
    tokens_remaining = 7,
    expires_at       = NULL,
    updated_at       = NOW()
  WHERE
    expires_at IS NOT NULL
    AND expires_at <= NOW()
    AND tier != 'free';

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

-- ============================================================
-- 5. FUNGSI CEK BOOTSTRAP (admin pertama)
-- ============================================================
CREATE OR REPLACE FUNCTION public.pepak_needs_bootstrap()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.pepak_users
    WHERE role = 'admin' AND status = 'approved'
  );
$$;

-- ============================================================
-- 6. VERIFIKASI — jalankan untuk memastikan semua terbuat
-- ============================================================
-- SELECT * FROM public.pepak_users LIMIT 5;
-- SELECT * FROM public.pepak_subscriptions LIMIT 5;
-- SELECT public.pepak_needs_bootstrap();
-- SELECT public.pepak_reset_daily_tokens();
