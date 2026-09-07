import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client using the service-role key, which bypasses RLS.
 * Never import this into a client component.
 *
 * Built lazily: `createClient` throws when the URL is missing, so constructing
 * it at module scope would take down every API route that imports this file
 * whenever the environment is not configured — turning a handled "temporarily
 * unavailable" response into an unhandled 500.
 */
let client: SupabaseClient | null = null;

export function getSupabaseServer(): SupabaseClient | null {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return null;

  client = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return client;
}
