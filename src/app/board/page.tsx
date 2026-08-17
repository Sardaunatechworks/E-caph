'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { createClient } from '@/lib/supabase/client';
import type { BoardMember } from '@/types/database';

const accentColors = [
  'bg-[#E67817]', // Vibrant Orange accent
  'bg-[#86C127]', // Lime Green accent
  'bg-[#0092DF]', // Cyan/Blue accent
  'bg-[#E67817]', // Orange accent
];

const defaultBoardMembers: BoardMember[] = [
  {
    id: 'board-1',
    full_name: 'Dr. Hauwa Mustapha',
    board_role: 'Chairman, Board of Trustees',
    bio: 'Renowned public health strategist and governance advisor.',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    email: 'info@e-caph.org',
    linkedin_url: null,
    twitter_url: null,
    order_index: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'board-2',
    full_name: 'Barr. Usman Danjuma',
    board_role: 'Board Trustee & Legal Counsel',
    bio: 'Human rights lawyer and legal reform advocate.',
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    email: 'info@e-caph.org',
    linkedin_url: null,
    twitter_url: null,
    order_index: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'board-3',
    full_name: 'Prof. Aliyu Bawa',
    board_role: 'Trustee - Health Research & Evaluation',
    bio: 'Professor of Community Medicine and Epidemiology.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    email: 'info@e-caph.org',
    linkedin_url: null,
    twitter_url: null,
    order_index: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'board-4',
    full_name: 'Hajiya Amina Bello',
    board_role: 'Trustee - Gender & Peace Cohesion',
    bio: 'Grassroots peace mediator and women advocate.',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    email: 'info@e-caph.org',
    linkedin_url: null,
    twitter_url: null,
    order_index: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function BoardPage() {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>(defaultBoardMembers);

  const loadData = async () => {
    let currentList = defaultBoardMembers;

    // 1. Check local storage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecaph_board_members');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            currentList = parsed.filter((m: BoardMember) => m.is_active !== false);
          }
        } catch {}
      }
    }

    // 2. Query Supabase Client
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('board_members')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (!error && data && data.length > 0) {
        currentList = data as BoardMember[];
      }
    } catch {}

    setBoardMembers(currentList);
  };

  useEffect(() => {
    loadData();

    // Real-time storage listener & 10s global multi-device polling
    const handleStorageChange = () => loadData();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('ecaph_board_updated', handleStorageChange);

    const interval = setInterval(loadData, 10000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ecaph_board_updated', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B] font-sans">
      <Header />

      <PageBanner
        title="Board of Members"
        subtitle="Meet the governing Board Members guiding institutional vision and governance at e-CAPH."
        breadcrumb={[{ label: 'About Us', href: '/about' }]}
      />

      {/* Board Roster Section */}
      <section className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#86C127] uppercase tracking-widest block">
              Governance Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0092DF]">
              Board of Members
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-10">
            {boardMembers.map((member, idx) => {
              const initials = member.full_name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2);

              const accent = accentColors[idx % accentColors.length];

              return (
                <div key={member.id} className="flex flex-col items-center text-center space-y-6 group">
                  {/* Photo Card with Offset Accent Background */}
                  <div className="relative w-full max-w-[280px]">
                    {/* Offset Accent Block */}
                    <div
                      className={`absolute inset-0 translate-x-3 translate-y-3 rounded-[20px] ${accent} transition-transform duration-300 group-hover:translate-x-4 group-hover:translate-y-4`}
                    />

                    {/* Main Image Container */}
                    <div className="relative aspect-square w-full rounded-[20px] bg-[#D1D5DB] overflow-hidden border border-slate-200/80 shadow-sm">
                      {member.avatar_url ? (
                        <img
                          src={member.avatar_url}
                          alt={member.full_name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#CBD5E1]">
                          <div className="w-20 h-20 rounded-full bg-[#0092DF] text-white flex items-center justify-center text-2xl font-black shadow-md">
                            {initials}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Member Name and Position Only */}
                  <div className="space-y-1 pt-2">
                    <h3 className="text-lg font-extrabold text-[#0092DF] group-hover:text-[#007DC2] transition-colors leading-snug">
                      {member.full_name}
                    </h3>
                    <p className="text-xs font-bold text-[#E67817] uppercase tracking-wider">
                      {member.board_role}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
