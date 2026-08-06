import { createBrowserClient } from '@supabase/ssr';

const FALLBACK_URL = 'https://chxoqhihpoghsojxatsx.supabase.co';
const FALLBACK_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoeG9xaGlocG9naHNvanhhdHN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4NzQ1MDUsImV4cCI6MjEwMTQ1MDUwNX0.obwpwfqib0rgZvsu4SHs-XaAQhZKprosCtHSSpKABxI';

export function createClient() {
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

  return createBrowserClient(url, key);
}

