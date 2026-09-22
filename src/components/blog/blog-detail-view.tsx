'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import {
  Calendar,
  Clock,
  ArrowLeft,
  BookOpen,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2
} from 'lucide-react';
import type { Post } from '@/types/database';

interface BlogDetailViewProps {
  slug?: string;
}

export function BlogDetailView({ slug: propSlug }: BlogDetailViewProps) {
  const [slug, setSlug] = useState<string>(propSlug || '');
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  // Lightbox Modal State for Multi-Image Gallery
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Dynamic slug resolution from URL if prop is missing or generic 'view'
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const querySlug = searchParams.get('slug');

      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      // If pathname is /blog/<custom-slug> or /stories/<custom-slug>
      let pathSlug = '';
      if (pathSegments.length >= 2 && pathSegments[0] === 'blog' && pathSegments[1] !== 'view') {
        pathSlug = pathSegments[1];
      }

      const resolved = querySlug || (pathSlug && pathSlug !== 'view' ? pathSlug : propSlug) || '';
      if (resolved && resolved !== slug) {
        setSlug(resolved);
      } else if (!resolved && propSlug) {
        setSlug(propSlug);
      }
    }
  }, [propSlug]);

  useEffect(() => {
    if (!slug || slug === 'view') {
      setLoading(false);
      return;
    }

    async function loadPost() {
      setLoading(true);
      let foundPost: Post | null = null;

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (data && !error) {
          foundPost = data as Post;
        }
      } catch (err) {
        console.warn('Database query notice:', err);
      }

      // Check localStorage if not found in database or offline
      if (!foundPost && typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('ecaph_posts');
          if (saved) {
            const list: Post[] = JSON.parse(saved);
            foundPost = list.find((p) => p.slug === slug) || null;
          }
        } catch {}
      }

      setPost(foundPost);
      setLoading(false);
    }

    loadPost();
  }, [slug]);

  // Extract gallery images and clean text content
  const extractImagesAndContent = () => {
    if (!post) return { galleryImages: [], cleanContent: '' };

    let imagesList: string[] = [];
    let rawContent = post.content || '';

    // 1. Check if post has first-class images array
    if (Array.isArray(post.images) && post.images.length > 0) {
      imagesList = [...post.images];
    }

    // 2. Check for embedded metadata tag <!--ECAPH_GALLERY:[...]-->
    if (rawContent.includes('<!--ECAPH_GALLERY:')) {
      try {
        const match = rawContent.match(/<!--ECAPH_GALLERY:(.*?)-->/);
        if (match && match[1]) {
          const parsed = JSON.parse(match[1]);
          if (Array.isArray(parsed)) {
            imagesList = Array.from(new Set([...imagesList, ...parsed]));
          }
        }
      } catch {}
      // Remove tag from displayed content
      rawContent = rawContent.replace(/<!--ECAPH_GALLERY:.*?-->/g, '').trim();
    }

    // Include featured_image if not already present
    if (post.featured_image && !imagesList.includes(post.featured_image)) {
      imagesList = [post.featured_image, ...imagesList];
    }

    // Dedup and filter empty strings
    imagesList = Array.from(new Set(imagesList.filter(Boolean)));

    return {
      galleryImages: imagesList,
      cleanContent: rawContent || post.summary || '',
    };
  };

  const { galleryImages, cleanContent } = extractImagesAndContent();

  const openLightbox = (index: number) => {
    setActiveImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, galleryImages.length]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B]">
        <Header />
        <div className="py-36 text-center text-[#64748B] font-semibold text-sm flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#0092DF] border-t-transparent rounded-full animate-spin"></div>
          <p>Loading publication &amp; story details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B]">
        <Header />
        <PageBanner
          title="Article Not Found"
          subtitle="The requested publication or story could not be located."
        />
        <div className="py-20 text-center space-y-4 max-w-md mx-auto px-4">
          <BookOpen className="w-12 h-12 text-[#94A3B8] mx-auto" />
          <h3 className="text-lg font-bold text-[#1E293B]">No Article Available</h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            This article may have been unpublished, moved, or is still being drafted in the Admin CMS.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link href="/blog" prefetch={false}>
              <Button className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold text-xs">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog Portal
              </Button>
            </Link>
            <Link href="/stories" prefetch={false}>
              <Button variant="outline" className="border-[#0092DF] text-[#0092DF] font-bold text-xs">
                View Field Stories
              </Button>
            </Link>
          </div>
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
        breadcrumb={[
          { label: 'Blog & Stories', href: '/blog' },
          { label: post.title.slice(0, 30) + '...', href: '#' }
        ]}
      />

      <article className="py-16 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-[#86C127] text-white font-bold uppercase text-[10px] tracking-wider">
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
              {galleryImages.length > 1 && (
                <Badge variant="secondary" className="bg-[#E6F4FC] text-[#0092DF] font-bold text-[10px] flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  {galleryImages.length} Pictures
                </Badge>
              )}
            </div>

            <Link href="/blog" prefetch={false}>
              <Button variant="outline" size="sm" className="text-xs border-[#E2E8F0] font-bold text-[#0092DF] hover:bg-[#F7FAF8]">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> All Articles
              </Button>
            </Link>
          </div>

          {/* Primary Featured Cover Image */}
          {post.featured_image && (
            <div
              onClick={() => openLightbox(0)}
              className="relative aspect-video w-full rounded-[12px] bg-[#E2E8F0] overflow-hidden border border-slate-200 shadow-md group cursor-pointer"
            >
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white/90 backdrop-blur-xs text-[#1E293B] text-xs font-bold px-3 py-1.5 rounded-[6px] shadow-sm flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-[#0092DF]" /> Expand Photo
                </span>
              </div>
            </div>
          )}

          {/* Body Content */}
          <div className="prose max-w-none text-slate-800 leading-relaxed space-y-6 pt-2">
            {cleanContent ? (
              cleanContent.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-base leading-relaxed text-[#334155]">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-base leading-relaxed text-[#334155]">{post.summary}</p>
            )}
          </div>

          {/* Multi-Image Gallery Section */}
          {galleryImages.length > 1 && (
            <div className="pt-8 border-t border-[#E2E8F0] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#0092DF] flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#86C127]" />
                    Story &amp; Field Photo Gallery
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Click any picture below to view full-resolution photography from this publication.
                  </p>
                </div>
                <Badge className="bg-[#86C127] text-white text-[11px] font-bold">
                  {galleryImages.length} Photos
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
                {galleryImages.map((imgUrl, index) => (
                  <div
                    key={index}
                    onClick={() => openLightbox(index)}
                    className="relative aspect-square rounded-[8px] overflow-hidden border border-slate-200 bg-slate-100 group cursor-pointer shadow-xs hover:shadow-md transition-all"
                  >
                    <img
                      src={imgUrl}
                      alt={`${post.title} photo ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Maximize2 className="w-5 h-5 text-white drop-shadow-md" />
                    </div>
                    <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Editorial Attribution Footer */}
          <div className="pt-8 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0092DF] text-white flex items-center justify-center font-black text-sm shadow-sm">
                eC
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0092DF]">e-CAPH Editorial &amp; Field Team</h4>
                <p className="text-[11px] text-[#64748B]">
                  Enhancing Communities Action for Peace &amp; Better Health Initiative
                </p>
              </div>
            </div>

            <Link href="/blog" prefetch={false}>
              <Button variant="outline" size="sm" className="text-xs border-[#0092DF] text-[#0092DF] font-bold hover:bg-[#0092DF] hover:text-white transition-colors">
                Browse More Publications
              </Button>
            </Link>
          </div>
        </div>
      </article>

      {/* Lightbox Modal for Multi-Image Gallery */}
      {lightboxOpen && galleryImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-[#86C127] p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Button */}
          {galleryImages.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-[#86C127] p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Current Image */}
          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center justify-center space-y-3">
            <img
              src={galleryImages[activeImageIndex]}
              alt={`Photo ${activeImageIndex + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded-[8px] shadow-2xl"
            />
            <div className="text-center text-white text-xs font-semibold bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-xs">
              Photo {activeImageIndex + 1} of {galleryImages.length}
            </div>
          </div>

          {/* Next Button */}
          {galleryImages.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#86C127] p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
              aria-label="Next Image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}
