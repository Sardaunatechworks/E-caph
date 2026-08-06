import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { siteConfig } from '@/config/site';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Get in touch with ${siteConfig.fullName}.`,
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B]">
      <Header />

      <PageBanner
        title="Contact Us"
        subtitle="Partner with e-CAPH, volunteer, or send an inquiry to our team."
      />

      <section className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <Badge variant="secondary">Direct Outreach</Badge>
              <h2 className="text-3xl font-extrabold text-[#0092DF]">Get in Touch</h2>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Whether you represent a donor institution, government office, local CSO, or community member, we welcome your communication.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 rounded-[10px] bg-[#F3F7F5] border border-[#E2E8F0]">
                <div className="w-10 h-10 rounded-[6px] bg-[#0092DF] text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#86C127]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1E293B] text-sm">Office Address</h4>
                  <p className="text-xs text-[#64748B] mt-0.5">{siteConfig.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-[10px] bg-[#F3F7F5] border border-[#E2E8F0]">
                <div className="w-10 h-10 rounded-[6px] bg-[#0092DF] text-white flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#86C127]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1E293B] text-sm">Email Address</h4>
                  <a href={`mailto:${siteConfig.email}`} className="text-xs text-[#0092DF] font-semibold hover:underline mt-0.5 block">
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-[10px] bg-[#F3F7F5] border border-[#E2E8F0]">
                <div className="w-10 h-10 rounded-[6px] bg-[#0092DF] text-white flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#86C127]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1E293B] text-sm">Phone Number</h4>
                  <a href={`tel:${siteConfig.phone}`} className="text-xs text-[#0092DF] font-semibold hover:underline mt-0.5 block">
                    {siteConfig.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 p-8 rounded-[10px] bg-[#F3F7F5] border border-[#E2E8F0] brand-shadow space-y-6">
            <h3 className="text-xl font-bold text-[#0092DF]">Send Us a Message</h3>

            <form className="space-y-4" action="#" method="POST">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1E293B]">Full Name *</label>
                  <Input placeholder="John Doe" required className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px] focus-visible:ring-[#0092DF]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1E293B]">Email Address *</label>
                  <Input type="email" placeholder="john@example.com" required className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px] focus-visible:ring-[#0092DF]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1E293B]">Phone Number</label>
                  <Input type="tel" placeholder="+234..." className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px] focus-visible:ring-[#0092DF]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1E293B]">Inquiry Type</label>
                  <Select className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px] focus-visible:ring-[#0092DF]">
                    {siteConfig.inquiryTypes.map((type, i) => (
                      <option key={i} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1E293B]">Subject *</label>
                <Input placeholder="Inquiry topic" required className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px] focus-visible:ring-[#0092DF]" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1E293B]">Message *</label>
                <Textarea placeholder="Type your message here..." rows={4} required className="bg-white border-[#E2E8F0] text-xs rounded-[6px] focus-visible:ring-[#0092DF]" />
              </div>

              <Button type="submit" className="w-full bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold py-2.5">
                Send Message <Send className="w-4 h-4 ml-2 text-[#E67817]" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
