import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { technicalApproaches } from '@/config/theme';
import { Target, Award, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about ${siteConfig.fullName} — our mission, vision, and approach to sustainable development in Nigeria.`,
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B]">
      <Header />

      <PageBanner
        title="About Us"
        subtitle="Youth-led non-profit driving public health, human rights, and civic empowerment across Nigeria."
      />

      {/* Overview */}
      <section className="py-16 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 max-w-4xl">
          <Badge variant="secondary">Organizational Identity</Badge>
          <h2 className="text-3xl font-extrabold text-[#0092DF]">
            Action for Peace and Better Health Initiative
          </h2>
          <p className="text-base text-[#64748B] leading-relaxed">
            {siteConfig.description}
          </p>
          <p className="text-base text-[#64748B] leading-relaxed">
            Operating from Kaduna, Nigeria, e-CAPH creates grassroots programs that empower communities, protect human rights, and foster social cohesion through youth-led action.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-[#F3F7F5] border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-8 rounded-[10px] bg-white border border-[#E2E8F0] brand-shadow space-y-4 relative overflow-hidden">
            <div className="w-full h-1 bg-[#86C127] absolute top-0 left-0"></div>
            <div className="w-10 h-10 rounded-[6px] bg-[#FDF2E8] text-[#E67817] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-[#0092DF]">Our Mission</h3>
            <p className="text-[#64748B] text-sm leading-relaxed">{siteConfig.mission}</p>
          </div>

          <div className="p-8 rounded-[10px] bg-white border border-[#E2E8F0] brand-shadow space-y-4 relative overflow-hidden">
            <div className="w-full h-1 bg-[#86C127] absolute top-0 left-0"></div>
            <div className="w-10 h-10 rounded-[6px] bg-[#FDF2E8] text-[#E67817] flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-[#0092DF]">Our Vision</h3>
            <p className="text-[#64748B] text-sm leading-relaxed">{siteConfig.vision}</p>
          </div>
        </div>
      </section>

      {/* Technical Approaches */}
      <section className="py-16 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="secondary">Methodology</Badge>
            <h2 className="text-3xl font-extrabold text-[#0092DF]">How We Operate</h2>
          </div>
          <div className="space-y-4 max-w-4xl mx-auto">
            {technicalApproaches.map((item) => (
              <div key={item.number} className="p-6 rounded-[10px] border border-[#E2E8F0] bg-[#F7FAF8] flex items-start gap-6">
                <span className="text-2xl font-extrabold text-[#E67817] shrink-0">{item.number}</span>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-[#0092DF]">{item.title}</h4>
                  <p className="text-sm text-[#64748B] leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#003D60] text-white text-center">
        <div className="container mx-auto max-w-3xl px-4 space-y-4">
          <h3 className="text-2xl sm:text-3xl font-bold">Interested in Partnering With Us?</h3>
          <p className="text-slate-200 text-sm">Collaborate with e-CAPH on public health, youth empowerment, or civic initiatives.</p>
          <div className="pt-2">
            <Link href="/contact?type=partnership">
              <Button className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold">
                Partner With Us <ArrowRight className="ml-2 w-4 h-4 text-[#E67817]" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
