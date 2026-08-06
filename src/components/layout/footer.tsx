import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/common/logo';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#003D60] text-white py-16 mt-auto font-sans border-t border-[#005A8D]">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Column 1: Logo & Summary */}
        <div className="space-y-4 lg:col-span-2">
          <Logo variant="white" />

          <p className="text-xs text-slate-200 leading-relaxed max-w-sm">
            {siteConfig.description}
          </p>

          <div className="pt-2 text-xs text-slate-200 space-y-1.5">
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#86C127]" /> {siteConfig.address}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#86C127]" /> {siteConfig.email}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#86C127]" /> {siteConfig.phone}
            </p>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-[#86C127] uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            {siteConfig.nav.footer.quickLinks.map((q, i) => (
              <li key={i}>
                <Link href={q.href} className="text-slate-200 hover:text-[#E67817] transition-colors">
                  {q.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Programmes */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-[#86C127] uppercase tracking-wider">Programmes</h4>
          <ul className="space-y-2 text-xs">
            {siteConfig.nav.footer.programmes.slice(0, 5).map((p, i) => (
              <li key={i}>
                <Link href={p.href} className="text-slate-200 hover:text-[#E67817] transition-colors leading-snug block">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="space-y-3 lg:col-span-1">
          <h4 className="text-sm font-bold text-[#86C127] uppercase tracking-wider">Stay Informed</h4>
          <p className="text-xs text-slate-200 leading-relaxed">
            Subscribe for field updates, policy briefs, and reports.
          </p>

          <form action="#" method="POST" className="space-y-2 pt-1">
            <Input
              type="email"
              placeholder="Your email address"
              required
              className="bg-[#005A8D] border-[#007DC2] text-white placeholder:text-slate-300 text-xs h-9 rounded-[6px] focus-visible:ring-[#86C127]"
            />
            <Button
              type="submit"
              size="sm"
              className="w-full bg-[#0092DF] hover:bg-[#007DC2] text-white font-semibold text-xs h-9"
            >
              Subscribe <Send className="w-3 h-3 ml-1.5" />
            </Button>
          </form>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-[#005A8D] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-4">
        <p>© {new Date().getFullYear()} {siteConfig.fullName}. All rights reserved.</p>

        <div className="flex items-center gap-6">
          {siteConfig.nav.footer.legal.map((l, i) => (
            <Link key={i} href={l.href} className="hover:text-[#E67817] transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
