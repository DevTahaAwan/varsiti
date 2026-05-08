import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

function getPublicSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase public environment variables are missing.");
  }

  return { supabaseUrl, supabaseAnonKey };
}

export function getSupabaseClient() {
  if (!browserClient) {
    const { supabaseUrl, supabaseAnonKey } = getPublicSupabaseEnv();
    browserClient = createClient(supabaseUrl, supabaseAnonKey);
  }

  return browserClient;
}

/**
 * DATABASE SCHEMA DESIGN:
 *
 * Table: users
 * - id: text (matches Clerk userId)
 * - email: text
 * - created_at: timestamp
 *
 * Table: user_progress
 * - user_id: text (matches Clerk userId)
 * - week_id: uuid
 * - elapsed_seconds: integer
 *
 * Table: user_ai_usage
 * - user_id: text (matches Clerk userId)
 * - usage_date: date
 * - request_count: integer
 */