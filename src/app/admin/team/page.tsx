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
import { Upload, X, Camera } from 'lucide-react';

interface TeamRecord {
  id: string;
  full_name: string;
  role_title: string;
  bio: string;
  avatar_url: string;
  email: string;
  linkedin_url: string;
  is_active: boolean;
  order_index: number;
}

export default function AdminTeamPage() {
  const [data, setData] = useState<TeamRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<TeamRecord | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState<Omit<TeamRecord, 'id'>>({
    full_name: '',
    role_title: '',
    bio: '',
    avatar_url: '',
    email: '',
    linkedin_url: '',
    is_active: true,
    order_index: 1,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      // 1. Read file locally as Data URL for instant display
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Url = event.target?.result as string;
        setFormData((prev) => ({ ...prev, avatar_url: base64Url }));

        // 2. Attempt Supabase Storage upload if available
        try {
          const supabase = createClient();
          const fileExt = file.name.split('.').pop();
          const fileName = `team_${Date.now()}.${fileExt}`;
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

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: dbData, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true });

      if (error || !dbData || dbData.length === 0) {
        setData([
          {
            id: '1',
            full_name: 'Abdulmumin Rabiu',
            role_title: 'Executive Director & Founder',
            bio: 'Abdulmumin is a dynamic community development leader with extensive expertise in project management, strategic program leadership, and community engagement.',
            avatar_url: '',
            email: 'caph4dev35@gmail.com',
            linkedin_url: '#',
            is_active: true,
            order_index: 1,
          },
          {
            id: '2',
            full_name: 'Khadija Lawal Aliyu',
            role_title: 'Gender Thematic Lead',
            bio: 'Providing leadership on gender equality, human rights, and social inclusion programming.',
            avatar_url: '',
            email: 'caph4dev35@gmail.com',
            linkedin_url: '#',
            is_active: true,
            order_index: 2,
          },
          {
            id: '3',
            full_name: 'Fatima Muftau',
            role_title: 'Monitoring & Evaluation (M&E) Lead',
            bio: 'Fatima Muftau is a dedicated Monitoring & Evaluation professional with expertise in data collection, analysis, and program assessment.',
            avatar_url: '',
            email: 'caph4dev35@gmail.com',
            linkedin_url: '#',
            is_active: true,
            order_index: 3,
          },
          {
            id: '4',
            full_name: 'Muhammed Sani Kabir',
            role_title: 'Communications Lead',
            bio: 'Muhammed Sani Kabir is a creative and impact-driven Communications Lead with expertise in digital advocacy and strategic messaging.',
            avatar_url: '',
            email: 'caph4dev35@gmail.com',
            linkedin_url: '#',
            is_active: true,
            order_index: 4,
          },
          {
            id: '5',
            full_name: 'Zakiyya Said Abdulkadir',
            role_title: 'Health Thematic Lead',
            bio: 'Providing technical leadership for community and primary healthcare programs, including adolescent and youth health interventions.',
            avatar_url: '',
            email: 'caph4dev35@gmail.com',
            linkedin_url: '#',
            is_active: true,
            order_index: 5,
          },
        ]);
      } else {
        setData(dbData as TeamRecord[]);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const columns: Column<TeamRecord>[] = [
    {
      header: 'Member Name',
      accessorKey: 'full_name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[4px] bg-[#0092DF] text-white flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
            {row.avatar_url ? (
              <img src={row.avatar_url} alt={row.full_name} className="w-full h-full object-cover" />
            ) : (
              row.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2)
            )}
          </div>
          <div>
            <div className="font-bold text-[#0092DF]">{row.full_name}</div>
            <div className="text-[10px] text-[#86C127] font-semibold">{row.role_title}</div>
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
          {row.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const handleOpenAdd = () => {
    setEditingRow(null);
    setFormData({
      full_name: '',
      role_title: '',
      bio: '',
      avatar_url: '',
      email: '',
      linkedin_url: '',
      is_active: true,
      order_index: data.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row: TeamRecord) => {
    setEditingRow(row);
    setFormData({
      full_name: row.full_name,
      role_title: row.role_title,
      bio: row.bio,
      avatar_url: row.avatar_url,
      email: row.email,
      linkedin_url: row.linkedin_url,
      is_active: row.is_active,
      order_index: row.order_index,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (row: TeamRecord) => {
    if (confirm(`Are you sure you want to delete "${row.full_name}"?`)) {
      try {
        const supabase = createClient();
        await supabase.from('team_members').delete().eq('id', row.id);
      } catch {}
      setData(data.filter((d) => d.id !== row.id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    if (editingRow) {
      try {
        await supabase.from('team_members').update(formData).eq('id', editingRow.id);
      } catch {}
      setData(data.map((d) => (d.id === editingRow.id ? { ...d, ...formData } : d)));
    } else {
      try {
        const { data: inserted } = await supabase.from('team_members').insert(formData).select();
        if (inserted && inserted[0]) {
          setData([...data, inserted[0] as TeamRecord]);
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
      <AdminHeader title="Team Members CMS" />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
        <DataTable
          title="Manage Leadership &amp; Staff Profiles"
          description="Update staff profile pictures, role titles, bios, and order index."
          columns={columns}
          data={data}
          searchKey="full_name"
          searchPlaceholder="Search team members..."
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          addButtonLabel="New Team Member"
        />
      </main>

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRow ? 'Edit Team Member' : 'Add Team Member'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Full Name *</label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Full Name"
                required
                className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Role Title *</label>
              <Input
                value={formData.role_title}
                onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                placeholder="e.g. Public Health Specialist"
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
              <div className="w-14 h-14 rounded-[8px] bg-[#0092DF] text-white flex items-center justify-center text-lg font-bold shrink-0 overflow-hidden shadow-sm relative">
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
                  Select an image file (JPG, PNG, WEBP) from your local computer or paste a URL below.
                </p>

                <Input
                  value={formData.avatar_url}
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@e-caph.org"
                className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">LinkedIn URL</label>
              <Input
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E293B]">Biography</label>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Brief professional background..."
              rows={3}
              className="bg-white border-[#E2E8F0] text-xs rounded-[6px]"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded text-[#0092DF] focus:ring-[#0092DF]"
            />
            <label htmlFor="is_active" className="text-xs font-bold text-[#1E293B]">
              Show Profile on Team Page
            </label>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold">
              Save Member Profile
            </Button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
}
