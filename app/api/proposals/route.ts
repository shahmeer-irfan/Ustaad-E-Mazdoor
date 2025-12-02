import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import pool from '@/lib/db';

// GET all proposals for a user (freelancer sees their sent proposals, client sees proposals for their jobs)
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const role = searchParams.get('role'); // 'freelancer' or 'client'

    // Get user's profile ID
    const profileResult = await pool.query(
      'SELECT id, user_type FROM profiles WHERE clerk_id = $1',
      [userId]
    );

    if (profileResult.rows.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { id: profileId, user_type } = profileResult.rows[0];

    let query = '';
    let params: any[] = [];

    if (role === 'freelancer' || user_type === 'freelancer') {
      // Freelancer: get their sent proposals
      query = `
        SELECT 
          p.*,
          j.title as job_title,
          j.budget_min,
          j.budget_max,
          j.status as job_status,
          c.full_name as client_name,
          c.avatar_url as client_avatar
        FROM proposals p
        JOIN jobs j ON p.job_id = j.id
        JOIN profiles c ON j.client_id = c.id
        WHERE p.freelancer_id = $1
        ORDER BY p.created_at DESC
      `;
      params = [profileId];
    } else if (role === 'client' || user_type === 'client') {
      // Client: get proposals for their jobs
      if (jobId) {
        query = `
          SELECT 
            p.*,
            f.full_name as freelancer_name,
            f.avatar_url as freelancer_avatar,
            f.hourly_rate,
            f.success_rate,
            f.completed_jobs,
            COALESCE(AVG(r.rating), 0) as avg_rating,
            COUNT(r.id) as review_count
          FROM proposals p
          JOIN profiles f ON p.freelancer_id = f.id
          LEFT JOIN reviews r ON r.freelancer_id = f.id
          WHERE p.job_id = $1
          GROUP BY p.id, f.id
          ORDER BY p.created_at DESC
        `;
        params = [jobId];
      } else {
        query = `
          SELECT 
            p.*,
            j.title as job_title,
            f.full_name as freelancer_name,
            f.avatar_url as freelancer_avatar
          FROM proposals p
          JOIN jobs j ON p.job_id = j.id
          JOIN profiles f ON p.freelancer_id = f.id
          WHERE j.client_id = $1
          ORDER BY p.created_at DESC
        `;
        params = [profileId];
      }
    }

    const result = await pool.query(query, params);

    return NextResponse.json({ proposals: result.rows });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}

// POST - Create a new proposal
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { jobId, coverLetter, proposedBudget, proposedDuration } = body;

    // Validate required fields
    if (!jobId || !coverLetter || !proposedBudget) {
      return NextResponse.json(
        { error: 'Job ID, cover letter, and proposed budget are required' },
        { status: 400 }
      );
    }

    // Get freelancer profile
    const profileResult = await pool.query(
      'SELECT id, user_type FROM profiles WHERE clerk_id = $1',
      [userId]
    );

    if (profileResult.rows.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { id: freelancerId, user_type } = profileResult.rows[0];

    if (user_type !== 'freelancer') {
      return NextResponse.json(
        { error: 'Only freelancers can submit proposals' },
        { status: 403 }
      );
    }

    // Check if freelancer already submitted a proposal for this job
    const existingProposal = await pool.query(
      'SELECT id FROM proposals WHERE job_id = $1 AND freelancer_id = $2',
      [jobId, freelancerId]
    );

    if (existingProposal.rows.length > 0) {
      return NextResponse.json(
        { error: 'You have already submitted a proposal for this job' },
        { status: 400 }
      );
    }

    // Create proposal
    const result = await pool.query(
      `INSERT INTO proposals (job_id, freelancer_id, cover_letter, proposed_budget, proposed_duration)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [jobId, freelancerId, coverLetter, proposedBudget, proposedDuration]
    );

    // Update job proposal count
    await pool.query(
      'UPDATE jobs SET proposal_count = proposal_count + 1 WHERE id = $1',
      [jobId]
    );

    return NextResponse.json({
      message: 'Proposal submitted successfully',
      proposal: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating proposal:', error);
    return NextResponse.json(
      { error: 'Failed to create proposal' },
      { status: 500 }
    );
  }
}
