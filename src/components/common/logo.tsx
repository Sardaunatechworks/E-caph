'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'default' | 'white' | 'compact';
  className?: string;
  showText?: boolean;
}

export function Logo({ variant = 'default', className = '', showText = true }: LogoProps) {
  const isWhite = variant === 'white';
  const textColor = isWhite ? 'text-white' : 'text-[#0092DF]';
  const rcTextColor = isWhite ? 'text-[#38BDF8]' : 'text-[#0092DF]';

  const [logoConfig, setLogoConfig] = useState({
    use_custom_image: false,
    image_url: '/logo.png',
    brand_title: 'e-CAPH',
    registration_number: 'RC:144280',
  });

  const loadConfig = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecaph_site_logo');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            setLogoConfig((prev) => ({ ...prev, ...parsed }));
          }
        } catch {}
      }
    }
  };

  useEffect(() => {
    loadConfig();

    const handleSync = () => loadConfig();
    window.addEventListener('storage', handleSync);
    window.addEventListener('ecaph_logo_updated', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('ecaph_logo_updated', handleSync);
    };
  }, []);

  return (
    <Link href="/" className={`inline-flex items-center gap-3.5 group ${className}`}>
      {logoConfig.use_custom_image && logoConfig.image_url ? (
        <div className="w-10 h-10 shrink-0 overflow-hidden flex items-center justify-center">
          <img
            src={logoConfig.image_url}
            alt={logoConfig.brand_title}
            className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </div>
      ) : (
        /* Official e-CAPH Mark: 3 Interlocking Embracing Figures */
        <svg
          viewBox="0 0 400 400"
          className="w-10 h-10 shrink-0 transition-transform duration-200 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top-Right Green Figure */}
          <circle cx="260" cy="80" r="45" fill="#86C127" />
          <path
            d="M 160 85 C 220 40, 300 45, 330 100 C 360 160, 330 260, 250 330 C 230 348, 200 365, 185 370 C 230 320, 285 240, 275 150 C 270 105, 230 85, 160 85 Z"
            fill="#86C127"
          />

          {/* Left Orange Figure */}
          <circle cx="130" cy="130" r="38" fill="#E67817" />
          <path
            d="M 110 165 C 80 225, 95 305, 160 360 C 180 375, 200 375, 200 375 C 150 365, 110 320, 90 265 C 70 210, 85 170, 110 165 Z"
            fill="#E67817"
          />

          {/* Center Blue Figure */}
          <circle cx="205" cy="165" r="32" fill="#0092DF" />
          <path
            d="M 145 195 C 185 168, 240 168, 268 202 C 248 270, 220 330, 185 360 C 212 310, 232 250, 218 215 C 205 190, 170 188, 145 195 Z"
            fill="#0092DF"
          />
        </svg>
      )}

      {/* Typography: RC:144280 + e-CAPH */}
      {showText && variant !== 'compact' && (
        <div className="flex flex-col relative justify-center">
          <span className={`text-[9px] font-extrabold tracking-wider uppercase self-end mr-0.5 -mb-0.5 ${rcTextColor}`}>
            {logoConfig.registration_number}
          </span>
          <span className={`font-black text-2xl leading-none tracking-tight font-sans ${textColor}`}>
            {logoConfig.brand_title}
          </span>
        </div>
      )}
    </Link>
  );
}
