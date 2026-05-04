# Proposal System Implementation Guide

## Overview
Complete proposal workflow system allowing freelancers to submit proposals to jobs and clients to review, accept, or reject them.

## Database Schema

The `proposals` table is already documented in `DATABASE_SCHEMA.md`. Key fields:
- `id` (UUID, Primary Key)
- `job_id` (UUID, Foreign Key → jobs.id)
- `freelancer_id` (UUID, Foreign Key → profiles.id)
- `cover_letter` (TEXT, required)
- `proposed_budget` (DECIMAL)
- `proposed_duration` (TEXT)
- `status` (TEXT: 'pending', 'accepted', 'rejected', 'withdrawn')
- `created_at`, `updated_at` (TIMESTAMP)

## API Endpoints

### 1. GET /api/proposals
**Purpose:** Fetch proposals based on user role

**Query Parameters:**
- `role` - Filter by user role ('freelancer' or 'client')
- `jobId` - Filter proposals for a specific job (client only)

**Response:**
```json
{
  "proposals": [
    {
      "id": "uuid",
      "job_id": "uuid",
      "job_title": "string",
      "freelancer_id": "uuid",
      "freelancer_name": "string",
      "cover_letter": "string",
      "proposed_budget": 50000,
      "proposed_duration": "1-2 weeks",
      "status": "pending",
      "created_at": "timestamp",
      "avg_rating": 4.5,
      "review_count": 10,
      "success_rate": 95,
      "client_name": "string"
    }
  ]
}
```

**Authorization:**
- Freelancers see their own sent proposals
- Clients see proposals for their jobs

### 2. POST /api/proposals
**Purpose:** Submit a new proposal

**Request Body:**
```json
{
  "jobId": "uuid",
  "coverLetter": "string (min 100 chars)",
  "proposedBudget": 50000,
  "proposedDuration": "1-2 weeks"
}
```

**Response:**
```json
{
  "proposal": {
    "id": "uuid",
    "job_id": "uuid",
    "freelancer_id": "uuid",
    "cover_letter": "string",
    "proposed_budget": 50000,
    "proposed_duration": "1-2 weeks",
    "status": "pending",
    "created_at": "timestamp"
  }
}
```

**Validation:**
- User must be a freelancer
- Checks for duplicate proposals (one per job per freelancer)
- Automatically increments `jobs.proposal_count`

### 3. PATCH /api/proposals/[id]
**Purpose:** Update proposal status

**Request Body:**
```json
{
  "status": "accepted" | "rejected" | "withdrawn"
}
```

**Authorization:**
- Freelancers can only withdraw their own proposals
- Clients can accept/reject proposals for their jobs

**Side Effects:**
- When status = 'accepted':
  - Updates `jobs.status` to 'in_progress'
  - Auto-rejects all other pending proposals for the same job
- Updates `updated_at` timestamp

### 4. DELETE /api/proposals/[id]
**Purpose:** Delete a proposal (freelancer only)

**Authorization:**
- Only the freelancer who created the proposal can delete it

**Side Effects:**
- Decrements `jobs.proposal_count` safely using `GREATEST(proposal_count - 1, 0)`

## Frontend Components

### 1. ProposalDialog Component
**Location:** `components/ProposalDialog.tsx`

**Features:**
- Cover letter textarea (min 100 characters)
- Proposed budget input (shows client's budget range)
- Duration selector (dropdown with preset options)
- Form validation
- Success/error handling
- Auto-refresh job page after submission

**Usage:**
```tsx
<ProposalDialog
  open={proposalDialogOpen}
  onOpenChange={setProposalDialogOpen}
  jobId={jobId}
  jobTitle="Job Title"
  budgetRange={{ min: 10000, max: 50000 }}
/>
```

### 2. Job Detail Page Updates
**Location:** `app/job/[id]/page.tsx`

**Freelancer View:**
- "Send Proposal" button in sidebar
- Opens ProposalDialog on click
- Button disabled if not signed in

**Client View:**
- Tabs: "Job Details" and "Proposals"
- Proposals tab shows all received proposals with:
  - Freelancer name, avatar, rating
  - Proposed budget and duration
  - Cover letter
  - Accept/Reject buttons for pending proposals
- Auto-refreshes after accepting/rejecting
- When accepted, other proposals auto-reject

### 3. My Proposals Page
**Location:** `app/my-proposals/page.tsx`

**Features:**
- 4 tabs: Pending, Accepted, Rejected, Withdrawn
- Proposal card shows:
  - Job title (link to job)
  - Submission date
  - Client name
  - Proposed budget and duration
  - Cover letter (truncated)
  - Status badge
- Actions for pending proposals:
  - Withdraw (changes status to 'withdrawn')
  - Delete (removes from database)
- Access restricted to freelancers only

**Navigation:**
- Added to user dropdown menu (freelancers only)
- Icon: FileText
- Label: "My Proposals"

## Workflow

### Freelancer Submits Proposal
1. Freelancer browses jobs at `/browse-jobs`
2. Opens job detail page `/job/[id]`
3. Clicks "Send Proposal" button
4. Fills out ProposalDialog form
5. Submits → POST /api/proposals
6. Backend validates:
   - User is freelancer
   - No duplicate proposal exists
7. Inserts proposal with status 'pending'
8. Increments job.proposal_count
9. Shows success message
10. Redirects/refreshes page

### Client Reviews Proposals
1. Client opens their posted job at `/job/[id]`
2. Switches to "Proposals" tab
3. Sees list of proposals with freelancer details
4. Clicks "Accept Proposal" or "Reject"
5. Confirms action
6. PATCH /api/proposals/[id] with new status
7. If accepted:
   - Job status → 'in_progress'
   - Other pending proposals → 'rejected'
8. Shows success message
9. Refreshes proposals list

### Freelancer Manages Proposals
1. Freelancer clicks user avatar → "My Proposals"
2. Navigates to `/my-proposals`
3. Sees all proposals organized by status
4. For pending proposals:
   - Can withdraw (status → 'withdrawn')
   - Can delete (removes from DB)
5. PATCH /api/proposals/[id] or DELETE /api/proposals/[id]
6. Shows success message
7. Refreshes list

## Data Flow Diagrams

### Proposal Submission Flow
```
[Freelancer] → [Send Proposal Button] → [ProposalDialog]
    ↓
[Form Validation] → [POST /api/proposals]
    ↓
[Auth Check: Freelancer?] → [Duplicate Check]
    ↓
[Insert Proposal] → [Update job.proposal_count]
    ↓
[Return Success] → [Close Dialog] → [Refresh Job Page]
```

### Proposal Acceptance Flow
```
[Client] → [View Proposals Tab] → [Accept Button]
    ↓
[Confirm Dialog] → [PATCH /api/proposals/[id]]
    ↓
[Auth Check: Job Owner?] → [Update Proposal Status]
    ↓
[Update Job Status] → [Reject Other Proposals]
    ↓
[Return Success] → [Refresh Both Lists]
```

## Security & Authorization

### Role-Based Access Control
- **Freelancers can:**
  - Submit proposals to any open job
  - View their own sent proposals
  - Withdraw/delete their own proposals
  
- **Clients can:**
  - View proposals for their own jobs
  - Accept/reject proposals for their jobs
  - Cannot submit proposals
  
- **Both roles can:**
  - View job listings
  - View freelancer profiles

### Database Security
- All queries use parameterized statements ($1, $2) to prevent SQL injection
- Foreign key constraints ensure data integrity
- Cascade deletes handle orphaned records
- Check constraints on status field prevent invalid values

### Authentication
- Clerk `auth()` helper validates user session
- User ID from Clerk linked to profiles table via `clerk_id`
- Role stored in Clerk's `unsafeMetadata.role`

## Error Handling

### Common Errors
1. **"You must be a freelancer to submit proposals"**
   - User role is not 'freelancer'
   - Solution: Sign in as freelancer

2. **"You have already submitted a proposal for this job"**
   - Duplicate proposal detected
   - Solution: Withdraw/delete existing proposal first

3. **"Unauthorized to update this proposal"**
   - Trying to update someone else's proposal
   - Solution: Only update your own proposals

4. **"Job not found or unauthorized"**
   - Invalid job ID or not the job owner
   - Solution: Verify job ownership

### Frontend Validation
- Cover letter minimum 100 characters
- Budget must be a positive number
- Duration is required (dropdown selection)
- User must be signed in

## Testing Checklist

### Database Setup
- [ ] Execute proposals table CREATE statement from DATABASE_SCHEMA.md
- [ ] Verify foreign key constraints work
- [ ] Insert test data for jobs and profiles
- [ ] Test cascade deletes

### API Endpoints
- [ ] GET /api/proposals (freelancer view)
- [ ] GET /api/proposals (client view)
- [ ] GET /api/proposals?jobId=X (client filtering)
- [ ] POST /api/proposals (success)
- [ ] POST /api/proposals (duplicate prevention)
- [ ] PATCH /api/proposals/[id] (accept)
- [ ] PATCH /api/proposals/[id] (reject)
- [ ] PATCH /api/proposals/[id] (withdraw)
- [ ] DELETE /api/proposals/[id]

### Frontend Features
- [ ] ProposalDialog opens and closes
- [ ] Form validation works
- [ ] Proposal submission succeeds
- [ ] Error messages display correctly
- [ ] Job page refreshes after submission
- [ ] Proposals tab shows for clients
- [ ] Accept/reject buttons work
- [ ] Auto-rejection of competing proposals
- [ ] My Proposals page displays all statuses
- [ ] Withdraw button works
- [ ] Delete button works
- [ ] Navigation link shows for freelancers only

### User Flows
- [ ] Freelancer can submit proposal
- [ ] Freelancer sees proposal in "My Proposals"
- [ ] Client sees proposal in job's "Proposals" tab
- [ ] Client can accept proposal
- [ ] Other proposals auto-reject on acceptance
- [ ] Job status changes to 'in_progress'
- [ ] Freelancer can withdraw pending proposal
- [ ] Freelancer can delete proposal

## Next Steps

### Enhancements
1. **Email Notifications**
   - Notify client when proposal received
   - Notify freelancer when proposal accepted/rejected
   - Use Clerk's email functionality or third-party service

2. **Real-time Updates**
   - WebSocket connection for live proposal count updates
   - Toast notifications for status changes

3. **Proposal Editing**
   - Allow freelancers to edit pending proposals
   - Track revision history

4. **Client Dashboard**
   - Aggregate view of all proposals across all jobs
   - Filtering and sorting options
   - Comparison view for multiple proposals

5. **Freelancer Dashboard**
   - Analytics: conversion rate, avg response time
   - Templates for cover letters
   - Proposal drafts

6. **Proposal Filters**
   - Filter by budget range
   - Sort by rating, date, budget
   - Search by freelancer name

7. **Messaging System**
   - Allow client-freelancer communication
   - Q&A before accepting proposal

8. **Escrow/Payment Integration**
   - Link accepted proposals to payment milestones
   - Stripe or PayPal integration

## Troubleshooting

### Proposal not showing in list
- Check user role (correct role viewing correct list?)
- Verify proposal.job_id matches job.id
- Check database: `SELECT * FROM proposals WHERE id = 'uuid'`

### Accept button not working
- Verify user is the job owner
- Check console for error messages
- Verify job_id in proposal matches user's job

### Duplicate proposal error
- Check existing proposals: `SELECT * FROM proposals WHERE job_id = 'x' AND freelancer_id = 'y'`
- Delete or withdraw existing proposal first

### Proposal count not updating
- Check trigger or manual count update in code
- Verify UPDATE statement executes
- Refresh job detail page

## Files Modified/Created

### Created
- `components/ProposalDialog.tsx` (161 lines)
- `app/api/proposals/route.ts` (183 lines)
- `app/api/proposals/[id]/route.ts` (165 lines)
- `app/my-proposals/page.tsx` (371 lines)
- `PROPOSAL_SYSTEM_GUIDE.md` (this file)

### Modified
- `app/job/[id]/page.tsx` - Added proposal viewing/submission
- `components/Navigation.tsx` - Added "My Proposals" link
- Imports updated to use default pool import

### Total Lines Added: ~1000+

## Conclusion

The proposal system is now fully implemented with:
✅ Complete backend API with all CRUD operations
✅ Role-based authorization and security
✅ Frontend components for submission and management
✅ Data synchronization (counts, statuses, cascades)
✅ User-friendly UI with loading/error states
✅ Navigation integration

**Ready to test after database tables are created!**
