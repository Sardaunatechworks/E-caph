'use client';

import Link from 'next/link';
import { useState } from 'react';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/common/logo';
import { Mail, Phone, MapPin, Menu, X, ChevronDown } from 'lucide-react';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [mediaDropdownOpen, setMediaDropdownOpen] = useState(false);

  return (
    <header className="w-full font-sans sticky top-0 z-50 shadow-sm bg-white">
      {/* Top Information Bar - Deep Blue with Orange Accents */}
      <div className="bg-[#005A8D] text-white text-xs py-2 px-4 border-b border-[#007DC2]/40">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-1.5 hover:text-[#E67817] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#E67817]" />
              <span className="hidden sm:inline">{siteConfig.email}</span>
            </a>
            <a
              href={`tel:${siteConfig.phone}`}
              className="flex items-center gap-1.5 hover:text-[#E67817] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#E67817]" />
              <span>{siteConfig.phone}</span>
            </a>
            <span className="hidden md:flex items-center gap-1.5 text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-[#E67817]" />
              {siteConfig.address}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-200">
            <span>Enhancing Communities Action for Peace &amp; Health</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Anchor */}
          <Logo />

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-[#1E293B]">
            <Link
              href="/"
              className="hover:text-[#E67817] transition-colors relative py-2 text-[#0092DF] border-b-2 border-[#0092DF]"
            >
              Home
            </Link>

            {/* About Us Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-[#E67817] transition-colors cursor-pointer py-2 font-semibold">
                About Us <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
              </button>
              {aboutDropdownOpen && (
                <div className="absolute top-full left-0 w-52 bg-white border border-[#E2E8F0] rounded-[6px] shadow-md py-2 space-y-1 z-50 animate-in fade-in-50 duration-150">
                  <Link
                    href="/about"
                    className="block px-4 py-2 text-xs font-semibold text-[#1E293B] hover:bg-[#F7FAF8] hover:text-[#0092DF] transition-colors"
                  >
                    Our Story &amp; Mission
                  </Link>
                  <Link
                    href="/team"
                    className="block px-4 py-2 text-xs font-semibold text-[#1E293B] hover:bg-[#F7FAF8] hover:text-[#0092DF] transition-colors"
                  >
                    Meet Our Team
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/programmes"
              className="hover:text-[#E67817] hover:border-b-2 hover:border-[#E67817] transition-all py-2"
            >
              Our Programmes
            </Link>

            <Link
              href="/projects"
              className="hover:text-[#E67817] hover:border-b-2 hover:border-[#E67817] transition-all py-2"
            >
              Projects
            </Link>

            {/* Media Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setMediaDropdownOpen(true)}
              onMouseLeave={() => setMediaDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-[#E67817] transition-colors cursor-pointer py-2 font-semibold">
                Media <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
              </button>
              {mediaDropdownOpen && (
                <div className="absolute top-full left-0 w-48 bg-white border border-[#E2E8F0] rounded-[6px] shadow-md py-2 space-y-1 z-50 animate-in fade-in-50 duration-150">
                  <Link
                    href="/stories"
                    className="block px-4 py-2 text-xs font-semibold text-[#1E293B] hover:bg-[#F7FAF8] hover:text-[#0092DF] transition-colors"
                  >
                    Stories &amp; News
                  </Link>
                  <Link
                    href="/media"
                    className="block px-4 py-2 text-xs font-semibold text-[#1E293B] hover:bg-[#F7FAF8] hover:text-[#0092DF] transition-colors"
                  >
                    Gallery &amp; Multimedia
                  </Link>
                  <Link
                    href="/opportunities"
                    className="block px-4 py-2 text-xs font-semibold text-[#1E293B] hover:bg-[#F7FAF8] hover:text-[#0092DF] transition-colors"
                  >
                    Careers &amp; Opportunities
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className="hover:text-[#E67817] hover:border-b-2 hover:border-[#E67817] transition-all py-2"
            >
              Contact Us
            </Link>
          </nav>

          {/* Action Button & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link href="/contact?type=partnership" className="hidden sm:inline-flex">
              <Button size="default" className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold">
                Partner With Us
              </Button>
            </Link>

            <button
              className="lg:hidden p-2 rounded-[6px] hover:bg-[#F7FAF8] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6 text-[#1E293B]" /> : <Menu className="w-6 h-6 text-[#1E293B]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#E2E8F0] bg-white px-6 py-6 space-y-4 shadow-lg animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-3 text-sm font-semibold text-[#1E293B]">
            <Link href="/" onClick={() => setMobileOpen(false)} className="py-1.5 text-[#0092DF]">
              Home
            </Link>

            <div className="space-y-1.5 pl-2 border-l-2 border-[#86C127]">
              <span className="text-xs font-bold text-[#86C127] uppercase tracking-wider block">About Us</span>
              <Link href="/about" onClick={() => setMobileOpen(false)} className="block py-1 hover:text-[#E67817]">
                Our Story &amp; Mission
              </Link>
              <Link href="/team" onClick={() => setMobileOpen(false)} className="block py-1 text-[#0092DF] font-bold">
                Meet Our Team
              </Link>
            </div>

            <Link href="/programmes" onClick={() => setMobileOpen(false)} className="py-1.5 hover:text-[#E67817]">
              Our Programmes
            </Link>
            <Link href="/projects" onClick={() => setMobileOpen(false)} className="py-1.5 hover:text-[#E67817]">
              Projects
            </Link>
            <Link href="/stories" onClick={() => setMobileOpen(false)} className="py-1.5 hover:text-[#E67817]">
              Stories &amp; News
            </Link>
            <Link href="/media" onClick={() => setMobileOpen(false)} className="py-1.5 hover:text-[#E67817]">
              Media &amp; Gallery
            </Link>
            <Link href="/opportunities" onClick={() => setMobileOpen(false)} className="py-1.5 hover:text-[#E67817]">
              Opportunities
            </Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="py-1.5 hover:text-[#E67817]">
              Contact Us
            </Link>
          </nav>

          <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
            <Link href="/contact?type=partnership" onClick={() => setMobileOpen(false)}>
              <Button className="w-full bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold">
                Partner With Us
              </Button>
            </Link>
            <p className="text-xs text-[#64748B] text-center pt-1">
              {siteConfig.address} • {siteConfig.phone}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
