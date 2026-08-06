import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const FALLBACK_URL = 'https://chxoqhihpoghsojxatsx.supabase.co';
const FALLBACK_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoeG9xaGlocG9naHNvanhhdHN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4NzQ1MDUsImV4cCI6MjEwMTQ1MDUwNX0.obwpwfqib0rgZvsu4SHs-XaAQhZKprosCtHSSpKABxI';

export async function createClient() {
  const cookieStore = await cookies();

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const url =
    rawUrl && !rawUrl.includes('your-project') && !rawUrl.includes('placeholder')
      ? rawUrl
      : FALLBACK_URL;

  const key =
    rawKey && !rawKey.includes('your_supabase_anon_key') && !rawKey.includes('placeholder')
      ? rawKey
      : FALLBACK_ANON_KEY;

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: any) {
        try {
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options: any }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component ignore
        }
      },
    },
  });
}

