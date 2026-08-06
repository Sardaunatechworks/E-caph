import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/config/site';
import { createClient } from '@/lib/supabase/server';
import { Users, HeartPulse, ShieldCheck, TrendingUp } from 'lucide-react';
import type { ImpactStatistic } from '@/types/database';

export const metadata: Metadata = {
  title: 'Our Impact',
  description: `Measuring the social, health, and civic impact of ${siteConfig.name}.`,
};

export default async function ImpactPage() {
  let dbStats: ImpactStatistic[] | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('impact_statistics')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true });
    dbStats = data as ImpactStatistic[] | null;
  } catch {
    // Crash-proof fallback for Vercel deployment
  }

  const stats = dbStats || [];

  const defaultStats = [
    { label: 'Young People Reached', value: '95,000+', icon: Users },
    { label: 'Schools & Hubs Engaged', value: '36+', icon: HeartPulse },
    { label: 'Communities Served', value: '120+', icon: ShieldCheck },
    { label: 'Health Interventions Delivered', value: '45,000+', icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B]">
      <Header />

      <PageBanner
        title="Our Impact"
        subtitle="Quantifying our commitment to peace, community health, and sustainable development across Nigeria."
      />

      <section className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="secondary">Results &amp; Evidence</Badge>
            <h2 className="text-3xl font-extrabold text-[#0092DF]">Impact by the Numbers</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.length > 0
              ? stats.map((stat) => (
                  <div key={stat.id} className="p-8 rounded-[10px] bg-[#F3F7F5] border border-[#E2E8F0] brand-shadow text-center space-y-2">
                    <div className="text-4xl font-extrabold text-[#0092DF]">
                      {(stat.value ?? stat.numeric_value ?? 0).toLocaleString()}{stat.suffix || ''}
                    </div>
                    <div className="text-xs font-bold text-[#86C127] uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))
              : defaultStats.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="p-8 rounded-[10px] bg-[#F3F7F5] border border-[#E2E8F0] brand-shadow text-center space-y-3">
                      <div className="w-10 h-10 rounded-[6px] bg-[#F3F9E9] text-[#86C127] mx-auto flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-4xl font-extrabold text-[#0092DF]">{item.value}</div>
                      <div className="text-xs font-bold text-[#86C127] uppercase tracking-wider">{item.label}</div>
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
