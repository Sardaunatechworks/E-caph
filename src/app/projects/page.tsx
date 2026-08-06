import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/config/site';
import { createClient } from '@/lib/supabase/server';
import { MapPin, Calendar, FolderKanban } from 'lucide-react';
import type { Project } from '@/types/database';

export const metadata: Metadata = {
  title: 'Our Projects',
  description: `Active and completed projects carried out by ${siteConfig.name}.`,
};

export default async function ProjectsPage() {
  let dbProjects: Project[] | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    dbProjects = data as Project[] | null;
  } catch {
    // Crash-proof fallback for Vercel deployment
  }

  const projects = dbProjects || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B]">
      <Header />

      <PageBanner
        title="Projects &amp; Initiatives"
        subtitle="Community-level interventions, public health initiatives, and policy advocacy projects across Nigeria."
      />

      <section className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-[10px] border border-[#E2E8F0] border-t-4 border-t-[#86C127] bg-white p-6 brand-shadow flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-[11px] bg-[#F3F9E9] text-[#6EA71F]">
                        {project.status}
                      </Badge>
                      {project.location && (
                        <span className="text-xs text-[#64748B] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#0092DF]" />
                          {project.location}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-[#0092DF] leading-snug">{project.title}</h3>
                    <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3">{project.summary}</p>
                  </div>
                  {project.start_date && (
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {project.start_date}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-3">
              <FolderKanban className="w-12 h-12 text-[#94A3B8] mx-auto" />
              <h3 className="text-lg font-bold text-[#1E293B]">Projects Directory</h3>
              <p className="text-xs text-[#64748B]">Detailed project profiles are currently being loaded into our system.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
