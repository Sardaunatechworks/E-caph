-- ============================================================================
-- e-CAPH: Master Supabase Database Schema, RLS Policies & Storage Setup
-- Idempotent script: Safe to run multiple times in Supabase SQL Editor!
-- ============================================================================

-- 1. STORAGE BUCKET SETUP FOR MEDIA & DOCUMENTS
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Bucket Public Read & Write Policies
DROP POLICY IF EXISTS "Public Read Media Storage" ON storage.objects;
CREATE POLICY "Public Read Media Storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Admin Write Media Storage" ON storage.objects;
CREATE POLICY "Admin Write Media Storage" ON storage.objects
  FOR ALL USING (bucket_id = 'media');

-- 2. PROGRAMMES TABLE
CREATE TABLE IF NOT EXISTS public.programmes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  icon_name TEXT,
  featured_image TEXT,
  color_theme TEXT,
  outcomes JSONB,
  is_published BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.programmes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read programmes" ON public.programmes;
CREATE POLICY "Public read programmes" ON public.programmes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write programmes" ON public.programmes;
CREATE POLICY "Admin write programmes" ON public.programmes FOR ALL USING (true);

-- 3. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programme_id UUID REFERENCES public.programmes(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  summary TEXT NOT NULL,
  description TEXT,
  objectives TEXT[],
  activities TEXT[],
  results_to_date TEXT[],
  target_beneficiaries TEXT,
  location TEXT,
  donor_partner TEXT,
  status TEXT DEFAULT 'ongoing',
  start_date DATE,
  end_date DATE,
  featured_image TEXT,
  is_flagship BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  budget NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read projects" ON public.projects;
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write projects" ON public.projects;
CREATE POLICY "Admin write projects" ON public.projects FOR ALL USING (true);

-- 4. IMPACT STATISTICS TABLE
CREATE TABLE IF NOT EXISTS public.impact_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value NUMERIC NOT NULL DEFAULT 0,
  suffix TEXT,
  icon_name TEXT,
  category TEXT,
  order_index INTEGER DEFAULT 1,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.impact_statistics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read impact_statistics" ON public.impact_statistics;
CREATE POLICY "Public read impact_statistics" ON public.impact_statistics FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write impact_statistics" ON public.impact_statistics;
CREATE POLICY "Admin write impact_statistics" ON public.impact_statistics FOR ALL USING (true);

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

-- 6. BOARD MEMBERS TABLE
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

-- 7. POSTS / STORIES TABLE
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID,
  category_id UUID,
  programme_id UUID REFERENCES public.programmes(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  images TEXT[] DEFAULT '{}',
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

-- 8. DOWNLOAD RESOURCES (PDFs) TABLE
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

-- 9. OPPORTUNITIES TABLE
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

-- 10. MEDIA ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.media_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  caption TEXT,
  media_type TEXT NOT NULL DEFAULT 'photo',
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT,
  order_index INTEGER DEFAULT 0,
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

-- 11. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  inquiry_type TEXT DEFAULT 'General Inquiry',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert contact_messages" ON public.contact_messages;
CREATE POLICY "Public insert contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin read contact_messages" ON public.contact_messages;
CREATE POLICY "Admin read contact_messages" ON public.contact_messages FOR ALL USING (true);

-- 12. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Public insert newsletter_subscribers" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin read newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admin read newsletter_subscribers" ON public.newsletter_subscribers FOR ALL USING (true);

-- 13. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write site_settings" ON public.site_settings;
CREATE POLICY "Admin write site_settings" ON public.site_settings FOR ALL USING (true);

-- ============================================================================
-- INITIAL SEED RECORDS (Using Valid UUID Identifiers)
-- ============================================================================

-- 1. SEED PROGRAMMES
INSERT INTO public.programmes (id, title, slug, description, content, icon_name, color_theme, is_published, order_index)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'Adolescent and Youth Health & Development', 'adolescent-and-youth-health-and-development', 'Promoting adolescent health, SRHR advocacy, and youth development across communities.', 'Comprehensive youth health programs focusing on reproductive rights, mental health, and community advocacy.', 'HeartPulse', 'blue', true, 1),
  ('10000000-0000-0000-0000-000000000002', 'Maternal, Newborn & Child Health (MNCH)', 'maternal-newborn-and-child-health', 'Strengthening maternal healthcare delivery, ANC attendance, and essential newborn care.', 'Improving maternal health outcomes through community health worker tracking and primary facility advocacy.', 'Heart', 'blue', true, 2),
  ('10000000-0000-0000-0000-000000000003', 'Gender-Based Violence Prevention & Response', 'gender-based-violence-prevention-and-response', 'Community advocacy, protection services, and survivor support systems.', 'Preventing gender-based violence and providing psychosocial support for survivors.', 'ShieldCheck', 'green', true, 3),
  ('10000000-0000-0000-0000-000000000004', 'Peacebuilding & Social Cohesion', 'peacebuilding-and-social-cohesion', 'Youth mediation, inter-faith dialogue, and early warning systems.', 'Fostering peaceful coexistence and youth conflict resolution in local wards.', 'Users', 'green', true, 4),
  ('10000000-0000-0000-0000-000000000005', 'Community Engagement & Social Accountability', 'community-engagement-and-social-accountability', 'Youth-led civic monitoring of primary health services and public budgets.', 'Empowering citizens through Gani da Ido social accountability scorecards.', 'Award', 'green', true, 5),
  ('10000000-0000-0000-0000-000000000006', 'Digital Innovation & Data for Development', 'digital-innovation-and-data-for-development', 'Leveraging modern tech tools, GIS mapping, and data analytics for sustainable development.', 'Building digital skills and tech solutions for community healthcare tracking.', 'Sparkles', 'orange', true, 6)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug;

-- 2. SEED IMPACT STATISTICS
INSERT INTO public.impact_statistics (id, label, value, suffix, icon_name, category, order_index, is_published)
VALUES
  ('20000000-0000-0000-0000-000000000001', 'Beneficiaries Reached', 15000, '+', 'Users', 'Outreach', 1, true),
  ('20000000-0000-0000-0000-000000000002', 'Health Centers Monitored', 40, '+', 'HeartPulse', 'Healthcare', 2, true),
  ('20000000-0000-0000-0000-000000000003', 'Youth Champions Trained', 120, '+', 'Award', 'Capacity', 3, true),
  ('20000000-0000-0000-0000-000000000004', 'Women Skills Graduates', 250, '+', 'Sparkles', 'Empowerment', 4, true)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  value = EXCLUDED.value;

-- 3. SEED TEAM MEMBERS
INSERT INTO public.team_members (id, full_name, role_title, bio, avatar_url, email, order_index, is_active)
VALUES
  ('30000000-0000-0000-0000-000000000001', 'Abdulmumin Rabiu', 'Executive Director & Founder', 'Abdulmumin is a dynamic community development leader with extensive expertise in project management and youth engagement.', NULL, 'caph4dev35@gmail.com', 1, true),
  ('30000000-0000-0000-0000-000000000002', 'Khadija Lawal Aliyu', 'Gender Thematic Lead', 'Providing leadership on gender equality, human rights, and social inclusion programming.', NULL, 'caph4dev35@gmail.com', 2, true),
  ('30000000-0000-0000-0000-000000000003', 'Fatima Muftau', 'Monitoring & Evaluation (M&E) Lead', 'Dedicated Monitoring & Evaluation professional with expertise in data collection and program assessment.', NULL, 'caph4dev35@gmail.com', 3, true),
  ('30000000-0000-0000-0000-000000000004', 'Muhammed Sani Kabir', 'Communications Lead', 'Creative and impact-driven Communications Lead with expertise in digital advocacy and strategic messaging.', NULL, 'caph4dev35@gmail.com', 4, true)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role_title = EXCLUDED.role_title;

-- 4. SEED BOARD MEMBERS
INSERT INTO public.board_members (id, full_name, board_role, bio, avatar_url, email, order_index, is_active)
VALUES
  ('40000000-0000-0000-0000-000000000001', 'Dr. Hauwa Mustapha', 'Chairman, Board of Trustees', 'Renowned public health strategist and governance advisor.', NULL, 'info@e-caph.org', 1, true),
  ('40000000-0000-0000-0000-000000000002', 'Barr. Usman Danjuma', 'Board Trustee & Legal Counsel', 'Human rights lawyer and legal reform advocate.', NULL, 'info@e-caph.org', 2, true),
  ('40000000-0000-0000-0000-000000000003', 'Hajia Maryam Bello', 'Board Trustee & Financial Steward', 'Development finance specialist and women rights advocate.', NULL, 'info@e-caph.org', 3, true)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  board_role = EXCLUDED.board_role;

-- 5. SEED PROJECTS
INSERT INTO public.projects (id, title, slug, summary, description, target_beneficiaries, location, status, featured_image, is_flagship, is_published)
VALUES
  (
    '50000000-0000-0000-0000-000000000001',
    'e-CAPH Skills Hub',
    'ecaph-skills-hub-women-youth-empowerment',
    'An economic empowerment initiative equipping women and young people with practical vocational and entrepreneurial skills.',
    'The e-CAPH Skills Hub equips women and youth with digital and vocational skills for sustainable livelihoods.',
    'Women, adolescent girls, and youth.',
    'Kaduna & Kano, Nigeria',
    'ongoing',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    true,
    true
  ),
  (
    '50000000-0000-0000-0000-000000000002',
    'Gani da Ido - Muryar Matasa',
    'gani-da-ido-youth-civic-accountability',
    'A youth-led civic engagement and social accountability project strengthening community participation in primary healthcare.',
    'Monitors public health services, budgets, and government commitments through community scorecards.',
    'Youth advocates and primary health service users.',
    'Northern Nigeria Wards',
    'ongoing',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    true,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary;

-- 6. SEED POSTS
INSERT INTO public.posts (id, title, slug, summary, content, featured_image, post_type, status, published_at)
VALUES
  (
    '60000000-0000-0000-0000-000000000001',
    'e-CAPH Launches Skills Hub for Women and Youth Empowerment',
    'ecaph-launches-skills-hub-women-youth-empowerment',
    'Equipping young people and women with high-demand vocational skills and startup support.',
    'The e-CAPH Skills Hub equips participants with practical vocational and entrepreneurial skills to foster economic independence.',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    'article',
    'published',
    now()
  ),
  (
    '60000000-0000-0000-0000-000000000002',
    'Gani da Ido: Youth Accountability Champions Tracking Primary Healthcare',
    'gani-da-ido-youth-accountability-champions-primary-healthcare',
    'Empowering young leaders to monitor community health centers and public service delivery.',
    'Youth Accountability Champions collect community scorecards across primary health centers in northern Nigeria.',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    'report',
    'published',
    now()
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary;
