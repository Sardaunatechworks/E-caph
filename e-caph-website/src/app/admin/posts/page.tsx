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

interface PostRecord {
  id: string;
  title: string;
  post_type: 'article' | 'field_update' | 'report' | 'press_release';
  summary: string;
  status: 'draft' | 'under_review' | 'published' | 'archived';
  published_at: string;
}

export default function AdminPostsPage() {
  const [data, setData] = useState<PostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<PostRecord | null>(null);

  const [formData, setFormData] = useState<Omit<PostRecord, 'id'>>({
    title: '',
    post_type: 'article',
    summary: '',
    status: 'published',
    published_at: new Date().toISOString().split('T')[0],
  });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: dbData, error } = await supabase
        .from('posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (error || !dbData || dbData.length === 0) {
        setData([
          {
            id: '1',
            title: 'Strengthening Primary Healthcare Through Youth-Led Accountability',
            post_type: 'field_update',
            summary: 'Through the Gani da Ido initiative, local youth advocates in Kaduna have monitored over 40 primary healthcare centers.',
            status: 'published',
            published_at: '2026-08-01',
          },
          {
            id: '2',
            title: 'Lafiyar Iyali Maternal Care Campaign Launches Second Phase',
            post_type: 'press_release',
            summary: 'Expanding maternal health service delivery and community dialogue sessions across underserved LGAs.',
            status: 'published',
            published_at: '2026-07-28',
          },
        ]);
      } else {
        setData(dbData as PostRecord[]);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const columns: Column<PostRecord>[] = [
    {
      header: 'Article Title',
      accessorKey: 'title',
      cell: (row) => (
        <div>
          <div className="font-bold text-[#0092DF]">{row.title}</div>
          <div className="text-[10px] text-[#64748B] capitalize">{row.post_type.replace('_', ' ')} • {row.published_at}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge variant={row.status === 'published' ? 'published' : row.status === 'draft' ? 'draft' : 'pending'} className="capitalize">
          {row.status.replace('_', ' ')}
        </Badge>
      ),
    },
  ];

  const handleOpenAdd = () => {
    setEditingRow(null);
    setFormData({
      title: '',
      post_type: 'article',
      summary: '',
      status: 'published',
      published_at: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row: PostRecord) => {
    setEditingRow(row);
    setFormData({
      title: row.title,
      post_type: row.post_type,
      summary: row.summary,
      status: row.status,
      published_at: row.published_at,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (row: PostRecord) => {
    if (confirm(`Are you sure you want to delete "${row.title}"?`)) {
      try {
        const supabase = createClient();
        await supabase.from('posts').delete().eq('id', row.id);
      } catch {}
      setData(data.filter((d) => d.id !== row.id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    if (editingRow) {
      try {
        await supabase.from('posts').update(formData).eq('id', editingRow.id);
      } catch {}
      setData(data.map((d) => (d.id === editingRow.id ? { ...d, ...formData } : d)));
    } else {
      try {
        const { data: inserted } = await supabase.from('posts').insert(formData).select();
        if (inserted && inserted[0]) {
          setData([inserted[0] as PostRecord, ...data]);
        } else {
          setData([{ id: String(Date.now()), ...formData }, ...data]);
        }
      } catch {
        setData([{ id: String(Date.now()), ...formData }, ...data]);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] font-sans">
      <AdminHeader title="Stories &amp; Posts CMS" />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
        <DataTable
          title="Manage Stories, Field Updates &amp; News"
          description="Publish reports, articles, and field updates to the public site."
          columns={columns}
          data={data}
          searchKey="title"
          searchPlaceholder="Search posts..."
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          addButtonLabel="New Article"
        />
      </main>

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRow ? 'Edit Post' : 'Add New Post'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B]">Post Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Post headline"
              required
              className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Post Type</label>
              <Select
                value={formData.post_type}
                onChange={(e) => setFormData({ ...formData, post_type: e.target.value as any })}
                className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              >
                <option value="article">Article</option>
                <option value="field_update">Field Update</option>
                <option value="report">Report</option>
                <option value="press_release">Press Release</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Status</label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="under_review">Under Review</option>
                <option value="archived">Archived</option>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B]">Summary *</label>
            <Textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Short excerpt for social sharing and cards..."
              rows={3}
              required
              className="bg-white border-[#E2E8F0] text-xs rounded-[6px]"
            />
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold">
              Save Post
            </Button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
}
