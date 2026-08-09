-- ============================================================================
-- e-CAPH: Master Supabase Database Schema & Storage Setup
-- Run this script in your Supabase Dashboard -> SQL Editor to create all tables!
-- ============================================================================

-- 1. STORAGE BUCKET SETUP FOR MEDIA & DOCUMENTS
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Bucket Public Read Policy
CREATE POLICY "Public Read Media Storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Admin Write Media Storage" ON storage.objects
  FOR ALL USING (bucket_id = 'media');

-- 2. BOARD MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.board_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  board_role TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  email TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  order_index INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read board_members" ON public.board_members;
CREATE POLICY "Public read board_members" ON public.board_members FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write board_members" ON public.board_members;
CREATE POLICY "Admin write board_members" ON public.board_members FOR ALL USING (true);

-- 3. DOWNLOAD RESOURCES (PDFs) TABLE
CREATE TABLE IF NOT EXISTS public.download_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Annual Report',
  file_url TEXT NOT NULL,
  file_size TEXT,
  file_type TEXT DEFAULT 'application/pdf',
  downloads_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  published_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.download_resources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read download_resources" ON public.download_resources;
CREATE POLICY "Public read download_resources" ON public.download_resources FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write download_resources" ON public.download_resources;
CREATE POLICY "Admin write download_resources" ON public.download_resources FOR ALL USING (true);

-- 4. OPPORTUNITIES TABLE
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  opportunity_type TEXT NOT NULL DEFAULT 'fellowship',
  location TEXT DEFAULT 'Kaduna, Nigeria',
  description TEXT,
  requirements TEXT,
  application_link TEXT,
  deadline DATE,
  is_open BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read opportunities" ON public.opportunities;
CREATE POLICY "Public read opportunities" ON public.opportunities FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write opportunities" ON public.opportunities;
CREATE POLICY "Admin write opportunities" ON public.opportunities FOR ALL USING (true);

-- 5. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  email TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  order_index INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read team_members" ON public.team_members;
CREATE POLICY "Public read team_members" ON public.team_members FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write team_members" ON public.team_members;
CREATE POLICY "Admin write team_members" ON public.team_members FOR ALL USING (true);

-- 6. POSTS / STORIES TABLE
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  post_type TEXT DEFAULT 'article',
  status TEXT DEFAULT 'published',
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read posts" ON public.posts;
CREATE POLICY "Public read posts" ON public.posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write posts" ON public.posts;
CREATE POLICY "Admin write posts" ON public.posts FOR ALL USING (true);

-- ============================================================================
-- INITIAL SEED RECORDS
-- ============================================================================

INSERT INTO public.board_members (id, full_name, board_role, bio, email, order_index, is_active)
VALUES
  ('30000000-0000-0000-0000-000000000001', 'Dr. Hauwa Mustapha', 'Chairman, Board of Trustees', 'Renowned public health strategist and governance advisor.', 'info@e-caph.org', 1, true),
  ('30000000-0000-0000-0000-000000000002', 'Barr. Usman Danjuma', 'Board Trustee & Legal Counsel', 'Human rights lawyer and legal reform advocate.', 'info@e-caph.org', 2, true),
  ('30000000-0000-0000-0000-000000000003', 'Prof. Aliyu Bawa', 'Trustee - Health Research & Evaluation', 'Professor of Community Medicine and Epidemiology.', 'info@e-caph.org', 3, true),
  ('30000000-0000-0000-0000-000000000004', 'Hajiya Amina Bello', 'Trustee - Gender & Peace Cohesion', 'Grassroots peace mediator and women advocate.', 'info@e-caph.org', 4, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.download_resources (id, title, slug, description, category, file_url, file_size, downloads_count, is_published)
VALUES
  ('40000000-0000-0000-0000-000000000001', 'e-CAPH Annual Impact Report 2025-2026', 'e-caph-annual-impact-report-2025-2026', 'Comprehensive annual report highlighting key achievements.', 'Annual Report', 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf', '3.2 MB', 142, true),
  ('40000000-0000-0000-0000-000000000002', 'Policy Brief: Digital ANC Tracking & Primary Healthcare Delivery', 'policy-brief-digital-anc-tracking-kaduna', 'Evidence-based policy brief examining the impact of digital tracking tools.', 'Policy Brief', 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf', '1.8 MB', 89, true)
ON CONFLICT (id) DO NOTHING;
