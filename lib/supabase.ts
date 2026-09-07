import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser-safe Supabase client (anon key, subject to RLS). Created lazily so a
 * missing environment variable cannot throw at import time.
 */
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  client = createClient(url, anonKey);
  return client;
}

/** Rows in `public.waitlist`. */
export interface WaitlistEntry {
  id?: string;
  full_name: string;
  email: string;
  phone?: string | null;
  interest: string;
  referral?: string | null;
  message?: string | null;
  created_at?: string;
}

/** Rows in `public.tour_requests`. */
export interface TourRequest {
  id?: string;
  full_name: string;
  email: string;
  phone?: string | null;
  team_size?: string | null;
  interest: string;
  /** ISO date, e.g. 2026-09-14 */
  preferred_date: string;
  preferred_time: string;
  message?: string | null;
  status?: "new" | "confirmed" | "completed" | "cancelled";
  created_at?: string;
}

/** Rows in `public.newsletter_subscribers`. */
export interface NewsletterSubscriber {
  id?: string;
  email: string;
  source?: string;
  created_at?: string;
}
