import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await pool.query(
      `SELECT
         p.id,
         p.full_name as name,
         p.bio,
         p.location,
         p.hourly_rate,
         p.avatar_url,
         p.completed_jobs,
         p.success_rate,
         p.response_time,
         p.member_since,
         COALESCE(AVG(r.rating), 0) as rating,
         COUNT(DISTINCT r.id) as review_count,
         ARRAY_AGG(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL) as skills
       FROM profiles p
       LEFT JOIN reviews r ON p.id = r.freelancer_id
       LEFT JOIN freelancer_skills fs ON p.id = fs.profile_id
       LEFT JOIN skills s ON fs.skill_id = s.id
       WHERE p.id = $1 AND p.user_type = 'freelancer'
       GROUP BY p.id`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Freelancer not found' }, { status: 404 });
    }

    const row = result.rows[0];
    const freelancer = {
      id: row.id,
      name: row.name,
      title: row.bio ? row.bio.split('.')[0] : 'Skilled Professional',
      bio: row.bio,
      location: row.location,
      rating: parseFloat(row.rating).toFixed(1),
      reviews: parseInt(row.review_count),
      skills: (row.skills || []).filter(Boolean),
      hourlyRate: `PKR ${parseInt(row.hourly_rate || 0).toLocaleString()}`,
      completedJobs: row.completed_jobs || 0,
      successRate: row.success_rate || 0,
      responseTime: row.response_time,
      avatarUrl: row.avatar_url,
      memberSince: row.member_since
        ? new Date(row.member_since).getFullYear().toString()
        : new Date().getFullYear().toString(),
    };

    return NextResponse.json({ freelancer });
  } catch (error) {
    console.error('Error fetching freelancer:', error);
    return NextResponse.json({ error: 'Failed to fetch freelancer' }, { status: 500 });
  }
}
