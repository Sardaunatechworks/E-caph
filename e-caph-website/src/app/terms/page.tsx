import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of service for ${siteConfig.fullName}.`,
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B]">
      <Header />

      <PageBanner
        title="Terms of Service"
        subtitle="Guidelines and terms governing the use of the e-CAPH website."
      />

      <section className="py-16 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <p className="text-xs font-semibold text-[#94A3B8]">Last updated: August 2026</p>

          <div className="space-y-6 text-sm text-[#64748B] leading-relaxed">
            <p>
              Welcome to the website of {siteConfig.fullName} (&quot;e-CAPH&quot;). By visiting this platform, you agree to comply with these Terms of Service.
            </p>

            <h3 className="text-base font-bold text-[#0092DF]">1. Use of Content</h3>
            <p>
              All materials, publications, logos, and reports are property of e-CAPH unless otherwise indicated. Educational and non-commercial re-use is permitted provided proper attribution is maintained.
            </p>

            <h3 className="text-base font-bold text-[#0092DF]">2. Intellectual Property</h3>
            <p>
              The e-CAPH name, logo, and brand identifiers may not be copied or modified without prior written approval.
            </p>

            <h3 className="text-base font-bold text-[#0092DF]">3. Contact Information</h3>
            <p>
              For inquiries regarding terms of use, please reach out to{' '}
              <a href={`mailto:${siteConfig.email}`} className="text-[#0092DF] font-semibold underline hover:text-[#E67817]">
                {siteConfig.email}
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
