import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  // If CLERK_WEBHOOK_SECRET is not configured (local dev), skip Svix verification.
  // Profile creation is handled by /api/profile auto-create on first login instead.
  const isLocalDev =
    !WEBHOOK_SECRET ||
    WEBHOOK_SECRET.includes('REPLACE') ||
    WEBHOOK_SECRET.includes('whsec_REPLACE');

  // Get the body early (needed for both paths)
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  if (isLocalDev) {
    // Local dev: skip Svix verification, trust the raw payload
    // Profile creation is handled by /api/profile GET auto-create anyway
    console.log('[webhook] ⚠️  Skipping Svix verification (no CLERK_WEBHOOK_SECRET set)');
    evt = payload as WebhookEvent;
  } else {
    // Production: full Svix signature verification
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Missing Svix headers', { status: 400 });
    }

    try {
      const wh = new Webhook(WEBHOOK_SECRET!);
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('[webhook] Svix verification failed:', err);
      return new Response('Invalid signature', { status: 400 });
    }
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, unsafe_metadata } = evt.data;
    
    const email = email_addresses[0]?.email_address;
    const userType = (unsafe_metadata as any)?.role || 'client'; // Default to client

    try {
      // Insert user into profiles table
      await pool.query(
        `INSERT INTO profiles (id, clerk_id, email, user_type, full_name, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
         ON CONFLICT (clerk_id) DO NOTHING`,
        [id, email, userType, email.split('@')[0]]
      );

      console.log(`✅ User profile created for ${email} as ${userType}`);
    } catch (error) {
      console.error('Error creating user profile:', error);
      return new Response('Error creating user profile', { status: 500 });
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, unsafe_metadata } = evt.data;
    
    const email = email_addresses[0]?.email_address;
    const userType = (unsafe_metadata as any)?.role;

    try {
      // Update user type if role was changed
      if (userType) {
        await pool.query(
          `UPDATE profiles 
           SET user_type = $1, updated_at = NOW()
           WHERE clerk_id = $2`,
          [userType, id]
        );

        console.log(`✅ User profile updated for ${email} to ${userType}`);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      return new Response('Error updating user profile', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    try {
      // Soft delete or hard delete user
      await pool.query(
        `DELETE FROM profiles WHERE clerk_id = $1`,
        [id]
      );

      console.log(`✅ User profile deleted for clerk_id: ${id}`);
    } catch (error) {
      console.error('Error deleting user profile:', error);
      return new Response('Error deleting user profile', { status: 500 });
    }
  }

  return new Response('', { status: 200 });
}
