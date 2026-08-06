import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1E293B]">
      <Header />

      <section className="flex-1 flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 rounded-[10px] bg-[#E6F4FC] text-[#0092DF] flex items-center justify-center mx-auto border border-[#E2E8F0]">
            <FileQuestion className="w-8 h-8 text-[#E67817]" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-[#0092DF]">404</h1>
            <h2 className="text-xl font-bold text-[#1E293B]">Page Not Found</h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              The page you are trying to reach does not exist or has been relocated.
            </p>
          </div>
          <Link href="/" className="inline-block">
            <Button className="bg-[#0092DF] hover:bg-[#007DC2] text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Return to Homepage
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
