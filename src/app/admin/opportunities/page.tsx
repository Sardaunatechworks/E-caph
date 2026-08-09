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

interface OpportunityRecord {
  id: string;
  title: string;
  opportunity_type: 'job' | 'internship' | 'fellowship' | 'volunteer' | 'grant';
  location: string;
  deadline: string;
  is_open: boolean;
  application_link: string;
}

export default function AdminOpportunitiesPage() {
  const [data, setData] = useState<OpportunityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<OpportunityRecord | null>(null);

  const [formData, setFormData] = useState<Omit<OpportunityRecord, 'id'>>({
    title: '',
    opportunity_type: 'fellowship',
    location: 'Kaduna, Nigeria',
    deadline: '',
    is_open: true,
    application_link: '',
  });

  const fetchOpportunities = async () => {
    setLoading(true);
    let currentList: OpportunityRecord[] = [];

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecaph_opportunities');
      if (saved) {
        try { currentList = JSON.parse(saved); } catch {}
      }
    }

    try {
      const supabase = createClient();
      const { data: dbData, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && dbData && dbData.length > 0) {
        currentList = dbData as OpportunityRecord[];
      }
    } catch {
      // Fallback
    } finally {
      setData(currentList);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const columns: Column<OpportunityRecord>[] = [
    {
      header: 'Title',
      accessorKey: 'title',
      cell: (row) => (
        <div>
          <div className="font-bold text-[#0092DF]">{row.title}</div>
          <div className="text-[10px] text-[#64748B] capitalize">{row.opportunity_type} • {row.location}</div>
        </div>
      ),
    },
    {
      header: 'Deadline',
      accessorKey: 'deadline',
      cell: (row) => <span className="text-xs text-[#1E293B] font-semibold">{row.deadline || 'Ongoing'}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'is_open',
      cell: (row) => (
        <Badge variant={row.is_open ? 'published' : 'draft'}>
          {row.is_open ? 'Open' : 'Closed'}
        </Badge>
      ),
    },
  ];

  const handleOpenAdd = () => {
    setEditingRow(null);
    setFormData({
      title: '',
      opportunity_type: 'fellowship',
      location: 'Kaduna, Nigeria',
      deadline: '',
      is_open: true,
      application_link: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row: OpportunityRecord) => {
    setEditingRow(row);
    setFormData({
      title: row.title,
      opportunity_type: row.opportunity_type,
      location: row.location,
      deadline: row.deadline,
      is_open: row.is_open,
      application_link: row.application_link,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (row: OpportunityRecord) => {
    if (confirm(`Are you sure you want to delete "${row.title}"?`)) {
      try {
        const supabase = createClient();
        await supabase.from('opportunities').delete().eq('id', row.id);
      } catch {}
      setData(data.filter((d) => d.id !== row.id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
    const payload = { ...formData, slug };
    let updated: OpportunityRecord[] = [];

    if (editingRow) {
      updated = data.map((d) => (d.id === editingRow.id ? { ...d, ...formData } : d));
      try {
        await supabase.from('opportunities').update(payload).eq('id', editingRow.id);
      } catch {}
    } else {
      const newItem: OpportunityRecord = { id: String(Date.now()), ...formData };
      updated = [newItem, ...data];
      try {
        const { data: inserted } = await supabase.from('opportunities').insert(payload).select();
        if (inserted && inserted[0]) {
          updated = [inserted[0] as OpportunityRecord, ...data];
        }
      } catch {}
    }

    setData(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecaph_opportunities', JSON.stringify(updated));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] font-sans">
      <AdminHeader title="Opportunities CMS" />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
        <DataTable
          title="Manage Careers &amp; Fellowships"
          description="Post job openings, fellowships, and volunteer applications."
          columns={columns}
          data={data}
          searchKey="title"
          searchPlaceholder="Search opportunities..."
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          addButtonLabel="New Opportunity"
        />
      </main>

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRow ? 'Edit Opportunity' : 'Add New Opportunity'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B]">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. NextGen Public Health Fellow"
              required
              className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Type</label>
              <Select
                value={formData.opportunity_type}
                onChange={(e) => setFormData({ ...formData, opportunity_type: e.target.value as any })}
                className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              >
                <option value="job">Job Opening</option>
                <option value="fellowship">Fellowship</option>
                <option value="volunteer">Volunteer</option>
                <option value="internship">Internship</option>
                <option value="grant">Grant / Funding</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Kaduna, Nigeria"
                className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Application Link</label>
              <Input
                value={formData.application_link}
                onChange={(e) => setFormData({ ...formData, application_link: e.target.value })}
                placeholder="https://..."
                className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Deadline</label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_open"
              checked={formData.is_open}
              onChange={(e) => setFormData({ ...formData, is_open: e.target.checked })}
              className="rounded text-[#0092DF] focus:ring-[#0092DF]"
            />
            <label htmlFor="is_open" className="text-xs font-bold text-[#1E293B]">
              Accepting Applications Currently
            </label>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold">
              Save Opportunity
            </Button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
}
