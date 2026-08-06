import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface PageBannerProps {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href: string }[];
}

export function PageBanner({ title, subtitle, breadcrumb }: PageBannerProps) {
  return (
    <section className="relative bg-gradient-to-r from-[#003D60] via-[#005A8D] to-[#0092DF] text-white py-14 lg:py-18 overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
          <Link href="/" className="hover:text-[#86C127] transition-colors">
            Home
          </Link>
          {breadcrumb &&
            breadcrumb.map((item, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                <Link href={item.href} className="hover:text-[#86C127] transition-colors">
                  {item.label}
                </Link>
              </span>
            ))}
          <ChevronRight className="w-3.5 h-3.5 opacity-70" />
          <span className="text-[#86C127] font-semibold">{title}</span>
        </nav>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl font-normal leading-relaxed pt-1">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
