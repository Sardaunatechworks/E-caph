'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/common/logo';
import {
  LayoutDashboard,
  Layers,
  FolderKanban,
  FileText,
  Briefcase,
  Users,
  TrendingUp,
  Mail,
  UserCheck,
  ExternalLink,
  X,
} from 'lucide-react';

interface SidebarProps {
  unreadMessagesCount?: number;
  onCloseMobile?: () => void;
}

export function AdminSidebar({ unreadMessagesCount = 2, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Programmes', href: '/admin/programmes', icon: Layers },
    { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { label: 'Stories & Posts', href: '/admin/posts', icon: FileText },
    { label: 'Opportunities', href: '/admin/opportunities', icon: Briefcase },
    { label: 'Team Members', href: '/admin/team', icon: Users },
    { label: 'Impact Stats', href: '/admin/impact', icon: TrendingUp },
    {
      label: 'Messages',
      href: '/admin/messages',
      icon: Mail,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
    { label: 'Subscribers', href: '/admin/subscribers', icon: UserCheck },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] h-full min-h-screen flex flex-col justify-between font-sans shrink-0">
      <div className="p-6 space-y-6">
        {/* Logo & Close Button for Mobile */}
        <div className="pb-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <Logo />
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Sidebar Nav */}
        <nav className="space-y-1 text-sm font-semibold text-[#64748B]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-[6px] transition-colors ${
                  isActive
                    ? 'bg-[#E6F4FC] text-[#0092DF] font-bold'
                    : 'hover:bg-[#F7FAF8] hover:text-[#1E293B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#0092DF]' : 'text-[#94A3B8]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-[#E67817] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Link to Public Site */}
      <div className="p-4 border-t border-[#E2E8F0] bg-[#F7FAF8]">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-bold text-[#0092DF] hover:bg-white hover:shadow-sm transition-all"
        >
          <span>View Public Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#E67817]" />
        </Link>
      </div>
    </aside>
  );
}

