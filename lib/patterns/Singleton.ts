/**
 * SINGLETON PATTERN — Database Client (Supabase JS + optional pg.Pool)
 *
 * Intent
 *   One database connection object per process. Routes to pg.Pool when
 *   DATABASE_URL is configured (production), or to @supabase/supabase-js
 *   REST client in development (no DB password needed).
 *
 * The `CompatiblePool` interface mirrors the pg.Pool `.query()` API so ALL
 * existing route handlers work without any changes.
 *
 * SRS reference: DC-2 — pattern #1
 */

import { Pool, QueryResult, QueryResultRow } from 'pg';
import { createClient } from '@supabase/supabase-js';

// ─── Shared interface ─────────────────────────────────────────────────────────

export interface CompatiblePool {
  query<R extends QueryResultRow = QueryResultRow>(
    sql: string,
    params?: unknown[]
  ): Promise<Pick<QueryResult<R>, 'rows' | 'rowCount'>>;

  connect(): Promise<CompatibleClient>;
}

export interface CompatibleClient extends CompatiblePool {
  release(): void;
}

// ─── pg.Pool Wrapper (used when DATABASE_URL is set) ─────────────────────────

class PgPoolWrapper implements CompatiblePool {
  private pool: Pool;

  constructor(connString: string) {
    this.pool = new Pool({
      connectionString: connString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 8_000,
      keepAlive: true,
    });
    this.pool.on('error', (e) =>
      console.error('[pg.Pool] idle client error:', e.message)
    );
  }

  query<R extends QueryResultRow = QueryResultRow>(
    sql: string,
    params?: unknown[]
  ): Promise<QueryResult<R>> {
    return this.pool.query<R>(sql, params as unknown[]);
  }

  async connect(): Promise<CompatibleClient> {
    const client = await this.pool.connect();
    return {
      query: <R extends QueryResultRow>(sql: string, params?: unknown[]) =>
        client.query<R>(sql, params as unknown[]),
      connect: async () => this.connect(),
      release: () => client.release(),
    };
  }
}

// ─── Supabase JS Adapter (used when DATABASE_URL is missing) ─────────────────

class SupabaseAdapter implements CompatiblePool {
  private supabase;

  constructor(url: string, anonKey: string) {
    this.supabase = createClient(url, anonKey, {
      auth: { persistSession: false },
    });
  }

  async query<R extends QueryResultRow = QueryResultRow>(
    sql: string,
    params: unknown[] = []
  ): Promise<Pick<QueryResult<R>, 'rows' | 'rowCount'>> {

    // Interpolate $1 … $N placeholders into the SQL string
    let q = sql.trim();
    (params as (string | number | boolean | null)[]).forEach((v, i) => {
      const safe =
        v === null || v === undefined
          ? 'NULL'
          : typeof v === 'number'
          ? String(v)
          : `'${String(v).replace(/'/g, "''")}'`;
      q = q.replace(new RegExp(`\\$${i + 1}(?!\\d)`, 'g'), safe);
    });

    // Execute via the pg_execute RPC (create this in Supabase SQL editor once)
    const { data, error } = await this.supabase.rpc('pg_execute', {
      query: q,
    });

    if (error) {
      // Pretty-print the failed query for debugging
      console.error('[SupabaseAdapter] query failed:', error.message);
      console.error('[SupabaseAdapter] SQL:', q.slice(0, 400));
      throw new Error(`[SupabaseAdapter] ${error.message}`);
    }

    const rows: R[] = Array.isArray(data) ? data : data ? [data as R] : [];
    return { rows, rowCount: rows.length };
  }

  async connect(): Promise<CompatibleClient> {
    return {
      query: this.query.bind(this),
      connect: this.connect.bind(this),
      release: () => { /* no-op for REST adapter */ },
    };
  }
}

// ─── Singleton factory ────────────────────────────────────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var __ustaadPool__: CompatiblePool | undefined;
}

export function getPool(): CompatiblePool {
  if (global.__ustaadPool__) return global.__ustaadPool__;

  const databaseUrl = process.env.DATABASE_URL;
  const hasRealUrl =
    databaseUrl &&
    !databaseUrl.includes('[YOUR-DB-PASSWORD]') &&
    !databaseUrl.includes('REPLACE');

  if (hasRealUrl) {
    console.log('[db] ✅ Using pg.Pool (DATABASE_URL configured)');
    global.__ustaadPool__ = new PgPoolWrapper(databaseUrl!);
  } else {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error(
        '[db] Missing env vars: DATABASE_URL or NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY'
      );
    }
    console.log('[db] ⚠️  Using Supabase JS REST adapter (no DATABASE_URL)');
    global.__ustaadPool__ = new SupabaseAdapter(url, key);
  }

  return global.__ustaadPool__!;
}

const pool = getPool();
export default pool;
