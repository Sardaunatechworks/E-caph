import Link from 'next/link';
import { AdminHeader } from '@/components/admin/admin-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import {
  Layers,
  FolderKanban,
  FileText,
  Briefcase,
  Users,
  TrendingUp,
  Mail,
  Plus,
  ArrowRight,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import type { ContactMessage, Post, Project } from '@/types/database';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: progCount }, { count: projCount }, { count: postCount }, { count: oppCount }, { data: dbMessages }, { data: dbPosts }] =
    await Promise.all([
      supabase.from('programmes').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('posts').select('*', { count: 'exact', head: true }),
      supabase.from('opportunities').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(4),
      supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(4),
    ]);

  const recentMessages = (dbMessages as ContactMessage[] | null) || [];
  const recentPosts = (dbPosts as Post[] | null) || [];

  const metrics = [
    { label: 'Core Programmes', value: progCount || 6, icon: Layers, href: '/admin/programmes', color: 'text-[#0092DF]' },
    { label: 'Active Projects', value: projCount || 5, icon: FolderKanban, href: '/admin/projects', color: 'text-[#86C127]' },
    { label: 'Published Stories', value: postCount || 3, icon: FileText, href: '/admin/posts', color: 'text-[#0092DF]' },
    { label: 'Open Opportunities', value: oppCount || 2, icon: Briefcase, href: '/admin/opportunities', color: 'text-[#E67817]' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] font-sans">
      <AdminHeader title="Executive Overview" />

      <main className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[10px] bg-white border border-[#E2E8F0] brand-shadow">
          <div>
            <Badge className="bg-[#86C127] text-white text-[10px] font-extrabold uppercase mb-1">
              Dashboard Overview
            </Badge>
            <h2 className="text-2xl font-extrabold text-[#0092DF]">Welcome to e-CAPH CMS</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Manage public health programmes, flagship initiatives, news, team profiles, and community outreach.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/posts">
              <Button size="sm" className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold text-xs gap-1.5">
                <Plus className="w-4 h-4" /> New Article
              </Button>
            </Link>
            <Link href="/admin/projects">
              <Button size="sm" variant="secondary" className="text-xs font-bold gap-1.5">
                <Plus className="w-4 h-4" /> New Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <Link
                key={idx}
                href={m.href}
                className="p-6 rounded-[10px] bg-white border border-[#E2E8F0] brand-shadow hover:brand-shadow-lg transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-[6px] bg-[#F7FAF8] border border-[#E2E8F0] flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${m.color}`} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#E67817] transition-colors" />
                </div>
                <div>
                  <div className="text-3xl font-black text-[#1E293B]">{m.value}</div>
                  <div className="text-xs font-bold text-[#64748B]">{m.label}</div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Activity & Inbox Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Contact Messages */}
          <div className="p-6 rounded-[10px] bg-white border border-[#E2E8F0] brand-shadow space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0092DF]" />
                <h3 className="font-bold text-[#1E293B] text-base">Recent Inbox Inquiries</h3>
              </div>
              <Link href="/admin/messages" className="text-xs font-bold text-[#E67817] hover:underline">
                View All Messages
              </Link>
            </div>

            {recentMessages.length > 0 ? (
              <div className="space-y-3">
                {recentMessages.map((msg) => (
                  <div key={msg.id} className="p-3.5 rounded-[6px] bg-[#F7FAF8] border border-[#E2E8F0] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0092DF]">{msg.name}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {msg.inquiry_type}
                      </Badge>
                    </div>
                    <p className="text-xs font-semibold text-[#1E293B]">{msg.subject}</p>
                    <p className="text-[11px] text-[#64748B] line-clamp-1">{msg.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#64748B]">No recent contact messages.</div>
            )}
          </div>

          {/* Recent Posts & Updates */}
          <div className="p-6 rounded-[10px] bg-white border border-[#E2E8F0] brand-shadow space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#86C127]" />
                <h3 className="font-bold text-[#1E293B] text-base">Recent Field Stories</h3>
              </div>
              <Link href="/admin/posts" className="text-xs font-bold text-[#E67817] hover:underline">
                Manage Posts
              </Link>
            </div>

            {recentPosts.length > 0 ? (
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <div key={post.id} className="p-3.5 rounded-[6px] bg-[#F7FAF8] border border-[#E2E8F0] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1E293B] line-clamp-1">{post.title}</span>
                      <Badge variant={post.status === 'published' ? 'published' : 'draft'}>
                        {post.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#64748B] line-clamp-1">{post.summary}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#64748B]">No recent posts available.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
