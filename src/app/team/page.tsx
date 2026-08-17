'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { createClient } from '@/lib/supabase/client';
import type { TeamMember } from '@/types/database';

const accentColors = [
  'bg-[#E67817]', // Vibrant Orange accent
  'bg-[#86C127]', // Lime Green accent
  'bg-[#0092DF]', // Cyan/Blue accent
  'bg-[#E67817]', // Orange accent
];

const defaultTeamMembers: TeamMember[] = [
  {
    id: 'team-1',
    full_name: 'Dr. Fatima Abubakar',
    role_title: 'Executive Director & Founder',
    bio: 'Public health physician with 15+ years leading health systems reform and community interventions in Nigeria.',
    avatar_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
    email: 'fatima@e-caph.org',
    linkedin_url: null,
    twitter_url: null,
    order_index: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'team-2',
    full_name: 'Ibrahim Sani',
    role_title: 'Director of Programmes',
    bio: 'Development strategist overseeing adolescent health, civic accountability, and youth economic empowerment initiatives.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    email: 'ibrahim@e-caph.org',
    linkedin_url: null,
    twitter_url: null,
    order_index: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'team-3',
    full_name: 'Amina Kabir',
    role_title: 'Head of Public Health & ANC',
    bio: 'Epidemiologist leading maternal-newborn health tracking and primary health center community advocacy.',
    avatar_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80',
    email: 'amina@e-caph.org',
    linkedin_url: null,
    twitter_url: null,
    order_index: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'team-4',
    full_name: 'Yusuf Mohammed',
    role_title: 'Lead, Gani da Ido & Civic Governance',
    bio: 'Social accountability expert coordinating Youth Accountability Champions and community service monitoring.',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    email: 'yusuf@e-caph.org',
    linkedin_url: null,
    twitter_url: null,
    order_index: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(defaultTeamMembers);

  const fetchTeamMembers = async () => {
    let currentList = defaultTeamMembers;

    // 1. Check local storage
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

    // 2. Query Supabase Client
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

    setTeamMembers(currentList);
  };

  useEffect(() => {
    fetchTeamMembers();

    const handleSync = () => fetchTeamMembers();
    window.addEventListener('storage', handleSync);
    window.addEventListener('ecaph_team_updated', handleSync);

    const interval = setInterval(fetchTeamMembers, 10000);

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
        subtitle="Dedicated professionals driving sustainable development, public health, and peacebuilding in Nigeria."
        breadcrumb={[{ label: 'About Us', href: '/about' }]}
      />

      {/* Leadership & Staff Roster Section */}
      <section className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#86C127] uppercase tracking-widest block">
              Organizational Staff
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0092DF]">
              Meet Our Team
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-10">
            {teamMembers.map((member, idx) => {
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
