import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * DATABASE SCHEMA DESIGN:
 * 
 * Table: users
 * - id: uuid (matches clerk userId)
 * - email: text
 * - created_at: timestamp
 * 
 * Table: progress
 * - id: uuid
 * - user_id: uuid (foreign key -> users.id)
 * - week_id: integer
 * - topic_type: text (e.g. "theory", "practice", "quiz")
 * - topic_index: integer
 * - status: text (e.g. "completed", "correct", "wrong")
 * - code_submission: text (optional, for code solutions)
 * - submitted_at: timestamp
 * 
 * Note: Actual table creation needs to be done via Supabase dashboard / SQL Editor.
 */
