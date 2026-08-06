import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, MapPin } from 'lucide-react';

interface InitiativeCardProps {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  isFeatured?: boolean;
}

export function InitiativeCard({
  id,
  title,
  category,
  description,
  location,
  isFeatured = false,
}: InitiativeCardProps) {
  if (isFeatured) {
    return (
      <div className="group rounded-[10px] border border-[#E2E8F0] border-t-4 border-t-[#86C127] bg-gradient-to-br from-[#003D60] to-[#005A8D] text-white p-8 brand-shadow-lg card-hover-lift space-y-6 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge className="bg-[#86C127] text-white font-bold border-none uppercase text-[10px] tracking-wider animate-soft-pulse">
              Featured Flagship Initiative
            </Badge>
            <span className="text-xs text-slate-200 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#E67817]" />
              {location}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug group-hover:text-emerald-100 transition-colors">
            {title}
          </h3>

          <p className="text-slate-100 text-sm sm:text-base leading-relaxed">
            {description}
          </p>
        </div>

        <div className="pt-4 border-t border-white/20 flex items-center justify-between">
          <span className="text-xs font-semibold text-[#86C127]">{category}</span>
          <Link
            href="/projects"
            className="inline-flex items-center text-sm font-bold text-[#E67817] hover:text-white transition-colors group/link"
          >
            Learn More <ArrowRight className="ml-1.5 w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-[10px] border border-[#E2E8F0] border-t-4 border-t-[#86C127] bg-white p-6 brand-shadow card-hover-lift hover:brand-shadow-lg transition-all duration-150 flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-[11px] bg-[#F3F9E9] text-[#6EA71F]">
            {category}
          </Badge>
          <span className="text-xs text-[#64748B] flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#0092DF]" />
            {location}
          </span>
        </div>

        <h3 className="text-lg font-bold text-[#0092DF] group-hover:text-[#007DC2] transition-colors leading-snug">
          {title}
        </h3>

        <p className="text-sm text-[#64748B] leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      <Link
        href="/projects"
        className="inline-flex items-center text-xs font-bold text-[#E67817] hover:text-[#CF660F] transition-colors pt-2 group/link"
      >
        Learn More <ArrowRight className="ml-1.5 w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1.5" />
      </Link>
    </div>
  );
}
