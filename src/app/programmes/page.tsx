import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { siteConfig } from '@/config/site';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Programmes',
  description: `Explore the core programmes of ${siteConfig.name}.`,
};

export default function ProgrammesPage() {
  const programmesList = siteConfig.nav.footer.programmes;

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B]">
      <Header />

      <PageBanner
        title="Our Programmes"
        subtitle="Comprehensive interventions spanning public health, youth empowerment, peacebuilding, and civic accountability."
      />

      <section className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programmesList.map((prog, idx) => (
              <div
                key={idx}
                className="group rounded-[10px] border border-[#E2E8F0] border-t-4 border-t-[#86C127] bg-white p-6 brand-shadow hover:brand-shadow-lg transition-all duration-150 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-[6px] bg-[#E6F4FC] text-[#0092DF] flex items-center justify-center font-bold group-hover:bg-[#0092DF] group-hover:text-white transition-colors">
                    0{idx + 1}
                  </div>
                  <h3 className="text-lg font-bold text-[#0092DF] group-hover:text-[#007DC2] transition-colors leading-snug">
                    {prog.label}
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    Evidence-informed, community-driven interventions empowering vulnerable groups and strengthening local health and governance structures.
                  </p>
                </div>
                <Link
                  href={prog.href}
                  className="inline-flex items-center text-xs font-bold text-[#E67817] hover:text-[#CF660F] transition-colors pt-2"
                >
                  View Programme Details <ArrowRight className="ml-1.5 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
