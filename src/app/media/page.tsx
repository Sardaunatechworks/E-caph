'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { Camera, Play, ExternalLink, Calendar, FileText } from 'lucide-react';
import type { MediaItem } from '@/types/database';

export default function MediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedMediaPreview, setSelectedMediaPreview] = useState<MediaItem | null>(null);

  const fetchMedia = async () => {
    let currentList: MediaItem[] = [];

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecaph_media_items');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            currentList = parsed.filter((m: MediaItem) => m.is_published !== false);
          }
        } catch {}
      }
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        currentList = data as MediaItem[];
      }
    } catch {}

    setMediaItems(currentList);
  };

  useEffect(() => {
    fetchMedia();

    const handleSync = () => fetchMedia();
    window.addEventListener('storage', handleSync);
    window.addEventListener('ecaph_media_updated', handleSync);

    const interval = setInterval(fetchMedia, 10000);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('ecaph_media_updated', handleSync);
      clearInterval(interval);
    };
  }, []);

  const filteredItems = mediaItems.filter(
    (item) => selectedFilter === 'all' || item.media_type === selectedFilter
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B] font-sans">
      <Header />

      <PageBanner
        title="Media &amp; Gallery Centre"
        subtitle="Photographs, videos, press statements, and multimedia documentation from e-CAPH community outreach across Nigeria."
      />

      <section className="py-16 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-2 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] max-w-xl mx-auto brand-shadow">
            {[
              { id: 'all', label: 'All Media' },
              { id: 'photo', label: 'Photos' },
              { id: 'video', label: 'Videos' },
              { id: 'press_release', label: 'Press Statements' },
              { id: 'document', label: 'Infographics' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-4 py-2 rounded-[8px] text-xs font-bold transition-all ${
                  selectedFilter === f.id
                    ? 'bg-[#0092DF] text-white shadow-xs'
                    : 'bg-transparent text-[#64748B] hover:text-[#0092DF]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Media Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="rounded-[16px] border border-[#E2E8F0] border-t-4 border-t-[#86C127] bg-[#F8FAFC] p-6 brand-shadow hover:brand-shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-4">
                  {/* Media Thumbnail Container */}
                  <div
                    onClick={() => setSelectedMediaPreview(item)}
                    className="aspect-video w-full rounded-[10px] bg-[#E2E8F0] overflow-hidden border border-slate-200 relative cursor-pointer group/img flex items-center justify-center shadow-xs"
                  >
                    {item.media_type === 'photo' || item.media_type === 'document' ? (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : item.media_type === 'video' ? (
                      <div className="relative w-full h-full">
                        <img
                          src={
                            item.thumbnail_url ||
                            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
                          }
                          alt={item.title}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-[#0092DF] text-white flex items-center justify-center shadow-lg group-hover/img:scale-110 transition-transform">
                            <Play className="w-6 h-6 fill-current ml-1" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white text-[#0092DF] p-6 text-center space-y-2 flex-col">
                        <FileText className="w-12 h-12 text-[#E67817]" />
                        <span className="text-xs font-extrabold text-[#0092DF]">Press Release Statement</span>
                      </div>
                    )}

                    <div className="absolute top-3 right-3">
                      <Badge className="bg-[#0092DF] text-white text-[10px] font-bold uppercase shadow-xs">
                        {item.media_type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#64748B]">
                      <span className="font-bold text-[#E67817] uppercase tracking-wider">
                        {item.category || 'e-CAPH Media'}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#0092DF]" />
                        {new Date(item.published_at || item.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3
                      onClick={() => setSelectedMediaPreview(item)}
                      className="text-lg font-extrabold text-[#0092DF] leading-snug group-hover:text-[#007DC2] transition-colors cursor-pointer"
                    >
                      {item.title}
                    </h3>

                    {item.caption && (
                      <p className="text-xs text-[#475569] leading-relaxed line-clamp-3">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                  <Button
                    onClick={() => setSelectedMediaPreview(item)}
                    variant="outline"
                    size="sm"
                    className="text-xs font-bold text-[#0092DF] border-[#E2E8F0] hover:bg-[#E6F4FC]"
                  >
                    {item.media_type === 'video'
                      ? 'Watch Video'
                      : item.media_type === 'press_release'
                      ? 'Read Statement'
                      : 'View Full Photo'}
                  </Button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#0092DF] p-1 transition-colors"
                    title="Open Resource URL"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Preview Dialog */}
      {selectedMediaPreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] border border-[#E2E8F0] max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <Badge className="bg-[#86C127] text-white font-bold uppercase text-[10px]">
                {selectedMediaPreview.media_type.replace('_', ' ')}
              </Badge>
              <button
                onClick={() => setSelectedMediaPreview(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-extrabold text-[#0092DF]">{selectedMediaPreview.title}</h3>

              {selectedMediaPreview.media_type === 'photo' || selectedMediaPreview.media_type === 'document' ? (
                <div className="w-full rounded-[12px] overflow-hidden border border-slate-200 max-h-[450px]">
                  <img src={selectedMediaPreview.url} alt={selectedMediaPreview.title} className="w-full h-full object-contain bg-slate-100" />
                </div>
              ) : selectedMediaPreview.media_type === 'video' ? (
                <div className="aspect-video w-full rounded-[12px] bg-slate-900 flex items-center justify-center text-white">
                  <a
                    href={selectedMediaPreview.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold text-sm shadow-lg"
                  >
                    <Play className="w-5 h-5 fill-current" /> Open Video in New Tab
                  </a>
                </div>
              ) : (
                <div className="p-6 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
                  <p className="text-sm text-[#334155] leading-relaxed whitespace-pre-line">
                    {selectedMediaPreview.caption || selectedMediaPreview.title}
                  </p>
                  <a
                    href={selectedMediaPreview.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#0092DF] hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" /> Download Official Press Statement PDF
                  </a>
                </div>
              )}

              {selectedMediaPreview.caption && selectedMediaPreview.media_type !== 'press_release' && (
                <p className="text-sm text-[#334155] leading-relaxed font-normal pt-2">
                  {selectedMediaPreview.caption}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] flex justify-end">
              <Button onClick={() => setSelectedMediaPreview(null)} className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold text-xs">
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
