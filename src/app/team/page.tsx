import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageBanner } from '@/components/common/page-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { createClient } from '@/lib/supabase/server';
import { Mail, Linkedin, ArrowRight, HeartPulse, Users, ShieldCheck } from 'lucide-react';
import type { TeamMember } from '@/types/database';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Our Team',
  description: `Meet the leadership and passionate team behind ${siteConfig.fullName}.`,
};

const defaultTeamMembers = [
  {
    id: '1',
    full_name: 'Abdulmumin Rabiu',
    role_title: 'Executive Director & Founder',
    bio: 'Abdulmumin is a dynamic community development leader with extensive expertise in project management, strategic program leadership, and community engagement. With over five years of experience driving social impact across northern Nigeria, he has successfully designed, implemented, and scaled initiatives that empower adolescents, youth, and local communities to improve health, education, and livelihoods.',
    avatar_url: null,
    email: 'caph4dev35@gmail.com',
    linkedin_url: '#',
    order_index: 1,
    is_active: true,
  },
  {
    id: '2',
    full_name: 'Khadija Lawal Aliyu',
    role_title: 'Gender Thematic Lead',
    bio: 'Providing leadership on gender equality, human rights, and social inclusion programming. She holds a BSc in Biochemistry (First Class) from Federal University Gashua and has strong experience in research, advocacy, and community engagement.',
    avatar_url: null,
    email: 'caph4dev35@gmail.com',
    linkedin_url: '#',
    order_index: 2,
    is_active: true,
  },
  {
    id: '3',
    full_name: 'Fatima Muftau',
    role_title: 'Monitoring & Evaluation (M&E) Lead',
    bio: 'Fatima Muftau is a dedicated Monitoring & Evaluation professional with expertise in data collection, analysis, and program assessment to support evidence-based decision-making. She holds an HND in PsychoSocial Rehabilitation Science.',
    avatar_url: null,
    email: 'caph4dev35@gmail.com',
    linkedin_url: '#',
    order_index: 3,
    is_active: true,
  },
  {
    id: '4',
    full_name: 'Muhammed Sani Kabir',
    role_title: 'Communications Lead',
    bio: 'Muhammed Sani Kabir is a creative and impact-driven Communications Lead with expertise in digital advocacy, strategic messaging, and multimedia content production. He specializes in leveraging ICT4D tools to bridge data, storytelling, and social impact.',
    avatar_url: null,
    email: 'caph4dev35@gmail.com',
    linkedin_url: '#',
    order_index: 4,
    is_active: true,
  },
  {
    id: '5',
    full_name: 'Zakiyya Said Abdulkadir',
    role_title: 'Health Thematic Lead',
    bio: 'Providing technical leadership for community and primary healthcare programs, including adolescent and youth health interventions. She holds a Higher National Diploma and National Diploma in Community Health from Shehu Idris College of Health Science and Technology, Makarfi.',
    avatar_url: null,
    email: 'caph4dev35@gmail.com',
    linkedin_url: '#',
    order_index: 5,
    is_active: true,
  },
];

const accentColors = [
  'bg-[#E67817]', // Vibrant Orange accent
  'bg-[#86C127]', // Lime Green accent
  'bg-[#0092DF]', // Cyan/Blue accent
  'bg-[#E67817]', // Orange accent
];

export default async function TeamPage() {
  let dbMembers: TeamMember[] | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    dbMembers = data as TeamMember[] | null;
  } catch {
    // Crash-proof fallback for Vercel deployment
  }

  const teamMembers = dbMembers || defaultTeamMembers;

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B] font-sans">
      <Header />

      <PageBanner
        title="Meet Our Team"
        subtitle="Dedicated professionals driving sustainable development, public health, and peacebuilding in Nigeria."
        breadcrumb={[{ label: 'About Us', href: '/about' }]}
      />

      {/* Leadership & Staff Roster Section */}
      <section className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#86C127] uppercase tracking-widest block">
              Organizational Staff
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0092DF]">
              Meet Our Team
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-10">
            {teamMembers.map((member, idx) => {
              const initials = member.full_name.split(' ').map(n => n[0]).join('').slice(0, 2);
              const accent = accentColors[idx % accentColors.length];

              return (
                <div key={member.id} className="flex flex-col items-center text-center space-y-6 group">
                  {/* Photo Card with Offset Accent Background */}
                  <div className="relative w-full max-w-[280px]">
                    {/* Offset Accent Block */}
                    <div
                      className={`absolute inset-0 translate-x-3 translate-y-3 rounded-[20px] ${accent} transition-transform duration-300 group-hover:translate-x-4 group-hover:translate-y-4`}
                    />

                    {/* Main Image Container */}
                    <div className="relative aspect-square w-full rounded-[20px] bg-[#D1D5DB] overflow-hidden border border-slate-200/80 shadow-sm">
                      {member.avatar_url ? (
                        <img
                          src={member.avatar_url}
                          alt={member.full_name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#CBD5E1]">
                          <div className="w-20 h-20 rounded-full bg-[#0092DF] text-white flex items-center justify-center text-2xl font-black shadow-md">
                            {initials}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Member Name and Position Only */}
                  <div className="space-y-1 pt-2">
                    <h3 className="text-lg font-extrabold text-[#0092DF] group-hover:text-[#007DC2] transition-colors leading-snug">
                      {member.full_name}
                    </h3>
                    <p className="text-xs text-[#64748B] font-semibold tracking-wide">
                      {member.role_title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Values */}
      <section className="py-20 bg-[#F3F7F5] border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="secondary">Leadership Principles</Badge>
            <h2 className="text-3xl font-extrabold text-[#0092DF]">How We Work Together</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-[10px] bg-white border border-[#E2E8F0] border-t-4 border-t-[#86C127] brand-shadow space-y-3">
              <div className="w-10 h-10 rounded-[6px] bg-[#E6F4FC] text-[#0092DF] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0092DF]">Youth Leadership</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Empowering young healthcare professionals and advocates to lead localized intervention programs.
              </p>
            </div>

            <div className="p-6 rounded-[10px] bg-white border border-[#E2E8F0] border-t-4 border-t-[#86C127] brand-shadow space-y-3">
              <div className="w-10 h-10 rounded-[6px] bg-[#F3F9E9] text-[#86C127] flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0092DF]">Community Inclusion</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Co-designing initiatives alongside community leaders, women groups, and primary healthcare workers.
              </p>
            </div>

            <div className="p-6 rounded-[10px] bg-white border border-[#E2E8F0] border-t-4 border-t-[#86C127] brand-shadow space-y-3">
              <div className="w-10 h-10 rounded-[6px] bg-[#FDF2E8] text-[#E67817] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0092DF]">Evidence &amp; Rigor</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Applying research rigor, data protection, and transparent monitoring across all field interventions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#003D60] text-white text-center">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Interested in Partnering With Our Team?
          </h2>
          <p className="text-slate-200 text-base leading-relaxed max-w-2xl mx-auto">
            We welcome strategic collaborations with international development partners, civil society organizations, and research institutions.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link href="/contact?type=partnership">
              <Button size="lg" className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-extrabold shadow-md">
                Partner With Us
              </Button>
            </Link>
            <Link href="/opportunities">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent">
                View Open Positions <ArrowRight className="ml-2 w-4 h-4 text-[#E67817]" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
