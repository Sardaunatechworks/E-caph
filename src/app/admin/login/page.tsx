'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/common/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Check if session cookie is already present
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const hasCookie = document.cookie.includes('ecaph_admin_session=authenticated');
      if (hasCookie) {
        router.push(nextUrl);
      }
    }
  }, [router, nextUrl]);

  const setAuthSessionCookie = () => {
    document.cookie = 'ecaph_admin_session=authenticated; path=/; max-age=86400; SameSite=Lax';
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecaph_admin_user', JSON.stringify({ email }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.session) {
        setErrorMsg(error?.message || 'Authentication failed. Invalid email or password.');
      } else {
        setAuthSessionCookie();
        setSuccessMsg('Authentication verified. Redirecting to dashboard...');
        setTimeout(() => {
          router.push(nextUrl);
        }, 400);
      }
    } catch {
      setErrorMsg('Unable to connect to authentication server. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-2xl p-8 space-y-6 relative z-10 font-sans">
      {/* Centered Logo & Header */}
      <div className="flex flex-col items-center justify-center text-center space-y-3 pb-4 border-b border-slate-100">
        <Logo />
        <div className="space-y-1">
          <h2 className="text-xl font-black text-[#0092DF]">CMS Portal</h2>
          <p className="text-xs text-slate-500 font-medium">
            Enhancing Communities Action for Peace &amp; Better Health Initiative
          </p>
        </div>
      </div>

      {/* Security Warning Banner if Redirected */}
      {searchParams.get('next') && !errorMsg && !successMsg && (
        <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Authentication required to access administrative dashboard.</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form Controls */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#0092DF]" />
            Email Address
          </label>
          <Input
            type="email"
            placeholder="admin@e-caph.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-slate-50 border-slate-200 h-10 text-xs rounded-md focus-visible:ring-[#0092DF]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#0092DF]" />
            Password
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-slate-50 border-slate-200 h-10 text-xs rounded-md focus-visible:ring-[#0092DF]"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold h-10 text-xs shadow-md shadow-[#0092DF]/20 transition-all"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
          <ArrowRight className="w-4 h-4 ml-1.5 text-[#E67817]" />
        </Button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0092DF]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#86C127]/10 rounded-full blur-2xl pointer-events-none" />

      <Suspense fallback={
        <div className="w-full max-w-md bg-white rounded-xl p-8 text-center text-xs font-bold text-[#0092DF]">
          Loading CMS Portal...
        </div>
      }>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}



