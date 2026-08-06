'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminLayout } from '@/app/admin/layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import {
  LogOut,
  ExternalLink,
  User,
  Menu,
  Bell,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
} from 'lucide-react';

interface AdminHeaderProps {
  title?: string;
  userEmail?: string;
  userRole?: string;
  onMenuClick?: () => void;
}

export function AdminHeader({
  title = 'CMS Portal',
  userEmail = 'admin@e-caph.org',
  userRole = 'Super Admin',
  onMenuClick,
}: AdminHeaderProps) {
  const router = useRouter();
  const { setMobileOpen } = useAdminLayout();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleMenu = onMenuClick || (() => setMobileOpen(true));


  const notifications = [
    {
      id: 1,
      title: 'New Inquiry Received',
      desc: 'Musa Abdullahi sent a partnership request for Youth Peace Building.',
      time: '12 min ago',
      type: 'inquiry',
    },
    {
      id: 2,
      title: 'System Security Sync',
      desc: 'Role permissions and automated backups verified successfully.',
      time: '1 hour ago',
      type: 'system',
    },
    {
      id: 3,
      title: 'Post Published',
      desc: 'Draft "Kano Maternal Health Rally" was published to main feed.',
      time: '3 hours ago',
      type: 'content',
    },
  ];

  const handleLogout = async () => {
    try {
      // Clear 24h admin session cookie
      document.cookie = 'ecaph_admin_session=; path=/; max-age=0; SameSite=Lax';
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ecaph_admin_user');
      }
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore fallback
    } finally {
      router.push('/admin/login');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between font-sans shrink-0 sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggleMenu}
          className="lg:hidden p-2 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="text-base sm:text-lg font-bold text-[#1E293B] truncate">{title}</h1>
          <Badge className="bg-[#86C127] text-white text-[10px] uppercase font-extrabold px-2 py-0.5 hidden sm:inline-flex">
            Live CMS
          </Badge>
        </div>
      </div>

      {/* Middle: Search Input (Desktop) */}
      <div className="hidden md:flex items-center relative w-64 lg:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <Input
          type="text"
          placeholder="Search modules, posts, messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 rounded-md focus-visible:ring-[#0092DF]"
        />
      </div>

      {/* Right: Actions, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-md hover:bg-slate-100 text-slate-600 transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E67817] ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50 animate-in fade-in-50 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">System Notifications</span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0092DF]">{n.title}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {n.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{n.desc}</p>
                  </div>
                ))}
              </div>

              <div className="px-4 py-2 border-t border-slate-100 text-center">
                <Link
                  href="/admin/messages"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] font-bold text-[#E67817] hover:underline"
                >
                  View All Messages &amp; Alerts
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-[6px] bg-[#F7FAF8] border border-[#E2E8F0]">
          <div className="w-7 h-7 rounded-[4px] bg-[#0092DF] text-white flex items-center justify-center text-xs font-bold shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-[#1E293B] leading-none truncate max-w-[120px]">
              {userEmail}
            </span>
            <span className="text-[10px] text-[#86C127] font-extrabold leading-none mt-0.5">
              {userRole}
            </span>
          </div>
        </div>

        {/* Live Site Shortcut */}
        <Link href="/" target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex">
          <Button variant="outline" size="sm" className="text-xs gap-1.5 h-8">
            <ExternalLink className="w-3.5 h-3.5 text-[#E67817]" />
            Live Site
          </Button>
        </Link>

        {/* Logout Action */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-xs text-[#EF4444] hover:bg-red-50 hover:text-red-700 gap-1.5 h-8 px-2 sm:px-3"
          title="Sign out of Admin Session"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}

