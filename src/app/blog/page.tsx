'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { Calendar, Clock, ArrowRight, BookOpen, Image as ImageIcon } from 'lucide-react';
import type { Post } from '@/types/database';

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    let currentList: Post[] = [];

    // 1. Read from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecaph_posts');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            currentList = parsed.filter((p: Post) => p.status !== 'draft');
          }
        } catch {}
      }
    }

    // 2. Query Supabase Client
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (!error && data && data.length > 0) {
        currentList = data as Post[];
      }
    } catch {}

    setPosts(currentList);
  };

  useEffect(() => {
    fetchPosts();

    const handleSync = () => fetchPosts();
    window.addEventListener('storage', handleSync);
    window.addEventListener('ecaph_posts_updated', handleSync);

    const interval = setInterval(fetchPosts, 10000);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('ecaph_posts_updated', handleSync);
      clearInterval(interval);
    };
  }, []);

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
          {posts.length === 0 ? (
            <div className="p-16 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] text-center space-y-4 max-w-xl mx-auto">
              <BookOpen className="w-12 h-12 text-[#0092DF] mx-auto opacity-60" />
              <h3 className="text-xl font-bold text-[#0092DF]">No Publications Yet</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Check back soon or publish new articles from the Admin Dashboard!
              </p>
            </div>
          ) : (
            <>
              {/* Featured Article Hero */}
              {featuredPost && (
                <div className="rounded-[12px] border border-[#E2E8F0] border-t-4 border-t-[#86C127] bg-[#F8FAFC] p-8 sm:p-12 brand-shadow space-y-6">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-[#86C127] text-white font-bold uppercase text-[10px]">
                      Featured Insight
                    </Badge>
                    <span className="text-xs text-[#64748B] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#E67817]" />
                      {new Date(featuredPost.published_at || featuredPost.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Featured Image */}
                    {featuredPost.featured_image && (
                      <div className="lg:col-span-5 aspect-video rounded-[10px] bg-[#E2E8F0] overflow-hidden border border-slate-200 shadow-sm">
                        <img
                          src={featuredPost.featured_image}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className={featuredPost.featured_image ? 'lg:col-span-7 space-y-4' : 'lg:col-span-12 space-y-4'}>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0092DF] hover:text-[#007DC2] transition-colors leading-tight">
                        <Link href={`/blog/${featuredPost.slug}`}>
                          {featuredPost.title}
                        </Link>
                      </h2>

                      <p className="text-sm text-[#64748B] leading-relaxed">
                        {featuredPost.summary}
                      </p>

                      <Link href={`/blog/${featuredPost.slug}`} className="inline-block pt-2">
                        <Button className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold group">
                          Read Full Article <ArrowRight className="ml-2 w-4 h-4 text-[#E67817] group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Remaining Blog Grid */}
              {remainingPosts.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-extrabold text-[#0092DF]">Recent Publications &amp; Articles</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {remainingPosts.map((post) => (
                      <article
                        key={post.id}
                        className="rounded-[10px] border border-[#E2E8F0] border-t-4 border-t-[#86C127] bg-white p-6 brand-shadow hover:brand-shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4"
                      >
                        {post.featured_image && (
                          <div className="aspect-video w-full rounded-[8px] bg-[#E2E8F0] overflow-hidden border border-slate-200">
                            <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
                          </div>
                        )}

                        <div className="space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-[#64748B]">
                              <Badge variant="secondary" className="text-[10px] uppercase font-bold bg-[#F3F9E9] text-[#6EA71F]">
                                {post.post_type?.replace('_', ' ') || 'article'}
                              </Badge>
                              <span className="flex items-center gap-1 text-[11px]">
                                <Clock className="w-3 h-3 text-[#E67817]" />
                                5 min read
                              </span>
                            </div>

                            <h4 className="text-lg font-bold text-[#0092DF] hover:text-[#007DC2] transition-colors leading-snug line-clamp-2">
                              <Link href={`/blog/${post.slug}`}>
                                {post.title}
                              </Link>
                            </h4>

                            <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3">
                              {post.summary}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                            <span className="text-[11px] text-[#94A3B8]">
                              {new Date(post.published_at || post.created_at).toLocaleDateString()}
                            </span>
                            <Link href={`/blog/${post.slug}`} className="text-xs font-bold text-[#E67817] hover:underline flex items-center gap-1">
                              Read More <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
