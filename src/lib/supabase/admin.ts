import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'https://chxoqhihpoghsojxatsx.supabase.co';

export function createAdminClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const url =
    rawUrl && !rawUrl.includes('your-project') && !rawUrl.includes('placeholder')
      ? rawUrl
      : FALLBACK_URL;

  if (!serviceRoleKey) {
    return createSupabaseClient(url, 'placeholder-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

