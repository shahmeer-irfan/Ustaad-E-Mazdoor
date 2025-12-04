import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import pool from '@/lib/db';

// POST - Create a review
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { jobId, freelancerId, rating, comment } = body;

    // Validate required fields
    if (!jobId || !freelancerId || !rating) {
      return NextResponse.json(
        { error: 'Job ID, freelancer ID, and rating are required' },
        { status: 400 }
      );
    }

    // Validate rating value
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Get client profile
    const profileResult = await pool.query(
      'SELECT id, user_type FROM profiles WHERE clerk_id = $1',
      [userId]
    );

    if (profileResult.rows.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { id: clientId, user_type } = profileResult.rows[0];

    // Only clients can leave reviews
    if (user_type !== 'client') {
      return NextResponse.json(
        { error: 'Only clients can leave reviews' },
        { status: 403 }
      );
    }

    // Check if job exists and belongs to this client
    const jobResult = await pool.query(
      'SELECT id, status FROM jobs WHERE id = $1 AND client_id = $2',
      [jobId, clientId]
    );

    if (jobResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Job not found or you are not the client' },
        { status: 404 }
      );
    }

    // Check if review already exists
    const existingReview = await pool.query(
      'SELECT id FROM reviews WHERE job_id = $1 AND client_id = $2 AND freelancer_id = $3',
      [jobId, clientId, freelancerId]
    );

    if (existingReview.rows.length > 0) {
      return NextResponse.json(
        { error: 'You have already reviewed this freelancer for this job' },
        { status: 400 }
      );
    }

    // Create review
    const result = await pool.query(
      `INSERT INTO reviews (job_id, freelancer_id, client_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [jobId, freelancerId, clientId, rating, comment || null]
    );

    // Update freelancer's average rating
    await pool.query(
      `UPDATE profiles 
       SET avg_rating = (
         SELECT AVG(rating) FROM reviews WHERE freelancer_id = $1
       ),
       review_count = (
         SELECT COUNT(*) FROM reviews WHERE freelancer_id = $1
       )
       WHERE id = $1`,
      [freelancerId]
    );

    return NextResponse.json({
      message: 'Review submitted successfully',
      review: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

// GET - Get reviews for a freelancer
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const freelancerId = searchParams.get('freelancerId');

    if (!freelancerId) {
      return NextResponse.json(
        { error: 'Freelancer ID is required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `SELECT r.*, 
              p.full_name as client_name,
              j.title as job_title
       FROM reviews r
       JOIN profiles p ON r.client_id = p.id
       JOIN jobs j ON r.job_id = j.id
       WHERE r.freelancer_id = $1
       ORDER BY r.created_at DESC`,
      [freelancerId]
    );

    return NextResponse.json({ reviews: result.rows });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
