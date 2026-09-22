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
import {
  Upload,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Star,
  Plus,
  Link as LinkIcon,
  Check
} from 'lucide-react';
import type { Post } from '@/types/database';

// Helper to extract gallery images from a post
function parsePostGallery(post: Partial<Post>): { images: string[]; cleanContent: string } {
  let images: string[] = [];
  let content = post.content || '';

  if (Array.isArray(post.images) && post.images.length > 0) {
    images = [...post.images];
  }

  if (content.includes('<!--ECAPH_GALLERY:')) {
    try {
      const match = content.match(/<!--ECAPH_GALLERY:(.*?)-->/);
      if (match && match[1]) {
        const parsed = JSON.parse(match[1]);
        if (Array.isArray(parsed)) {
          images = Array.from(new Set([...images, ...parsed]));
        }
      }
    } catch {}
    content = content.replace(/<!--ECAPH_GALLERY:.*?-->/g, '').trim();
  }

  if (post.featured_image && !images.includes(post.featured_image)) {
    images = [post.featured_image, ...images];
  }

  images = Array.from(new Set(images.filter(Boolean)));
  return { images, cleanContent: content };
}

export default function AdminPostsPage() {
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Post | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [manualImageUrl, setManualImageUrl] = useState('');
  const [uploadProgressText, setUploadProgressText] = useState('');

  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    post_type: Post['post_type'];
    summary: string;
    content: string;
    featured_image: string;
    images: string[];
    status: Post['status'];
    published_at: string;
  }>({
    title: '',
    slug: '',
    post_type: 'article',
    summary: '',
    content: '',
    featured_image: '',
    images: [],
    status: 'published',
    published_at: new Date().toISOString().split('T')[0],
  });

  // Handle Multi-Image Upload
  const handleMultipleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImages(true);
    setUploadProgressText(`Uploading ${files.length} picture${files.length > 1 ? 's' : ''}...`);

    try {
      const supabase = createClient();
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgressText(`Uploading picture ${i + 1} of ${files.length}...`);

        try {
          const fileExt = file.name.split('.').pop() || 'jpg';
          const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 25);
          const fileName = `post_${Date.now()}_${cleanName}.${fileExt}`;
          const filePath = `posts/gallery/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(filePath, file, { upsert: true });

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from('media')
              .getPublicUrl(filePath);

            if (publicUrlData?.publicUrl) {
              uploadedUrls.push(publicUrlData.publicUrl);
              continue;
            }
          }
        } catch {
          // Fallback to local DataURL preview if Supabase storage upload encounters issues
        }

        // Base64 Data URL fallback
        const base64Url = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        uploadedUrls.push(base64Url);
      }

      setFormData((prev) => {
        const newImages = Array.from(new Set([...prev.images, ...uploadedUrls]));
        const newFeatured = prev.featured_image || newImages[0] || '';
        return {
          ...prev,
          images: newImages,
          featured_image: newFeatured,
        };
      });
    } catch (err) {
      console.error('Multi-image upload error:', err);
    } finally {
      setUploadingImages(false);
      setUploadProgressText('');
      e.target.value = '';
    }
  };

  // Add image manually via URL
  const handleAddManualUrl = () => {
    const trimmed = manualImageUrl.trim();
    if (!trimmed) return;

    setFormData((prev) => {
      const newImages = Array.from(new Set([...prev.images, trimmed]));
      return {
        ...prev,
        images: newImages,
        featured_image: prev.featured_image || trimmed,
      };
    });
    setManualImageUrl('');
  };

  // Set an image as the main featured cover image
  const handleSetFeatured = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      featured_image: url,
    }));
  };

  // Remove an image from gallery
  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => {
      const targetUrl = prev.images[indexToRemove];
      const newImages = prev.images.filter((_, idx) => idx !== indexToRemove);
      let newFeatured = prev.featured_image;

      if (newFeatured === targetUrl) {
        newFeatured = newImages[0] || '';
      }

      return {
        ...prev,
        images: newImages,
        featured_image: newFeatured,
      };
    });
  };

  const fetchPosts = async () => {
    setLoading(true);
    let currentList: Post[] = [];

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecaph_posts');
      if (saved) {
        try {
          currentList = JSON.parse(saved);
        } catch {}
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
        if (typeof window !== 'undefined') {
          localStorage.setItem('ecaph_posts', JSON.stringify(currentList));
        }
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
      header: 'Article / Story Title',
      accessorKey: 'title',
      cell: (row) => {
        const { images } = parsePostGallery(row);
        const coverImg = row.featured_image || images[0] || null;

        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[6px] bg-[#E2E8F0] overflow-hidden flex items-center justify-center shrink-0 border border-slate-200">
              {coverImg ? (
                <img src={coverImg} alt={row.title} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-4 h-4 text-[#94A3B8]" />
              )}
            </div>
            <div>
              <div className="font-bold text-[#0092DF] line-clamp-1 flex items-center gap-1.5">
                {row.title}
                {images.length > 1 && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {images.length} photos
                  </span>
                )}
              </div>
              <div className="text-[10px] text-[#64748B] capitalize">
                {row.post_type?.replace('_', ' ') || 'article'} • {new Date(row.published_at || row.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge
          variant={row.status === 'published' ? 'published' : row.status === 'draft' ? 'draft' : 'pending'}
          className="capitalize"
        >
          {row.status ? row.status.replace('_', ' ') : 'Published'}
        </Badge>
      ),
    },
  ];

  const handleOpenAdd = () => {
    setEditingRow(null);
    setManualImageUrl('');
    setFormData({
      title: '',
      slug: '',
      post_type: 'article',
      summary: '',
      content: '',
      featured_image: '',
      images: [],
      status: 'published',
      published_at: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row: Post) => {
    setEditingRow(row);
    setManualImageUrl('');
    const { images, cleanContent } = parsePostGallery(row);

    setFormData({
      title: row.title,
      slug: row.slug || '',
      post_type: row.post_type || 'article',
      summary: row.summary || '',
      content: cleanContent || row.content || '',
      featured_image: row.featured_image || images[0] || '',
      images: images,
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

    const baseSlug =
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'article';

    const slug = editingRow
      ? formData.slug || baseSlug
      : `${baseSlug}-${Date.now().toString().slice(-4)}`;

    // Clean content of any existing gallery tags, then embed gallery metadata
    let cleanContent = formData.content.replace(/<!--ECAPH_GALLERY:.*?-->/g, '').trim();
    if (!cleanContent) cleanContent = formData.summary;

    const finalContent =
      formData.images.length > 0
        ? `${cleanContent}\n\n<!--ECAPH_GALLERY:${JSON.stringify(formData.images)}-->`
        : cleanContent;

    const primaryCover = formData.featured_image || formData.images[0] || null;

    const basePayload = {
      title: formData.title,
      slug,
      post_type: formData.post_type,
      summary: formData.summary,
      content: finalContent,
      featured_image: primaryCover,
      status: formData.status,
      published_at: new Date(formData.published_at).toISOString(),
    };

    let updated: Post[] = [];

    // Attempt saving with images column first, falling back if column not in DB schema yet
    if (editingRow) {
      const fullPayloadWithImages = { ...basePayload, images: formData.images };
      try {
        const { error } = await supabase
          .from('posts')
          .update(fullPayloadWithImages)
          .eq('id', editingRow.id);

        if (error && error.message.includes('images')) {
          // Retry without images column (preserved in content and localStorage)
          await supabase.from('posts').update(basePayload).eq('id', editingRow.id);
        }
      } catch {}

      updated = data.map((d) =>
        d.id === editingRow.id
          ? ({ ...d, ...basePayload, images: formData.images } as Post)
          : d
      );
    } else {
      const newItem: Post = {
        id: String(Date.now()),
        author_id: null,
        category_id: null,
        programme_id: null,
        project_id: null,
        ...basePayload,
        images: formData.images,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      updated = [newItem, ...data];

      try {
        const fullPayloadWithImages = { ...basePayload, images: formData.images };
        const { data: inserted, error } = await supabase
          .from('posts')
          .insert(fullPayloadWithImages)
          .select();

        if (error && error.message.includes('images')) {
          const { data: fallbackInserted } = await supabase
            .from('posts')
            .insert(basePayload)
            .select();
          if (fallbackInserted && fallbackInserted[0]) {
            updated = [{ ...fallbackInserted[0], images: formData.images } as Post, ...data];
          }
        } else if (inserted && inserted[0]) {
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
          description="Create, publish, edit, and attach multiple high-resolution photos to field stories, news, research reports, and articles."
          columns={columns}
          data={data}
          searchKey="title"
          searchPlaceholder="Search blog posts..."
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          addButtonLabel="New Article / Story"
        />
      </main>

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRow ? 'Edit Article / Field Story' : 'Publish New Article / Story'}
      >
        <form onSubmit={handleSave} className="space-y-5 max-h-[82vh] overflow-y-auto pr-2">
          {/* Article Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B]">Article / Story Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter title..."
              required
              className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
            />
          </div>

          {/* Multiple Pictures & Gallery Upload Section */}
          <div className="space-y-3 p-4 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-[#0092DF] flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#86C127]" />
                  Story &amp; Publication Pictures ({formData.images.length})
                </label>
                <p className="text-[11px] text-[#64748B]">
                  Upload multiple photos from your computer. You can choose any picture as the main cover photo.
                </p>
              </div>

              {/* Multi-file Upload Button */}
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#0092DF] hover:bg-[#007DC2] text-white text-xs font-bold shadow-xs transition-colors">
                {uploadingImages ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                {uploadingImages ? 'Uploading...' : 'Upload Pictures (Multiple)'}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMultipleImagesUpload}
                  disabled={uploadingImages}
                  className="hidden"
                />
              </label>
            </div>

            {uploadProgressText && (
              <div className="text-xs text-[#0092DF] font-semibold flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {uploadProgressText}
              </div>
            )}

            {/* Thumbnail Preview Grid */}
            {formData.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                {formData.images.map((imgUrl, index) => {
                  const isCover = formData.featured_image === imgUrl || (!formData.featured_image && index === 0);

                  return (
                    <div
                      key={index}
                      className={`relative aspect-square rounded-[8px] overflow-hidden border-2 bg-white transition-all group ${
                        isCover ? 'border-[#86C127] shadow-sm' : 'border-[#E2E8F0] hover:border-slate-300'
                      }`}
                    >
                      <img src={imgUrl} alt={`Uploaded ${index + 1}`} className="w-full h-full object-cover" />

                      {/* Cover Badge */}
                      {isCover && (
                        <div className="absolute top-1.5 left-1.5 bg-[#86C127] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-white" /> Cover Photo
                        </div>
                      )}

                      {/* Hover Action Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                        {!isCover && (
                          <button
                            type="button"
                            onClick={() => handleSetFeatured(imgUrl)}
                            className="bg-white/90 hover:bg-white text-[#1E293B] text-[10px] font-bold px-2 py-1 rounded shadow-xs w-full text-center flex items-center justify-center gap-1"
                          >
                            <Star className="w-3 h-3 text-[#E67817]" /> Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="bg-rose-600/90 hover:bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xs w-full text-center flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 border-2 border-dashed border-[#CBD5E1] rounded-[8px] text-center space-y-2">
                <ImageIcon className="w-8 h-8 text-[#94A3B8] mx-auto opacity-70" />
                <p className="text-xs text-[#64748B]">No pictures attached yet.</p>
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-white border border-[#CBD5E1] hover:bg-slate-50 text-xs font-bold text-[#0092DF] shadow-2xs">
                  <Upload className="w-3.5 h-3.5" /> Choose Images from Computer
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMultipleImagesUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Optional Manual URL Input */}
            <div className="pt-2 flex items-center gap-2">
              <Input
                value={manualImageUrl}
                onChange={(e) => setManualImageUrl(e.target.value)}
                placeholder="Or paste external image URL (https://...)"
                className="bg-white border-[#E2E8F0] h-8 text-[11px] rounded-[4px] flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddManualUrl}
                disabled={!manualImageUrl.trim()}
                className="h-8 text-xs font-bold border-[#CBD5E1] text-[#0092DF]"
              >
                Add Image
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Article / Story Type</label>
              <Select
                value={formData.post_type}
                onChange={(e) => setFormData({ ...formData, post_type: e.target.value as Post['post_type'] })}
                className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              >
                <option value="article">Article</option>
                <option value="impact_story">Impact Story</option>
                <option value="field_update">Field Update</option>
                <option value="report">Research Report / Publication</option>
                <option value="press_release">Press Release</option>
                <option value="news">News</option>
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

          {/* Excerpt / Summary */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B]">Article Excerpt / Summary *</label>
            <Textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Short 2-3 sentence overview for cards and social sharing..."
              rows={2}
              required
              className="bg-white border-[#E2E8F0] text-xs rounded-[6px]"
            />
          </div>

          {/* Full Article Content */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B]">Full Story / Publication Content</label>
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
            <Button type="submit" disabled={uploadingImages} className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold">
              {uploadingImages ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading Images...
                </>
              ) : (
                'Save & Publish Article'
              )}
            </Button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
}
