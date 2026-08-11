'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PDFViewerModal } from '@/components/common/pdf-viewer-modal';
import { siteConfig } from '@/config/site';
import { createClient } from '@/lib/supabase/client';
import { FileText, Download, Eye, Search, Filter, BookOpen } from 'lucide-react';
import type { DownloadResource } from '@/types/database';

const categories = ['All Categories', 'Annual Report', 'Policy Brief', 'Research Paper', 'Tool/Guide'];

export default function ResourcesPage() {
  const [resources, setResources] = useState<DownloadResource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedResourceForView, setSelectedResourceForView] = useState<DownloadResource | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const fetchResources = async () => {
    let currentList: DownloadResource[] = [];

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecaph_download_resources');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            currentList = parsed.filter((r: DownloadResource) => r.is_published !== false);
          }
        } catch {}
      }
    }

    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('download_resources')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        currentList = data as DownloadResource[];
      }
    } catch {}

    setResources(currentList);
  };

  useEffect(() => {
    fetchResources();

    const handleSync = () => fetchResources();
    window.addEventListener('storage', handleSync);
    window.addEventListener('ecaph_resources_updated', handleSync);

    const interval = setInterval(fetchResources, 10000);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('ecaph_resources_updated', handleSync);
      clearInterval(interval);
    };
  }, []);

  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.description && res.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'All Categories' || res.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenViewer = (res: DownloadResource) => {
    setSelectedResourceForView(res);
    setIsViewerOpen(true);
  };

  const handleDownload = (res: DownloadResource) => {
    // Increment download count locally & in DB
    setResources((prev) =>
      prev.map((r) => (r.id === res.id ? { ...r, downloads_count: r.downloads_count + 1 } : r))
    );
    try {
      const supabase = createClient();
      supabase
        .from('download_resources')
        .update({ downloads_count: res.downloads_count + 1 })
        .eq('id', res.id);
    } catch {}
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B] font-sans">
      <Header />

      <PageBanner
        title="Resource &amp; Publications Hub"
        subtitle="Download official policy briefs, annual reports, research toolkits, and publications published by e-CAPH."
      />

      <section className="py-16 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Search & Category Filter */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] brand-shadow">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PDF documents &amp; reports..."
                className="pl-9 bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-[#64748B] flex items-center gap-1 mr-2">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#0092DF] text-white shadow-xs'
                      : 'bg-white text-[#64748B] hover:bg-slate-100 border border-[#E2E8F0]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Resources Grid */}
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredResources.map((res) => (
                <div
                  key={res.id}
                  className="rounded-[12px] border border-[#E2E8F0] border-t-4 border-t-[#86C127] bg-white p-6 brand-shadow hover:brand-shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold bg-[#F3F9E9] text-[#6EA71F]">
                        {res.category}
                      </Badge>
                      <span className="text-xs text-[#94A3B8] font-medium">
                        {res.file_size || 'PDF Document'} • {res.downloads_count} Downloads
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#0092DF] leading-snug">
                      {res.title}
                    </h3>

                    {res.description && (
                      <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3">
                        {res.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenViewer(res)}
                      className="text-xs font-bold text-[#0092DF] border-[#0092DF] hover:bg-[#0092DF] hover:text-white transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1.5 text-[#86C127]" /> View PDF Online
                    </Button>

                    <a
                      href={res.file_url}
                      download
                      onClick={() => handleDownload(res)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" className="bg-[#E67817] hover:bg-[#d56d13] text-white font-bold text-xs shadow-xs">
                        <Download className="w-4 h-4 mr-1.5" /> Download PDF
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-3 bg-[#F8FAFC] rounded-[12px] border border-[#E2E8F0]">
              <BookOpen className="w-12 h-12 text-[#94A3B8] mx-auto" />
              <h3 className="text-lg font-bold text-[#1E293B]">No PDF Resources Found</h3>
              <p className="text-xs text-[#64748B]">Try searching with a different keyword or category filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* PDF Viewer Modal */}
      <PDFViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        resource={selectedResourceForView}
      />

      <Footer />
    </div>
  );
}
