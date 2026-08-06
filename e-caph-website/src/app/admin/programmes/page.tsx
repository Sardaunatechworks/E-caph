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

interface ProgrammeRecord {
  id: string;
  title: string;
  slug: string;
  description: string;
  is_published: boolean;
  order_index: number;
}

export default function AdminProgrammesPage() {
  const [data, setData] = useState<ProgrammeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<ProgrammeRecord | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    is_published: true,
  });

  const fetchProgrammes = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: dbData, error } = await supabase
        .from('programmes')
        .select('*')
        .order('order_index', { ascending: true });

      if (error || !dbData || dbData.length === 0) {
        // Fallback fallback if table empty
        setData(
          siteConfig.nav.footer.programmes.map((p, idx) => ({
            id: String(idx + 1),
            title: p.label,
            slug: p.href.replace('/programmes/', ''),
            description: 'Community-centered thematic intervention pillar operating across northern Nigeria.',
            is_published: true,
            order_index: idx + 1,
          }))
        );
      } else {
        setData(dbData as ProgrammeRecord[]);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammes();
  }, []);

  const columns: Column<ProgrammeRecord>[] = [
    {
      header: 'Programme Title',
      accessorKey: 'title',
      cell: (row) => (
        <div>
          <div className="font-bold text-[#0092DF]">{row.title}</div>
          <div className="text-[10px] text-[#64748B]">/programmes/{row.slug}</div>
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
    setFormData({ title: '', slug: '', description: '', is_published: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row: ProgrammeRecord) => {
    setEditingRow(row);
    setFormData({
      title: row.title,
      slug: row.slug,
      description: row.description,
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
      setData(data.filter((d) => d.id !== row.id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    if (editingRow) {
      try {
        await supabase.from('programmes').update(formData).eq('id', editingRow.id);
      } catch {}
      setData(data.map((d) => (d.id === editingRow.id ? { ...d, ...formData } : d)));
    } else {
      const newRec = {
        ...formData,
        order_index: data.length + 1,
      };
      try {
        const { data: inserted } = await supabase.from('programmes').insert(newRec).select();
        if (inserted && inserted[0]) {
          setData([...data, inserted[0] as ProgrammeRecord]);
        } else {
          setData([...data, { id: String(Date.now()), ...newRec }]);
        }
      } catch {
        setData([...data, { id: String(Date.now()), ...newRec }]);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] font-sans">
      <AdminHeader title="Programmes CMS" />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
        <DataTable
          title="Manage Core Programmes"
          description="Create, edit, reorder, or publish the thematic pillars of e-CAPH."
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
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
            <label htmlFor="is_published" className="text-xs font-bold text-[#1E293B]">
              Publish Immediately on Public Website
            </label>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold">
              Save Programme Record
            </Button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
}
