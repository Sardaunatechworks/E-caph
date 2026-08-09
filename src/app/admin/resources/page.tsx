'use client';

import { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { DataTable, type Column } from '@/components/admin/data-table';
import { ModalForm } from '@/components/admin/modal-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PDFViewerModal } from '@/components/common/pdf-viewer-modal';
import { createClient } from '@/lib/supabase/client';
import { Upload, X, FileText, Download, Eye, FileDown } from 'lucide-react';
import type { DownloadResource } from '@/types/database';

export default function AdminResourcesPage() {
  const [data, setData] = useState<DownloadResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<DownloadResource | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedResourceForView, setSelectedResourceForView] = useState<DownloadResource | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const [formData, setFormData] = useState<Omit<DownloadResource, 'id' | 'created_at' | 'updated_at'>>({
    title: '',
    slug: '',
    description: '',
    category: 'Annual Report',
    file_url: '',
    file_size: '',
    file_type: 'application/pdf',
    downloads_count: 0,
    is_published: true,
    published_date: new Date().toISOString(),
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    const formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    try {
      // 1. Read local file as Data URL
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Url = event.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          file_url: base64Url,
          file_size: formattedSize,
          title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
          slug: prev.slug || file.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        }));

        // 2. Attempt Supabase Storage upload
        try {
          const supabase = createClient();
          const fileExt = file.name.split('.').pop();
          const fileName = `pdf_${Date.now()}.${fileExt}`;
          const filePath = `documents/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(filePath, file, { upsert: true });

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from('media')
              .getPublicUrl(filePath);
            if (publicUrlData?.publicUrl) {
              setFormData((prev) => ({ ...prev, file_url: publicUrlData.publicUrl }));
            }
          }
        } catch {}
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('PDF File upload error:', err);
    } finally {
      setUploadingFile(false);
    }
  };

  const fetchResources = async () => {
    setLoading(true);
    let currentList: DownloadResource[] = [];

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecaph_download_resources');
      if (saved) {
        try { currentList = JSON.parse(saved); } catch {}
      }
    }

    try {
      const supabase = createClient();
      const { data: dbData, error } = await supabase
        .from('download_resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && dbData && dbData.length > 0) {
        currentList = dbData as DownloadResource[];
      }
    } catch {
      // Fallback
    } finally {
      setData(currentList);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const columns: Column<DownloadResource>[] = [
    {
      header: 'Document Title',
      accessorKey: 'title',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[6px] bg-[#0092DF] text-white flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-[#0092DF] line-clamp-1">{row.title}</div>
            <div className="text-[10px] text-[#64748B]">{row.file_size || 'PDF'} • {row.downloads_count} downloads</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: (row) => (
        <Badge variant="secondary" className="text-[10px] uppercase font-bold bg-[#F3F9E9] text-[#6EA71F]">
          {row.category}
        </Badge>
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
    {
      header: 'Preview',
      accessorKey: 'id',
      cell: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedResourceForView(row);
            setIsViewerOpen(true);
          }}
          className="text-xs font-bold text-[#0092DF] border-[#0092DF] h-8"
        >
          <Eye className="w-3.5 h-3.5 mr-1" /> View PDF
        </Button>
      ),
    },
  ];

  const handleOpenAdd = () => {
    setEditingRow(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      category: 'Annual Report',
      file_url: '',
      file_size: '',
      file_type: 'application/pdf',
      downloads_count: 0,
      is_published: true,
      published_date: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row: DownloadResource) => {
    setEditingRow(row);
    setFormData({
      title: row.title,
      slug: row.slug,
      description: row.description || '',
      category: row.category,
      file_url: row.file_url,
      file_size: row.file_size || '',
      file_type: row.file_type || 'application/pdf',
      downloads_count: row.downloads_count,
      is_published: row.is_published,
      published_date: row.published_date || new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (row: DownloadResource) => {
    if (confirm(`Are you sure you want to delete "${row.title}"?`)) {
      const updated = data.filter((d) => d.id !== row.id);
      setData(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('ecaph_download_resources', JSON.stringify(updated));
        window.dispatchEvent(new Event('ecaph_resources_updated'));
      }
      try {
        const supabase = createClient();
        await supabase.from('download_resources').delete().eq('id', row.id);
      } catch {}
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    const baseSlug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'document';
    const slug = editingRow
      ? (formData.slug || baseSlug)
      : `${baseSlug}-${Date.now().toString().slice(-4)}`;
    const payload = { ...formData, slug };
    let updated: DownloadResource[] = [];

    if (editingRow) {
      updated = data.map((d) => (d.id === editingRow.id ? ({ ...d, ...payload } as DownloadResource) : d));
      try {
        await supabase.from('download_resources').upsert(payload, { onConflict: 'id' });
      } catch {}
    } else {
      const newItem: DownloadResource = {
        id: String(Date.now()),
        ...payload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      updated = [newItem, ...data];
      try {
        const { data: inserted } = await supabase.from('download_resources').upsert(payload, { onConflict: 'slug' }).select();
        if (inserted && inserted[0]) {
          updated = [inserted[0] as DownloadResource, ...data];
        }
      } catch {}
    }

    setData(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecaph_download_resources', JSON.stringify(updated));
      window.dispatchEvent(new Event('ecaph_resources_updated'));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] font-sans">
      <AdminHeader title="PDF Resources &amp; Publications CMS" />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
        <DataTable
          title="Upload &amp; Manage PDF Resources"
          description="Upload local PDF files from your computer, manage categories, track downloads, and publish documents."
          columns={columns}
          data={data}
          searchKey="title"
          searchPlaceholder="Search PDF resources..."
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          addButtonLabel="Upload New PDF Resource"
        />
      </main>

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRow ? 'Edit PDF Resource' : 'Upload PDF Resource'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {/* Local PDF File Uploader */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1E293B]">PDF Document File *</label>

            <div className="p-4 border border-[#E2E8F0] rounded-[8px] bg-[#F8FAFC] space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[8px] bg-[#E67817] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <FileDown className="w-6 h-6" />
                </div>

                <div className="flex-1 space-y-1">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold text-xs rounded-[6px] transition-colors shadow-sm">
                    <Upload className="w-4 h-4" />
                    {uploadingFile ? 'Processing PDF...' : 'Choose PDF File from Computer'}
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-[#64748B]">Select a PDF document from your computer.</p>
                </div>
              </div>

              {formData.file_url && (
                <div className="p-2.5 bg-white border border-[#E2E8F0] rounded-[6px] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0092DF] line-clamp-1">File Attached ({formData.file_size || 'PDF'})</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData({ ...formData, file_url: '', file_size: '' })}
                    className="text-xs text-rose-600 hover:text-rose-700 h-7"
                  >
                    <X className="w-3.5 h-3.5 mr-1" /> Clear
                  </Button>
                </div>
              )}

              <Input
                value={formData.file_url}
                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                placeholder="Or paste external PDF URL (https://...)"
                required
                className="bg-white border-[#E2E8F0] h-8 text-[11px] rounded-[4px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Document Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. e-CAPH Annual Report 2026"
                required
                className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Resource Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-white border border-[#E2E8F0] h-10 text-xs rounded-[6px] px-3 font-medium focus:ring-[#0092DF]"
              >
                <option value="Annual Report">Annual Report</option>
                <option value="Policy Brief">Policy Brief</option>
                <option value="Research Paper">Research Paper</option>
                <option value="Tool/Guide">Tool / Guide</option>
                <option value="Financial Report">Financial Report</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B]">Description &amp; Summary</label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Summary of research findings, scope, and key recommendations..."
              rows={3}
              className="bg-white border-[#E2E8F0] text-xs rounded-[6px]"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_published_res"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="rounded text-[#0092DF] focus:ring-[#0092DF]"
            />
            <label htmlFor="is_published_res" className="text-xs font-bold text-[#1E293B]">
              Publish Document Immediately to Resource Hub
            </label>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold">
              Save PDF Resource
            </Button>
          </div>
        </form>
      </ModalForm>

      {/* PDF Viewer Modal */}
      <PDFViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        resource={selectedResourceForView}
      />
    </div>
  );
}
