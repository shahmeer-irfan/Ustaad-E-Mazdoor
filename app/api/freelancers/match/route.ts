/**
 * /api/freelancers/match
 *
 * Computes an AI match score for the currently authenticated freelancer
 * against a specific job using the Strategy pattern (WeightedScoreMatching).
 *
 * SRS reference: REQ-3.2 — weighted matching scoring.
 * Design pattern: Strategy (MatchingContext) — README §2.4.
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import pool from '@/lib/db';
import { MatchingContext, WeightedScoreMatching, type FreelancerProfile, type JobBrief } from '@/lib/patterns/MatchingStrategy';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    if (!jobId) return NextResponse.json({ error: 'jobId is required' }, { status: 400 });

    // Fetch job details
    const jobResult = await pool.query(
      `SELECT j.id, j.budget_min, j.budget_max,
              c.slug as category_slug, c.name as category_name,
              j.location
       FROM jobs j
       LEFT JOIN categories c ON j.category_id = c.id
       WHERE j.id = $1`,
      [jobId]
    );
    if (jobResult.rows.length === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    const jobRow = jobResult.rows[0];

    // Fetch freelancer profile + skills
    const profileResult = await pool.query(
      `SELECT
         p.id, p.location, p.hourly_rate,
         COALESCE(AVG(r.rating), 0) as rating,
         p.success_rate,
         p.response_time,
         ARRAY_AGG(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL) as skills
       FROM profiles p
       LEFT JOIN reviews r ON p.id = r.freelancer_id
       LEFT JOIN freelancer_skills fs ON p.id = fs.profile_id
       LEFT JOIN skills s ON fs.skill_id = s.id
       WHERE p.clerk_id = $1
       GROUP BY p.id`,
      [userId]
    );
    if (profileResult.rows.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    const pr = profileResult.rows[0];

    // Build Strategy inputs
    const job: JobBrief = {
      id:        jobRow.id,
      category:  jobRow.category_slug || jobRow.category_name || '',
      location:  jobRow.location || '',
      budgetMin: parseFloat(jobRow.budget_min) || 0,
      budgetMax: parseFloat(jobRow.budget_max) || 0,
      urgent:    false,
    };

    const candidate: FreelancerProfile = {
      id:             pr.id,
      skills:         (pr.skills || []).filter(Boolean),
      location:       pr.location || '',
      rating:         parseFloat(pr.rating) || 0,
      responseMins:   30, // default if not tracked
      acceptanceRate: parseFloat(pr.success_rate) / 100 || 0,
      hourlyRate:     parseFloat(pr.hourly_rate) || 0,
    };

    // Use Strategy: WeightedScoreMatching (REQ-3.2)
    const context = new MatchingContext(new WeightedScoreMatching());
    const [result] = context.rank(job, [candidate]);

    return NextResponse.json({
      match: {
        score:       result.score,
        explanation: result.explanation,
        strategy:    context.currentStrategy,
      },
    });
  } catch (error) {
    console.error('[/api/freelancers/match] error:', error);
    return NextResponse.json({ error: 'Failed to compute match score' }, { status: 500 });
  }
}
