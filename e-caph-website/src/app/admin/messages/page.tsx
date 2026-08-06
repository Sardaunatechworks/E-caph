'use client';

import { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { DataTable, type Column } from '@/components/admin/data-table';
import { ModalForm } from '@/components/admin/modal-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface MessageRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  inquiry_type: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  created_at: string;
}

export default function AdminMessagesPage() {
  const [data, setData] = useState<MessageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<MessageRecord | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: dbData, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !dbData || dbData.length === 0) {
        setData([
          {
            id: '1',
            name: 'Dr. Aminu Bello',
            email: 'bello@health-advocates.org',
            phone: '+234 803 123 4567',
            organization: 'Health Advocates Initiative',
            inquiry_type: 'Partnership Inquiry',
            subject: 'Collaboration on Maternal Healthcare Delivery',
            message: 'Greetings e-CAPH team. We would like to inquire about joint programming on adolescent health.',
            status: 'unread',
            created_at: '2026-08-05 10:14',
          },
          {
            id: '2',
            name: 'Fatima Abubakar',
            email: 'fatima@youthlead.ng',
            phone: '+234 802 987 6543',
            organization: 'Youth Lead Network',
            inquiry_type: 'Volunteering',
            subject: 'Youth Advocate Volunteer Application',
            message: 'I am writing to express my interest in volunteering with e-CAPH for the NextGen fellowship.',
            status: 'read',
            created_at: '2026-08-04 14:30',
          },
        ]);
      } else {
        setData(dbData as MessageRecord[]);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const columns: Column<MessageRecord>[] = [
    {
      header: 'Sender',
      accessorKey: 'name',
      cell: (row) => (
        <div>
          <div className="font-bold text-[#0092DF]">{row.name}</div>
          <div className="text-[10px] text-[#64748B]">{row.email} • {row.organization || 'Individual'}</div>
        </div>
      ),
    },
    {
      header: 'Inquiry & Subject',
      accessorKey: 'subject',
      cell: (row) => (
        <div>
          <Badge variant="outline" className="text-[10px] text-[#86C127] border-[#86C127]/30 mb-1">
            {row.inquiry_type}
          </Badge>
          <div className="text-xs font-semibold text-[#1E293B] line-clamp-1">{row.subject}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge variant={row.status === 'unread' ? 'draft' : 'published'} className="capitalize">
          {row.status}
        </Badge>
      ),
    },
  ];

  const handleView = async (row: MessageRecord) => {
    setSelectedRecord(row);
    if (row.status === 'unread') {
      try {
        const supabase = createClient();
        await supabase.from('contact_messages').update({ status: 'read' }).eq('id', row.id);
      } catch {}
      setData(data.map((d) => (d.id === row.id ? { ...d, status: 'read' } : d)));
    }
  };

  const handleDelete = async (row: MessageRecord) => {
    if (confirm(`Are you sure you want to delete message from "${row.name}"?`)) {
      try {
        const supabase = createClient();
        await supabase.from('contact_messages').delete().eq('id', row.id);
      } catch {}
      setData(data.filter((d) => d.id !== row.id));
    }
  };

  const handleToggleReplied = async () => {
    if (!selectedRecord) return;
    const newStatus = selectedRecord.status === 'replied' ? 'read' : 'replied';

    try {
      const supabase = createClient();
      await supabase.from('contact_messages').update({ status: newStatus }).eq('id', selectedRecord.id);
    } catch {}

    setData(
      data.map((d) => (d.id === selectedRecord.id ? { ...d, status: newStatus } : d))
    );
    setSelectedRecord(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] font-sans">
      <AdminHeader title="Messages Inbox CMS" />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
        <DataTable
          title="Contact Submissions &amp; Partnership Inquiries"
          description="View, process, and respond to incoming contact forms from the live website."
          columns={columns}
          data={data}
          searchKey="name"
          searchPlaceholder="Search messages..."
          onView={handleView}
          onDelete={handleDelete}
        />
      </main>

      <ModalForm
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title="Contact Message Details"
      >
        {selectedRecord && (
          <div className="space-y-4 text-xs text-[#1E293B]">
            <div className="p-4 rounded-[6px] bg-[#F7FAF8] border border-[#E2E8F0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0092DF] text-sm">{selectedRecord.name}</span>
                <Badge variant={selectedRecord.status === 'unread' ? 'draft' : 'published'}>
                  {selectedRecord.status}
                </Badge>
              </div>
              <div className="text-[#64748B] space-y-0.5">
                <div>Email: <a href={`mailto:${selectedRecord.email}`} className="text-[#0092DF] underline">{selectedRecord.email}</a></div>
                <div>Phone: {selectedRecord.phone || 'N/A'}</div>
                <div>Organization: {selectedRecord.organization || 'N/A'}</div>
                <div>Received: {selectedRecord.created_at}</div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-[#1E293B]">Subject:</span>
              <p className="text-sm font-semibold text-[#0092DF]">{selectedRecord.subject}</p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-[#1E293B]">Message Content:</span>
              <div className="p-4 rounded-[6px] bg-white border border-[#E2E8F0] text-xs text-[#64748B] leading-relaxed whitespace-pre-wrap">
                {selectedRecord.message}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] flex justify-between items-center">
              <Button
                variant="outline"
                type="button"
                onClick={handleToggleReplied}
                className="text-xs gap-1.5"
              >
                <CheckCircle className="w-4 h-4 text-[#86C127]" />
                {selectedRecord.status === 'replied' ? 'Mark as Unreplied' : 'Mark as Replied'}
              </Button>
              <Button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold"
              >
                Close View
              </Button>
            </div>
          </div>
        )}
      </ModalForm>
    </div>
  );
}
