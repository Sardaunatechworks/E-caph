'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { MapPin, FolderKanban, Sparkles, ArrowRight, Search, CheckCircle2 } from 'lucide-react';
import type { Project } from '@/types/database';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    let currentList: Project[] = [];

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

  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.toLowerCase();
    return (
      project.title.toLowerCase().includes(query) ||
      project.summary.toLowerCase().includes(query) ||
      (project.location && project.location.toLowerCase().includes(query))
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B] font-sans">
      <Header />

      <PageBanner
        title="Projects &amp; Field Interventions"
        subtitle="Explore all community interventions, youth economic empowerment hubs, public health monitoring, and civic accountability projects across Nigeria."
      />

      <section className="py-16 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header & Search Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#E2E8F0]">
            <div className="space-y-2 text-center md:text-left">
              <Badge variant="secondary" className="bg-[#86C127] text-white font-bold uppercase text-[10px]">
                Live Projects Directory
              </Badge>
              <h2 className="text-3xl font-extrabold text-[#0092DF]">
                All Field Projects ({filteredProjects.length})
              </h2>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by keyword, location..."
                className="pl-10 bg-[#F8FAFC] border-[#E2E8F0] h-11 text-xs rounded-[8px]"
              />
            </div>
          </div>

          {/* Full Grid of All Projects */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-[16px] border border-[#E2E8F0] border-t-4 border-t-[#86C127] bg-[#F8FAFC] p-6 brand-shadow hover:brand-shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6 group"
                >
                  <div className="space-y-4">
                    {/* Project Featured Cover Image */}
                    {project.featured_image && (
                      <div className="aspect-video w-full rounded-[10px] bg-[#E2E8F0] overflow-hidden border border-slate-200 shadow-xs">
                        <img
                          src={project.featured_image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3F9E9] text-[#6EA71F] text-[11px] font-extrabold uppercase">
                        <Sparkles className="w-3.5 h-3.5 text-[#86C127]" /> {project.status || 'Ongoing'}
                      </span>
                      {project.location && (
                        <span className="text-xs text-[#64748B] flex items-center gap-1 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-[#E67817]" />
                          {project.location}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-extrabold text-[#0092DF] leading-snug group-hover:text-[#007DC2] transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-xs text-[#475569] leading-relaxed font-normal line-clamp-3">
                      {project.summary}
                    </p>

                    {project.target_beneficiaries && (
                      <div className="p-3 rounded-[8px] bg-white border border-[#E2E8F0] text-[11px] text-[#64748B] font-medium space-y-1">
                        <span className="font-bold text-[#0092DF] block">Target Beneficiaries:</span>
                        <p>{project.target_beneficiaries}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#E2E8F0]">
                    <Button
                      onClick={() => setSelectedProject(project)}
                      className="w-full bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold text-xs"
                    >
                      View Full Project Details <ArrowRight className="w-4 h-4 ml-2 text-[#E67817]" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center rounded-[16px] bg-[#F8FAFC] border border-[#E2E8F0] brand-shadow space-y-3">
              <FolderKanban className="w-12 h-12 text-[#94A3B8] mx-auto" />
              <h3 className="text-lg font-bold text-[#1E293B]">No Projects Found in Database</h3>
              <p className="text-xs text-[#64748B]">Projects created in the Admin CMS will automatically display here.</p>
            </div>
          )}
        </div>
      </section>

      {/* Detailed Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] border border-[#E2E8F0] max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-[#86C127] text-white font-bold uppercase text-[10px]">
                  Project Profile
                </Badge>
                {selectedProject.location && (
                  <span className="text-xs text-[#64748B] flex items-center gap-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-[#E67817]" /> {selectedProject.location}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-extrabold text-[#0092DF]">{selectedProject.title}</h3>

              {selectedProject.featured_image && (
                <div className="aspect-video w-full rounded-[12px] bg-[#E2E8F0] overflow-hidden border border-slate-200">
                  <img src={selectedProject.featured_image} alt={selectedProject.title} className="w-full h-full object-cover" />
                </div>
              )}

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

              {selectedProject.results_to_date && selectedProject.results_to_date.length > 0 && (
                <div className="p-4 rounded-[10px] bg-[#F3F9E9] border border-[#86C127]/40 space-y-2">
                  <h4 className="text-xs font-bold text-[#6EA71F] uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#86C127]" /> Verified Results to Date
                  </h4>
                  <ul className="text-xs text-[#334155] space-y-1 list-disc list-inside font-medium">
                    {selectedProject.results_to_date.map((res, idx) => (
                      <li key={idx}>{res}</li>
                    ))}
                  </ul>
                </div>
              )}
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
