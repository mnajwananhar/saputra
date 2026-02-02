import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase credentials missing");
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Export a mock client for cases where Supabase is not available
export const mockSupabase = {
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({
      select: () => ({ single: () => ({ data: null, error: null }) }),
    }),
    update: () => ({
      eq: () => ({
        select: () => ({ single: () => ({ data: null, error: null }) }),
      }),
    }),
    delete: () => ({ eq: () => ({ error: null }) }),
    order: () => ({ error: null }),
    eq: () => ({
      order: () => ({ error: null }),
      single: () => ({ data: null, error: null }),
      select: () => ({ error: null }),
    }),
    single: () => ({ data: null, error: null }),
  }),
  rpc: () => ({ data: null, error: null }),
};
