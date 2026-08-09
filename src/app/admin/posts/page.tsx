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
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import type { Post } from '@/types/database';

export default function AdminPostsPage() {
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Post | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    post_type: Post['post_type'];
    summary: string;
    content: string;
    featured_image: string;
    status: Post['status'];
    published_at: string;
  }>({
    title: '',
    slug: '',
    post_type: 'article',
    summary: '',
    content: '',
    featured_image: '',
    status: 'published',
    published_at: new Date().toISOString().split('T')[0],
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      // 1. Instant local preview via Data URL
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Url = reader.result as string;
        setFormData((prev) => ({ ...prev, featured_image: base64Url }));

        // 2. Attempt Supabase Storage Upload
        try {
          const supabase = createClient();
          const fileExt = file.name.split('.').pop();
          const fileName = `post_${Date.now()}.${fileExt}`;
          const filePath = `posts/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(filePath, file, { upsert: true });

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from('media')
              .getPublicUrl(filePath);
            if (publicUrlData?.publicUrl) {
              setFormData((prev) => ({ ...prev, featured_image: publicUrlData.publicUrl }));
            }
          }
        } catch {
          // Keep base64 preview
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    let currentList: Post[] = [];

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecaph_posts');
      if (saved) {
        try { currentList = JSON.parse(saved); } catch {}
      }
    }

    try {
      const supabase = createClient();
      const { data: dbData, error } = await supabase
        .from('posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (!error && dbData && dbData.length > 0) {
        currentList = dbData as Post[];
      }
    } catch {
      // Fallback
    } finally {
      setData(currentList);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const columns: Column<Post>[] = [
    {
      header: 'Article Title',
      accessorKey: 'title',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[6px] bg-[#E2E8F0] overflow-hidden flex items-center justify-center shrink-0 border border-slate-200">
            {row.featured_image ? (
              <img src={row.featured_image} alt={row.title} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-4 h-4 text-[#94A3B8]" />
            )}
          </div>
          <div>
            <div className="font-bold text-[#0092DF] line-clamp-1">{row.title}</div>
            <div className="text-[10px] text-[#64748B] capitalize">{row.post_type?.replace('_', ' ') || 'article'} • {new Date(row.published_at || row.created_at).toLocaleDateString()}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge variant={row.status === 'published' ? 'published' : row.status === 'draft' ? 'draft' : 'pending'} className="capitalize">
          {row.status ? row.status.replace('_', ' ') : 'Published'}
        </Badge>
      ),
    },
  ];

  const handleOpenAdd = () => {
    setEditingRow(null);
    setFormData({
      title: '',
      slug: '',
      post_type: 'article',
      summary: '',
      content: '',
      featured_image: '',
      status: 'published',
      published_at: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row: Post) => {
    setEditingRow(row);
    setFormData({
      title: row.title,
      slug: row.slug || '',
      post_type: row.post_type || 'article',
      summary: row.summary || '',
      content: row.content || '',
      featured_image: row.featured_image || '',
      status: row.status || 'published',
      published_at: row.published_at ? row.published_at.split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (row: Post) => {
    if (confirm(`Are you sure you want to delete "${row.title}"?`)) {
      const updated = data.filter((d) => d.id !== row.id);
      setData(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('ecaph_posts', JSON.stringify(updated));
        window.dispatchEvent(new Event('ecaph_posts_updated'));
      }
      try {
        const supabase = createClient();
        await supabase.from('posts').delete().eq('id', row.id);
      } catch {}
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    const baseSlug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'article';
    const slug = editingRow
      ? (formData.slug || baseSlug)
      : `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const payload = {
      title: formData.title,
      slug,
      post_type: formData.post_type,
      summary: formData.summary,
      content: formData.content || formData.summary,
      featured_image: formData.featured_image || null,
      status: formData.status,
      published_at: new Date(formData.published_at).toISOString(),
    };

    let updated: Post[] = [];

    if (editingRow) {
      updated = data.map((d) => (d.id === editingRow.id ? ({ ...d, ...payload } as Post) : d));
      try {
        await supabase.from('posts').upsert({ id: editingRow.id, ...payload }, { onConflict: 'id' });
      } catch {}
    } else {
      const newItem: Post = {
        id: String(Date.now()),
        author_id: null,
        category_id: null,
        programme_id: null,
        project_id: null,
        ...payload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      updated = [newItem, ...data];
      try {
        const { data: inserted } = await supabase.from('posts').upsert(payload, { onConflict: 'slug' }).select();
        if (inserted && inserted[0]) {
          updated = [inserted[0] as Post, ...data];
        }
      } catch {}
    }

    setData(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecaph_posts', JSON.stringify(updated));
      window.dispatchEvent(new Event('ecaph_posts_updated'));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] font-sans">
      <AdminHeader title="Stories &amp; Publications CMS" />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
        <DataTable
          title="Manage Blog Articles &amp; Field Stories"
          description="Create, publish, edit, and manage news, research publications, and field stories."
          columns={columns}
          data={data}
          searchKey="title"
          searchPlaceholder="Search blog posts..."
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          addButtonLabel="New Article"
        />
      </main>

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRow ? 'Edit Article' : 'Publish New Article'}
      >
        <form onSubmit={handleSave} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
          {/* Article Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B]">Article Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter article title..."
              required
              className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
            />
          </div>

          {/* Featured Image Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1E293B]">Featured Header Image</label>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-[8px] border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                {formData.featured_image ? (
                  <img src={formData.featured_image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
              </div>

              <div className="space-y-1.5 flex-1">
                <label
                  htmlFor="featured_image_input"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-[6px] bg-white border border-[#E2E8F0] text-xs font-bold text-[#0092DF] hover:bg-[#F7FAF8] cursor-pointer shadow-sm transition-colors"
                >
                  {uploadingImage ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#0092DF]" />
                  ) : (
                    <Upload className="w-4 h-4 text-[#0092DF]" />
                  )}
                  {formData.featured_image ? 'Change Cover Image' : 'Choose Local Image File'}
                </label>
                <input
                  id="featured_image_input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-[10px] text-[#64748B]">Select image file from computer (.jpg, .png, .webp)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Article Category / Type</label>
              <Select
                value={formData.post_type}
                onChange={(e) => setFormData({ ...formData, post_type: e.target.value as Post['post_type'] })}
                className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              >
                <option value="article">Article</option>
                <option value="field_update">Field Update</option>
                <option value="report">Research Report</option>
                <option value="press_release">Press Release</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Publish Status</label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Post['status'] })}
                className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="under_review">Under Review</option>
              </Select>
            </div>
          </div>

          {/* Article Excerpt / Summary */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B]">Article Excerpt / Summary *</label>
            <Textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Short 2-3 sentence overview for blog cards and social sharing..."
              rows={2}
              required
              className="bg-white border-[#E2E8F0] text-xs rounded-[6px]"
            />
          </div>

          {/* Full Article Content */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B]">Full Article Body Content</label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write or paste full article body paragraphs here..."
              rows={6}
              className="bg-white border-[#E2E8F0] text-xs rounded-[6px]"
            />
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold">
              Save &amp; Publish Article
            </Button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
}
