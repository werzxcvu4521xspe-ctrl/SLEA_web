import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isPlaceholder = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-supabase-url');

if (isPlaceholder) {
  if (typeof window !== 'undefined') {
    console.warn(
      'Supabase environment variables are missing or set to placeholders. Please configure your .env.local file with valid Supabase keys.'
    );
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
