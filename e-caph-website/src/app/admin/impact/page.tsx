'use client';

import { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { DataTable, type Column } from '@/components/admin/data-table';
import { ModalForm } from '@/components/admin/modal-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

interface ImpactRecord {
  id: string;
  metric_key: string;
  label: string;
  numeric_value: number;
  suffix: string;
  icon_name: string;
  category: string;
  is_published: boolean;
  order_index: number;
}

export default function AdminImpactPage() {
  const [data, setData] = useState<ImpactRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<ImpactRecord | null>(null);

  const [formData, setFormData] = useState<Omit<ImpactRecord, 'id'>>({
    metric_key: '',
    label: '',
    numeric_value: 100,
    suffix: '+',
    icon_name: 'Users',
    category: 'general',
    is_published: true,
    order_index: 1,
  });

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: dbData, error } = await supabase
        .from('impact_statistics')
        .select('*')
        .order('order_index', { ascending: true });

      if (error || !dbData || dbData.length === 0) {
        setData([
          {
            id: '1',
            metric_key: 'youth_reached',
            label: 'Young People Reached',
            numeric_value: 95000,
            suffix: '+',
            icon_name: 'Users',
            category: 'outreach',
            is_published: true,
            order_index: 1,
          },
          {
            id: '2',
            metric_key: 'schools_engaged',
            label: 'Schools & Hubs Engaged',
            numeric_value: 36,
            suffix: '+',
            icon_name: 'HeartPulse',
            category: 'institutions',
            is_published: true,
            order_index: 2,
          },
          {
            id: '3',
            metric_key: 'communities_served',
            label: 'Communities Served',
            numeric_value: 120,
            suffix: '+',
            icon_name: 'ShieldCheck',
            category: 'communities',
            is_published: true,
            order_index: 3,
          },
        ]);
      } else {
        setData(dbData as ImpactRecord[]);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const columns: Column<ImpactRecord>[] = [
    {
      header: 'Metric Label',
      accessorKey: 'label',
      cell: (row) => (
        <div>
          <div className="font-bold text-[#0092DF]">{row.label}</div>
          <div className="text-[10px] text-[#64748B]">{row.metric_key}</div>
        </div>
      ),
    },
    {
      header: 'Value',
      accessorKey: 'numeric_value',
      cell: (row) => (
        <span className="text-sm font-black text-[#1E293B]">
          {row.numeric_value.toLocaleString()}{row.suffix}
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
    setFormData({
      metric_key: 'metric_' + Date.now(),
      label: '',
      numeric_value: 100,
      suffix: '+',
      icon_name: 'Users',
      category: 'general',
      is_published: true,
      order_index: data.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row: ImpactRecord) => {
    setEditingRow(row);
    setFormData({
      metric_key: row.metric_key,
      label: row.label,
      numeric_value: row.numeric_value,
      suffix: row.suffix,
      icon_name: row.icon_name,
      category: row.category,
      is_published: row.is_published,
      order_index: row.order_index,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (row: ImpactRecord) => {
    if (confirm(`Are you sure you want to delete "${row.label}"?`)) {
      try {
        const supabase = createClient();
        await supabase.from('impact_statistics').delete().eq('id', row.id);
      } catch {}
      setData(data.filter((d) => d.id !== row.id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    if (editingRow) {
      try {
        await supabase.from('impact_statistics').update(formData).eq('id', editingRow.id);
      } catch {}
      setData(data.map((d) => (d.id === editingRow.id ? { ...d, ...formData } : d)));
    } else {
      try {
        const { data: inserted } = await supabase.from('impact_statistics').insert(formData).select();
        if (inserted && inserted[0]) {
          setData([...data, inserted[0] as ImpactRecord]);
        } else {
          setData([...data, { id: String(Date.now()), ...formData }]);
        }
      } catch {
        setData([...data, { id: String(Date.now()), ...formData }]);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] font-sans">
      <AdminHeader title="Impact Metrics CMS" />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
        <DataTable
          title="Manage Impact Statistics"
          description="Update outreach numbers, statistics, and impact counters displayed on the homepage and impact page."
          columns={columns}
          data={data}
          searchKey="label"
          searchPlaceholder="Search metrics..."
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          addButtonLabel="New Metric"
        />
      </main>

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRow ? 'Edit Impact Metric' : 'Add Impact Metric'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B]">Metric Label *</label>
            <Input
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="e.g. Young People Reached"
              required
              className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Numeric Value *</label>
              <Input
                type="number"
                value={formData.numeric_value}
                onChange={(e) => setFormData({ ...formData, numeric_value: Number(e.target.value) })}
                placeholder="95000"
                required
                className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Suffix</label>
              <Input
                value={formData.suffix}
                onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                placeholder="+"
                className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              />
            </div>
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
              Display Metric on Impact Page
            </label>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold">
              Save Metric
            </Button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
}
