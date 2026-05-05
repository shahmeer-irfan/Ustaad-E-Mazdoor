import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import pool from '@/lib/db';

// PATCH — Accept or reject a proposal (client only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: proposalId } = await params;
    const body = await request.json();
    const { status } = body;

    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status. Must be "accepted" or "rejected"' }, { status: 400 });
    }

    // Verify the requester is the client who owns the job
    const profileResult = await pool.query(
      'SELECT id, user_type FROM profiles WHERE clerk_id = $1',
      [userId]
    );
    if (profileResult.rows.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    const { id: profileId, user_type } = profileResult.rows[0];

    if (user_type !== 'client') {
      return NextResponse.json({ error: 'Only clients can accept or reject proposals' }, { status: 403 });
    }

    // Verify the proposal belongs to this client's job
    const proposalCheck = await pool.query(
      `SELECT p.id, p.job_id, p.freelancer_id, j.client_id
       FROM proposals p
       JOIN jobs j ON p.job_id = j.id
       WHERE p.id = $1`,
      [proposalId]
    );
    if (proposalCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }
    if (proposalCheck.rows[0].client_id !== profileId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update proposal status
    const result = await pool.query(
      `UPDATE proposals SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, proposalId]
    );

    // If accepted, move job to in_progress
    if (status === 'accepted') {
      await pool.query(
        `UPDATE jobs SET status = 'in_progress', updated_at = NOW() WHERE id = $1`,
        [proposalCheck.rows[0].job_id]
      );
    }

    // Notify observers (Observer pattern — REQ-5.x)
    try {
      const { notifications } = await import('@/lib/patterns/NotificationObserver');
      if (status === 'accepted') {
        await notifications.publish({
          type: 'proposal.accepted',
          proposalId,
          jobId: proposalCheck.rows[0].job_id,
          freelancerId: proposalCheck.rows[0].freelancer_id,
        });
      }
    } catch { /* observer failure must not break the main flow */ }

    return NextResponse.json({ success: true, proposal: result.rows[0] });
  } catch (error) {
    console.error('Error updating proposal:', error);
    return NextResponse.json({ error: 'Failed to update proposal' }, { status: 500 });
  }
}

// GET — Single proposal by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: proposalId } = await params;

    const result = await pool.query(
      `SELECT p.*, j.title as job_title, f.full_name as freelancer_name
       FROM proposals p
       JOIN jobs j ON p.job_id = j.id
       JOIN profiles f ON p.freelancer_id = f.id
       WHERE p.id = $1`,
      [proposalId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    return NextResponse.json({ proposal: result.rows[0] });
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return NextResponse.json({ error: 'Failed to fetch proposal' }, { status: 500 });
  }
}
