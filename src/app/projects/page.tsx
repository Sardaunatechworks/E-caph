'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { MapPin, Calendar, FolderKanban, Sparkles, ShieldCheck, ArrowRight, Lightbulb } from 'lucide-react';
import type { Project } from '@/types/database';

const featuredInitiatives: Project[] = [
  {
    id: 'init-skills-hub',
    programme_id: null,
    title: 'e-CAPH Skills Hub',
    slug: 'ecaph-skills-hub-women-youth-empowerment',
    summary: 'An economic empowerment initiative designed to equip women and young people with practical vocational and entrepreneurial skills that improve economic opportunities while addressing social vulnerabilities.',
    description: `The e-CAPH Skills Hub for women and youth empowerment is an economic empowerment initiative designed to equip women and young people with practical vocational and entrepreneurial skills that improve their economic opportunities while also addressing social vulnerabilities.\n\nThrough the Hub, Participants acquire high-demand skills in digital technology, entrepreneurship, vocational development, leadership, employability, and other emerging areas. Our goal is not only to provide training, but also to strengthen confidence, creativity, economic independence, and the ability of participants to contribute meaningfully to their communities.`,
    objectives: ['Equip women and youth with high-demand digital technology, entrepreneurship, and vocational development skills.'],
    activities: ['Vocational workshops', 'Digital literacy bootcamps', 'Business startup mentoring', 'Leadership circles'],
    results_to_date: ['Over 250 young women and youth trained across local communities.'],
    target_beneficiaries: 'Women, adolescent girls, and unemployed youth.',
    location: 'Kaduna & Kano, Nigeria',
    donor_partner: 'e-CAPH Community Development Fund',
    status: 'ongoing',
    start_date: '2025-01-15',
    end_date: null,
    featured_image: null,
    is_flagship: true,
    is_published: true,
    budget: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'init-gani-da-ido',
    programme_id: null,
    title: 'Gani da Ido - Muryar Matasa – Idon Al’umma',
    slug: 'gani-da-ido-youth-civic-accountability',
    summary: 'A youth-led civic engagement and social accountability project that amplifies young people’s voices and strengthens community participation in public decision-making.',
    description: `The e-CAPH Gani da Ido - Muryar Matasa – Idon Al’umma is a youth-led civic engagement and social accountability project that amplifies young people’s voices and strengthens community participation in public decision-making.\n\nThe project enables citizens to monitor public services, budgets, government commitments and development projects through accessible digital and community-based platforms. It provides safe channels for submitting complaints, sharing feedback and tracking how responsible institutions respond. Through Youth Accountability Champions, community scorecards, public dialogues and evidence-based advocacy, the project promotes transparency, inclusion and improved service delivery.`,
    objectives: ['Promote public service transparency, community scorecards, and youth-led budget monitoring.'],
    activities: ['Youth Accountability Champions training', 'Primary healthcare facility scorecards', 'Public Town Hall dialogues'],
    results_to_date: ['Monitored over 40 primary healthcare centers and trained 120 Youth Accountability Champions.'],
    target_beneficiaries: 'Youth advocates, local ward citizens, and primary health service users.',
    location: 'Northern Nigeria Wards',
    donor_partner: 'Civic Governance & Social Accountability Fund',
    status: 'ongoing',
    start_date: '2024-06-01',
    end_date: null,
    featured_image: null,
    is_flagship: true,
    is_published: true,
    budget: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(featuredInitiatives);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    let currentList = featuredInitiatives;

    // 1. Check local storage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecaph_projects');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            currentList = parsed.filter((p: Project) => p.is_published !== false);
          }
        } catch {}
      }
    }

    // 2. Query Supabase Client
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        currentList = data as Project[];
      }
    } catch {}

    setProjects(currentList);
  };

  useEffect(() => {
    fetchProjects();

    const handleSync = () => fetchProjects();
    window.addEventListener('storage', handleSync);
    window.addEventListener('ecaph_projects_updated', handleSync);

    const interval = setInterval(fetchProjects, 10000);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('ecaph_projects_updated', handleSync);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B] font-sans">
      <Header />

      <PageBanner
        title="Projects &amp; Flagship Initiatives"
        subtitle="Community-level interventions, youth economic empowerment, public health monitoring, and civic accountability projects across Nigeria."
      />

      {/* Featured Flagship Initiatives Section */}
      <section className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="secondary" className="bg-[#86C127] text-white font-bold uppercase tracking-wider text-[10px]">
              Flagship Community Programs
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0092DF]">
              Key Strategic Initiatives
            </h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Driving sustainable economic independence, vocational skills, youth leadership, and transparent civic governance in local communities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* e-CAPH Skills Hub Card */}
            <div className="rounded-[16px] border border-[#E2E8F0] border-t-4 border-t-[#86C127] bg-[#F8FAFC] p-8 sm:p-10 brand-shadow hover:brand-shadow-lg transition-all duration-300 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3F9E9] text-[#6EA71F] text-xs font-extrabold uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-[#86C127]" /> Economic Empowerment
                  </span>
                  <span className="text-xs text-[#64748B] flex items-center gap-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-[#E67817]" /> Kaduna &amp; Kano
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-[#0092DF] leading-snug">
                  e-CAPH Skills Hub
                </h3>

                <p className="text-sm text-[#475569] font-medium leading-relaxed">
                  The e-CAPH Skills Hub for women and youth empowerment is an economic empowerment initiative designed to equip women and young people with practical vocational and entrepreneurial skills that improve their economic opportunities while also addressing social vulnerabilities.
                </p>

                <div className="p-4 rounded-[10px] bg-white border border-[#E2E8F0] text-xs text-[#64748B] leading-relaxed space-y-2">
                  <span className="font-bold text-[#0092DF] block">Key Focus Areas:</span>
                  <p>Digital Technology • Entrepreneurship • Vocational Development • Leadership &amp; Employability</p>
                </div>
              </div>

              <div className="pt-6 border-t border-[#E2E8F0]">
                <Button
                  onClick={() => setSelectedProject(featuredInitiatives[0])}
                  className="w-full bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold text-xs"
                >
                  Read Full Initiative Overview <ArrowRight className="w-4 h-4 ml-2 text-[#E67817]" />
                </Button>
              </div>
            </div>

            {/* Gani da Ido Card */}
            <div className="rounded-[16px] border border-[#E2E8F0] border-t-4 border-t-[#0092DF] bg-[#F8FAFC] p-8 sm:p-10 brand-shadow hover:brand-shadow-lg transition-all duration-300 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4FC] text-[#0092DF] text-xs font-extrabold uppercase">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0092DF]" /> Civic Accountability
                  </span>
                  <span className="text-xs text-[#64748B] flex items-center gap-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-[#E67817]" /> Northern Nigeria
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-[#0092DF] leading-snug">
                  Gani da Ido - Muryar Matasa – Idon Al’umma
                </h3>

                <p className="text-sm text-[#475569] font-medium leading-relaxed">
                  A youth-led civic engagement and social accountability project that amplifies young people’s voices and strengthens community participation in public decision-making and service monitoring.
                </p>

                <div className="p-4 rounded-[10px] bg-white border border-[#E2E8F0] text-xs text-[#64748B] leading-relaxed space-y-2">
                  <span className="font-bold text-[#0092DF] block">Key Mechanisms:</span>
                  <p>Youth Accountability Champions • Community Scorecards • Public Budget Tracking • Feedback Channels</p>
                </div>
              </div>

              <div className="pt-6 border-t border-[#E2E8F0]">
                <Button
                  onClick={() => setSelectedProject(featuredInitiatives[1])}
                  className="w-full bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold text-xs"
                >
                  Read Full Initiative Overview <ArrowRight className="w-4 h-4 ml-2 text-[#E67817]" />
                </Button>
              </div>
            </div>
          </div>

          {/* Full Projects Directory */}
          {projects.length > 2 && (
            <div className="space-y-8 pt-10 border-t border-[#E2E8F0]">
              <h3 className="text-2xl font-extrabold text-[#0092DF] text-center">More Active Projects &amp; Field Interventions</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.slice(2).map((project) => (
                  <div
                    key={project.id}
                    className="rounded-[10px] border border-[#E2E8F0] border-t-4 border-t-[#86C127] bg-white p-6 brand-shadow flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-[11px] bg-[#F3F9E9] text-[#6EA71F] capitalize">
                          {project.status || 'Active'}
                        </Badge>
                        {project.location && (
                          <span className="text-xs text-[#64748B] flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#0092DF]" />
                            {project.location}
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-[#0092DF] leading-snug">{project.title}</h4>
                      <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3">{project.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modal Detail Dialog for Selected Initiative */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] border border-[#E2E8F0] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <Badge variant="secondary" className="bg-[#86C127] text-white font-bold uppercase text-[10px]">
                e-CAPH Initiative
              </Badge>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-extrabold text-[#0092DF]">{selectedProject.title}</h3>

              <div className="prose max-w-none text-slate-700 text-sm leading-relaxed space-y-4">
                {selectedProject.description ? (
                  selectedProject.description.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="text-sm leading-relaxed text-[#334155]">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-sm leading-relaxed text-[#334155]">{selectedProject.summary}</p>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-[#E2E8F0] flex justify-end">
              <Button onClick={() => setSelectedProject(null)} className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold">
                Done Reading
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
