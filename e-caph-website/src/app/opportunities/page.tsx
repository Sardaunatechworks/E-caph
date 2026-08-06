import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/config/site';
import { createClient } from '@/lib/supabase/server';
import { Briefcase, MapPin, ExternalLink } from 'lucide-react';
import type { Opportunity } from '@/types/database';

export const metadata: Metadata = {
  title: 'Opportunities & Careers',
  description: `Careers, fellowships, and volunteer opportunities with ${siteConfig.name}.`,
};

export default async function OpportunitiesPage() {
  const supabase = await createClient();
  const { data: dbOpps } = await supabase
    .from('opportunities')
    .select('*')
    .eq('is_open', true)
    .order('created_at', { ascending: false });

  const opportunities = (dbOpps as Opportunity[] | null) || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B]">
      <Header />

      <PageBanner
        title="Careers &amp; Opportunities"
        subtitle="Join our team, apply for fellowships, or volunteer to drive community change."
      />

      <section className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {opportunities.length > 0 ? (
            <div className="space-y-4 max-w-4xl mx-auto">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="p-6 rounded-[10px] border border-[#E2E8F0] border-l-4 border-l-[#86C127] bg-white brand-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-[#0092DF] text-white">{opp.opportunity_type}</Badge>
                      {opp.location && (
                        <span className="text-xs text-[#64748B] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#E67817]" />
                          {opp.location}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-[#0092DF]">{opp.title}</h3>
                    <p className="text-xs text-[#64748B] line-clamp-2">{opp.description}</p>
                  </div>
                  {opp.application_link && (
                    <a
                      href={opp.application_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 rounded-[6px] bg-[#0092DF] hover:bg-[#007DC2] text-white text-xs font-semibold transition-colors shrink-0"
                    >
                      Apply Now <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-3">
              <Briefcase className="w-12 h-12 text-[#94A3B8] mx-auto" />
              <h3 className="text-lg font-bold text-[#1E293B]">No Open Positions Currently</h3>
              <p className="text-xs text-[#64748B] max-w-md mx-auto">
                We don&apos;t have active job or fellowship openings at the moment. Follow our updates for future calls!
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
