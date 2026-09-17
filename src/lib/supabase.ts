import { createClient } from '@supabase/supabase-js';

// Retrieve from localStorage or environment variables
export const getSupabaseConfig = () => {
  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('studiringkas_supabase_url') : null;
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('studiringkas_supabase_key') : null;

  const url = storedUrl || (import.meta.env.VITE_SUPABASE_URL as string) || 'https://demo-studiringkas.supabase.co';
  const anonKey = storedKey || (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'demo-anon-key-studiringkas-preview';

  return { url, anonKey, isConfigured: Boolean(storedUrl || import.meta.env.VITE_SUPABASE_URL) };
};

const config = getSupabaseConfig();

export const supabase = createClient(config.url, config.anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const updateSupabaseCredentials = (url: string, anonKey: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('studiringkas_supabase_url', url.trim());
    localStorage.setItem('studiringkas_supabase_key', anonKey.trim());
    // Reload client if needed
    window.location.reload();
  }
};
