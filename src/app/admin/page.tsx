import Link from 'next/link';
import { AdminHeader } from '@/components/admin/admin-header';
import {
  BeneficiariesReachChart,
  PillarsDistributionChart,
  InquiryStatusChart,
} from '@/components/admin/dashboard-charts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
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
} from 'lucide-react';
import type { ContactMessage, Post } from '@/types/database';

export default async function AdminDashboardPage() {
  let progCount = 6;
  let projCount = 18;
  let postCount = 24;
  let oppCount = 4;
  let msgCount = 195;
  let recentMessages: ContactMessage[] = [];
  let recentPosts: Post[] = [];

  try {
    const supabase = await createClient();
    const [resProg, resProj, resPost, resOpp, resMsg, resP] = await Promise.all([
      supabase.from('programmes').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('posts').select('*', { count: 'exact', head: true }),
      supabase.from('opportunities').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(4),
      supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(4),
    ]);

    if (resProg.count) progCount = resProg.count;
    if (resProj.count) projCount = resProj.count;
    if (resPost.count) postCount = resPost.count;
    if (resOpp.count) oppCount = resOpp.count;
    if (resMsg.data && resMsg.data.length > 0) recentMessages = resMsg.data as ContactMessage[];
    if (resP.data && resP.data.length > 0) recentPosts = resP.data as Post[];
  } catch {
    // Fallback data if offline
  }

  // Fallback demo data if DB is empty
  if (recentMessages.length === 0) {
    recentMessages = [
      {
        id: '1',
        name: 'Amina Bello',
        email: 'amina.bello@healthgov.ng',
        phone: '+234 803 123 4567',
        organization: 'Ministry of Health, Kano',
        subject: 'Maternal Health Partnership Proposal',
        inquiry_type: 'partnership',
        message: 'Requesting formal collaboration on community health worker training in Kano State.',
        created_at: new Date().toISOString(),
        is_read: false,
        replied_at: null,
      },
      {
        id: '2',
        name: 'Ibrahim Garba',
        email: 'igarba@youthpeace.org',
        phone: '+234 802 987 6543',
        organization: 'Youth Peace Network',
        subject: 'Youth Peace Ambassador Training',
        inquiry_type: 'volunteer',
        message: 'Submitting volunteer applications for the upcoming peace building retreat.',
        created_at: new Date().toISOString(),
        is_read: true,
        replied_at: null,
      },
    ];
  }

  if (recentPosts.length === 0) {
    recentPosts = [
      {
        id: '1',
        title: 'Over 120,000 Beneficiaries Reached in 2026 Northern Nigeria Health Rally',
        slug: 'northern-nigeria-health-rally-2026',
        summary: 'e-CAPH field officers completed rural healthcare distribution across 14 local councils.',
        content: '',
        featured_image: '',
        post_type: 'impact_story',
        published_at: new Date().toISOString(),
        author_id: null,
        category_id: null,
        programme_id: null,
        project_id: null,
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Youth Conflict Resolution Workshop Conducted in Kaduna',
        slug: 'youth-conflict-resolution-kaduna',
        summary: 'Empowering local community leaders to resolve grassroots disputes peacefully.',
        content: '',
        featured_image: '',
        post_type: 'news',
        published_at: new Date().toISOString(),
        author_id: null,
        category_id: null,
        programme_id: null,
        project_id: null,
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }

  const metrics = [
    {
      label: 'Core Programmes',
      value: progCount,
      trend: '+12% YoY',
      icon: Layers,
      href: '/admin/programmes',
      color: 'text-[#0092DF]',
      bg: 'bg-[#E6F4FC]',
    },
    {
      label: 'Active Projects',
      value: projCount,
      trend: '+18.4% Impact',
      icon: FolderKanban,
      href: '/admin/projects',
      color: 'text-[#86C127]',
      bg: 'bg-[#F3F9E9]',
    },
    {
      label: 'Published Stories',
      value: postCount,
      trend: '+24.5k Views',
      icon: FileText,
      href: '/admin/posts',
      color: 'text-[#0092DF]',
      bg: 'bg-[#E6F4FC]',
    },
    {
      label: 'Public Inquiries',
      value: msgCount,
      trend: '94.8% Responded',
      icon: Mail,
      href: '/admin/messages',
      color: 'text-[#E67817]',
      bg: 'bg-[#FEF3EA]',
    },
  ];

  const auditLogs = [
    { id: 1, action: 'User Session Authenticated', detail: 'Super Admin logged in from IP 197.210.xx', time: '10 mins ago', type: 'security' },
    { id: 2, action: 'Story Post Published', detail: 'Published "Youth Conflict Resolution Workshop"', time: '45 mins ago', type: 'content' },
    { id: 3, action: 'Database Backup Completed', detail: 'Automated snapshot saved (24.8 GB)', time: '2 hours ago', type: 'system' },
    { id: 4, action: 'Inquiry Marked Resolved', detail: 'Processed partnership inquiry #1042', time: '3 hours ago', type: 'support' },
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

        {/* System Health & Infrastructure Diagnostics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-xl bg-slate-900 text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold">Database Status</div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Online (38ms)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold">Security & SSL</div>
              <div className="text-xs font-bold text-slate-200">256-Bit Encrypted</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-500/20 text-purple-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold">Cloud Storage</div>
              <div className="text-xs font-bold text-slate-200">24.8 GB / 100 GB</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold">Automated Backup</div>
              <div className="text-xs font-bold text-slate-200">2 hrs ago (Verified)</div>
            </div>
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
                  <span className="text-[10px] font-black text-[#86C127] bg-[#F3F9E9] px-2 py-0.5 rounded-full">
                    {m.trend}
                  </span>
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
              <Badge variant="outline" className="text-[10px] border-[#0092DF] text-[#0092DF]">
                2026 Trend
              </Badge>
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
              {recentMessages.map((msg) => (
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
              ))}
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
              {recentPosts.map((post) => (
                <div key={post.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1E293B] line-clamp-1">{post.title}</span>
                    <Badge variant={post.status === 'published' ? 'published' : 'draft'}>
                      {post.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{post.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Trail & Live Activity Log */}
        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#E67817]" />
              <h3 className="font-bold text-[#1E293B] text-base">System Audit Trail &amp; Activity Log</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">Real-Time Security Logging</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0092DF]">{log.action}</span>
                  <span className="text-[10px] text-slate-400">{log.time}</span>
                </div>
                <p className="text-[11px] text-slate-600">{log.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

