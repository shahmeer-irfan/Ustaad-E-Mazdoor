/**
 * REPOSITORY PATTERN — Profile data access
 *
 * SRS reference: DC-2 — pattern #5; supports REQ-1.x (Authentication & user
 * profile management). All persistence concerns for the `profiles` table
 * live here so route handlers don't need to know about pg.
 */
import pool from "@/lib/db";
import type { ProfileRow } from "@/lib/patterns/UserFactory";

export class ProfileRepository {
  async findByClerkId(clerkId: string): Promise<ProfileRow | null> {
    const sql = `
      SELECT id, clerk_id, email, full_name, user_type
      FROM profiles
      WHERE clerk_id = $1
    `;
    const r = await pool.query<ProfileRow>(sql, [clerkId]);
    return r.rows[0] ?? null;
  }

  async findById(id: string): Promise<ProfileRow | null> {
    const sql = `
      SELECT id, clerk_id, email, full_name, user_type
      FROM profiles
      WHERE id = $1
    `;
    const r = await pool.query<ProfileRow>(sql, [id]);
    return r.rows[0] ?? null;
  }

  async createFromWebhook(input: {
    clerkId: string;
    email:   string;
    userType: "customer" | "freelancer" | "admin";
    fullName: string;
  }): Promise<void> {
    await pool.query(
      `INSERT INTO profiles (id, clerk_id, email, user_type, full_name, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
       ON CONFLICT (clerk_id) DO NOTHING`,
      [input.clerkId, input.email, input.userType, input.fullName]
    );
  }

  async updateUserType(clerkId: string, userType: "customer" | "freelancer" | "admin"): Promise<void> {
    await pool.query(
      `UPDATE profiles SET user_type = $1, updated_at = NOW() WHERE clerk_id = $2`,
      [userType, clerkId]
    );
  }
}

export const profileRepository = new ProfileRepository();
