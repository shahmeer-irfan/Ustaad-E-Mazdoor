import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 8_000,
  keepAlive: true,
});

// Supabase pooler can drop idle clients server-side; the pg.Pool then surfaces
// them as "Connection terminated unexpectedly". Swallow & log so subsequent
// queries grab a fresh client instead of crashing the whole pool.
pool.on('error', (err) => {
  console.error('[pg.Pool] idle client error:', err.message);
});

export default pool;
