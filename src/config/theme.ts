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
    accent: '#0092DF', // Blue (Public Health)
    bg: '#E6F4FC',
    border: '#B3E0F7',
    text: '#005A8D',
  },
  'maternal-newborn-and-child-health': {
    accent: '#0092DF', // Blue (Public Health)
    bg: '#E6F4FC',
    border: '#B3E0F7',
    text: '#005A8D',
  },
  'gender-based-violence-prevention-and-response': {
    accent: '#86C127', // Green
    bg: '#F3F9E9',
    border: '#D2EBB0',
    text: '#4A7512',
  },
  'peacebuilding-and-social-cohesion': {
    accent: '#86C127', // Green (Peacebuilding)
    bg: '#F3F9E9',
    border: '#D2EBB0',
    text: '#4A7512',
  },
  'community-engagement-and-social-accountability': {
    accent: '#0092DF', // Blue (Governance)
    bg: '#E6F4FC',
    border: '#B3E0F7',
    text: '#005A8D',
  },
  'digital-innovation-and-data-for-development': {
    accent: '#E67817', // Orange (Education/Tech)
    bg: '#FDF2E8',
    border: '#F9D4B5',
    text: '#9C4E0B',
  },
} as const;

export type ProgrammeSlug = keyof typeof programmeColors;

export const thematicFocusAreas = [
  {
    slug: 'public-health',
    title: 'Public Health',
    accentColor: '#0092DF', // Blue
    description:
      'Strengthening primary healthcare, adolescent & maternal health, health promotion, nutrition, and disease prevention across communities.',
  },
  {
    slug: 'education-and-youth',
    title: 'Education & Youth Development',
    accentColor: '#E67817', // Orange
    description:
      'Advancing quality education, life skills, leadership training, digital literacy, and youth empowerment initiatives.',
  },
  {
    slug: 'climate-resilience',
    title: 'Climate Action & Environmental Resilience',
    accentColor: '#86C127', // Green
    description:
      'Supporting climate adaptation, environmental sustainability, emergency preparedness, and community resilience.',
  },
  {
    slug: 'good-governance',
    title: 'Good Governance & Accountability',
    accentColor: '#0092DF', // Blue
    description:
      'Promoting civic transparency, citizen participation, policy advocacy, and accountable public institutions.',
  },
  {
    slug: 'peacebuilding',
    title: 'Peacebuilding & Social Cohesion',
    accentColor: '#86C127', // Green
    description:
      'Building peaceful, inclusive, and conflict-resilient communities through local dialogue, mediation, and social cohesion.',
  },
] as const;

export const flagshipInitiatives = [
  {
    id: 'nextgen-fellowship',
    title: 'NextGeneration: Adolescent Health Fellowship',
    category: 'Public Health & Youth',
    accentColor: '#0092DF',
    description:
      'Empowering young healthcare advocates and researchers through structured mentorship, leadership training, and field implementation.',
    location: 'Kaduna & Kano States',
    isFeatured: true,
  },
  {
    id: 'lafiyar-iyali',
    title: 'Lafiyar Iyali Project',
    category: 'Maternal & Child Health',
    accentColor: '#86C127',
    description:
      'Grassroots maternal and child health intervention improving rural healthcare access and maternal nutrition knowledge.',
    location: 'North-West Nigeria',
    isFeatured: false,
  },
  {
    id: 'adolescent-health-lab',
    title: 'e-CAPH Adolescent Health Lab',
    category: 'Research & Innovation',
    accentColor: '#0092DF',
    description:
      'Youth-led research initiative generating localized data and evidence on adolescent reproductive health and wellbeing.',
    location: 'Kaduna, Nigeria',
    isFeatured: false,
  },
  {
    id: 'skills-hub',
    title: 'e-CAPH Skills Hub',
    category: 'Youth Empowerment',
    accentColor: '#E67817',
    description:
      'Digital skills, vocational training, and economic empowerment incubator for vulnerable young women and youth.',
    location: 'Kaduna State',
    isFeatured: false,
  },
  {
    id: 'gani-da-ido',
    title: 'Gani da Ido',
    category: 'Civic Accountability',
    accentColor: '#86C127',
    description:
      'Community monitoring and social accountability project tracking primary healthcare service delivery at the grassroots level.',
    location: 'Northern Nigeria',
    isFeatured: false,
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
