'use client';

import { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import {
  Camera,
  Video,
  FileText,
  Plus,
  Trash2,
  Edit2,
  Search,
  Check,
  Upload,
  Link as LinkIcon,
  Eye,
  Filter,
  Sparkles,
} from 'lucide-react';
import type { MediaItem } from '@/types/database';

const initialDefaultMediaItems: MediaItem[] = [
  {
    id: 'media-1',
    title: 'Community Health Advocates Training Workshop in Kaduna',
    caption: 'Over 50 grassroots health champions completed our primary healthcare monitoring toolkit training.',
    media_type: 'photo',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    thumbnail_url: null,
    category: 'Community Health',
    order_index: 1,
    is_published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'media-2',
    title: 'Gani da Ido Project Launch & Youth Dialogue',
    caption: 'Official video coverage of the youth-led social accountability town hall meeting.',
    media_type: 'video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    category: 'Social Accountability',
    order_index: 2,
    is_published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'media-3',
    title: 'Press Statement: Call for Accelerated Implementation of Primary Healthcare Reforms',
    caption: 'e-CAPH issues official press statement advocating transparent budget allocation for maternal-newborn health centers.',
    media_type: 'press_release',
    url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    thumbnail_url: null,
    category: 'Policy & Advocacy',
    order_index: 3,
    is_published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    media_type: 'photo' as 'photo' | 'video' | 'press_release' | 'document',
    url: '',
    thumbnail_url: '',
    category: 'Community Health',
    is_published: true,
  });

  const fetchMedia = async () => {
    setLoading(true);
    let currentList = initialDefaultMediaItems;

    // 1. Check local storage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecaph_media_items');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            currentList = parsed;
          }
        } catch {}
      }
    }

    // 2. Query Supabase
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        currentList = data as MediaItem[];
      }
    } catch {}

    setItems(currentList);
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const persistItems = (newList: MediaItem[]) => {
    setItems(newList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecaph_media_items', JSON.stringify(newList));
      window.dispatchEvent(new Event('ecaph_media_updated'));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultUrl = reader.result as string;
        setFormData((prev) => ({ ...prev, url: resultUrl }));
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      caption: '',
      media_type: 'photo',
      url: '',
      thumbnail_url: '',
      category: 'Community Health',
      is_published: true,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: MediaItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      caption: item.caption || '',
      media_type: item.media_type,
      url: item.url,
      thumbnail_url: item.thumbnail_url || '',
      category: item.category || 'General',
      is_published: item.is_published,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url) return;

    const newItem: MediaItem = {
      id: editingId || `media-${Date.now()}`,
      title: formData.title,
      caption: formData.caption || null,
      media_type: formData.media_type,
      url: formData.url,
      thumbnail_url: formData.thumbnail_url || null,
      category: formData.category || null,
      order_index: items.length + 1,
      is_published: formData.is_published,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    let updatedList: MediaItem[];
    if (editingId) {
      updatedList = items.map((item) => (item.id === editingId ? newItem : item));
    } else {
      updatedList = [newItem, ...items];
    }

    persistItems(updatedList);

    // Save to Supabase DB (catch silently if table pending creation)
    try {
      const supabase = createClient();
      await supabase
        .from('media_items')
        .upsert(
          {
            id: newItem.id,
            title: newItem.title,
            caption: newItem.caption,
            media_type: newItem.media_type,
            url: newItem.url,
            thumbnail_url: newItem.thumbnail_url,
            category: newItem.category,
            is_published: newItem.is_published,
            published_at: newItem.published_at,
          },
          { onConflict: 'id' }
        )
        .then(() => {});
    } catch {}

    setIsFormOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this media item?')) {
      const updatedList = items.filter((item) => item.id !== id);
      persistItems(updatedList);

      try {
        const supabase = createClient();
        await supabase.from('media_items').delete().eq('id', id).then(() => {});
      } catch {}
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.caption && item.caption.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedTypeFilter === 'all' || item.media_type === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] font-sans">
      <AdminHeader title="Media Centre CMS (Photos, Videos &amp; Press Statements)" />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-[12px] bg-white border border-[#E2E8F0] brand-shadow">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search media, videos, press..."
                className="pl-9 bg-[#F8FAFC] border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {['all', 'photo', 'video', 'press_release', 'document'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-[6px] text-xs font-bold capitalize transition-all shrink-0 ${
                    selectedTypeFilter === t
                      ? 'bg-[#0092DF] text-white shadow-xs'
                      : 'bg-[#F8FAFC] text-[#64748B] hover:bg-slate-100 border border-[#E2E8F0]'
                  }`}
                >
                  {t === 'press_release' ? 'Press Statements' : t}s
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleOpenAdd}
            className="w-full md:w-auto bg-[#86C127] hover:bg-[#75A922] text-white font-bold text-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add New Media Item
          </Button>
        </div>

        {/* Modal Form Dialog */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-[16px] border border-[#E2E8F0] max-w-2xl w-full p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                <h3 className="text-xl font-extrabold text-[#0092DF]">
                  {editingId ? 'Edit Media Item' : 'Add New Media Item'}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold text-sm"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#1E293B]">Media Category / Type</label>
                    <select
                      value={formData.media_type}
                      onChange={(e: any) => setFormData({ ...formData, media_type: e.target.value })}
                      className="w-full h-10 px-3 rounded-[6px] border border-[#E2E8F0] bg-[#F8FAFC] font-semibold text-xs text-[#1E293B]"
                    >
                      <option value="photo">Photo / Image</option>
                      <option value="video">Video (YouTube / Vimeo / MP4)</option>
                      <option value="press_release">Press Release / Statement</option>
                      <option value="document">Infographic / Document</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-[#1E293B]">Topic / Category Tag</label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Public Health, Governance, Youth Hub"
                      className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#1E293B]">Title / Statement Headline *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter descriptive title for this photo, video, or statement"
                    required
                    className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#1E293B]">Caption / Description Text</label>
                  <Textarea
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    placeholder="Provide detailed description, caption, or statement text..."
                    rows={3}
                    className="bg-white border-[#E2E8F0] text-xs rounded-[6px]"
                  />
                </div>

                {/* File Upload or URL Input */}
                <div className="space-y-3 p-4 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
                  <label className="font-bold text-[#1E293B] block">Media Resource File / URL *</label>

                  {formData.media_type === 'photo' || formData.media_type === 'document' ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-[6px] bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold text-xs shadow-xs">
                          <Upload className="w-3.5 h-3.5" /> Select Local File
                          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </label>
                        <span className="text-[11px] text-[#64748B]">or paste image URL below</span>
                      </div>

                      <Input
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="https://images.unsplash.com/... or base64 Data URL"
                        required
                        className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder={
                          formData.media_type === 'video'
                            ? 'https://www.youtube.com/watch?v=... or MP4 URL'
                            : 'https://... PDF URL or statement link'
                        }
                        required
                        className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
                      />

                      {formData.media_type === 'video' && (
                        <div className="space-y-1 pt-1">
                          <label className="font-bold text-[#1E293B]">Video Cover Thumbnail Image URL (Optional)</label>
                          <Input
                            value={formData.thumbnail_url}
                            onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                            placeholder="https://images.unsplash.com/... cover photo"
                            className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {formData.url && (
                    <div className="p-3 rounded-[8px] bg-white border border-[#E2E8F0] flex items-center justify-between text-[11px]">
                      <span className="text-[#0092DF] font-semibold truncate max-w-md">{formData.url}</span>
                      <Badge variant="secondary" className="bg-[#F3F9E9] text-[#6EA71F]">
                        Resource Ready
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded border-slate-300 text-[#0092DF] focus:ring-[#0092DF] w-4 h-4"
                  />
                  <label htmlFor="is_published" className="font-bold text-[#1E293B]">
                    Publish immediately on Media Centre page
                  </label>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFormOpen(false)}
                    className="border-[#E2E8F0] text-xs font-bold"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold text-xs">
                    {editingId ? 'Save Changes' : 'Publish Media Item'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Media Grid Display */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="rounded-[12px] border border-[#E2E8F0] border-t-4 border-t-[#86C127] bg-white p-6 brand-shadow hover:brand-shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Media Preview Box */}
                  <div className="aspect-video w-full rounded-[8px] bg-[#F1F5F9] overflow-hidden border border-slate-200 relative group flex items-center justify-center">
                    {item.media_type === 'photo' || item.media_type === 'document' ? (
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                    ) : item.media_type === 'video' ? (
                      item.thumbnail_url ? (
                        <div className="relative w-full h-full">
                          <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                            <Video className="w-10 h-10 text-white drop-shadow-md" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#003D60] text-white space-y-2 flex-col">
                          <Video className="w-10 h-10 text-[#86C127]" />
                          <span className="text-[11px] font-bold">Video Resource</span>
                        </div>
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#F8FAFC] text-[#0092DF] space-y-2 flex-col p-4 text-center">
                        <FileText className="w-10 h-10 text-[#E67817]" />
                        <span className="text-[11px] font-bold text-slate-700">{item.title}</span>
                      </div>
                    )}

                    <div className="absolute top-2 right-2">
                      <Badge className="bg-[#0092DF] text-white text-[10px] uppercase font-bold shadow-xs">
                        {item.media_type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-[#E67817] uppercase tracking-wider block">
                      {item.category || 'General Media'}
                    </span>
                    <h4 className="text-base font-extrabold text-[#0092DF] leading-snug line-clamp-2">
                      {item.title}
                    </h4>
                    {item.caption && (
                      <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3 font-normal">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className={`text-[10px] font-bold ${
                      item.is_published ? 'bg-[#F3F9E9] text-[#6EA71F]' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.is_published ? 'Published' : 'Draft'}
                  </Badge>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-[6px] bg-slate-100 hover:bg-[#E6F4FC] text-[#0092DF] transition-colors"
                      title="Edit Item"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-[6px] bg-slate-100 hover:bg-rose-50 text-rose-600 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center rounded-[12px] bg-white border border-[#E2E8F0] brand-shadow space-y-4">
            <Camera className="w-12 h-12 text-[#94A3B8] mx-auto" />
            <h3 className="text-lg font-bold text-[#1E293B]">No Media Items Found</h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              Start by uploading photos, video links, or press releases using the Add New Media button above.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
