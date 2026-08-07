-- ============================================================================
-- e-CAPH (Enhancing Communities Action for Peace and Better Health Initiative)
-- Live Seed Data Migration (e-caph.org)
-- ============================================================================

-- 1. SEED TEAM MEMBERS (Real team from e-caph.org)
INSERT INTO public.team_members (id, full_name, role_title, bio, avatar_url, email, linkedin_url, order_index, is_active)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'Abdulmumin Rabiu',
    'Executive Director & Founder',
    'Abdulmumin is a dynamic community development leader with extensive expertise in project management, strategic program leadership, and community engagement. With over five years of experience driving social impact across northern Nigeria, he has successfully designed, implemented, and scaled initiatives that empower adolescents, youth, and local communities to improve health, education, and livelihoods.',
    NULL,
    'caph4dev35@gmail.com',
    '#',
    1,
    true
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Khadija Lawal Aliyu',
    'Gender Thematic Lead',
    'Providing leadership on gender equality, human rights, and social inclusion programming. She holds a BSc in Biochemistry (First Class) from Federal University Gashua and has strong experience in research, advocacy, and community engagement. Khadija has held multiple student leadership roles and led research on child malnutrition and harmful social practices.',
    NULL,
    'caph4dev35@gmail.com',
    '#',
    2,
    true
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Fatima Muftau',
    'Monitoring & Evaluation (M&E) Lead',
    'Fatima Muftau is a dedicated Monitoring & Evaluation professional with expertise in data collection, analysis, and program assessment to support evidence-based decision-making. She holds an HND in PsychoSocial Rehabilitation Science and is skilled in KoboCollect, ODK, Survey123, Power BI, and SQL.',
    NULL,
    'caph4dev35@gmail.com',
    '#',
    3,
    true
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'Muhammed Sani Kabir',
    'Communications Lead',
    'Muhammed Sani Kabir is a creative and impact-driven Communications Lead with expertise in digital advocacy, strategic messaging, and multimedia content production. He specializes in leveraging ICT4D tools to bridge data, storytelling, and social impact in health, governance, and civic engagement.',
    NULL,
    'caph4dev35@gmail.com',
    '#',
    4,
    true
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    'Zakiyya Said Abdulkadir',
    'Health Thematic Lead',
    'Providing technical leadership for community and primary healthcare programs, including adolescent and youth health interventions. She holds a Higher National Diploma and National Diploma in Community Health from Shehu Idris College of Health Science and Technology, Makarfi.',
    NULL,
    'caph4dev35@gmail.com',
    '#',
    5,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role_title = EXCLUDED.role_title,
  bio = EXCLUDED.bio,
  email = EXCLUDED.email,
  order_index = EXCLUDED.order_index,
  is_active = EXCLUDED.is_active;

-- 2. SEED PROGRAMMES
INSERT INTO public.programmes (id, title, slug, description, content, icon_name, color_theme, is_published, order_index)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'Adolescent and Youth Health and Development',
    'adolescent-and-youth-health-and-development',
    'Providing age-appropriate information, services, and safe spaces on sexual and reproductive health, HIV, HPV, nutrition, mental health, and life skills.',
    'Detailed programme content for Adolescent and Youth Health and Development.',
    'HeartPulse',
    'teal',
    true,
    1
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'Maternal, Newborn and Child Health (MNCH)',
    'maternal-newborn-and-child-health',
    'Supporting improved access to quality maternal health services through community follow-up, digital tracking tools, and accountability initiatives such as the ANC Tracker.',
    'Detailed programme content for Maternal, Newborn and Child Health.',
    'Users',
    'rose',
    true,
    2
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'Gender-Based Violence (GBV) Prevention & Response',
    'gender-based-violence-prevention-and-response',
    'Strengthening community prevention mechanisms, survivor referral pathways, case documentation, and advocacy for survivor-centred services.',
    'Detailed programme content for GBV Prevention & Response.',
    'ShieldCheck',
    'purple',
    true,
    3
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    'Peacebuilding and Social Cohesion',
    'peacebuilding-and-social-cohesion',
    'Promoting dialogue, inclusion, and non-violent community engagement as foundations for health, safety, and development.',
    'Detailed programme content for Peacebuilding and Social Cohesion.',
    'Sparkles',
    'amber',
    true,
    4
  ),
  (
    '10000000-0000-0000-0000-000000000005',
    'Community Engagement and Social Accountability',
    'community-engagement-and-social-accountability',
    'Mobilising community champions, volunteers, and civil society platforms to improve transparency, citizen participation, and service delivery.',
    'Detailed programme content for Community Engagement and Social Accountability.',
    'Award',
    'blue',
    true,
    5
  ),
  (
    '10000000-0000-0000-0000-000000000006',
    'Digital Innovation for Better Health',
    'digital-innovation-and-data-for-development',
    'Using technology to improve data collection, monitoring, accountability, and evidence-based decision-making across primary healthcare systems.',
    'Detailed programme content for Digital Innovation for Better Health.',
    'TrendingUp',
    'emerald',
    true,
    6
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  is_published = EXCLUDED.is_published,
  order_index = EXCLUDED.order_index;

-- 3. SEED IMPACT STATISTICS
INSERT INTO public.impact_statistics (id, label, value, numeric_value, suffix, icon_name, category, order_index, is_published)
VALUES
  ('20000000-0000-0000-0000-000000000001', 'Adolescents & Youth Reached', 95000, 95000, '+', 'Users', 'Youth', 1, true),
  ('20000000-0000-0000-0000-000000000002', 'Primary Health Facilities Monitored', 40, 40, '+', 'HeartPulse', 'Health', 2, true),
  ('20000000-0000-0000-0000-000000000003', 'Communities Empowered', 120, 120, '+', 'ShieldCheck', 'Community', 3, true),
  ('20000000-0000-0000-0000-000000000004', 'Community Interventions Delivered', 45000, 45000, '+', 'TrendingUp', 'Impact', 4, true)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  value = EXCLUDED.value,
  numeric_value = EXCLUDED.numeric_value,
  is_published = EXCLUDED.is_published;
