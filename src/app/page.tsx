'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { thematicFocusAreas, flagshipInitiatives, technicalApproaches } from '@/config/theme';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FocusAreaCard } from '@/components/common/focus-area-card';
import { InitiativeCard } from '@/components/common/initiative-card';
import { Logo } from '@/components/common/logo';
import { createClient } from '@/lib/supabase/client';
import { ArrowRight, Award, Sparkles, BookOpen, Users, HeartPulse, ShieldCheck, TrendingUp } from 'lucide-react';
import type { TeamMember, Post, Project, Programme, ImpactStatistic } from '@/types/database';

export default function HomePage() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<ImpactStatistic[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        const [resProg, resProj, resStat, resPost, resTeam] = await Promise.all([
          supabase.from('programmes').select('*').eq('is_published', true).order('order_index', { ascending: true }),
          supabase.from('projects').select('*').eq('is_published', true).order('created_at', { ascending: false }),
          supabase.from('impact_statistics').select('*').eq('is_published', true).order('order_index', { ascending: true }),
          supabase.from('posts').select('*').eq('status', 'published').order('published_at', { ascending: false }).limit(3),
          supabase.from('team_members').select('*').eq('is_active', true).order('order_index', { ascending: true }).limit(4),
        ]);

        if (resProg.data) setProgrammes(resProg.data as Programme[]);
        if (resProj.data) setProjects(resProj.data as Project[]);
        if (resStat.data) setStats(resStat.data as ImpactStatistic[]);
        if (resPost.data) setPosts(resPost.data as Post[]);
        if (resTeam.data) setTeamMembers(resTeam.data as TeamMember[]);
      } catch {}
      setLoaded(true);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B] font-sans">
      <Header />

      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-r from-[#003D60] via-[#005A8D] to-[#0092DF] text-white py-20 sm:py-28 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Badge className="bg-[#86C127] text-white font-bold border-none px-3.5 py-1 text-xs uppercase tracking-wider animate-soft-pulse">
              Youth-Led Action for Healthier &amp; Peaceful Communities
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
              Empowering Youth, <span className="text-[#E67817]">Promoting Peace</span>, Advancing Community Health
            </h1>

            <p className="text-lg sm:text-xl text-slate-100 font-normal leading-relaxed max-w-2xl">
              e-CAPH advances public health, human rights, youth empowerment, climate resilience, and accountable governance across Nigeria.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/programmes">
                <Button size="lg" className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold shadow-md transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
                  Explore Our Work <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent transition-all duration-200">
                  Learn About e-CAPH
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About e-CAPH Section */}
      <section className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-3">
                <Badge variant="secondary">Who We Are</Badge>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0092DF] leading-tight">
                  Action for Health, Rights, and Peace Cohesion
                </h2>
              </div>
              <p className="text-base text-[#475569] leading-relaxed font-normal">
                {siteConfig.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                <div className="p-4 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] brand-shadow text-center space-y-1">
                  <HeartPulse className="w-6 h-6 text-[#0092DF] mx-auto" />
                  <h4 className="text-xs font-extrabold text-[#0092DF]">Public Health</h4>
                  <p className="text-[11px] text-[#64748B]">Maternal &amp; Youth Care</p>
                </div>

                <div className="p-4 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] brand-shadow text-center space-y-1">
                  <Users className="w-6 h-6 text-[#E67817] mx-auto" />
                  <h4 className="text-xs font-extrabold text-[#0092DF]">Youth Hub</h4>
                  <p className="text-[11px] text-[#64748B]">Vocational Empowerment</p>
                </div>

                <div className="p-4 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] brand-shadow text-center space-y-1">
                  <ShieldCheck className="w-6 h-6 text-[#86C127] mx-auto" />
                  <h4 className="text-xs font-extrabold text-[#0092DF]">Accountability</h4>
                  <p className="text-[11px] text-[#64748B]">Gani da Ido Project</p>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/about">
                  <Button className="bg-[#86C127] hover:bg-[#75A922] text-white font-bold text-xs">
                    Read Our Full Profile <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-4/3 rounded-[20px] bg-gradient-to-tr from-[#003D60] to-[#0092DF] p-8 text-white brand-shadow-lg flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-4 relative z-10">
                  <Logo variant="white" showText={false} className="mb-4" />
                  <h3 className="text-2xl font-black text-white leading-snug">
                    Bridging Community Needs With Evidence &amp; Youth Innovation
                  </h3>
                  <p className="text-xs text-slate-100 leading-relaxed max-w-md">
                    Operating in Northern Nigeria with registered CAC certificate {siteConfig.cacId}. Empowering local health centers, adolescent girls, and youth advocates.
                  </p>
                </div>

                <div className="pt-6 border-t border-white/20 flex flex-wrap items-center justify-between text-xs text-slate-200 relative z-10 font-bold gap-2">
                  <span className="bg-[#E67817] text-white px-2 py-0.5 rounded-[4px] text-[10px]">CAC Reg: {siteConfig.cacId}</span>
                  <span className="text-[11px] font-semibold">{siteConfig.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Strategic Focus Areas */}
      <section className="py-20 bg-[#F3F7F5] border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="secondary">Core Pillars</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0092DF]">
              Strategic Thematic Areas
            </h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Our integrated programmatic pillars address interconnected health, rights, peace, and economic challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {thematicFocusAreas.map((area, idx) => (
              <FocusAreaCard
                key={area.slug}
                slug={area.slug}
                title={area.title}
                description={area.description}
                index={idx}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Flagship Initiatives */}
      <section className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3 max-w-2xl">
              <Badge variant="secondary">Featured Programs</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0092DF]">
                Flagship Interventions
              </h2>
            </div>
            <Link href="/projects" className="text-xs font-bold text-[#E67817] hover:underline flex items-center shrink-0 group">
              View All Projects <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {flagshipInitiatives.map((initiative) => (
              <InitiativeCard
                key={initiative.id}
                id={initiative.id}
                title={initiative.title}
                category={initiative.category}
                description={initiative.description}
                location={initiative.location}
                isFeatured={initiative.isFeatured}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Impact Counter Strip — Real-time from DB */}
      {stats.length > 0 && (
        <section className="py-16 bg-[#003D60] text-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.slice(0, 4).map((stat, idx) => {
                const accentColors = ['text-[#86C127]', 'text-[#E67817]', 'text-[#0092DF]', 'text-[#86C127]'];
                const displayValue = stat.value != null
                  ? `${stat.value.toLocaleString()}${stat.suffix || ''}`
                  : '—';

                return (
                  <div key={stat.id} className="space-y-2">
                    <div className={`text-4xl sm:text-5xl font-black ${accentColors[idx % accentColors.length]}`}>
                      {displayValue}
                    </div>
                    <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 6. Technical Approaches */}
      <section className="py-20 bg-[#F3F7F5] border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="secondary">Methodology</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0092DF]">
              How We Deliver Lasting Change
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicalApproaches.map((tech, idx) => (
              <div key={idx} className="p-6 rounded-[10px] bg-white border border-[#E2E8F0] brand-shadow space-y-3 hover:brand-shadow-lg transition-all duration-200">
                <div className="w-10 h-10 rounded-[6px] bg-[#E6F4FC] text-[#0092DF] flex items-center justify-center font-bold text-sm">
                  0{idx + 1}
                </div>
                <h3 className="text-base font-bold text-[#0092DF]">{tech.title}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Latest News & Stories — Real-time from DB */}
      {loaded && posts.length > 0 && (
        <section className="py-20 bg-white border-b border-[#E2E8F0]">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-3 max-w-2xl">
                <Badge variant="secondary">Field Updates</Badge>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0092DF]">
                  Latest News &amp; Articles
                </h2>
              </div>
              <Link href="/stories" className="text-xs font-bold text-[#E67817] hover:underline flex items-center shrink-0 group">
                Browse All News <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div key={post.id} className="rounded-[12px] border border-[#E2E8F0] border-t-4 border-t-[#86C127] bg-[#F8FAFC] p-6 brand-shadow hover:brand-shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group">
                  <div className="space-y-3">
                    {post.featured_image && (
                      <div className="aspect-video w-full rounded-[8px] bg-[#E2E8F0] overflow-hidden border border-slate-200 shadow-xs mb-3">
                        <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
                      </div>
                    )}
                    <Badge variant="secondary" className="text-[11px] uppercase bg-[#E6F4FC] text-[#0092DF] font-bold">
                      {post.post_type.replace('_', ' ')}
                    </Badge>
                    <h3 className="text-lg font-extrabold text-[#0092DF] leading-snug group-hover:text-[#007DC2] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed">{post.summary}</p>
                  </div>
                  <Link href={`/blog/${post.slug}`} prefetch={false} className="text-xs font-bold text-[#E67817] hover:underline inline-flex items-center group/link pt-2 border-t border-[#E2E8F0]">
                    Read Article <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform duration-200 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 11. Team Preview Section — Real-time from DB */}
      {loaded && teamMembers.length > 0 && (
        <section className="py-20 bg-[#F3F7F5] border-b border-[#E2E8F0]">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-3 max-w-2xl">
                <Badge variant="secondary">Leadership</Badge>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0092DF]">
                  Meet Our Team
                </h2>
              </div>
              <Link href="/team" className="text-xs font-bold text-[#E67817] hover:underline flex items-center shrink-0 group">
                Meet Full Team <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {teamMembers.map((member, idx) => {
                const initials = member.full_name.split(' ').map(n => n[0]).join('').slice(0, 2);
                const accentColors = ['bg-[#E67817]', 'bg-[#86C127]', 'bg-[#0092DF]', 'bg-[#E67817]'];
                const accent = accentColors[idx % accentColors.length];

                return (
                  <div key={member.id} className="flex flex-col items-center text-center space-y-6 group">
                    {/* Photo Card with Offset Accent Background */}
                    <div className="relative w-full max-w-[260px]">
                      <div
                        className={`absolute inset-0 translate-x-3 translate-y-3 rounded-[20px] ${accent} transition-transform duration-300 group-hover:translate-x-4 group-hover:translate-y-4`}
                      />
                      <div className="relative aspect-square w-full rounded-[20px] bg-[#D1D5DB] overflow-hidden border border-slate-200/80 shadow-sm">
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
                            <div className="w-16 h-16 rounded-full bg-[#0092DF] text-white flex items-center justify-center text-xl font-black shadow-md">
                              {initials}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Member Name and Position Only */}
                    <div className="space-y-1 pt-1">
                      <h3 className="text-base font-extrabold text-[#0092DF] group-hover:text-[#007DC2] transition-colors leading-snug">
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
      )}

      {/* 12. Final Call to Action */}
      <section className="py-20 bg-[#003D60] text-white text-center">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Working Together for Healthier &amp; More Resilient Communities
          </h2>
          <p className="text-slate-200 text-base leading-relaxed max-w-2xl mx-auto">
            Partner with e-CAPH to support youth-led solutions that create lasting community impact across Nigeria.
          </p>
          <div className="pt-2">
            <Link href="/contact">
              <Button size="lg" className="bg-[#E67817] hover:bg-[#CF660F] text-white font-bold shadow-md">
                Get In Touch With Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
