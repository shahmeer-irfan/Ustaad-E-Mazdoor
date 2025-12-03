import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const location = searchParams.get('location');
  const search = searchParams.get('search');

  try {
    let query = `
      SELECT 
        j.id,
        j.title,
        j.description,
        j.budget_min,
        j.budget_max,
        j.budget_type,
        j.location,
        j.duration,
        j.created_at,
        j.proposals_count,
        c.name as category,
        c.slug as category_slug,
        ARRAY_AGG(DISTINCT s.name) as skills
      FROM jobs j
      LEFT JOIN categories c ON j.category_id = c.id
      LEFT JOIN job_skills js ON j.id = js.job_id
      LEFT JOIN skills s ON js.skill_id = s.id
      WHERE j.status = 'open'
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (category && category !== 'all') {
      query += ` AND c.slug = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (location && location !== 'all') {
      query += ` AND j.location ILIKE $${paramIndex}`;
      params.push(`%${location}%`);
      paramIndex++;
    }

    if (search) {
      query += ` AND (j.title ILIKE $${paramIndex} OR j.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += `
      GROUP BY j.id, j.title, j.description, j.budget_min, j.budget_max, 
               j.budget_type, j.location, j.duration, j.created_at, 
               j.proposals_count, c.name, c.slug
      ORDER BY j.created_at DESC
    `;

    const result = await pool.query(query, params);

    // Transform data to match frontend format
    const jobs = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      budget: row.budget_type === 'fixed' 
        ? `PKR ${row.budget_min.toLocaleString()} - ${row.budget_max.toLocaleString()}`
        : `PKR ${row.budget_min.toLocaleString()}/hr`,
      location: row.location,
      duration: row.duration,
      postedTime: getRelativeTime(row.created_at),
      category: row.category,
      proposals: row.proposals_count || 0,
      skills: row.skills.filter(Boolean),
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
