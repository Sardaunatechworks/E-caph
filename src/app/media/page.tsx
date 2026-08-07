import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { siteConfig } from '@/config/site';
import { Camera, Video, FileText } from 'lucide-react';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Media & Gallery',
  description: `Photos, videos, and media resources from ${siteConfig.name}.`,
};

export default function MediaPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B]">
      <Header />

      <PageBanner
        title="Media Centre"
        subtitle="Photographs, videos, press kit, and multimedia documentation from our community outreach."
      />

      <section className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-[10px] bg-[#F3F7F5] border border-[#E2E8F0] space-y-3 border-t-4 border-t-[#86C127]">
              <div className="w-10 h-10 rounded-[6px] bg-[#0092DF] text-white flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0092DF]">Photo Gallery</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Documentation of field workshops, community dialogues, and health intervention sessions.
              </p>
            </div>

            <div className="p-8 rounded-[10px] bg-[#F3F7F5] border border-[#E2E8F0] space-y-3 border-t-4 border-t-[#86C127]">
              <div className="w-10 h-10 rounded-[6px] bg-[#E67817] text-white flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0092DF]">Video Highlights</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Short films, beneficiary testimonials, and project recaps.
              </p>
            </div>

            <div className="p-8 rounded-[10px] bg-[#F3F7F5] border border-[#E2E8F0] space-y-3 border-t-4 border-t-[#86C127]">
              <div className="w-10 h-10 rounded-[6px] bg-[#86C127] text-white flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0092DF]">Press Statements</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Official press releases, policy briefs, and institutional brand assets.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
