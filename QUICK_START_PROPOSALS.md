# Quick Start: Testing the Proposal System

## Step 1: Create Database Tables ⚡

Open your Supabase dashboard and execute this SQL:

```sql
-- Execute in Supabase SQL Editor
-- Tables needed for proposal system:

-- 1. Profiles table (if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  full_name TEXT,
  email TEXT,
  role TEXT CHECK (role IN ('freelancer', 'client')) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Categories table (if not exists)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Jobs table (if not exists)
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget_type TEXT CHECK (budget_type IN ('fixed', 'hourly')),
  budget_min DECIMAL(10, 2),
  budget_max DECIMAL(10, 2),
  location TEXT,
  project_duration TEXT,
  status TEXT CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')) DEFAULT 'open',
  proposal_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Proposals table (CRITICAL)
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  freelancer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  cover_letter TEXT NOT NULL,
  proposed_budget DECIMAL(10, 2),
  proposed_duration TEXT,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(job_id, freelancer_id)  -- Prevent duplicate proposals
);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_proposals_job_id ON public.proposals(job_id);
CREATE INDEX IF NOT EXISTS idx_proposals_freelancer_id ON public.proposals(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON public.proposals(status);
CREATE INDEX IF NOT EXISTS idx_jobs_client_id ON public.jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
```

## Step 2: Insert Test Data 📝

```sql
-- Insert test categories
INSERT INTO public.categories (name, icon) VALUES
('Web Development', 'code'),
('Graphic Design', 'palette'),
('Writing', 'pen-tool');

-- Insert test freelancer profile
INSERT INTO public.profiles (clerk_id, full_name, email, role) VALUES
('test_freelancer_123', 'Ali Hassan', 'ali@example.com', 'freelancer');

-- Insert test client profile
INSERT INTO public.profiles (clerk_id, full_name, email, role) VALUES
('test_client_456', 'Sara Ahmed', 'sara@example.com', 'client');

-- Insert test job (use the client's ID from above)
INSERT INTO public.jobs (
  client_id,
  category_id,
  title,
  description,
  budget_type,
  budget_min,
  budget_max,
  location,
  project_duration,
  status
) VALUES (
  (SELECT id FROM public.profiles WHERE clerk_id = 'test_client_456'),
  (SELECT id FROM public.categories WHERE name = 'Web Development'),
  'Build E-commerce Website',
  'Need a full-stack developer to build an online store with payment integration.',
  'fixed',
  50000,
  100000,
  'Lahore, Pakistan',
  '1-3 months',
  'open'
);
```

## Step 3: Test the Features 🧪

### As Freelancer:

1. **Sign up** at `/sign-up` with role: **Freelancer**
2. **Browse jobs** at `/browse-jobs`
3. **Open a job** (click on any job card)
4. **Click "Send Proposal"** button (green button in sidebar)
5. **Fill the form:**
   - Cover letter (min 100 characters)
   - Your proposed budget
   - Estimated duration
6. **Submit** and verify success message
7. **Go to "My Proposals"** (User menu → My Proposals)
8. **Verify** your proposal appears in "Pending" tab

### As Client:

1. **Sign up** at `/sign-up` with role: **Client**
2. **Post a job** at `/post-job`
3. **Wait for proposals** (or switch to freelancer account to submit one)
4. **Open your job** at `/browse-jobs` → click your job
5. **Click "Proposals" tab**
6. **Review proposals** (see freelancer details, ratings, cover letter)
7. **Click "Accept Proposal"** → Confirm
8. **Verify:**
   - Accepted proposal shows green badge
   - Other proposals auto-rejected
   - Job status changed to "In Progress"

### Test Withdrawing:

1. **Sign in as freelancer**
2. **Go to "My Proposals"**
3. **Find a pending proposal**
4. **Click "Withdraw Proposal"** → Confirm
5. **Verify** status changes to "Withdrawn"

## Step 4: Verify Database Changes 🔍

After testing, check your Supabase database:

```sql
-- Check proposals
SELECT * FROM public.proposals ORDER BY created_at DESC;

-- Check job proposal counts
SELECT id, title, proposal_count, status FROM public.jobs;

-- Check accepted proposals
SELECT 
  p.id,
  p.status,
  j.title as job_title,
  j.status as job_status
FROM public.proposals p
JOIN public.jobs j ON p.job_id = j.id
WHERE p.status = 'accepted';
```

## Common Issues & Solutions 🔧

### Issue: "User must be a freelancer"
**Solution:** Sign up with role = "freelancer" (not client)

### Issue: "Already submitted a proposal"
**Solution:** Each freelancer can only submit one proposal per job. Withdraw or delete the existing one first.

### Issue: "Proposal not showing in list"
**Solution:** 
- Refresh the page
- Check user role matches the view (freelancers see sent, clients see received)
- Verify database: `SELECT * FROM proposals WHERE job_id = 'your-job-id'`

### Issue: Accept button not working
**Solution:**
- Ensure you're the job owner (client who posted the job)
- Check browser console for errors
- Verify database connection is working

### Issue: Proposal count not updating
**Solution:**
- Refresh the job page
- Check database: `SELECT proposal_count FROM jobs WHERE id = 'job-id'`

## API Endpoints Reference 📡

```bash
# Get freelancer's proposals
GET /api/proposals?role=freelancer

# Get client's proposals for a job
GET /api/proposals?jobId=YOUR_JOB_ID

# Submit a proposal
POST /api/proposals
Body: { jobId, coverLetter, proposedBudget, proposedDuration }

# Accept/reject a proposal (client)
PATCH /api/proposals/PROPOSAL_ID
Body: { status: "accepted" | "rejected" }

# Withdraw a proposal (freelancer)
PATCH /api/proposals/PROPOSAL_ID
Body: { status: "withdrawn" }

# Delete a proposal (freelancer)
DELETE /api/proposals/PROPOSAL_ID
```

## Features Checklist ✅

- [x] Proposal submission form
- [x] Duplicate prevention
- [x] Cover letter validation (min 100 chars)
- [x] Budget and duration selection
- [x] Proposal listing for freelancers
- [x] Proposal listing for clients
- [x] Accept/reject functionality
- [x] Auto-rejection of competing proposals
- [x] Job status update on acceptance
- [x] Withdraw functionality
- [x] Delete functionality
- [x] Proposal count tracking
- [x] Status badges (color-coded)
- [x] Freelancer ratings display
- [x] Navigation integration
- [x] Role-based authorization
- [x] Loading states
- [x] Error handling
- [x] Success messages

## What's Next? 🚀

After testing the basic flow, you can enhance with:

1. **Email Notifications** - Alert clients when they receive proposals
2. **Real-time Updates** - WebSocket for live proposal counts
3. **Proposal Templates** - Save and reuse cover letters
4. **Analytics** - Track proposal conversion rates
5. **Messaging** - Chat between freelancer and client
6. **Payment Integration** - Link to Stripe/PayPal after acceptance

## Need Help? 💬

Check these files for detailed documentation:
- `PROPOSAL_SYSTEM_GUIDE.md` - Complete implementation details
- `DATABASE_SCHEMA.md` - Full database structure
- `PROPOSAL_IMPLEMENTATION_SUMMARY.md` - High-level overview

---

**Everything is ready to go! Just create the tables and start testing! 🎉**
