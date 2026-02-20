// /lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser / Client Component singleton
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server Component factory (no session persistence needed in Phase 1)
export const createServerClient = () =>
    createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
    });
