'use client';

import { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { DataTable, type Column } from '@/components/admin/data-table';
import { ModalForm } from '@/components/admin/modal-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { siteConfig } from '@/config/site';
import { slugify } from '@/lib/utilities';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ProgrammeRecord {
  id: string;
  title: string;
  slug: string;
  description: string;
  featured_image?: string | null;
  is_published: boolean;
  order_index: number;
}

export default function AdminProgrammesPage() {
  const [data, setData] = useState<ProgrammeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<ProgrammeRecord | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    featured_image: null as string | null,
    is_published: true,
  });

  const fetchProgrammes = async () => {
    setLoading(true);
    let cached: ProgrammeRecord[] = [];
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecaph_programmes');
      if (saved) {
        try {
          cached = JSON.parse(saved);
        } catch {}
      }
    }

    try {
      const supabase = createClient();
      const { data: dbData, error } = await supabase
        .from('programmes')
        .select('*')
        .order('order_index', { ascending: true });

      if (error || !dbData || dbData.length === 0) {
        if (cached.length > 0) {
          setData(cached);
        } else {
          // Fallback to siteConfig default programmes
          setData(
            siteConfig.nav.footer.programmes.map((p, idx) => ({
              id: String(idx + 1),
              title: p.label,
              slug: p.href.replace('/programmes/', '').replace(/\/$/, ''),
              description:
                'Community-centered thematic intervention pillar operating across northern Nigeria.',
              featured_image: null,
              is_published: true,
              order_index: idx + 1,
            }))
          );
        }
      } else {
        setData(dbData as ProgrammeRecord[]);
      }
    } catch {
      if (cached.length > 0) {
        setData(cached);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammes();
  }, []);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP, or GIF).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB. Please choose a smaller file.');
      return;
    }

    setUploadingImage(true);
    setUploadError(null);

    try {
      // 1. Read file as Base64 for instant preview & offline fallback
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Url = event.target?.result as string;
        setFormData((prev) => ({ ...prev, featured_image: base64Url }));

        // 2. Upload to Supabase Storage bucket 'media'
        try {
          const supabase = createClient();
          const fileExt = file.name.split('.').pop() || 'jpg';
          const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
          const fileName = `programme_${Date.now()}_${cleanName}.${fileExt}`;
          const filePath = `programmes/covers/${fileName}`;

          const { error: uploadErr } = await supabase.storage
            .from('media')
            .upload(filePath, file, { upsert: true });

          if (!uploadErr) {
            const { data: publicUrlData } = supabase.storage
              .from('media')
              .getPublicUrl(filePath);

            if (publicUrlData?.publicUrl) {
              setFormData((prev) => ({ ...prev, featured_image: publicUrlData.publicUrl }));
            }
          }
        } catch (storageErr) {
          console.warn('Storage upload fallback to base64 data url:', storageErr);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setUploadError(err?.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const columns: Column<ProgrammeRecord>[] = [
    {
      header: 'Programme Title',
      accessorKey: 'title',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[8px] bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center relative shadow-xs">
            {row.featured_image ? (
              <img
                src={row.featured_image}
                alt={row.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div>
            <div className="font-bold text-[#0092DF]">{row.title}</div>
            <div className="text-[10px] text-[#64748B]">/programmes/{row.slug}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: (row) => (
        <span className="text-xs text-[#64748B] line-clamp-1 max-w-md block">
          {row.description}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'is_published',
      cell: (row) => (
        <Badge variant={row.is_published ? 'published' : 'draft'}>
          {row.is_published ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
  ];

  const handleOpenAdd = () => {
    setEditingRow(null);
    setUploadError(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      featured_image: null,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row: ProgrammeRecord) => {
    setEditingRow(row);
    setUploadError(null);
    setFormData({
      title: row.title,
      slug: row.slug,
      description: row.description,
      featured_image: row.featured_image || null,
      is_published: row.is_published,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (row: ProgrammeRecord) => {
    if (confirm(`Are you sure you want to delete "${row.title}"?`)) {
      try {
        const supabase = createClient();
        await supabase.from('programmes').delete().eq('id', row.id);
      } catch {}
      const updated = data.filter((d) => d.id !== row.id);
      setData(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('ecaph_programmes', JSON.stringify(updated));
        window.dispatchEvent(new Event('ecaph_programmes_updated'));
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const programmeSlug = formData.slug?.trim() || slugify(formData.title) || `programme-${Date.now()}`;

    const payload = {
      ...formData,
      slug: programmeSlug,
      content: formData.description,
      featured_image: formData.featured_image || null,
    };

    let updatedList: ProgrammeRecord[] = [];

    if (editingRow) {
      try {
        await supabase.from('programmes').update(payload).eq('id', editingRow.id);
      } catch {}
      updatedList = data.map((d) => (d.id === editingRow.id ? { ...d, ...payload } : d));
    } else {
      const newRec = {
        ...payload,
        order_index: data.length + 1,
      };
      try {
        const { data: inserted } = await supabase.from('programmes').insert(newRec).select();
        if (inserted && inserted[0]) {
          updatedList = [...data, inserted[0] as ProgrammeRecord];
        } else {
          updatedList = [...data, { id: String(Date.now()), ...newRec }];
        }
      } catch {
        updatedList = [...data, { id: String(Date.now()), ...newRec }];
      }
    }

    setData(updatedList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecaph_programmes', JSON.stringify(updatedList));
      window.dispatchEvent(new Event('ecaph_programmes_updated'));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] font-sans">
      <AdminHeader title="Programmes CMS" />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
        <DataTable
          title="Manage Core Programmes"
          description="Create, edit, upload cover images, reorder, or publish the thematic pillars of e-CAPH."
          columns={columns}
          data={data}
          searchKey="title"
          searchPlaceholder="Search programmes..."
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          addButtonLabel="New Programme"
        />
      </main>

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRow ? 'Edit Programme' : 'Add New Programme'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B]">Programme Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => {
                const title = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  title,
                  slug: !editingRow || !prev.slug ? slugify(title) : prev.slug,
                }));
              }}
              placeholder="e.g. Adolescent & Youth Health"
              required
              className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B]">URL Slug *</label>
            <Input
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="adolescent-and-youth-health"
              required
              className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
            />
          </div>

          {/* Programme Cover Image Upload Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1E293B]">Programme Cover Image</label>
              {formData.featured_image && (
                <span className="text-[10px] text-emerald-600 font-bold">
                  ✓ Cover Image Attached
                </span>
              )}
            </div>

            <div className="p-4 border border-[#E2E8F0] rounded-[10px] bg-[#F8FAFC] space-y-3">
              {formData.featured_image ? (
                <div className="relative aspect-video max-h-48 w-full rounded-[8px] bg-slate-100 overflow-hidden border border-slate-200 group shadow-xs">
                  <img
                    src={formData.featured_image}
                    alt="Programme Cover Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label className="cursor-pointer px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs rounded-[6px] shadow-sm transition-colors inline-flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-[#0092DF]" />
                      Replace Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData((prev) => ({ ...prev, featured_image: null }))}
                      className="bg-white/95 text-rose-600 hover:text-rose-700 hover:bg-white text-xs border-white/50 h-8 font-bold"
                    >
                      <X className="w-3.5 h-3.5 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-[#CBD5E1] rounded-[8px] p-6 text-center bg-white hover:bg-slate-50/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-[#EBF6FC] text-[#0092DF] flex items-center justify-center mx-auto mb-2">
                    {uploadingImage ? (
                      <Loader2 className="w-6 h-6 animate-spin text-[#0092DF]" />
                    ) : (
                      <ImageIcon className="w-6 h-6" />
                    )}
                  </div>
                  <p className="text-xs font-bold text-[#1E293B]">
                    Upload Cover Image from Local Computer
                  </p>
                  <p className="text-[11px] text-[#64748B] mt-0.5 mb-3">
                    PNG, JPG, WEBP, or GIF (up to 10MB). Automatically stored in cloud storage.
                  </p>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold text-xs rounded-[6px] transition-colors shadow-xs">
                    <Upload className="w-4 h-4" />
                    {uploadingImage ? 'Uploading Image...' : 'Choose File from Computer'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {uploadError && (
                <p className="text-[11px] text-rose-600 font-medium">{uploadError}</p>
              )}

              <div className="pt-2 border-t border-[#E2E8F0]">
                <label className="text-[11px] font-semibold text-[#64748B] block mb-1">
                  Or paste an image URL directly:
                </label>
                <Input
                  value={formData.featured_image || ''}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  placeholder="https://example.com/cover-image.jpg"
                  className="bg-white border-[#E2E8F0] h-8 text-[11px] rounded-[6px]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B]">Description *</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Programme summary and target goals..."
              rows={4}
              required
              className="bg-white border-[#E2E8F0] text-xs rounded-[6px]"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="rounded text-[#0092DF] focus:ring-[#0092DF]"
            />
            <label htmlFor="is_published" className="text-xs font-bold text-[#1E293B] cursor-pointer">
              Publish Immediately on Public Website
            </label>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={uploadingImage}
              className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold"
            >
              Save Programme Record
            </Button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
}
