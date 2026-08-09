export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export const siteConfig = {
  name: 'e-CAPH',
  fullName: 'Enhancing Communities Action for Peace and Better Health Initiative',
  description:
    'The Enhancing Communities Action for Peace and Better Health Initiative (e-CAPH) is a community-driven, non-profit organization dedicated to promoting peace, improving health outcomes, and advancing sustainable development among adolescents, women, young people, and underserved populations in Nigeria.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://e-caph.org',
  ogImage: '/images/og-default.jpg',
  email: 'caph4dev35@gmail.com',
  phone: '09022207412',
  address: 'Kaduna, Nigeria',

  mission:
    'To promote sustainable development by empowering women and young people to lead innovative, inclusive, and sustainable solutions that address social, economic, health, and governance challenges within their communities.',
  vision:
    'A peaceful, inclusive, and prosperous society where all individuals enjoy their fundamental rights, have equitable access to opportunities, and are empowered to thrive and reach their full potential.',

  social: {
    twitter: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    youtube: '',
  },

  nav: {
    main: [
      { label: 'Home', href: '/' },
      {
        label: 'About',
        href: '/about',
        children: [
          { label: 'Our Story', href: '/about' },
          { label: 'Meet Our Team', href: '/team' },
          { label: 'Board of Members', href: '/board' },
        ],
      },
      { label: 'Programmes', href: '/programmes' },
      { label: 'Projects', href: '/projects' },
      { label: 'Impact', href: '/impact' },
      { label: 'Blog', href: '/blog' },
      { label: 'Stories', href: '/stories' },
      { label: 'Resources & PDFs', href: '/resources' },
      { label: 'Media', href: '/media' },
      { label: 'Opportunities', href: '/opportunities' },
      { label: 'Contact', href: '/contact' },
    ] as NavItem[],
    footer: {
      programmes: [
        { label: 'Adolescent & Youth Health', href: '/programmes/adolescent-and-youth-health-and-development' },
        { label: 'Maternal & Child Health', href: '/programmes/maternal-newborn-and-child-health' },
        { label: 'GBV Prevention & Response', href: '/programmes/gender-based-violence-prevention-and-response' },
        { label: 'Peacebuilding & Social Cohesion', href: '/programmes/peacebuilding-and-social-cohesion' },
        { label: 'Community Engagement', href: '/programmes/community-engagement-and-social-accountability' },
        { label: 'Digital Innovation', href: '/programmes/digital-innovation-and-data-for-development' },
      ],
      quickLinks: [
        { label: 'About Us', href: '/about' },
        { label: 'Board of Members', href: '/board' },
        { label: 'Blog & Articles', href: '/blog' },
        { label: 'PDF Resources & Reports', href: '/resources' },
        { label: 'Our Impact', href: '/impact' },
        { label: 'Opportunities', href: '/opportunities' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Partner With Us', href: '/contact?type=partnership' },
      ],
      legal: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ],
    },
  },

  inquiryTypes: [
    'General Inquiry',
    'Partnership',
    'Programme Support',
    'Volunteering',
    'Media',
    'Careers',
  ] as const,

  opportunityTypes: [
    'Job',
    'Internship',
    'Fellowship',
    'Volunteer',
    'Grant',
    'Training',
  ] as const,

  postTypes: [
    'article',
    'news',
    'impact_story',
    'announcement',
    'press_release',
    'report',
  ] as const,

  projectStatuses: [
    'planned',
    'ongoing',
    'completed',
    'suspended',
  ] as const,
} as const;

export type InquiryType = (typeof siteConfig.inquiryTypes)[number];
export type OpportunityType = (typeof siteConfig.opportunityTypes)[number];
export type PostType = (typeof siteConfig.postTypes)[number];
export type ProjectStatus = (typeof siteConfig.projectStatuses)[number];
