/**
 * SINGLETON PATTERN — Database Connection Pool
 *
 * Intent
 *   Ensure only ONE pg.Pool instance exists per Node.js process so all routes
 *   share the same connection pool, avoiding the resource exhaustion that
 *   happens when each module imports `pg` and creates its own pool.
 *
 * Why a Singleton here
 *   Postgres has a hard `max_connections` limit. With Next.js HMR every edit
 *   would re-evaluate `lib/db.ts` and create a new pool, leaking connections
 *   until the database refused new clients. The Singleton (cached on
 *   `globalThis` in development) guarantees idempotent instantiation.
 *
 * SRS reference: DC-2 (Design Patterns) — pattern #1
 * Code reference: see also `lib/db.ts` for the canonical instance.
 */
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __ustaadPool__: Pool | undefined;
}

function createPool(): Pool {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 8_000,
    keepAlive: true,
  });
}

export function getPool(): Pool {
  if (process.env.NODE_ENV === "production") {
    if (!global.__ustaadPool__) {
      global.__ustaadPool__ = createPool();
      global.__ustaadPool__.on("error", (e) =>
        console.error("[pg.Pool] idle client error:", e.message)
      );
    }
    return global.__ustaadPool__;
  }

  // Development: use globalThis cache so HMR reloads don't multiply pools.
  if (!global.__ustaadPool__) {
    global.__ustaadPool__ = createPool();
    global.__ustaadPool__.on("error", (e) =>
      console.error("[pg.Pool] idle client error:", e.message)
    );
  }
  return global.__ustaadPool__;
}

const pool = getPool();
export default pool;
