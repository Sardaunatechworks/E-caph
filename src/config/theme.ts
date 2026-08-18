export const colors = {
  primary: {
    DEFAULT: '#0092DF',
    hover: '#007DC2',
    50: '#E6F4FC',
    100: '#CCEAFA',
    500: '#0092DF',
    600: '#007DC2',
    700: '#005A8D',
    900: '#003D60',
  },
  secondary: {
    DEFAULT: '#86C127',
    hover: '#6EA71F',
    50: '#F3F9E9',
    100: '#E7F4D4',
  },
  accent: {
    DEFAULT: '#E67817',
    hover: '#CF660F',
    50: '#FDF2E8',
  },
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    muted: '#94A3B8',
  },
  bg: {
    white: '#FFFFFF',
    soft: '#F7FAF8',
    section: '#F3F7F5',
  },
  border: '#E2E8F0',
} as const;

export const programmeColors = {
  'adolescent-and-youth-health-and-development': {
    accent: '#0092DF',
    bg: '#E6F4FC',
    border: '#B3E0F7',
    text: '#005A8D',
  },
  'maternal-newborn-and-child-health': {
    accent: '#0092DF',
    bg: '#E6F4FC',
    border: '#B3E0F7',
    text: '#005A8D',
  },
  'gender-based-violence-prevention-and-response': {
    accent: '#86C127',
    bg: '#F3F9E9',
    border: '#D2EBB0',
    text: '#4A7512',
  },
  'peacebuilding-and-social-cohesion': {
    accent: '#86C127',
    bg: '#F3F9E9',
    border: '#D2EBB0',
    text: '#4A7512',
  },
  'community-engagement-and-social-accountability': {
    accent: '#86C127',
    bg: '#F3F9E9',
    border: '#D2EBB0',
    text: '#4A7512',
  },
  'digital-innovation-and-data-for-development': {
    accent: '#E67817',
    bg: '#FDF2E8',
    border: '#FCD8B8',
    text: '#9C4E0B',
  },
} as const;

export const thematicFocusAreas = [
  {
    id: 'public-health',
    slug: 'public-health',
    title: 'Public Health',
    accentColor: '#0092DF',
    description:
      'Strengthening primary healthcare, adolescent & maternal health, health promotion, nutrition, and disease prevention across communities.',
  },
  {
    id: 'education-and-youth',
    slug: 'education-and-youth',
    title: 'Youth Empowerment & Education',
    accentColor: '#E67817',
    description:
      'Vocational development, digital skills, leadership training, and economic empowerment initiatives for adolescent girls and youth.',
  },
  {
    id: 'good-governance',
    slug: 'good-governance',
    title: 'Civic Engagement & Accountability',
    accentColor: '#86C127',
    description:
      'Community scorecards, youth-led budget monitoring, social accountability tracking, and institutional advocacy.',
  },
  {
    id: 'peacebuilding',
    slug: 'peacebuilding',
    title: 'Peacebuilding & Social Cohesion',
    accentColor: '#86C127',
    description:
      'Fostering communal dialogue, youth mediation, early warning systems, and inter-faith conflict transformation.',
  },
  {
    id: 'climate-resilience',
    slug: 'climate-resilience',
    title: 'Climate Resilience & Health',
    accentColor: '#E67817',
    description:
      'Addressing the impact of environmental degradation on community health, food security, and rural livelihoods.',
  },
] as const;

export const flagshipInitiatives = [
  {
    id: 'skills-hub',
    title: 'e-CAPH Skills Hub',
    category: 'Economic Empowerment',
    accentColor: '#86C127',
    description:
      'High-demand digital technology, entrepreneurship, and vocational skills for women and youth economic independence.',
    location: 'Kaduna & Kano',
    isFeatured: true,
  },
  {
    id: 'gani-da-ido',
    title: 'Gani da Ido',
    category: 'Civic Accountability',
    accentColor: '#0092DF',
    description:
      'Youth-led social accountability project monitoring primary healthcare services, budgets, and public service delivery.',
    location: 'Northern Nigeria',
    isFeatured: true,
  },
] as const;

export const technicalApproaches = [
  {
    number: '01',
    title: 'Gender and Human Rights',
    description:
      'Ensuring every programme is rights-based, gender-responsive, inclusive, and strictly aligned with safeguarding principles.',
  },
  {
    number: '02',
    title: 'Community Participation',
    description:
      'Designing and implementing interventions side-by-side with communities rather than imposing solutions from above.',
  },
  {
    number: '03',
    title: 'Evidence, Research and Learning',
    description:
      'Utilizing empirical data, field research, and continuous learning to inform programme design and policy advocacy.',
  },
  {
    number: '04',
    title: 'Innovation',
    description:
      'Applying modern technology, digital tools, and creative methodologies to maximize community engagement and impact.',
  },
  {
    number: '05',
    title: 'Strategic Partnerships',
    description:
      'Collaborating with local governments, civil society, international agencies, and community leaders to scale impact sustainably.',
  },
] as const;
