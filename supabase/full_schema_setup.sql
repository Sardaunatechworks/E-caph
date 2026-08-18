-- ============================================================================
-- e-CAPH: Master Supabase Database Schema & Storage Setup
-- Idempotent script: Safe to run multiple times in Supabase SQL Editor!
-- ============================================================================

-- 1. STORAGE BUCKET SETUP FOR MEDIA & DOCUMENTS
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Bucket Public Read Policy
DROP POLICY IF EXISTS "Public Read Media Storage" ON storage.objects;
CREATE POLICY "Public Read Media Storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Admin Write Media Storage" ON storage.objects;
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
-- 7. SITE SETTINGS TABLE (Branding & Logo Config)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
-- 8. MEDIA ITEMS TABLE (Photos, Videos, Press Releases & Statements)
CREATE TABLE IF NOT EXISTS public.media_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  caption TEXT,
  media_type TEXT NOT NULL DEFAULT 'photo',
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT,
  order_index INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read media_items" ON public.media_items;
CREATE POLICY "Public read media_items" ON public.media_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write media_items" ON public.media_items;
CREATE POLICY "Admin write media_items" ON public.media_items FOR ALL USING (true);

-- ============================================================================
-- INITIAL SEED RECORDS FOR REAL DATABASE EXECUTION IN SUPABASE
-- ============================================================================

INSERT INTO public.team_members (id, full_name, role_title, bio, avatar_url, email, order_index, is_active)
VALUES
  ('team-1', 'Dr. Fatima Abubakar', 'Executive Director & Founder', 'Public health physician with 15+ years leading health systems reform and community interventions in Nigeria.', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80', 'fatima@e-caph.org', 1, true),
  ('team-2', 'Ibrahim Sani', 'Director of Programmes', 'Development strategist overseeing adolescent health, civic accountability, and youth economic empowerment initiatives.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', 'ibrahim@e-caph.org', 2, true),
  ('team-3', 'Amina Kabir', 'Head of Public Health & ANC', 'Epidemiologist leading maternal-newborn health tracking and primary health center community advocacy.', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80', 'amina@e-caph.org', 3, true),
  ('team-4', 'Yusuf Mohammed', 'Lead, Gani da Ido & Governance', 'Social accountability expert coordinating Youth Accountability Champions and community service scorecards.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80', 'yusuf@e-caph.org', 4, true)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role_title = EXCLUDED.role_title,
  avatar_url = EXCLUDED.avatar_url;

INSERT INTO public.board_members (id, full_name, board_role, bio, avatar_url, email, order_index, is_active)
VALUES
  ('board-1', 'Dr. Hauwa Mustapha', 'Chairman, Board of Trustees', 'Renowned public health strategist and governance advisor.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80', 'info@e-caph.org', 1, true),
  ('board-2', 'Barr. Usman Danjuma', 'Board Trustee & Legal Counsel', 'Human rights lawyer and legal reform advocate.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80', 'info@e-caph.org', 2, true),
  ('board-3', 'Hajia Maryam Bello', 'Board Trustee & Financial Steward', 'Development finance specialist and women rights advocate.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80', 'info@e-caph.org', 3, true),
  ('board-4', 'Prof. Kabir Ahmed', 'Senior Technical Advisor', 'Professor of Community Medicine and Health Policy.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80', 'info@e-caph.org', 4, true)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  board_role = EXCLUDED.board_role,
  bio = EXCLUDED.bio;

INSERT INTO public.projects (id, title, slug, summary, description, target_beneficiaries, location, status, featured_image, is_flagship, is_published)
VALUES
  (
    'init-skills-hub',
    'e-CAPH Skills Hub',
    'ecaph-skills-hub-women-youth-empowerment',
    'An economic empowerment initiative designed to equip women and young people with practical vocational and entrepreneurial skills that improve economic opportunities while addressing social vulnerabilities.',
    'The e-CAPH Skills Hub for women and youth empowerment is an economic empowerment initiative designed to equip women and young people with practical vocational and entrepreneurial skills that improve their economic opportunities while also addressing social vulnerabilities.',
    'Women, adolescent girls, and unemployed youth.',
    'Kaduna & Kano, Nigeria',
    'ongoing',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    true,
    true
  ),
  (
    'init-gani-da-ido',
    'Gani da Ido - Muryar Matasa – Idon Al’umma',
    'gani-da-ido-youth-civic-accountability',
    'A youth-led civic engagement and social accountability project that amplifies young people’s voices and strengthens community participation in public decision-making.',
    'The e-CAPH Gani da Ido project enables citizens to monitor public services, budgets, government commitments and development projects through accessible digital and community-based platforms.',
    'Youth advocates, local ward citizens, and primary health service users.',
    'Northern Nigeria Wards',
    'ongoing',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    true,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary;

INSERT INTO public.posts (id, title, slug, summary, content, featured_image, post_type, status, published_at)
VALUES
  (
    'post-1',
    'e-CAPH Launches Skills Hub for Women and Youth Economic Empowerment',
    'ecaph-launches-skills-hub-women-youth-empowerment',
    'Equipping young people and women with high-demand vocational skills, digital technology training, and startup support.',
    'The e-CAPH Skills Hub equips participants with practical vocational and entrepreneurial skills to foster economic independence.',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    'article',
    'published',
    now()
  ),
  (
    'post-2',
    'Gani da Ido: Youth Accountability Champions Tracking Primary Healthcare Services',
    'gani-da-ido-youth-accountability-champions-primary-healthcare',
    'Empowering young leaders to monitor community health centers, budget allocations, and public service delivery.',
    'Youth Accountability Champions collect community scorecards across primary health centers in northern Nigeria.',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    'report',
    'published',
    now()
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary;

INSERT INTO public.media_items (id, title, caption, media_type, url, thumbnail_url, category, order_index, is_published)
VALUES
  (
    'media-1',
    'Community Health Advocates Training Workshop in Kaduna',
    'Over 50 grassroots health champions completed our primary healthcare monitoring toolkit training.',
    'photo',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    NULL,
    'Community Health',
    1,
    true
  ),
  (
    'media-2',
    'Gani da Ido Project Launch & Youth Dialogue',
    'Official video coverage of the youth-led social accountability town hall meeting.',
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    'Social Accountability',
    2,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  caption = EXCLUDED.caption;

INSERT INTO public.download_resources (id, title, slug, description, category, file_url, file_size, downloads_count, is_published)
VALUES
  ('40000000-0000-0000-0000-000000000001', 'e-CAPH Annual Impact Report 2025-2026', 'e-caph-annual-impact-report-2025-2026', 'Comprehensive annual report highlighting key achievements.', 'Annual Report', 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf', '3.2 MB', 142, true),
  ('40000000-0000-0000-0000-000000000002', 'Policy Brief: Digital ANC Tracking & Primary Healthcare Delivery', 'policy-brief-digital-anc-tracking-kaduna', 'Evidence-based policy brief examining the impact of digital tracking tools.', 'Policy Brief', 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf', '1.8 MB', 89, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description;

