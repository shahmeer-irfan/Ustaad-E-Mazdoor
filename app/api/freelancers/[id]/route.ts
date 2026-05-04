import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Fetch freelancer profile
    const profileQuery = `
      SELECT 
        p.*,
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(DISTINCT r.id) as review_count
      FROM profiles p
      LEFT JOIN reviews r ON p.id = r.freelancer_id
      WHERE p.id = $1 AND p.user_type = 'freelancer'
      GROUP BY p.id
    `;

    const profileResult = await pool.query(profileQuery, [id]);

    if (profileResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Freelancer not found' },
        { status: 404 }
      );
    }

    const profile = profileResult.rows[0];

    // Fetch skills
    const skillsQuery = `
      SELECT s.name, fs.proficiency_level
      FROM freelancer_skills fs
      JOIN skills s ON fs.skill_id = s.id
      WHERE fs.profile_id = $1
    `;
    const skillsResult = await pool.query(skillsQuery, [id]);

    // Fetch education
    const educationQuery = `
      SELECT degree, institution, year, description
      FROM education
      WHERE profile_id = $1
      ORDER BY year DESC
    `;
    const educationResult = await pool.query(educationQuery, [id]);

    // Fetch certifications
    const certsQuery = `
      SELECT name, issuing_organization, issue_date, credential_url
      FROM certifications
      WHERE profile_id = $1
      ORDER BY issue_date DESC
    `;
    const certsResult = await pool.query(certsQuery, [id]);

    // Fetch portfolio
    const portfolioQuery = `
      SELECT title, description, image_url, project_url
      FROM portfolio
      WHERE profile_id = $1
      ORDER BY created_at DESC
    `;
    const portfolioResult = await pool.query(portfolioQuery, [id]);

    // Fetch reviews
    const reviewsQuery = `
      SELECT 
        r.rating,
        r.comment,
        r.created_at,
        p.full_name as client_name
      FROM reviews r
      JOIN profiles p ON r.client_id = p.id
      WHERE r.freelancer_id = $1
      ORDER BY r.created_at DESC
      LIMIT 10
    `;
    const reviewsResult = await pool.query(reviewsQuery, [id]);

    // Transform data
    const freelancer = {
      id: profile.id,
      name: profile.full_name,
      title: profile.bio ? profile.bio.split('.')[0] : 'Freelancer',
      location: profile.location,
      rating: parseFloat(profile.rating).toFixed(1),
      reviewCount: parseInt(profile.review_count),
      skills: skillsResult.rows.map(row => row.name),
      hourlyRate: `PKR ${parseInt(profile.hourly_rate || 0).toLocaleString()}`,
      availability: profile.availability || 'Available',
      memberSince: new Date(profile.member_since).getFullYear().toString(),
      bio: profile.bio,
      completedJobs: profile.completed_jobs,
      totalEarnings: `PKR ${parseInt(profile.total_earnings || 0).toLocaleString()}+`,
      successRate: `${profile.success_rate || 0}%`,
      responseTime: profile.response_time,
      languages: profile.languages || [],
      education: educationResult.rows,
      certifications: certsResult.rows.map(row => row.name),
      portfolio: portfolioResult.rows.map(row => ({
        title: row.title,
        description: row.description,
        image: row.image_url,
        url: row.project_url,
      })),
      clientReviews: reviewsResult.rows.map(row => ({
        client: row.client_name,
        rating: parseFloat(row.rating),
        comment: row.comment,
        date: getRelativeTime(row.created_at),
      })),
    };

    return NextResponse.json({ freelancer });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch freelancer details' },
      { status: 500 }
    );
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  return `${months} month${months > 1 ? 's' : ''} ago`;
}
