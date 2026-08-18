import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/config/site';
import { createClient } from '@/lib/supabase/server';
import { Calendar, BookOpen, ArrowRight } from 'lucide-react';
import { officialPosts } from '@/config/theme';
import type { Post } from '@/types/database';

export const metadata: Metadata = {
  title: 'Stories & Publications',
  description: `Field updates, reports, research publications, and news from ${siteConfig.name}.`,
};

export default async function StoriesPage() {
  let posts: Post[] = officialPosts;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (data && data.length > 0) {
      posts = data as Post[];
    }
  } catch {}

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B] font-sans">
      <Header />

      <PageBanner
        title="Stories &amp; Publications"
        subtitle="Field updates, impact stories, policy briefs, and research reports documenting e-CAPH interventions across Nigeria."
      />

      <section className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-[12px] border border-[#E2E8F0] border-t-4 border-t-[#86C127] bg-[#F8FAFC] p-6 brand-shadow hover:brand-shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {post.featured_image && (
                    <div className="aspect-video w-full rounded-[8px] bg-[#E2E8F0] overflow-hidden border border-slate-200 shadow-xs mb-2">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-[#64748B]">
                    <Badge variant="secondary" className="text-[11px] uppercase bg-[#E6F4FC] text-[#0092DF] font-bold">
                      {post.post_type ? post.post_type.replace('_', ' ') : 'Update'}
                    </Badge>
                    {post.published_at && (
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#0092DF]" />
                        {new Date(post.published_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-extrabold text-[#0092DF] leading-snug group-hover:text-[#007DC2] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed">{post.summary}</p>
                </div>

                <a
                  href={`/blog/${post.slug}`}
                  className="text-xs font-bold text-[#E67817] hover:underline inline-flex items-center group/link pt-2 border-t border-[#E2E8F0]"
                >
                  Read Article <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform duration-200 group-hover/link:translate-x-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
