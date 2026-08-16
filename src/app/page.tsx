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
import { createClient } from '@/lib/supabase/server';
import { ArrowRight, Award, Sparkles, BookOpen, Users, HeartPulse, ShieldCheck, TrendingUp } from 'lucide-react';
import type { TeamMember, Post, Project, Programme, ImpactStatistic } from '@/types/database';

export default async function HomePage() {
  let programmes: Programme[] = [];
  let projects: Project[] = [];
  let stats: ImpactStatistic[] = [];
  let posts: Post[] = [];
  let teamMembers: TeamMember[] = [];

  // Crash-proof Supabase data fetching for Vercel deployment
  try {
    const supabase = await createClient();
    const [resProg, resProj, resStat, resPost, resTeam] = await Promise.all([
      supabase.from('programmes').select('*').eq('is_published', true).order('order_index', { ascending: true }),
      supabase.from('projects').select('*').eq('is_published', true).order('created_at', { ascending: false }),
      supabase.from('impact_statistics').select('*').eq('is_published', true).order('order_index', { ascending: true }),
      supabase.from('posts').select('*').eq('status', 'published').order('published_at', { ascending: false }).limit(3),
      supabase.from('team_members').select('*').eq('is_active', true).order('order_index', { ascending: true }).limit(4),
    ]);

    programmes = (resProg.data as Programme[] | null) || [];
    projects = (resProj.data as Project[] | null) || [];
    stats = (resStat.data as ImpactStatistic[] | null) || [];
    posts = (resPost.data as Post[] | null) || [];
    teamMembers = (resTeam.data as TeamMember[] | null) || [];
  } catch {
    // Crash-proof fallback for Vercel deployment
  }

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
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Anchor Frame */}
            <div className="lg:col-span-5">
              <div className="rounded-[10px] border border-[#E2E8F0] border-t-4 border-t-[#86C127] bg-[#F7FAF8] p-8 space-y-6 brand-shadow card-hover-lift">
                <Logo />
                <div className="space-y-2">
                  <h4 className="font-bold text-xl text-[#0092DF]">
                    Enhancing Communities Action for Peace and Better Health Initiative
                  </h4>
                  <p className="text-xs font-semibold text-[#86C127] uppercase tracking-wider">
                    Official Registration RC:144280 • Kaduna, Nigeria
                  </p>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  A youth-led non-profit organization operating at the intersection of human rights, public health, and civic empowerment.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-7 space-y-6">
              <Badge variant="secondary">About e-CAPH</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0092DF] leading-tight">
                Dedicated to Driving Sustainable Development &amp; Community Resilience
              </h2>
              <p className="text-[#64748B] text-base leading-relaxed">
                {siteConfig.description}
              </p>
              <p className="text-[#64748B] text-base leading-relaxed">
                We empower young people and women to lead inclusive solutions that address health disparities, social inequality, and governance challenges directly within their communities.
              </p>
              <div className="pt-2">
                <Link href="/about">
                  <Button variant="outline" size="default" className="group">
                    Read Our Full Story <ArrowRight className="ml-2 w-4 h-4 text-[#E67817] transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission and Vision Section */}
      <section className="py-20 bg-[#F3F7F5] border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-8 rounded-[10px] bg-white border border-[#E2E8F0] brand-shadow card-hover-lift space-y-4 relative overflow-hidden group">
            <div className="w-full h-1 bg-[#86C127] absolute top-0 left-0"></div>
            <div className="w-10 h-10 rounded-[6px] bg-[#FDF2E8] text-[#E67817] flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-[#0092DF]">Our Mission</h3>
            <p className="text-[#64748B] text-sm leading-relaxed">
              {siteConfig.mission}
            </p>
          </div>

          <div className="p-8 rounded-[10px] bg-white border border-[#E2E8F0] brand-shadow card-hover-lift space-y-4 relative overflow-hidden group">
            <div className="w-full h-1 bg-[#86C127] absolute top-0 left-0"></div>
            <div className="w-10 h-10 rounded-[6px] bg-[#FDF2E8] text-[#E67817] flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-[#0092DF]">Our Vision</h3>
            <p className="text-[#64748B] text-sm leading-relaxed">
              {siteConfig.vision}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Thematic Focus Areas */}
      <section className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="secondary">Core Pillars</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0092DF]">
              Thematic Focus Areas
            </h2>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Our work spans integrated focus areas designed to build healthy, educated, and peaceful communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programmes.length > 0
              ? programmes.map((prog, idx) => (
                  <FocusAreaCard
                    key={prog.id}
                    slug={prog.slug}
                    title={prog.title}
                    description={prog.description}
                    index={idx}
                  />
                ))
              : thematicFocusAreas.map((area, idx) => (
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

      {/* 5. Impact Statistics Section */}
      <section className="py-16 bg-[#F3F7F5] border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.length > 0 ? (
              stats.map((st) => (
                <div key={st.id} className="space-y-2 p-6 rounded-[10px] bg-white border border-[#E2E8F0] brand-shadow card-hover-lift group">
                  <div className="w-10 h-10 rounded-[6px] bg-[#F3F9E9] text-[#86C127] mx-auto flex items-center justify-center mb-2 transition-transform duration-200 group-hover:scale-110">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="text-4xl font-extrabold text-[#0092DF]">
                    {(st.value ?? st.numeric_value ?? 0).toLocaleString()}{st.suffix || '+'}
                  </div>
                  <div className="text-xs font-bold text-[#86C127] uppercase tracking-wider">{st.label}</div>
                </div>
              ))
            ) : (
              <>
                <div className="space-y-2 p-6 rounded-[10px] bg-white border border-[#E2E8F0] brand-shadow card-hover-lift group">
                  <div className="w-10 h-10 rounded-[6px] bg-[#F3F9E9] text-[#86C127] mx-auto flex items-center justify-center mb-2">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-4xl font-extrabold text-[#0092DF]">95,000+</div>
                  <div className="text-xs font-bold text-[#86C127] uppercase tracking-wider">Young People Reached</div>
                </div>
                <div className="space-y-2 p-6 rounded-[10px] bg-white border border-[#E2E8F0] brand-shadow card-hover-lift group">
                  <div className="w-10 h-10 rounded-[6px] bg-[#F3F9E9] text-[#86C127] mx-auto flex items-center justify-center mb-2">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div className="text-4xl font-extrabold text-[#0092DF]">36+</div>
                  <div className="text-xs font-bold text-[#86C127] uppercase tracking-wider">Schools &amp; Hubs Engaged</div>
                </div>
                <div className="space-y-2 p-6 rounded-[10px] bg-white border border-[#E2E8F0] brand-shadow card-hover-lift group">
                  <div className="w-10 h-10 rounded-[6px] bg-[#F3F9E9] text-[#86C127] mx-auto flex items-center justify-center mb-2">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-4xl font-extrabold text-[#0092DF]">120+</div>
                  <div className="text-xs font-bold text-[#86C127] uppercase tracking-wider">Communities Served</div>
                </div>
                <div className="space-y-2 p-6 rounded-[10px] bg-white border border-[#E2E8F0] brand-shadow card-hover-lift group">
                  <div className="w-10 h-10 rounded-[6px] bg-[#F3F9E9] text-[#86C127] mx-auto flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="text-4xl font-extrabold text-[#0092DF]">45,000+</div>
                  <div className="text-xs font-bold text-[#86C127] uppercase tracking-wider">Health Interventions</div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 6. Flagship Initiatives */}
      <section className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3 max-w-2xl">
              <Badge variant="secondary">Key Projects</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0092DF]">
                Flagship Initiatives
              </h2>
              <p className="text-[#64748B] text-sm">
                Targeted, community-centered programs delivering measurable change across northern Nigeria.
              </p>
            </div>
            <Link href="/projects" className="text-xs font-bold text-[#E67817] hover:underline flex items-center shrink-0 group">
              View All Projects <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <InitiativeCard
                  key={proj.id}
                  id={proj.id}
                  title={proj.title}
                  category={proj.category || 'Public Health'}
                  description={proj.summary}
                  location={proj.location || 'Nigeria'}
                  isFeatured={proj.is_flagship}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <InitiativeCard {...flagshipInitiatives[0]} />
              </div>
              <div className="space-y-6">
                {flagshipInitiatives.slice(1, 3).map((item) => (
                  <InitiativeCard key={item.id} {...item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 7. Our Approach */}
      <section className="py-20 bg-[#F3F7F5] border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="secondary">Methodology</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0092DF]">
              Our Technical Approach
            </h2>
            <p className="text-[#64748B] text-sm">
              Cross-cutting strategies embedded across all e-CAPH interventions.
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {technicalApproaches.map((item) => (
              <div
                key={item.number}
                className="p-6 rounded-[10px] bg-white border border-[#E2E8F0] brand-shadow card-hover-lift flex items-start gap-6 hover:border-[#0092DF]/40 transition-all duration-200"
              >
                <span className="text-2xl font-extrabold text-[#E67817] shrink-0">
                  {item.number}
                </span>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#0092DF]">{item.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Featured Story */}
      <section className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[10px] border border-[#E2E8F0] border-t-4 border-t-[#86C127] bg-[#F7FAF8] p-8 sm:p-12 space-y-6 brand-shadow card-hover-lift">
            <Badge variant="secondary">Community Impact Story</Badge>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#0092DF]">
              Strengthening Primary Healthcare Through Youth-Led Accountability
            </h3>
            <p className="text-[#64748B] text-base leading-relaxed max-w-3xl">
              Through the Gani da Ido initiative, local youth advocates in Kaduna have monitored over 40 primary healthcare centers, engaging local health committees to improve drug availability and maternal health service quality.
            </p>
            <Link href="/stories" className="inline-block pt-2">
              <Button className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold group">
                Read Impact Case Study <ArrowRight className="ml-2 w-4 h-4 text-[#E67817] transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Latest News & Stories */}
      <section className="py-20 bg-[#F3F7F5] border-b border-[#E2E8F0]">
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

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="rounded-[10px] border border-[#E2E8F0] border-t-4 border-t-[#86C127] bg-white p-6 brand-shadow card-hover-lift flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <Badge variant="secondary" className="text-[11px] uppercase">
                      {post.post_type.replace('_', ' ')}
                    </Badge>
                    <h3 className="text-lg font-bold text-[#0092DF] leading-snug hover:text-[#007DC2] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed">{post.summary}</p>
                  </div>
                  <Link href="/stories" className="text-xs font-bold text-[#E67817] hover:underline inline-flex items-center group/link">
                    Read Article <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform duration-200 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-[10px] border border-[#E2E8F0] bg-white text-center space-y-3 brand-shadow">
              <BookOpen className="w-10 h-10 text-[#94A3B8] mx-auto" />
              <h4 className="font-bold text-[#1E293B]">Recent publications</h4>
              <p className="text-xs text-[#64748B] max-w-md mx-auto">
                Visit our news section for upcoming reports and announcements.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 10. Partner Section */}
      <section className="py-16 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
            Collaborating With Civil Society &amp; International Development Partners
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-[#64748B] font-bold text-sm">
            <span className="hover:text-[#0092DF] transition-colors duration-200 cursor-default">Public Health Agencies</span>
            <span className="text-slate-300">•</span>
            <span className="hover:text-[#0092DF] transition-colors duration-200 cursor-default">Youth Alliances</span>
            <span className="text-slate-300">•</span>
            <span className="hover:text-[#0092DF] transition-colors duration-200 cursor-default">Grassroots CSOs</span>
            <span className="text-slate-300">•</span>
            <span className="hover:text-[#0092DF] transition-colors duration-200 cursor-default">Research Partners</span>
          </div>
        </div>
      </section>

      {/* 11. Team Preview Section */}
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

          {teamMembers.length > 0 ? (
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
                      <p className="text-xs text-[#64748B] font-semibold tracking-wide">
                        {member.role_title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-[10px] bg-white border border-[#E2E8F0] text-center space-y-2">
              <Users className="w-10 h-10 text-[#94A3B8] mx-auto" />
              <p className="text-sm text-[#64748B]">Team roster being updated. Learn more on our About page.</p>
            </div>
          )}
        </div>
      </section>

      {/* 12. Final Call to Action */}
      <section className="py-20 bg-[#003D60] text-white text-center">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Working Together for Healthier &amp; More Resilient Communities
          </h2>
          <p className="text-slate-200 text-base leading-relaxed max-w-2xl mx-auto">
            Partner with e-CAPH to support youth-led solutions that create lasting community impact across Nigeria.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link href="/contact?type=partnership">
              <Button size="lg" className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-extrabold shadow-md transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
                Partner With Us
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent transition-all duration-200 group">
                Contact Our Team <ArrowRight className="ml-2 w-4 h-4 text-[#E67817] transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 13. Footer */}
      <Footer />
    </div>
  );
}
