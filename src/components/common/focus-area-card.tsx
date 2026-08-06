import Link from 'next/link';
import { ArrowRight, HeartPulse, GraduationCap, Leaf, Landmark, Users } from 'lucide-react';

interface FocusAreaCardProps {
  slug: string;
  title: string;
  description: string;
  index: number;
}

const iconMap: Record<string, any> = {
  'public-health': HeartPulse,
  'education-and-youth': GraduationCap,
  'climate-resilience': Leaf,
  'good-governance': Landmark,
  'peacebuilding': Users,
};

export function FocusAreaCard({ slug, title, description, index }: FocusAreaCardProps) {
  const Icon = iconMap[slug] || HeartPulse;

  return (
    <div className="group rounded-[10px] border border-[#E2E8F0] border-t-4 border-t-[#86C127] bg-white p-6 brand-shadow card-hover-lift hover:brand-shadow-lg hover:border-[#0092DF]/30 transition-all duration-200 flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-[6px] bg-[#F7FAF8] text-[#0092DF] group-hover:bg-[#0092DF] group-hover:text-white flex items-center justify-center transition-all duration-200 border border-[#E2E8F0] shadow-sm">
            <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span className="text-xs font-bold text-[#94A3B8] group-hover:text-[#86C127] transition-colors">0{index + 1}</span>
        </div>

        <h3 className="text-lg font-bold text-[#0092DF] group-hover:text-[#007DC2] transition-colors leading-snug">
          {title}
        </h3>

        <p className="text-sm text-[#64748B] leading-relaxed">
          {description}
        </p>
      </div>

      <Link
        href="/programmes"
        className="inline-flex items-center text-xs font-bold text-[#E67817] hover:text-[#CF660F] transition-colors pt-2 group/link"
      >
        Learn More <ArrowRight className="ml-1.5 w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1.5" />
      </Link>
    </div>
  );
}
