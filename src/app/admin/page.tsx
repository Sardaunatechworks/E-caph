'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/admin-header';
import {
  BeneficiariesReachChart,
  PillarsDistributionChart,
  InquiryStatusChart,
} from '@/components/admin/dashboard-charts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import {
  Layers,
  FolderKanban,
  FileText,
  Briefcase,
  Plus,
  ArrowRight,
  Mail,
  TrendingUp,
  Activity,
  ShieldCheck,
  HardDrive,
  Download,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  Inbox,
} from 'lucide-react';
import type { ContactMessage, Post } from '@/types/database';

export default function AdminDashboardPage() {
  const [progCount, setProgCount] = useState(0);
  const [projCount, setProjCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [oppCount, setOppCount] = useState(0);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const supabase = createClient();
        const [resProg, resProj, resPost, resOpp, resMsg, resP] = await Promise.all([
          supabase.from('programmes').select('*', { count: 'exact', head: true }),
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('posts').select('*', { count: 'exact', head: true }),
          supabase.from('opportunities').select('*', { count: 'exact', head: true }),
          supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(4),
          supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(4),
        ]);

        if (resProg.count != null) setProgCount(resProg.count);
        if (resProj.count != null) setProjCount(resProj.count);
        if (resPost.count != null) setPostCount(resPost.count);
        if (resOpp.count != null) setOppCount(resOpp.count);
        if (resMsg.data) setRecentMessages(resMsg.data as ContactMessage[]);
        if (resP.data) setRecentPosts(resP.data as Post[]);
      } catch {}
      setLoaded(true);
    };

    fetchDashboardData();
  }, []);

  const metrics = [
    {
      label: 'Core Programmes',
      value: progCount,
      icon: Layers,
      href: '/admin/programmes',
      color: 'text-[#0092DF]',
      bg: 'bg-[#E6F4FC]',
    },
    {
      label: 'Active Projects',
      value: projCount,
      icon: FolderKanban,
      href: '/admin/projects',
      color: 'text-[#86C127]',
      bg: 'bg-[#F3F9E9]',
    },
    {
      label: 'Published Stories',
      value: postCount,
      icon: FileText,
      href: '/admin/posts',
      color: 'text-[#0092DF]',
      bg: 'bg-[#E6F4FC]',
    },
    {
      label: 'Opportunities',
      value: oppCount,
      icon: Briefcase,
      href: '/admin/opportunities',
      color: 'text-[#E67817]',
      bg: 'bg-[#FEF3EA]',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] font-sans">
      <AdminHeader title="Executive Overview" />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
        {/* Executive Welcome Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-[#86C127] text-white text-[10px] font-black uppercase px-2 py-0.5">
                Executive Control Hub
              </Badge>
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#0092DF]" /> Live Syncing
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0092DF]">
              e-CAPH Administrative Portal
            </h2>
            <p className="text-xs text-slate-600 max-w-2xl">
              Monitor real-time public health outreach, peace-building initiatives, community messages, field stories, and infrastructure diagnostics across Nigeria.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/admin/posts">
              <Button size="sm" className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold text-xs gap-1.5 h-9">
                <Plus className="w-4 h-4" /> New Article
              </Button>
            </Link>
            <Link href="/admin/projects">
              <Button size="sm" variant="outline" className="text-xs font-bold gap-1.5 h-9 border-slate-300">
                <Plus className="w-4 h-4" /> New Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <Link
                key={idx}
                href={m.href}
                className="p-5 sm:p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-lg ${m.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${m.color}`} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#1E293B]">{m.value}</div>
                  <div className="text-xs font-bold text-slate-500">{m.label}</div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Analytics & Visualizations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Area Chart: Beneficiaries Reach */}
          <div className="lg:col-span-2 p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-[#1E293B] text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#0092DF]" />
                  Beneficiary Outreach &amp; Engagement
                </h3>
                <p className="text-xs text-slate-500">Monthly community members reached across northern Nigeria.</p>
              </div>
            </div>
            <BeneficiariesReachChart />
          </div>

          {/* Bar Chart: Programmatic Pillars */}
          <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-[#1E293B] text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#86C127]" />
                  Thematic Pillar Distribution
                </h3>
                <p className="text-xs text-slate-500">Active project count per focus area.</p>
              </div>
            </div>
            <PillarsDistributionChart />
            <div className="pt-2 border-t border-slate-100 text-center">
              <Link href="/admin/programmes" className="text-xs font-bold text-[#0092DF] hover:underline">
                Manage Programme Pillars &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Inquiries & Publications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Contact Inquiries Inbox */}
          <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0092DF]" />
                <h3 className="font-bold text-[#1E293B] text-base">Recent Inbox Inquiries</h3>
              </div>
              <Link href="/admin/messages" className="text-xs font-bold text-[#E67817] hover:underline">
                View All Inquiries
              </Link>
            </div>

            <div className="space-y-3">
              {recentMessages.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <Inbox className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-400 font-medium">No inquiries yet</p>
                </div>
              ) : (
                recentMessages.map((msg) => (
                  <div key={msg.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0092DF]">{msg.name}</span>
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {msg.inquiry_type}
                      </Badge>
                    </div>
                    <p className="text-xs font-bold text-[#1E293B]">{msg.subject}</p>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{msg.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Published Field Stories */}
          <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#86C127]" />
                <h3 className="font-bold text-[#1E293B] text-base">Recent Field Stories</h3>
              </div>
              <Link href="/admin/posts" className="text-xs font-bold text-[#E67817] hover:underline">
                Manage Stories
              </Link>
            </div>

            <div className="space-y-3">
              {recentPosts.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-400 font-medium">No posts yet — create your first article!</p>
                </div>
              ) : (
                recentPosts.map((post) => (
                  <div key={post.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1E293B] line-clamp-1">{post.title}</span>
                      <Badge variant={post.status === 'published' ? 'published' : 'draft'}>
                        {post.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{post.summary}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
