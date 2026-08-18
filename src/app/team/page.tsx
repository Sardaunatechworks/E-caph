'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { createClient } from '@/lib/supabase/client';
import type { TeamMember } from '@/types/database';

const accentColors = [
  'bg-[#E67817]',
  'bg-[#86C127]',
  'bg-[#0092DF]',
  'bg-[#E67817]',
];

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);

  const fetchTeam = async () => {
    let currentList: TeamMember[] = [];

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecaph_team_members');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            currentList = parsed.filter((m: TeamMember) => m.is_active !== false);
          }
        } catch {}
      }
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (!error && data && data.length > 0) {
        currentList = data as TeamMember[];
      }
    } catch {}

    setMembers(currentList);
  };

  useEffect(() => {
    fetchTeam();

    const handleSync = () => fetchTeam();
    window.addEventListener('storage', handleSync);
    window.addEventListener('ecaph_team_updated', handleSync);

    const interval = setInterval(fetchTeam, 10000);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('ecaph_team_updated', handleSync);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B] font-sans">
      <Header />

      <PageBanner
        title="Meet Our Team"
        subtitle="Dedicated healthcare professionals, development strategists, and youth advocates advancing community health and peace."
      />

      <section className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0092DF]">
              Executive Leadership &amp; Operational Team
            </h2>
            <p className="text-base text-[#475569] leading-relaxed font-normal">
              Our multidisciplinary team brings technical expertise in public health, youth mobilization, gender advocacy, and civic governance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-14 pt-4">
            {members.map((member, idx) => {
              const initials = member.full_name
                ? member.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2)
                : 'EC';
              const accent = accentColors[idx % accentColors.length];

              return (
                <div key={member.id} className="flex flex-col items-center text-center space-y-6 group">
                  <div className="relative w-full max-w-[280px]">
                    <div
                      className={`absolute inset-0 translate-x-3.5 translate-y-3.5 rounded-[24px] ${accent} transition-transform duration-300 group-hover:translate-x-4.5 group-hover:translate-y-4.5`}
                    />

                    <div className="relative aspect-square w-full rounded-[24px] bg-[#CBD5E1] overflow-hidden border border-slate-200 shadow-md">
                      {member.avatar_url ? (
                        <img
                          src={member.avatar_url}
                          alt={member.full_name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#CBD5E1]">
                          <div className="w-20 h-20 rounded-full bg-[#0092DF] text-white flex items-center justify-center text-2xl font-black shadow-lg">
                            {initials}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <h3 className="text-lg font-extrabold text-[#0092DF] group-hover:text-[#007DC2] transition-colors leading-snug">
                      {member.full_name}
                    </h3>
                    <p className="text-xs text-[#E67817] font-bold uppercase tracking-wider">
                      {member.role_title}
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
