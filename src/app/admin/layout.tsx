'use client';

import { useState, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

interface AdminLayoutContextType {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType>({
  mobileOpen: false,
  setMobileOpen: () => {},
});

export const useAdminLayout = () => useContext(AdminLayoutContext);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If on login page, render standalone page without dashboard chrome
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AdminLayoutContext.Provider value={{ mobileOpen, setMobileOpen }}>
      <div className="flex min-h-screen bg-[#F7FAF8] font-sans antialiased text-[#1E293B] relative overflow-x-hidden">
        {/* Desktop Persistent Sidebar */}
        <div className="hidden lg:block shrink-0">
          <AdminSidebar unreadMessagesCount={2} />
        </div>

        {/* Mobile Drawer Overlay */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileOpen(false)}
            />
            {/* Mobile Drawer Content */}
            <div className="relative flex-1 max-w-xs w-full bg-white z-10 shadow-2xl animate-in slide-in-from-left duration-200">
              <AdminSidebar
                unreadMessagesCount={2}
                onCloseMobile={() => setMobileOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main View Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
          {children}
        </div>
      </div>
    </AdminLayoutContext.Provider>
  );
}


