import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.fullName}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.fullName,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} scroll-smooth`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                var msg = (e && e.message) || '';
                if (msg.indexOf('ChunkLoadError') !== -1 || msg.indexOf('Loading chunk') !== -1 || msg.indexOf('Failed to load chunk') !== -1) {
                  if (!sessionStorage.getItem('chunk_reload_retry')) {
                    sessionStorage.setItem('chunk_reload_retry', 'true');
                    window.location.reload();
                  }
                }
              });
              window.addEventListener('load', function() {
                sessionStorage.removeItem('chunk_reload_retry');
              });
            `,
          }}
        />
      </head>
      <body className="font-sans bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col selection:bg-[#176B4D] selection:text-white">
        {children}
      </body>
    </html>
  );
}
