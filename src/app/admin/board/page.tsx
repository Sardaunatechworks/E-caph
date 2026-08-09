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
import { Upload, X, Camera, Award } from 'lucide-react';
import type { BoardMember } from '@/types/database';

export default function AdminBoardPage() {
  const [data, setData] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<BoardMember | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState<Omit<BoardMember, 'id' | 'created_at' | 'updated_at'>>({
    full_name: '',
    board_role: '',
    bio: '',
    avatar_url: '',
    email: '',
    linkedin_url: '',
    twitter_url: '',
    order_index: 1,
    is_active: true,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      // 1. Read file locally as Data URL for instant preview
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Url = event.target?.result as string;
        setFormData((prev) => ({ ...prev, avatar_url: base64Url }));

        // 2. Attempt Supabase Storage upload if available
        try {
          const supabase = createClient();
          const fileExt = file.name.split('.').pop();
          const fileName = `board_${Date.now()}.${fileExt}`;
          const filePath = `avatars/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(filePath, file, { upsert: true });

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from('media')
              .getPublicUrl(filePath);
            if (publicUrlData?.publicUrl) {
              setFormData((prev) => ({ ...prev, avatar_url: publicUrlData.publicUrl }));
            }
          }
        } catch {
          // Supabase storage optional fallback
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const fetchBoardMembers = async () => {
    setLoading(true);
    const defaultList: BoardMember[] = [
      {
        id: '1',
        full_name: 'Dr. Hauwa Mustapha',
        board_role: 'Chairman, Board of Trustees',
        bio: 'Renowned public health strategist and governance advisor.',
        avatar_url: '',
        email: 'info@e-caph.org',
        linkedin_url: '#',
        twitter_url: '#',
        order_index: 1,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        full_name: 'Barr. Usman Danjuma',
        board_role: 'Board Trustee & Legal Counsel',
        bio: 'Human rights lawyer and legal reform advocate.',
        avatar_url: '',
        email: 'info@e-caph.org',
        linkedin_url: '#',
        twitter_url: '#',
        order_index: 2,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        full_name: 'Prof. Aliyu Bawa',
        board_role: 'Trustee - Health Research & Evaluation',
        bio: 'Professor of Community Medicine and Epidemiology.',
        avatar_url: '',
        email: 'info@e-caph.org',
        linkedin_url: '#',
        twitter_url: '#',
        order_index: 3,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '4',
        full_name: 'Hajiya Amina Bello',
        board_role: 'Trustee - Gender & Peace Cohesion',
        bio: 'Grassroots peace mediator and women advocate.',
        avatar_url: '',
        email: 'info@e-caph.org',
        linkedin_url: '#',
        twitter_url: '#',
        order_index: 4,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    let currentList = defaultList;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecaph_board_members');
      if (saved) {
        try { currentList = JSON.parse(saved); } catch {}
      }
    }

    try {
      const supabase = createClient();
      const { data: dbData, error } = await supabase
        .from('board_members')
        .select('*')
        .order('order_index', { ascending: true });

      if (!error && dbData && dbData.length > 0) {
        currentList = dbData as BoardMember[];
      }
    } catch {
      // Fallback
    } finally {
      setData(currentList);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardMembers();
  }, []);

  const columns: Column<BoardMember>[] = [
    {
      header: 'Board Member',
      accessorKey: 'full_name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[6px] bg-[#86C127] text-white flex items-center justify-center text-xs font-extrabold shrink-0 overflow-hidden shadow-xs">
            {row.avatar_url ? (
              <img src={row.avatar_url} alt={row.full_name} className="w-full h-full object-cover" />
            ) : (
              row.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2)
            )}
          </div>
          <div>
            <div className="font-bold text-[#0092DF]">{row.full_name}</div>
            <div className="text-[10px] text-[#E67817] font-bold">{row.board_role}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Email',
      accessorKey: 'email',
      cell: (row) => <span className="text-xs text-[#64748B]">{row.email || '—'}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'is_active',
      cell: (row) => (
        <Badge variant={row.is_active ? 'published' : 'draft'}>
          {row.is_active ? 'Active Trustee' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const handleOpenAdd = () => {
    setEditingRow(null);
    setFormData({
      full_name: '',
      board_role: '',
      bio: '',
      avatar_url: '',
      email: '',
      linkedin_url: '',
      twitter_url: '',
      order_index: data.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row: BoardMember) => {
    setEditingRow(row);
    setFormData({
      full_name: row.full_name,
      board_role: row.board_role,
      bio: row.bio || '',
      avatar_url: row.avatar_url || '',
      email: row.email || '',
      linkedin_url: row.linkedin_url || '',
      twitter_url: row.twitter_url || '',
      order_index: row.order_index,
      is_active: row.is_active,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (row: BoardMember) => {
    if (confirm(`Are you sure you want to remove "${row.full_name}" from Board Members?`)) {
      const updated = data.filter((d) => d.id !== row.id);
      setData(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('ecaph_board_members', JSON.stringify(updated));
        window.dispatchEvent(new Event('ecaph_board_updated'));
      }
      try {
        const supabase = createClient();
        await supabase.from('board_members').delete().eq('id', row.id);
      } catch {}
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    let updated: BoardMember[] = [];

    if (editingRow) {
      updated = data.map((d) => (d.id === editingRow.id ? ({ ...d, ...formData } as BoardMember) : d));
      try {
        await supabase.from('board_members').update(formData).eq('id', editingRow.id);
      } catch {}
    } else {
      const newItem: BoardMember = {
        id: String(Date.now()),
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      updated = [...data, newItem];
      try {
        const { data: inserted } = await supabase.from('board_members').insert(formData).select();
        if (inserted && inserted[0]) {
          updated = [...data, inserted[0] as BoardMember];
        }
      } catch {}
    }

    setData(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecaph_board_members', JSON.stringify(updated));
      window.dispatchEvent(new Event('ecaph_board_updated'));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] font-sans">
      <AdminHeader title="Board of Members CMS" />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
        <DataTable
          title="Manage Governing Board &amp; Trustees"
          description="Add, edit, reorder, and update profile pictures for Board Members."
          columns={columns}
          data={data}
          searchKey="full_name"
          searchPlaceholder="Search board members..."
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          addButtonLabel="New Board Member"
        />
      </main>

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRow ? 'Edit Board Member' : 'Add Board Member'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Full Name *</label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="e.g. Dr. Hauwa Mustapha"
                required
                className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Board Role / Title *</label>
              <Input
                value={formData.board_role}
                onChange={(e) => setFormData({ ...formData, board_role: e.target.value })}
                placeholder="e.g. Chairman, Board of Trustees"
                required
                className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              />
            </div>
          </div>

          {/* Local Image File Uploader */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1E293B]">Profile Picture (Avatar)</label>

            <div className="flex items-center gap-4 p-3 border border-[#E2E8F0] rounded-[8px] bg-[#F8FAFC]">
              {/* Avatar Preview Box */}
              <div className="w-14 h-14 rounded-[8px] bg-[#86C127] text-white flex items-center justify-center text-lg font-bold shrink-0 overflow-hidden shadow-sm relative">
                {formData.avatar_url ? (
                  <img src={formData.avatar_url} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  formData.full_name ? formData.full_name.split(' ').map(n => n[0]).join('').slice(0, 2) : <Camera className="w-6 h-6" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold text-xs rounded-[6px] transition-colors shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    {uploadingImage ? 'Uploading...' : 'Choose File from Computer'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {formData.avatar_url && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData({ ...formData, avatar_url: '' })}
                      className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8"
                    >
                      <X className="w-3.5 h-3.5 mr-1" /> Remove
                    </Button>
                  )}
                </div>

                <p className="text-[11px] text-[#64748B]">
                  Upload JPG, PNG, or WEBP photo from local computer, or paste a URL below.
                </p>

                <Input
                  value={formData.avatar_url || ''}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  placeholder="Or paste image URL (https://...)"
                  className="bg-white border-[#E2E8F0] h-8 text-[11px] rounded-[4px]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Email Address</label>
              <Input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@e-caph.org"
                className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">LinkedIn URL</label>
              <Input
                value={formData.linkedin_url || ''}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B]">Biography</label>
            <Textarea
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Background, qualifications, and governance roles..."
              rows={3}
              className="bg-white border-[#E2E8F0] text-xs rounded-[6px]"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_active_board"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded text-[#0092DF] focus:ring-[#0092DF]"
            />
            <label htmlFor="is_active_board" className="text-xs font-bold text-[#1E293B]">
              Show Profile on Board Page
            </label>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold">
              Save Board Member
            </Button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
}
