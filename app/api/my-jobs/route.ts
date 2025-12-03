import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// GET jobs posted by the current user (for clients)
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get profile ID
    const profileQuery = 'SELECT id FROM profiles WHERE clerk_id = $1';
    const profileResult = await pool.query(profileQuery, [userId]);

    if (profileResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    const clientId = profileResult.rows[0].id;

    const query = `
      SELECT 
        j.id,
        j.title,
        j.description,
        j.budget_min,
        j.budget_max,
        j.budget_type,
        j.location,
        j.duration,
        j.status,
        j.created_at,
        j.proposals_count,
        j.views_count,
        c.name as category_name,
        c.slug as category_slug
      FROM jobs j
      LEFT JOIN categories c ON j.category_id = c.id
      WHERE j.client_id = $1
      ORDER BY j.created_at DESC
    `;

    const result = await pool.query(query, [clientId]);

    const jobs = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      budget: row.budget_type === 'fixed'
        ? `PKR ${parseInt(row.budget_min).toLocaleString()} - ${parseInt(row.budget_max).toLocaleString()}`
        : `PKR ${parseInt(row.budget_min).toLocaleString()}/hr`,
      budgetType: row.budget_type,
      location: row.location,
      duration: row.duration,
      status: row.status,
      category: row.category_name,
      categorySlug: row.category_slug,
      proposalsCount: row.proposals_count || 0,
      viewsCount: row.views_count || 0,
      postedTime: getRelativeTime(row.created_at),
      createdAt: row.created_at,
    }));

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}
