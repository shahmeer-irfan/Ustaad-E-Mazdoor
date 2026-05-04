# Clerk Webhook Setup Guide

## Problem
New users signing up through Clerk are not being created in the Supabase database, causing "Profile not found" errors when posting jobs.

## Solution
Set up Clerk webhooks to automatically sync users to Supabase when they sign up.

---

## Step 1: Deploy Your Application

First, deploy your app to production (Vercel, Railway, etc.) so you have a public URL.

Example: `https://ustaad-e-mazdoor.vercel.app`

---

## Step 2: Configure Clerk Webhook

### A. Go to Clerk Dashboard
1. Visit https://dashboard.clerk.com
2. Select your application
3. Go to **Webhooks** in the left sidebar
4. Click **+ Add Endpoint**

### B. Add Webhook Endpoint
- **Endpoint URL**: `https://your-domain.com/api/webhooks/clerk`
  - For Vercel: `https://ustaad-e-mazdoor.vercel.app/api/webhooks/clerk`
  - For local testing with ngrok: `https://xxxx.ngrok.io/api/webhooks/clerk`

### C. Subscribe to Events
Select these events:
- ✅ `user.created` (when a new user signs up)
- ✅ `user.updated` (when user metadata changes)
- ✅ `user.deleted` (when a user is deleted)

### D. Copy Signing Secret
1. After creating the webhook, Clerk will show you a **Signing Secret**
2. It starts with `whsec_...`
3. Copy this secret

---

## Step 3: Add Webhook Secret to Environment

### Local Development (.env.local)
```bash
CLERK_WEBHOOK_SECRET=whsec_your_actual_signing_secret_here
```

### Production (Vercel/Railway)
1. Go to your deployment platform
2. Add environment variable:
   - **Name**: `CLERK_WEBHOOK_SECRET`
   - **Value**: `whsec_...` (the secret you copied)
3. Redeploy your application

---

## Step 4: Sync Existing Users (One-Time)

If you already have users in Clerk but not in Supabase, run the sync script:

```bash
node sync-users.js
```

This will add all existing Clerk users to your Supabase database.

---

## Step 5: Test the Webhook

### Test Locally with ngrok (Optional)
```bash
# Install ngrok
npm install -g ngrok

# Start your dev server
npm run dev

# In another terminal, start ngrok
ngrok http 3000

# Use the ngrok URL in Clerk webhook settings
```

### Test in Production
1. Create a new account on your production site
2. Check Supabase database - new profile should appear
3. Check Clerk Dashboard → Webhooks → View webhook logs

---

## How It Works

### 1. User Signs Up
```
User → Clerk Sign Up → Clerk creates account
```

### 2. Clerk Sends Webhook
```
Clerk → POST /api/webhooks/clerk → Your app receives event
```

### 3. Your App Creates Profile
```
Webhook handler → INSERT into profiles table → Profile created
```

### 4. User Can Now Post Jobs
```
User logged in → Has profile in DB → Can create jobs ✅
```

---

## Troubleshooting

### "Profile not found" error still appearing

**Check 1**: Verify webhook is configured
```bash
# Go to Clerk Dashboard → Webhooks
# Status should show ✅ Active
```

**Check 2**: Check webhook logs in Clerk
```bash
# Clerk Dashboard → Webhooks → Your endpoint → Attempts
# Should show 200 responses (success)
```

**Check 3**: Check Supabase database
```sql
SELECT * FROM profiles ORDER BY created_at DESC LIMIT 10;
```

**Check 4**: Verify environment variable
```bash
# In your deployment platform, check:
CLERK_WEBHOOK_SECRET is set correctly
```

### Webhook returns 400 error

**Cause**: Signing secret mismatch

**Fix**: 
1. Copy the correct secret from Clerk Dashboard
2. Update `CLERK_WEBHOOK_SECRET` in .env.local
3. Restart your dev server

### Webhook returns 500 error

**Cause**: Database error

**Fix**:
1. Check server logs for error message
2. Verify `DATABASE_URL` is correct
3. Ensure `profiles` table exists in Supabase

---

## Database Schema Required

Make sure your `profiles` table has these columns:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  user_type TEXT CHECK (user_type IN ('client', 'freelancer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_profiles_clerk_id ON profiles(clerk_id);
```

---

## Next Steps

After setup:
1. ✅ New users will automatically sync to Supabase
2. ✅ No more "Profile not found" errors
3. ✅ Users can immediately post jobs after signup

---

## Local Development Tip

For local development without ngrok, you can manually create profiles:

```sql
-- In Supabase SQL Editor
INSERT INTO profiles (clerk_id, email, full_name, user_type)
VALUES ('user_xxx', 'test@example.com', 'Test User', 'client');
```

Replace `user_xxx` with the actual Clerk user ID from your Clerk Dashboard.
