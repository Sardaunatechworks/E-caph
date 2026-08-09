-- ============================================================================
-- e-CAPH: Board Members & PDF Resources Schema & Seed Data
-- ============================================================================

-- 1. BOARD MEMBERS TABLE
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

-- RLS Policies for Board Members
ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read board_members" ON public.board_members
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin write board_members" ON public.board_members
  FOR ALL USING (auth.role() = 'authenticated');

-- 2. DOWNLOAD RESOURCES (PDFs) TABLE
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

-- RLS Policies for Download Resources
ALTER TABLE public.download_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read download_resources" ON public.download_resources
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admin write download_resources" ON public.download_resources
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Seed Board Members
INSERT INTO public.board_members (id, full_name, board_role, bio, email, linkedin_url, order_index, is_active)
VALUES
  (
    '30000000-0000-0000-0000-000000000001',
    'Dr. Hauwa Mustapha',
    'Chairman, Board of Trustees',
    'Renowned public health strategist and governance advisor with over 20 years of leadership experience advising international development agencies and civil society coalitions across West Africa.',
    'info@e-caph.org',
    '#',
    1,
    true
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    'Barr. Usman Danjuma',
    'Board Trustee & Legal Counsel',
    'Human rights lawyer and legal reform advocate specializing in civil liberties, youth protection laws, and non-profit governance in Nigeria.',
    'info@e-caph.org',
    '#',
    2,
    true
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    'Prof. Aliyu Bawa',
    'Trustee - Health Research & Evaluation',
    'Professor of Community Medicine and Epidemiology with extensive publications on maternal healthcare, youth reproductive health, and disease monitoring.',
    'info@e-caph.org',
    '#',
    3,
    true
  ),
  (
    '30000000-0000-0000-0000-000000000004',
    'Hajiya Amina Bello',
    'Trustee - Gender & Peace Cohesion',
    'Grassroots peace mediator, women advocate, and community leader with deep ties across traditional governance structures in Northern Nigeria.',
    'info@e-caph.org',
    '#',
    4,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  board_role = EXCLUDED.board_role,
  bio = EXCLUDED.bio;

-- Seed Download Resources (PDF Documents)
INSERT INTO public.download_resources (id, title, slug, description, category, file_url, file_size, file_type, downloads_count, is_published)
VALUES
  (
    '40000000-0000-0000-0000-000000000001',
    'e-CAPH Annual Impact Report 2025-2026',
    'e-caph-annual-impact-report-2025-2026',
    'Comprehensive annual report highlighting key achievements across adolescent health, maternal ANC tracking, peacebuilding forums, and community governance in Nigeria.',
    'Annual Report',
    'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    '3.2 MB',
    'application/pdf',
    142,
    true
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    'Policy Brief: Digital ANC Tracking & Primary Healthcare Delivery in Kaduna',
    'policy-brief-digital-anc-tracking-kaduna',
    'Evidence-based policy brief examining the impact of digital tracking tools on 4th-visit antenatal care attendance and primary facility drug supply transparency.',
    'Policy Brief',
    'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    '1.8 MB',
    'application/pdf',
    89,
    true
  ),
  (
    '40000000-0000-0000-0000-000000000003',
    'Youth Dialogue & Conflict Resolution Facilitation Guide',
    'youth-dialogue-conflict-resolution-guide',
    'A practical training toolkit designed for community peace ambassadors, youth advocates, and civil society leaders conducting inter-faith and community dialogues.',
    'Tool/Guide',
    'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    '4.5 MB',
    'application/pdf',
    215,
    true
  ),
  (
    '40000000-0000-0000-0000-000000000004',
    'Gender-Based Violence Referral & Case Tracking Framework',
    'gbv-referral-case-tracking-framework',
    'Standard operating procedure and community documentation framework for GBV response teams, survivors advocacy groups, and referral health centers.',
    'Research Paper',
    'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    '2.1 MB',
    'application/pdf',
    110,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category;
