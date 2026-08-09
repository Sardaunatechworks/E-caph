'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { Calendar, Clock, ArrowLeft, BookOpen, User } from 'lucide-react';
import type { Post } from '@/types/database';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function BlogDetailPage({ params }: Props) {
  const { slug } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      let foundPost: Post | null = null;

      // 1. Check local storage
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('ecaph_posts');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              foundPost = parsed.find((p: Post) => p.slug === slug || p.id === slug) || null;
            }
          } catch {}
        }
      }

      // 2. Check Supabase
      if (!foundPost) {
        try {
          const supabase = createClient();
          const { data } = await supabase.from('posts').select('*').eq('slug', slug).single();
          if (data) {
            foundPost = data as Post;
          }
        } catch {}
      }

      setPost(foundPost);
      setLoading(false);
    }

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B]">
        <Header />
        <div className="py-32 text-center text-[#64748B] font-semibold text-sm">
          Loading article...
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B]">
        <Header />
        <PageBanner title="Article Not Found" subtitle="The requested blog post could not be located." />
        <div className="py-20 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-[#94A3B8] mx-auto" />
          <p className="text-sm text-[#64748B]">This article may have been unpublished or removed.</p>
          <Link href="/blog">
            <Button className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog Portal
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B] font-sans">
      <Header />

      <PageBanner
        title={post.title}
        subtitle={post.summary || 'e-CAPH Publication & Field Insight'}
        breadcrumb={[{ label: 'Blog', href: '/blog' }]}
      />

      <article className="py-16 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Article Header Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-3">
              <Badge className="bg-[#86C127] text-white font-bold uppercase text-[10px]">
                {post.post_type?.replace('_', ' ') || 'article'}
              </Badge>
              <span className="text-xs text-[#64748B] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#E67817]" />
                {new Date(post.published_at || post.created_at).toLocaleDateString()}
              </span>
              <span className="text-xs text-[#64748B] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#0092DF]" />
                5 min read
              </span>
            </div>

            <Link href="/blog">
              <Button variant="outline" size="sm" className="text-xs border-[#E2E8F0] font-bold text-[#0092DF]">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> All Articles
              </Button>
            </Link>
          </div>

          {/* Featured Cover Image */}
          {post.featured_image && (
            <div className="aspect-video w-full rounded-[12px] bg-[#E2E8F0] overflow-hidden border border-slate-200 shadow-md">
              <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Article Content */}
          <div className="prose max-w-none text-slate-800 leading-relaxed space-y-6 pt-2">
            {post.content ? (
              post.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-base leading-relaxed text-[#334155]">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-base leading-relaxed text-[#334155]">{post.summary}</p>
            )}
          </div>

          {/* Author / Organization Footer */}
          <div className="pt-8 border-t border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0092DF] text-white flex items-center justify-center font-black text-sm shadow-sm">
                eC
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0092DF]">e-CAPH Editorial Team</h4>
                <p className="text-[11px] text-[#64748B]">Enhancing Communities Action for Peace &amp; Better Health Initiative</p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
