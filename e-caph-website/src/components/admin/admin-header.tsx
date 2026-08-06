'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { LogOut, ExternalLink, ShieldCheck, User } from 'lucide-react';

interface AdminHeaderProps {
  title?: string;
  userEmail?: string;
  userRole?: string;
}

export function AdminHeader({
  title = 'CMS Portal',
  userEmail = 'admin@e-caph.org',
  userRole = 'Super Admin',
}: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/admin/login');
    } catch {
      router.push('/admin/login');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between font-sans shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-[#1E293B]">{title}</h1>
        <Badge className="bg-[#86C127] text-white text-[10px] uppercase font-extrabold px-2 py-0.5">
          Live CMS
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        {/* User Badge */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-[6px] bg-[#F7FAF8] border border-[#E2E8F0]">
          <div className="w-7 h-7 rounded-[4px] bg-[#0092DF] text-white flex items-center justify-center text-xs font-bold">
            <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-[#1E293B] leading-none">{userEmail}</span>
            <span className="text-[10px] text-[#86C127] font-extrabold leading-none mt-0.5">
              {userRole}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <Link href="/" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="text-xs gap-1.5">
            <ExternalLink className="w-3.5 h-3.5 text-[#E67817]" />
            Live Site
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-xs text-[#EF4444] hover:bg-red-50 hover:text-red-700 gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </Button>
      </div>
    </header>
  );
}
