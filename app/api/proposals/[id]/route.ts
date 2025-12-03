import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import pool from '@/lib/db';

// PATCH - Update proposal status (accept/reject)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!['accepted', 'rejected', 'withdrawn'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Get user profile
    const profileResult = await pool.query(
      'SELECT id, user_type FROM profiles WHERE clerk_id = $1',
      [userId]
    );

    if (profileResult.rows.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { id: profileId, user_type } = profileResult.rows[0];

    // Get proposal details
    const proposalResult = await pool.query(
      `SELECT p.*, j.client_id, j.title as job_title
       FROM proposals p
       JOIN jobs j ON p.job_id = j.id
       WHERE p.id = $1`,
      [id]
    );

    if (proposalResult.rows.length === 0) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    const proposal = proposalResult.rows[0];

    // Authorization check
    if (status === 'withdrawn') {
      // Only freelancer can withdraw their own proposal
      if (proposal.freelancer_id !== profileId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    } else {
      // Only client can accept/reject proposals
      if (proposal.client_id !== profileId || user_type !== 'client') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    // Update proposal status
    const updateResult = await pool.query(
      'UPDATE proposals SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );

    // If accepted, update job status and reject other proposals
    if (status === 'accepted') {
      // Update job status to in_progress
      await pool.query(
        'UPDATE jobs SET status = $1 WHERE id = $2',
        ['in_progress', proposal.job_id]
      );

      // Reject all other pending proposals for this job
      await pool.query(
        'UPDATE proposals SET status = $1, updated_at = NOW() WHERE job_id = $2 AND id != $3 AND status = $4',
        ['rejected', proposal.job_id, id, 'pending']
      );
    }

    return NextResponse.json({
      message: `Proposal ${status} successfully`,
      proposal: updateResult.rows[0]
    });
  } catch (error) {
    console.error('Error updating proposal:', error);
    return NextResponse.json(
      { error: 'Failed to update proposal' },
      { status: 500 }
    );
  }
}

// DELETE - Delete/withdraw proposal
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get user profile
    const profileResult = await pool.query(
      'SELECT id FROM profiles WHERE clerk_id = $1',
      [userId]
    );

    if (profileResult.rows.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const profileId = profileResult.rows[0].id;

    // Check if user owns this proposal
    const proposalResult = await pool.query(
      'SELECT job_id FROM proposals WHERE id = $1 AND freelancer_id = $2',
      [id, profileId]
    );

    if (proposalResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Proposal not found or unauthorized' },
        { status: 404 }
      );
    }

    const jobId = proposalResult.rows[0].job_id;

    // Delete proposal
    await pool.query('DELETE FROM proposals WHERE id = $1', [id]);

    // Update job proposal count
    await pool.query(
      'UPDATE jobs SET proposals_count = GREATEST(proposals_count - 1, 0) WHERE id = $1',
      [jobId]
    );

    return NextResponse.json({ message: 'Proposal deleted successfully' });
  } catch (error) {
    console.error('Error deleting proposal:', error);
    return NextResponse.json(
      { error: 'Failed to delete proposal' },
      { status: 500 }
    );
  }
}
