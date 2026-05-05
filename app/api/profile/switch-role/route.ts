/**
 * /api/profile/switch-role
 *
 * POST — flip the signed-in user between 'client' and 'freelancer'.
 * GET  — return the caller's current role (used by the navbar UserMenu).
 *
 * Authorisation: Clerk session required. The route never trusts a body
 * for the new role — it just toggles whatever the DB currently holds.
 */
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import pool from "@/lib/db";

type Role = "client" | "freelancer";

async function readRole(clerkId: string): Promise<Role | null> {
  const r = await pool.query<{ user_type: Role }>(
    "SELECT user_type FROM profiles WHERE clerk_id = $1",
    [clerkId]
  );
  return r.rows[0]?.user_type ?? null;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const current = await readRole(userId);
  if (!current) {
    return NextResponse.json(
      { error: "Profile not found. Sign out and sign back in to provision your account." },
      { status: 404 }
    );
  }
  return NextResponse.json({ role: current });
}

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const current = await readRole(userId);
    if (!current) {
      return NextResponse.json(
        { error: "Profile not found. Sign out and sign back in to provision your account." },
        { status: 404 }
      );
    }

    const next: Role = current === "client" ? "freelancer" : "client";

    await pool.query(
      "UPDATE profiles SET user_type = $1, updated_at = NOW() WHERE clerk_id = $2",
      [next, userId]
    );

    return NextResponse.json({
      previous: current,
      role: next,
      message: next === "freelancer"
        ? "Switched to Freelancer mode. You can now apply to jobs."
        : "Switched to Customer mode. You can now post jobs.",
    });
  } catch (err) {
    console.error("[/api/profile/switch-role] error:", err);
    return NextResponse.json(
      { error: "Failed to switch role" },
      { status: 500 }
    );
  }
}
