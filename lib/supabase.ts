/**
 * lib/supabase.ts — Supabase JS client
 *
 * Used as the database interface when DATABASE_URL (pg direct pooler) is not
 * configured.  The API routes call `pool.query(sql, params)` — the adapter
 * below re-implements that interface via the Supabase REST API so the app
 * works with just NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY.
 *
 * In production with DATABASE_URL set, pg.Pool is used directly (faster,
 * richer SQL).  In local development without the DB password, this adapter
 * handles all reads/writes through the Supabase REST API.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
