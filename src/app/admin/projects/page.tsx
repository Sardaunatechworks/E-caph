'use client';

import { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { DataTable, type Column } from '@/components/admin/data-table';
import { ModalForm } from '@/components/admin/modal-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';
import { flagshipInitiatives } from '@/config/theme';
import { slugify } from '@/lib/utilities';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ProjectRecord {
  id: string;
  title: string;
  slug?: string;
  category: string;
  summary: string;
  status: 'planned' | 'ongoing' | 'completed' | 'suspended';
  location: string;
  featured_image?: string | null;
  is_flagship: boolean;
  is_published: boolean;
}

export default function AdminProjectsPage() {
  const [data, setData] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<ProjectRecord | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<ProjectRecord, 'id'>>({
    title: '',
    slug: '',
    category: 'Public Health',
    summary: '',
    status: 'ongoing',
    location: 'Kaduna, Nigeria',
    featured_image: null,
    is_flagship: false,
    is_published: true,
  });

  const fetchProjects = async () => {
    setLoading(true);
    let cached: ProjectRecord[] = [];
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecaph_projects');
      if (saved) {
        try {
          cached = JSON.parse(saved);
        } catch {}
      }
    }

    try {
      const supabase = createClient();
      const { data: dbData, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !dbData || dbData.length === 0) {
        if (cached.length > 0) {
          setData(cached);
        } else {
          setData(
            flagshipInitiatives.map((p, idx) => ({
              id: String(idx + 1),
              title: p.title,
              slug: slugify(p.title),
              category: p.category,
              summary: p.description,
              status: 'ongoing',
              location: p.location,
              featured_image: null,
              is_flagship: p.isFeatured,
              is_published: true,
            }))
          );
        }
      } else {
        setData(dbData as ProjectRecord[]);
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
    fetchProjects();
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
          const fileName = `project_${Date.now()}_${cleanName}.${fileExt}`;
          const filePath = `projects/covers/${fileName}`;

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

  const columns: Column<ProjectRecord>[] = [
    {
      header: 'Project Title',
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
            <div className="text-[10px] text-[#64748B]">
              {row.category} • {row.location}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge variant={row.status === 'ongoing' ? 'published' : 'draft'} className="capitalize">
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Flagship',
      accessorKey: 'is_flagship',
      cell: (row) => (
        <Badge variant={row.is_flagship ? 'secondary' : 'outline'}>
          {row.is_flagship ? '★ Flagship' : 'Standard'}
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
      category: 'Public Health',
      summary: '',
      status: 'ongoing',
      location: 'Kaduna, Nigeria',
      featured_image: null,
      is_flagship: false,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row: ProjectRecord) => {
    setEditingRow(row);
    setUploadError(null);
    setFormData({
      title: row.title,
      slug: row.slug || slugify(row.title),
      category: row.category,
      summary: row.summary,
      status: row.status,
      location: row.location,
      featured_image: row.featured_image || null,
      is_flagship: row.is_flagship,
      is_published: row.is_published,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (row: ProjectRecord) => {
    if (confirm(`Are you sure you want to delete "${row.title}"?`)) {
      try {
        const supabase = createClient();
        await supabase.from('projects').delete().eq('id', row.id);
      } catch {}
      const updated = data.filter((d) => d.id !== row.id);
      setData(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('ecaph_projects', JSON.stringify(updated));
        window.dispatchEvent(new Event('ecaph_projects_updated'));
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const projectSlug = formData.slug?.trim() || slugify(formData.title) || `project-${Date.now()}`;

    const payload = {
      ...formData,
      slug: projectSlug,
      description: formData.summary,
      featured_image: formData.featured_image || null,
    };

    let updatedList: ProjectRecord[] = [];

    if (editingRow) {
      try {
        await supabase.from('projects').update(payload).eq('id', editingRow.id);
      } catch {}
      updatedList = data.map((d) => (d.id === editingRow.id ? { ...d, ...payload } : d));
    } else {
      try {
        const { data: inserted } = await supabase.from('projects').insert(payload).select();
        if (inserted && inserted[0]) {
          updatedList = [inserted[0] as ProjectRecord, ...data];
        } else {
          updatedList = [{ id: String(Date.now()), ...payload }, ...data];
        }
      } catch {
        updatedList = [{ id: String(Date.now()), ...payload }, ...data];
      }
    }

    setData(updatedList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecaph_projects', JSON.stringify(updatedList));
      window.dispatchEvent(new Event('ecaph_projects_updated'));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] font-sans">
      <AdminHeader title="Projects CMS" />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
        <DataTable
          title="Manage Projects &amp; Initiatives"
          description="Create, update, and manage community projects, upload cover images, flagship tags, and project statuses."
          columns={columns}
          data={data}
          searchKey="title"
          searchPlaceholder="Search projects..."
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          addButtonLabel="New Project"
        />
      </main>

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRow ? 'Edit Project' : 'Add New Project'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B]">Project Title *</label>
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
              placeholder="e.g. NextGeneration Adolescent Health Fellowship"
              required
              className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
            />
          </div>

          {/* Cover Image Upload Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1E293B]">Project Cover Image</label>
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
                    alt="Project Cover Preview"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Category</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Public Health & Youth"
                required
                className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Kaduna & Kano States"
                required
                className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B]">Status</label>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
            >
              <option value="ongoing">Ongoing</option>
              <option value="planned">Planned</option>
              <option value="completed">Completed</option>
              <option value="suspended">Suspended</option>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B]">Summary *</label>
            <Textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Brief project summary and objectives..."
              rows={3}
              required
              className="bg-white border-[#E2E8F0] text-xs rounded-[6px]"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-[#1E293B] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_flagship}
                onChange={(e) => setFormData({ ...formData, is_flagship: e.target.checked })}
                className="rounded text-[#0092DF] focus:ring-[#0092DF]"
              />
              Mark as Flagship Initiative
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-[#1E293B] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="rounded text-[#0092DF] focus:ring-[#0092DF]"
              />
              Publish Immediately
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
              Save Project Record
            </Button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
}
