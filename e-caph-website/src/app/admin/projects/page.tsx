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

interface ProjectRecord {
  id: string;
  title: string;
  category: string;
  summary: string;
  status: 'planned' | 'ongoing' | 'completed' | 'suspended';
  location: string;
  is_flagship: boolean;
  is_published: boolean;
}

export default function AdminProjectsPage() {
  const [data, setData] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<ProjectRecord | null>(null);

  const [formData, setFormData] = useState<Omit<ProjectRecord, 'id'>>({
    title: '',
    category: 'Public Health',
    summary: '',
    status: 'ongoing',
    location: 'Kaduna, Nigeria',
    is_flagship: false,
    is_published: true,
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: dbData, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !dbData || dbData.length === 0) {
        setData(
          flagshipInitiatives.map((p, idx) => ({
            id: String(idx + 1),
            title: p.title,
            category: p.category,
            summary: p.description,
            status: 'ongoing',
            location: p.location,
            is_flagship: p.isFeatured,
            is_published: true,
          }))
        );
      } else {
        setData(dbData as ProjectRecord[]);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const columns: Column<ProjectRecord>[] = [
    {
      header: 'Project Title',
      accessorKey: 'title',
      cell: (row) => (
        <div>
          <div className="font-bold text-[#0092DF]">{row.title}</div>
          <div className="text-[10px] text-[#64748B]">{row.category} • {row.location}</div>
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
    setFormData({
      title: '',
      category: 'Public Health',
      summary: '',
      status: 'ongoing',
      location: 'Kaduna, Nigeria',
      is_flagship: false,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row: ProjectRecord) => {
    setEditingRow(row);
    setFormData({
      title: row.title,
      category: row.category,
      summary: row.summary,
      status: row.status,
      location: row.location,
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
      setData(data.filter((d) => d.id !== row.id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    if (editingRow) {
      try {
        await supabase.from('projects').update(formData).eq('id', editingRow.id);
      } catch {}
      setData(data.map((d) => (d.id === editingRow.id ? { ...d, ...formData } : d)));
    } else {
      try {
        const { data: inserted } = await supabase.from('projects').insert(formData).select();
        if (inserted && inserted[0]) {
          setData([inserted[0] as ProjectRecord, ...data]);
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
      <AdminHeader title="Projects CMS" />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
        <DataTable
          title="Manage Projects &amp; Initiatives"
          description="Create, update, and manage community projects, flagship tags, and project statuses."
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
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. NextGeneration Adolescent Health Fellowship"
              required
              className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
            />
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
            <label className="flex items-center gap-2 text-xs font-bold text-[#1E293B]">
              <input
                type="checkbox"
                checked={formData.is_flagship}
                onChange={(e) => setFormData({ ...formData, is_flagship: e.target.checked })}
                className="rounded text-[#0092DF] focus:ring-[#0092DF]"
              />
              Mark as Flagship Initiative
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-[#1E293B]">
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
            <Button type="submit" className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold">
              Save Project Record
            </Button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
}
