/**
 * REPOSITORY PATTERN — Job data access
 *
 * Intent
 *   Centralize every SQL query that touches the `jobs` table behind a single
 *   class. Route handlers depend on `JobRepository`, never on raw SQL or the
 *   `pg` driver, so the persistence layer can be swapped (e.g. to Drizzle,
 *   Prisma, Supabase REST) without touching controllers.
 *
 * Why a Repository here
 *   • Eliminates copy-pasted SELECT/INSERT/UPDATE across 14 API routes.
 *   • Gives every query a typed return shape (no more `as any[]`).
 *   • Becomes the natural seam for caching (Redis) without touching routes.
 *
 * SRS reference: DC-2 — pattern #5; underpins REQ-2.x (Job lifecycle).
 */
import pool from "@/lib/db";

export interface JobRow {
  id:               string;
  title:            string;
  description:      string;
  budget_min:       number;
  budget_max:       number;
  budget_type:      "fixed" | "hourly";
  location:         string;
  duration:         string | null;
  status:           "open" | "in_progress" | "completed" | "cancelled";
  created_at:       string;
  proposals_count:  number;
  category_name:    string | null;
  category_slug:    string | null;
  skills:           string[];
}

export interface JobFilter {
  category?: string;
  location?: string;
  search?:   string;
  limit?:    number;
  offset?:   number;
}

export class JobRepository {
  /**
   * List open jobs with optional filters. Uses parameterized SQL only —
   * never string concatenation of user input (defends REQ-NF-Sec-1: SQL
   * injection prevention).
   */
  async findOpen(filter: JobFilter = {}): Promise<JobRow[]> {
    const params: (string | number)[] = [];
    let i = 1;

    let sql = `
      SELECT
        j.id, j.title, j.description, j.budget_min, j.budget_max,
        j.budget_type, j.location, j.duration, j.status, j.created_at,
        j.proposals_count,
        c.name AS category_name, c.slug AS category_slug,
        COALESCE(
          ARRAY_AGG(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL),
          '{}'::text[]
        ) AS skills
      FROM jobs j
      LEFT JOIN categories  c  ON j.category_id = c.id
      LEFT JOIN job_skills  js ON j.id = js.job_id
      LEFT JOIN skills      s  ON js.skill_id = s.id
      WHERE j.status = 'open'
    `;

    if (filter.category && filter.category !== "all") {
      sql += ` AND c.slug = $${i++}`;
      params.push(filter.category);
    }
    if (filter.location && filter.location !== "all") {
      sql += ` AND j.location ILIKE $${i++}`;
      params.push(`%${filter.location}%`);
    }
    if (filter.search) {
      sql += ` AND (j.title ILIKE $${i} OR j.description ILIKE $${i})`;
      params.push(`%${filter.search}%`);
      i++;
    }

    sql += `
      GROUP BY j.id, c.name, c.slug
      ORDER BY j.created_at DESC
      LIMIT $${i++} OFFSET $${i++}
    `;
    params.push(filter.limit ?? 20, filter.offset ?? 0);

    const result = await pool.query<JobRow>(sql, params);
    return result.rows;
  }

  async findById(id: string): Promise<JobRow | null> {
    const sql = `
      SELECT
        j.id, j.title, j.description, j.budget_min, j.budget_max,
        j.budget_type, j.location, j.duration, j.status, j.created_at,
        j.proposals_count,
        c.name AS category_name, c.slug AS category_slug,
        COALESCE(
          ARRAY_AGG(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL),
          '{}'::text[]
        ) AS skills
      FROM jobs j
      LEFT JOIN categories  c  ON j.category_id = c.id
      LEFT JOIN job_skills  js ON j.id = js.job_id
      LEFT JOIN skills      s  ON js.skill_id = s.id
      WHERE j.id = $1
      GROUP BY j.id, c.name, c.slug
    `;
    const result = await pool.query<JobRow>(sql, [id]);
    return result.rows[0] ?? null;
  }

  async findByClient(clientId: string): Promise<JobRow[]> {
    const sql = `
      SELECT
        j.id, j.title, j.description, j.budget_min, j.budget_max,
        j.budget_type, j.location, j.duration, j.status, j.created_at,
        j.proposals_count,
        c.name AS category_name, c.slug AS category_slug,
        '{}'::text[] AS skills
      FROM jobs j
      LEFT JOIN categories c ON j.category_id = c.id
      WHERE j.client_id = $1
      ORDER BY j.created_at DESC
    `;
    const result = await pool.query<JobRow>(sql, [clientId]);
    return result.rows;
  }

  /**
   * Create a job within a transaction. Demonstrates correct multi-step
   * atomicity (REQ-2.4): job + skill bindings + category counter must
   * all commit together or all roll back.
   */
  async create(input: {
    clientId:    string;
    title:       string;
    description: string;
    categoryId:  string;
    budgetMin:   number;
    budgetMax:   number;
    budgetType:  "fixed" | "hourly";
    location:    string;
    duration:    string | null;
    skills:      string[];
  }): Promise<string> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const insertJob = await client.query<{ id: string }>(
        `INSERT INTO jobs
           (client_id, title, description, category_id, budget_min, budget_max,
            budget_type, location, duration, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'open')
         RETURNING id`,
        [
          input.clientId, input.title, input.description, input.categoryId,
          input.budgetMin, input.budgetMax, input.budgetType,
          input.location, input.duration,
        ]
      );
      const jobId = insertJob.rows[0].id;

      for (const raw of input.skills) {
        const name = raw.trim();
        if (!name) continue;
        const slug = name.toLowerCase().replace(/\s+/g, "-");
        const skill = await client.query<{ id: string }>(
          `INSERT INTO skills (name, slug)
           VALUES ($1, $2)
           ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
           RETURNING id`,
          [name, slug]
        );
        await client.query(
          `INSERT INTO job_skills (job_id, skill_id) VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [jobId, skill.rows[0].id]
        );
      }

      await client.query(
        `UPDATE categories SET job_count = job_count + 1 WHERE id = $1`,
        [input.categoryId]
      );

      await client.query("COMMIT");
      return jobId;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  /** Used by /api/categories — encapsulated here for the same reason. */
  async listCategories() {
    const sql = `
      SELECT id, name, slug, icon, job_count
      FROM categories
      ORDER BY job_count DESC
    `;
    const result = await pool.query(sql);
    return result.rows;
  }
}

export const jobRepository = new JobRepository();
