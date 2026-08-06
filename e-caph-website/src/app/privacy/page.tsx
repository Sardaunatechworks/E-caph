import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy policy for ${siteConfig.fullName}.`,
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B]">
      <Header />

      <PageBanner
        title="Privacy Policy"
        subtitle="How e-CAPH manages and protects your personal information."
      />

      <section className="py-16 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <p className="text-xs font-semibold text-[#94A3B8]">Last updated: August 2026</p>

          <div className="space-y-6 text-sm text-[#64748B] leading-relaxed">
            <p>
              {siteConfig.fullName} (&quot;e-CAPH&quot;) respects your privacy and is dedicated to safeguarding any personal information collected through our website and digital services.
            </p>

            <h3 className="text-base font-bold text-[#0092DF]">1. Information Collection</h3>
            <p>
              We collect information that you directly provide when filling out contact forms, newsletter subscriptions, or opportunity applications. This includes your name, email address, phone number, and organization.
            </p>

            <h3 className="text-base font-bold text-[#0092DF]">2. Use of Information</h3>
            <p>
              Your data is strictly used to communicate regarding organizational activities, evaluate job/volunteer applications, process partnership inquiries, and improve our services.
            </p>

            <h3 className="text-base font-bold text-[#0092DF]">3. Data Protection</h3>
            <p>
              We do not sell or rent personal information to third parties. Security protocols are enforced to guard against unauthorized access or disclosure.
            </p>

            <h3 className="text-base font-bold text-[#0092DF]">4. Contact Us</h3>
            <p>
              Questions regarding this policy may be directed to{' '}
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
