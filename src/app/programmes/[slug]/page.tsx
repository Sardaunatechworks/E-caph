import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { createClient } from '@/lib/supabase/server';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import type { Project } from '@/types/database';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return siteConfig.nav.footer.programmes.map((p) => ({
    slug: p.href.replace('/programmes/', ''),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const programme = siteConfig.nav.footer.programmes.find(
    (p) => p.href === `/programmes/${slug}`
  );

  if (!programme) return { title: 'Programme Not Found' };

  return {
    title: programme.label,
    description: `Learn about ${programme.label} at ${siteConfig.name}.`,
  };
}

export default async function ProgrammeDetailPage({ params }: Props) {
  const { slug } = await params;
  const programme = siteConfig.nav.footer.programmes.find(
    (p) => p.href === `/programmes/${slug}`
  );

  if (!programme) notFound();

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

  const programmeProjects = dbProjects || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B]">
      <Header />

      <PageBanner
        title={programme.label}
        subtitle="Thematic programme pillar driving community-led solutions across Nigeria."
        breadcrumb={[{ label: 'Programmes', href: '/programmes' }]}
      />

      <section className="py-16 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#0092DF]">Programme Overview</h2>
              <p className="text-[#64748B] leading-relaxed text-base">
                {programme.label} is a strategic pillar within {siteConfig.name}, dedicated to designing scalable interventions alongside grassroots communities.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
              <h3 className="text-lg font-bold text-[#1E293B]">Objectives &amp; Methodology</h3>
              <ul className="space-y-3">
                {[
                  'Community engagement and participatory dialogue with local stakeholders.',
                  'Capacity enhancement and skills training for youth and women leaders.',
                  'Rights-based advocacy and policy engagement with decision-makers.',
                  'Data-driven monitoring, evaluation, and evidence generation.',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[#64748B] text-sm">
                    <CheckCircle2 className="w-5 h-5 text-[#86C127] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-[10px] bg-[#F3F7F5] border border-[#E2E8F0] space-y-4">
              <h4 className="font-bold text-[#0092DF] text-base">Partner With Us</h4>
              <p className="text-[#64748B] text-xs leading-relaxed">
                We welcome collaboration with donors, government agencies, and civil society partners.
              </p>
              <Link href="/contact?type=partnership" className="block">
                <Button className="w-full bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold">
                  Inquire About Partnership <ArrowRight className="ml-2 w-4 h-4 text-[#E67817]" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
