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
            Enhancing Communities Action for Peace and Better Health Initiative
          </h2>
          <p className="text-base text-[#64748B] leading-relaxed">
            The Enhancing Communities Action for Peace and Better Health Initiative (e-CAPH) is a community-driven, non-profit organization dedicated to promoting peace, improving health outcomes, and advancing sustainable development among adolescents, women, young people, and underserved populations in Nigeria.
          </p>
          <p className="text-base text-[#64748B] leading-relaxed">
            Founded on the understanding that peace, health, and development are deeply interconnected, e-CAPH works to strengthen community systems, empower local actors, and bridge gaps between communities and government institutions. Our interventions are designed to address the root causes of poor health outcomes, social exclusion, and vulnerability through inclusive participation, evidence-based programming, and accountability mechanisms.
          </p>
          <p className="text-base text-[#64748B] leading-relaxed">
            e-CAPH is recognized for its leadership in adolescent and reproductive health, maternal and child health, gender-based violence prevention and response, community engagement, and the strategic use of digital tools to improve service delivery and decision-making.
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

      {/* Impact & Measurable Contributions */}
      <section className="py-16 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 max-w-4xl">
          <div className="space-y-3">
            <Badge variant="secondary">Measurable Impact</Badge>
            <h2 className="text-3xl font-extrabold text-[#0092DF]">Our Contributions to Communities</h2>
            <p className="text-sm text-[#64748B]">e-CAPH has made measurable contributions to peacebuilding and improved health outcomes across communities by:</p>
          </div>
          <ul className="space-y-4 text-sm text-[#64748B]">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#86C127] mt-2 shrink-0"></span>
              <span>Reaching thousands of adolescents, women, and families with essential health information and services.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#86C127] mt-2 shrink-0"></span>
              <span>Improving ANC attendance, facility delivery, immunisation follow-up, and family planning uptake through community-based tracking and digital tools (such as the ANC Tracker).</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#86C127] mt-2 shrink-0"></span>
              <span>Strengthening GBV prevention and response systems, improving access to referral services and survivor support.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#86C127] mt-2 shrink-0"></span>
              <span>Building the capacity of community volunteers, youth champions, health workers, and civil society actors.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#86C127] mt-2 shrink-0"></span>
              <span>Supporting policy dialogue, community accountability platforms, and multi-stakeholder engagement that promote inclusive and responsive governance.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Why e-CAPH / Core Strengths */}
      <section className="py-16 bg-[#F3F7F5] border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="secondary">Why Choose e-CAPH</Badge>
            <h2 className="text-3xl font-extrabold text-[#0092DF]">Rooted in Communities &amp; Driven by Results</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-[10px] bg-white border border-[#E2E8F0] border-t-4 border-t-[#86C127] brand-shadow space-y-3">
              <h4 className="text-base font-bold text-[#0092DF]">Rooted in Communities</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Grounded in long-standing relationships with communities, traditional structures, youth groups, and frontline health workers.
              </p>
            </div>
            <div className="p-6 rounded-[10px] bg-white border border-[#E2E8F0] border-t-4 border-t-[#86C127] brand-shadow space-y-3">
              <h4 className="text-base font-bold text-[#0092DF]">Bridging Communities &amp; Systems</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Effectively connecting community realities with government systems and policies so citizen voices inform planning, budgeting, and service delivery.
              </p>
            </div>
            <div className="p-6 rounded-[10px] bg-white border border-[#E2E8F0] border-t-4 border-t-[#86C127] brand-shadow space-y-3">
              <h4 className="text-base font-bold text-[#0092DF]">Evidence &amp; Innovation Driven</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Through tools such as the ANC Tracker, using data and technology to strengthen accountability, improve decision-making, and enhance service uptake.
              </p>
            </div>
            <div className="p-6 rounded-[10px] bg-white border border-[#E2E8F0] border-t-4 border-t-[#86C127] brand-shadow space-y-3">
              <h4 className="text-base font-bold text-[#0092DF]">Proven Experience &amp; Results</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Years of hands-on implementation across diverse LGAs delivering measurable, scalable results aligned with national development priorities.
              </p>
            </div>
            <div className="p-6 rounded-[10px] bg-white border border-[#E2E8F0] border-t-4 border-t-[#86C127] brand-shadow space-y-3">
              <h4 className="text-base font-bold text-[#0092DF]">Strong Strategic Partnerships</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Collaborating with government institutions, development partners, and civil society to expand reach, influence policy, and sustain impact.
              </p>
            </div>
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
