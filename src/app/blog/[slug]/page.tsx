import { BlogDetailView } from '@/components/blog/blog-detail-view';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: 'welcome-to-ecaph' },
    { slug: 'community-health-initiative' },
    { slug: 'youth-empowerment-hub' },
  ];
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  return <BlogDetailView slug={slug} />;
}
