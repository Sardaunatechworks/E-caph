import Link from 'next/link';

interface LogoProps {
  variant?: 'default' | 'white' | 'compact';
  className?: string;
}

export function Logo({ variant = 'default', className = '' }: LogoProps) {
  const textColor = variant === 'white' ? 'text-white' : 'text-[#0092DF]';
  const subTextColor = variant === 'white' ? 'text-emerald-200' : 'text-[#64748B]';

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
      {/* Visual Logo Mark: 3 Embracing Figures */}
      <svg
        viewBox="0 0 100 100"
        className="w-10 h-10 shrink-0 transition-transform group-hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top/Right Figure - Green (#86C127) */}
        <circle cx="68" cy="22" r="11" fill="#86C127" />
        <path
          d="M 32 30 C 50 18, 78 20, 84 38 C 76 56, 52 58, 38 48 C 34 44, 32 38, 32 30 Z"
          fill="#86C127"
        />

        {/* Left Figure - Orange (#E67817) */}
        <circle cx="28" cy="34" r="10" fill="#E67817" />
        <path
          d="M 20 40 C 20 62, 38 84, 54 84 C 44 70, 26 58, 22 46 Z"
          fill="#E67817"
        />

        {/* Center/Lower Figure - Blue (#0092DF) */}
        <circle cx="48" cy="42" r="8" fill="#0092DF" />
        <path
          d="M 34 50 C 44 46, 58 48, 64 62 C 58 76, 42 82, 36 74 Z"
          fill="#0092DF"
        />
      </svg>

      {/* Brand Text */}
      {variant !== 'compact' && (
        <div className="flex flex-col">
          <span className={`font-black text-xl leading-none tracking-tight ${textColor}`}>
            e-CAPH
          </span>
          <span className={`text-[9px] font-semibold tracking-wider uppercase mt-1 ${subTextColor}`}>
            RC:144280
          </span>
        </div>
      )}
    </Link>
  );
}
