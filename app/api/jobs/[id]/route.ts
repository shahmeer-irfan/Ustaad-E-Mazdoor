import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Fetch job details
    const jobQuery = `
      SELECT 
        j.*,
        c.name as category_name,
        c.slug as category_slug,
        p.full_name as client_name,
        p.location as client_location,
        ci.company_name,
        ci.jobs_posted,
        ci.hire_rate,
        COALESCE(AVG(r.rating), 0) as client_rating,
        COUNT(DISTINCT r.id) as client_reviews,
        ARRAY_AGG(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL) as skills_required
      FROM jobs j
      LEFT JOIN categories c ON j.category_id = c.id
      LEFT JOIN profiles p ON j.client_id = p.id
      LEFT JOIN client_info ci ON p.id = ci.profile_id
      LEFT JOIN reviews r ON r.client_id = p.id
      LEFT JOIN job_skills js ON j.id = js.job_id
      LEFT JOIN skills s ON js.skill_id = s.id
      WHERE j.id = $1
      GROUP BY j.id, c.name, c.slug, p.full_name, p.location, 
               ci.company_name, ci.jobs_posted, ci.hire_rate
    `;

    const jobResult = await pool.query(jobQuery, [id]);

    if (jobResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    const job = jobResult.rows[0];

    // Fetch similar jobs
    const similarJobsQuery = `
      SELECT 
        j.id,
        j.title,
        j.budget_min,
        j.budget_max,
        j.budget_type,
        j.location,
        j.created_at
      FROM jobs j
      WHERE j.category_id = $1 
        AND j.id != $2
        AND j.status = 'open'
      ORDER BY j.created_at DESC
      LIMIT 3
    `;

    const similarResult = await pool.query(similarJobsQuery, [
      job.category_id,
      id,
    ]);

    // Transform data
    const transformedJob = {
      id: job.id,
      title: job.title,
      description: job.description,
      longDescription: job.long_description,
      budget: job.budget_type === 'fixed'
        ? `PKR ${job.budget_min.toLocaleString()} - ${job.budget_max.toLocaleString()}`
        : `PKR ${job.budget_min.toLocaleString()}/hr`,
      budgetType: job.budget_type === 'fixed' ? 'Fixed Price' : 'Hourly',
      location: job.location,
      postedTime: getRelativeTime(job.created_at),
      category: job.category_name,
      skillsRequired: job.skills_required || [],
      duration: job.duration,
      proposals: job.proposals_count,
      client: {
        name: job.company_name || job.client_name,
        rating: parseFloat(job.client_rating).toFixed(1),
        reviews: parseInt(job.client_reviews),
        jobsPosted: job.jobs_posted || 0,
        hireRate: job.hire_rate ? `${job.hire_rate}%` : '0%',
        memberSince: new Date(job.created_at).getFullYear().toString(),
      },
    };

    const similarJobs = similarResult.rows.map(row => ({
      id: row.id,
      title: row.title,
      budget: row.budget_type === 'fixed'
        ? `PKR ${row.budget_min.toLocaleString()} - ${row.budget_max.toLocaleString()}`
        : `PKR ${row.budget_min.toLocaleString()}/hr`,
      location: row.location,
      postedTime: getRelativeTime(row.created_at),
    }));

    return NextResponse.json({
      job: transformedJob,
      similarJobs,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job details' },
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
