import Link from 'next/link';

interface LogoProps {
  variant?: 'default' | 'white' | 'compact';
  className?: string;
  showText?: boolean;
}

export function Logo({ variant = 'default', className = '', showText = true }: LogoProps) {
  const textColor = variant === 'white' ? 'text-white' : 'text-[#0090DF]';
  const subTextColor = variant === 'white' ? 'text-emerald-200' : 'text-[#333333]';

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
      {/* Official e-CAPH Mark: 3 Embracing Figures */}
      <svg
        viewBox="0 0 120 120"
        className="w-10 h-10 shrink-0 transition-transform group-hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top-Right Figure (Green) */}
        <circle cx="76" cy="22" r="13" fill="#84C225" />
        <path
          d="M 44 20 C 65 10, 88 12, 96 28 C 104 46, 94 76, 74 96 C 68 102, 60 106, 56 107 C 68 93, 83 72, 80 46 C 78 32, 66 25, 44 20 Z"
          fill="#84C225"
        />

        {/* Left Figure (Orange) */}
        <circle cx="38" cy="36" r="11" fill="#E87A1E" />
        <path
          d="M 32 46 C 24 64, 28 88, 48 104 C 54 108, 59 108, 59 108 C 45 105, 32 92, 26 76 C 20 60, 24 48, 32 46 Z"
          fill="#E87A1E"
        />

        {/* Center Figure (Blue) */}
        <circle cx="60" cy="46" r="9" fill="#0090DF" />
        <path
          d="M 42 56 C 54 48, 70 48, 78 58 C 72 78, 64 96, 54 104 C 62 90, 68 72, 64 62 C 60 55, 50 54, 42 56 Z"
          fill="#0090DF"
        />
      </svg>

      {/* Brand Typography */}
      {showText && variant !== 'compact' && (
        <div className="flex flex-col relative">
          <span className={`text-[9px] font-extrabold tracking-wider uppercase self-end mr-0.5 -mb-0.5 ${subTextColor}`}>
            RC:144280
          </span>
          <span className={`font-black text-2xl leading-none tracking-tight font-sans ${textColor}`}>
            e-CAPH
          </span>
        </div>
      )}
    </Link>
  );
}
