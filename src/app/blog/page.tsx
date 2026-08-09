import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { createClient } from '@/lib/supabase/server';
import { Calendar, Clock, User, ArrowRight, Search, BookOpen } from 'lucide-react';
import type { Post } from '@/types/database';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog & Insights',
  description: `Read the latest articles, research insights, and field perspectives from ${siteConfig.fullName}.`,
};

const defaultBlogPosts: Post[] = [
  {
    id: '1',
    author_id: null,
    category_id: null,
    programme_id: null,
    project_id: null,
    title: 'Transforming Community Health Through Digital Antenatal Care Tracking',
    slug: 'transforming-community-health-digital-anc-tracking',
    summary: 'How e-CAPH frontline healthcare volunteers are using mobile tracking tools to register pregnant mothers, track immunization schedules, and improve maternal survival in rural communities.',
    content: `Antenatal care (ANC) is one of the single most effective health interventions for reducing maternal and neonatal mortality...`,
    featured_image: null,
    post_type: 'article',
    status: 'published',
    published_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    author_id: null,
    category_id: null,
    programme_id: null,
    project_id: null,
    title: 'Youth Leadership & Grassroots Conflict Mediation in Northern Nigeria',
    slug: 'youth-leadership-grassroots-conflict-mediation',
    summary: 'Empowering young advocates to bridge inter-faith dialogues, resolve community disputes, and build lasting social cohesion across local government councils.',
    content: `Peace is the foundational prerequisite for health, education, and economic resilience...`,
    featured_image: null,
    post_type: 'article',
    status: 'published',
    published_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    author_id: null,
    category_id: null,
    programme_id: null,
    project_id: null,
    title: 'Advocating for Gender Inclusion & GBV Prevention Mechanisms',
    slug: 'advocating-gender-inclusion-gbv-prevention',
    summary: 'A deep dive into community survivor support systems, referral pathway networks, and grassroots advocacy for survivor-centered care.',
    content: `Gender-based violence remains a significant barrier to health, education, and human development...`,
    featured_image: null,
    post_type: 'article',
    status: 'published',
    published_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default async function BlogPage() {
  let dbPosts: Post[] | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    dbPosts = data as Post[] | null;
  } catch {
    // Fallback
  }

  const posts = dbPosts && dbPosts.length > 0 ? dbPosts : defaultBlogPosts;
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B] font-sans">
      <Header />

      <PageBanner
        title="Blog &amp; Insights"
        subtitle="In-depth analysis, field stories, research reports, and commentary from the e-CAPH team."
      />

      <section className="py-16 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Featured Article Hero */}
          {featuredPost && (
            <div className="rounded-[12px] border border-[#E2E8F0] border-t-4 border-t-[#86C127] bg-[#F8FAFC] p-8 sm:p-12 brand-shadow space-y-6">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-[#86C127] text-white font-bold uppercase text-[10px]">
                  Featured Insight
                </Badge>
                <span className="text-xs text-[#64748B] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#E67817]" />
                  {featuredPost.published_at
                    ? new Date(featuredPost.published_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Recent'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0092DF] leading-tight">
                <Link href={`/blog/${featuredPost.slug}`} className="hover:text-[#007DC2] transition-colors">
                  {featuredPost.title}
                </Link>
              </h2>

              <p className="text-[#64748B] text-base leading-relaxed max-w-4xl">
                {featuredPost.summary}
              </p>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1E293B]">
                  <User className="w-4 h-4 text-[#86C127]" />
                  <span>e-CAPH Research &amp; Advocacy Team</span>
                </div>

                <Link href={`/blog/${featuredPost.slug}`}>
                  <Button className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold group">
                    Read Full Article <ArrowRight className="ml-2 w-4 h-4 text-[#E67817] group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Remaining Blog Grid */}
          <div className="space-y-6">
            <h3 className="text-2xl font-extrabold text-[#0092DF]">Recent Publications &amp; Articles</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(remainingPosts.length > 0 ? remainingPosts : defaultBlogPosts).map((post) => (
                <article
                  key={post.id}
                  className="rounded-[10px] border border-[#E2E8F0] border-t-4 border-t-[#86C127] bg-white p-6 brand-shadow hover:brand-shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#64748B]">
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold bg-[#F3F9E9] text-[#6EA71F]">
                        {post.post_type.replace('_', ' ')}
                      </Badge>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-[#E67817]" />
                        5 min read
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-[#0092DF] leading-snug hover:text-[#007DC2] transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h4>

                    <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed">{post.summary}</p>
                  </div>

                  <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                    <span className="text-[#94A3B8] font-semibold">
                      {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Recent'}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-[#E67817] font-bold hover:underline inline-flex items-center group/link"
                    >
                      Read Story <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
