/**
 * lib/db.ts — canonical database export
 *
 * Delegates to lib/patterns/Singleton.ts which implements the Singleton pattern.
 * All route handlers should import from here: `import pool from "@/lib/db"`
 *
 * Two modes (selected automatically at startup):
 *   1. pg.Pool  — when DATABASE_URL is set (production / Supabase pooler)
 *   2. Supabase JS REST adapter — when only NEXT_PUBLIC_SUPABASE_URL is set
 *
 * Both expose the same pool.query(sql, params) interface — no consumer changes needed.
 */
export { getPool, default } from '@/lib/patterns/Singleton';
