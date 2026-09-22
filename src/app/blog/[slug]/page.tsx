import { BlogDetailView } from '@/components/blog/blog-detail-view';

interface Props {
  params: Promise<{ slug: string }>;
}

import { createClient } from '@/lib/supabase/server';

export async function generateStaticParams() {
  const defaultSlugs = [
    'view',
    'welcome-to-ecaph',
    'community-health-initiative',
    'youth-empowerment-hub',
    'ecaph-launches-skills-hub-women-youth-empowerment',
    'gani-da-ido-youth-accountability-champions-primary-healthcare',
    'e-caph-strengthens-financial-governance-and-institutional-capacity-through-organizational-development-training-5193',
    'organogram-6502',
    'the-way-forward-2002',
    'staff-capacity-development-0400',
  ];

  try {
    const supabase = await createClient();
    const { data } = await supabase.from('posts').select('slug').eq('status', 'published');
    if (data && data.length > 0) {
      const dbSlugs = data.map((p) => p.slug).filter(Boolean);
      const combined = Array.from(new Set([...defaultSlugs, ...dbSlugs]));
      return combined.map((slug) => ({ slug }));
    }
  } catch {
    // Fallback if DB offline during build
  }

  return defaultSlugs.map((slug) => ({ slug }));
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  return <BlogDetailView slug={slug} />;
}
