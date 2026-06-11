-- =============================================================
-- SocialToolsByZa - Supabase Schema
-- Jalankan SQL ini di https://supabase.com dashboard > SQL Editor
-- =============================================================

-- Tabel users untuk menyimpan akun user
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'premium')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk pencarian email (login)
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- Row Level Security (RLS) - matikan dulu biar gampang
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- =============================================================
-- Cara dapetin environment variables:
-- 1. Buka https://supabase.com → New project
-- 2. Project Settings → API:
--    - Project URL → NEXT_PUBLIC_SUPABASE_URL
--    - anon public key → NEXT_PUBLIC_SUPABASE_ANON_KEY
--    - service_role key → SUPABASE_SERVICE_ROLE_KEY
-- 3. Isi di Vercel dashboard → Project Settings → Environment Variables
-- =============================================================
