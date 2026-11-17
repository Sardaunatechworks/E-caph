'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, ShieldCheck, HeartPulse, Scale, Users, Layers } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ProgrammeItem {
  id: string;
  title: string;
  category: string;
  icon: any;
  badgeColor: string;
  summary: string;
  details: string;
  featured_image?: string | null;
  slug?: string;
}

const defaultProgrammes: ProgrammeItem[] = [
  {
    id: 'prog-skills-hub',
    title: 'e-CAPH Skills Hub (Women & Youth Empowerment)',
    category: 'Economic Empowerment',
    icon: Sparkles,
    badgeColor: 'bg-[#86C127]',
    summary:
      'An economic empowerment initiative designed to equip women and young people with practical vocational and entrepreneurial skills that improve economic opportunities while addressing social vulnerabilities.',
    details: `The e-CAPH Skills Hub for women and youth empowerment is an economic empowerment initiative designed to equip women and young people with practical vocational and entrepreneurial skills that improve their economic opportunities while also addressing social vulnerabilities.\n\nThrough the Hub, Participants acquire high-demand skills in digital technology, entrepreneurship, vocational development, leadership, employability, and other emerging areas. Our goal is not only to provide training, but also to strengthen confidence, creativity, economic independence, and the ability of participants to contribute meaningfully to their communities.`,
    slug: 'skills-hub',
  },
  {
    id: 'prog-gani-da-ido',
    title: 'Gani da Ido (Muryar Matasa – Idon Al’umma)',
    category: 'Civic Engagement & Accountability',
    icon: ShieldCheck,
    badgeColor: 'bg-[#0092DF]',
    summary:
      'A youth-led civic engagement and social accountability project that amplifies young people’s voices and strengthens community participation in public decision-making.',
    details: `The e-CAPH Gani da Ido - Muryar Matasa – Idon Al’umma is a youth-led civic engagement and social accountability project that amplifies young people’s voices and strengthens community participation in public decision-making.\n\nThe project enables citizens to monitor public services, budgets, government commitments and development projects through accessible digital and community-based platforms. It provides safe channels for submitting complaints, sharing feedback and tracking how responsible institutions respond. Through Youth Accountability Champions, community scorecards, public dialogues and evidence-based advocacy, the project promotes transparency, inclusion and improved service delivery.`,
    slug: 'civic-accountability',
  },
  {
    id: 'prog-health',
    title: 'Adolescent & Youth Public Health',
    category: 'Public Health',
    icon: HeartPulse,
    badgeColor: 'bg-[#E67817]',
    summary:
      'Promoting maternal health, antenatal care tracking (ANC), reproductive health rights, and primary health system accountability across northern Nigeria.',
    details:
      'Mobilizing community health advocates to monitor drug availability, track 4th-visit antenatal care attendance, and build grassroots health awareness.',
    slug: 'public-health',
  },
  {
    id: 'prog-gbv',
    title: 'Gender Equality & GBV Prevention',
    category: 'Social Justice',
    icon: Scale,
    badgeColor: 'bg-[#86C127]',
    summary:
      'Advocating for gender inclusion, community survivor referral pathways, case tracking, and rights protection for women and adolescent girls.',
    details:
      'Empowering women champions, conducting grassroots dialogues, and establishing referral networks for gender-based violence response.',
    slug: 'gender-equality',
  },
];

export default function ProgrammesPage() {
  const [programmes, setProgrammes] = useState<ProgrammeItem[]>(defaultProgrammes);
  const [selectedProgramme, setSelectedProgramme] = useState<ProgrammeItem | null>(null);

  useEffect(() => {
    const fetchProgrammes = async () => {
      let cachedList: any[] = [];
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('ecaph_programmes');
        if (saved) {
          try {
            cachedList = JSON.parse(saved);
          } catch {}
        }
      }

      try {
        const supabase = createClient();
        const { data: dbData, error } = await supabase
          .from('programmes')
          .select('*')
          .eq('is_published', true)
          .order('order_index', { ascending: true });

        const activeList = (!error && dbData && dbData.length > 0) ? dbData : cachedList;

        if (activeList.length > 0) {
          // Merge active programmes with matching defaults or wrap into ProgrammeItem
          const merged: ProgrammeItem[] = activeList.map((item, idx) => {
            const match = defaultProgrammes.find(
              (d) =>
                d.slug === item.slug ||
                d.title.toLowerCase() === item.title.toLowerCase()
            );

            return {
              id: item.id || `prog-${idx}`,
              title: item.title,
              category: match?.category || 'Strategic Thematic Pillar',
              icon: match?.icon || Layers,
              badgeColor: match?.badgeColor || (idx % 2 === 0 ? 'bg-[#0092DF]' : 'bg-[#86C127]'),
              summary: item.description || match?.summary || '',
              details: item.content || item.description || match?.details || '',
              featured_image: item.featured_image || match?.featured_image || null,
              slug: item.slug || match?.slug,
            };
          });

          setProgrammes(merged);
        }
      } catch {
        if (cachedList.length > 0) {
          const merged: ProgrammeItem[] = cachedList.map((item, idx) => {
            const match = defaultProgrammes.find(
              (d) => d.slug === item.slug || d.title.toLowerCase() === item.title.toLowerCase()
            );
            return {
              id: item.id || `prog-${idx}`,
              title: item.title,
              category: match?.category || 'Strategic Thematic Pillar',
              icon: match?.icon || Layers,
              badgeColor: match?.badgeColor || 'bg-[#0092DF]',
              summary: item.description || match?.summary || '',
              details: item.content || item.description || match?.details || '',
              featured_image: item.featured_image || match?.featured_image || null,
              slug: item.slug || match?.slug,
            };
          });
          setProgrammes(merged);
        }
      }
    };

    fetchProgrammes();

    const handleUpdate = () => fetchProgrammes();
    window.addEventListener('ecaph_programmes_updated', handleUpdate);
    return () => {
      window.removeEventListener('ecaph_programmes_updated', handleUpdate);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B] font-sans">
      <Header />

      <PageBanner
        title="Our Core Programmes"
        subtitle="Comprehensive interventions spanning vocational skills, youth economic empowerment, public health, peacebuilding, and civic accountability."
      />

      <section className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="secondary" className="bg-[#86C127] text-white font-bold uppercase tracking-wider text-[10px]">
              Thematic Areas
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0092DF]">
              Programmes &amp; Interventions
            </h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Evidence-informed, community-driven interventions empowering vulnerable groups and strengthening local health and governance structures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programmes.map((prog) => {
              const Icon = prog.icon;
              return (
                <div
                  key={prog.id}
                  className="rounded-[16px] border border-[#E2E8F0] border-t-4 border-t-[#86C127] bg-[#F8FAFC] p-8 brand-shadow hover:brand-shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6 group"
                >
                  <div className="space-y-4">
                    {/* Programme Cover Image */}
                    {prog.featured_image && (
                      <div className="aspect-video w-full rounded-[10px] bg-slate-100 overflow-hidden border border-slate-200 shadow-xs">
                        <img
                          src={prog.featured_image}
                          alt={prog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-extrabold uppercase ${prog.badgeColor}`}>
                        <Icon className="w-3.5 h-3.5" /> {prog.category}
                      </span>
                    </div>

                    <h3 className="text-2xl font-extrabold text-[#0092DF] leading-snug">
                      {prog.title}
                    </h3>

                    <p className="text-sm text-[#475569] leading-relaxed">
                      {prog.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E2E8F0] flex items-center gap-3">
                    <Button
                      onClick={() => setSelectedProgramme(prog)}
                      className="flex-1 bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold text-xs"
                    >
                      View Programme Overview <ArrowRight className="w-4 h-4 ml-2 text-[#E67817]" />
                    </Button>
                    {prog.slug && (
                      <Link href={`/programmes/${prog.slug}`}>
                        <Button
                          variant="outline"
                          className="border-[#E2E8F0] text-xs font-bold text-[#0092DF] hover:bg-slate-50"
                        >
                          Full Page
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal Detail Dialog */}
      {selectedProgramme && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] border border-[#E2E8F0] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <Badge variant="secondary" className="bg-[#86C127] text-white font-bold uppercase text-[10px]">
                {selectedProgramme.category}
              </Badge>
              <button
                onClick={() => setSelectedProgramme(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕ Close
              </button>
            </div>

            {selectedProgramme.featured_image && (
              <div className="aspect-video w-full rounded-[12px] bg-slate-100 overflow-hidden border border-slate-200 shadow-sm">
                <img
                  src={selectedProgramme.featured_image}
                  alt={selectedProgramme.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-2xl font-extrabold text-[#0092DF]">{selectedProgramme.title}</h3>

              <div className="prose max-w-none text-slate-700 text-sm leading-relaxed space-y-4">
                {selectedProgramme.details.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-sm leading-relaxed text-[#334155]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#E2E8F0] flex justify-end">
              <Button onClick={() => setSelectedProgramme(null)} className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold">
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
