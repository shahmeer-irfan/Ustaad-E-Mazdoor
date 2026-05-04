# 🚀 QUICK FIX - Profile Not Found Error

## What's Wrong?
Users signing up through Clerk are not being added to Supabase database → "Profile not found" when posting jobs.

## Why?
Missing Clerk webhook = No automatic user sync to database.

---

## ✅ IMMEDIATE FIX (3 Steps)

### 1️⃣ Get Your Webhook Secret
```
1. Go to https://dashboard.clerk.com
2. Select your app → Webhooks → Add Endpoint
3. URL: https://your-domain.com/api/webhooks/clerk
4. Events: user.created, user.updated, user.deleted
5. COPY the signing secret (starts with whsec_...)
```

### 2️⃣ Add Secret to Environment
```bash
# .env.local (for local)
CLERK_WEBHOOK_SECRET=whsec_paste_your_secret_here

# Vercel/Railway (for production)
Add environment variable:
CLERK_WEBHOOK_SECRET = whsec_paste_your_secret_here
```

### 3️⃣ Restart & Test
```bash
# Local
npm run dev

# Production
Redeploy your app
```

---

## 🔧 Sync Existing Users (One-Time)

If you already have users that need to be added to database:

```bash
node sync-users.js
```

---

## ✅ How to Verify It's Working

### Test 1: Create New Account
```
1. Sign up with a new email
2. Check Supabase → profiles table
3. New row should appear immediately
```

### Test 2: Check Webhook Logs
```
Clerk Dashboard → Webhooks → Your endpoint → Attempts
Should show 200 (success) responses
```

### Test 3: Post a Job
```
1. Log in as new user
2. Try to post a job
3. Should work without "Profile not found" error ✅
```

---

## 📋 Files Created

1. **`app/api/webhooks/clerk/route.ts`** - Webhook handler (auto-syncs users)
2. **`sync-users.js`** - Manual sync script for existing users
3. **`WEBHOOK_SETUP.md`** - Full detailed guide

---

## 🆘 Still Not Working?

### Check Clerk User ID
```
1. Log into your app
2. Open browser console
3. Go to Application → Cookies
4. Find __session cookie
5. The user ID is in there (starts with user_)
```

### Manually Add User to Database
```sql
-- In Supabase SQL Editor
INSERT INTO profiles (clerk_id, email, full_name, user_type)
VALUES 
  ('user_2xxxxxx', 'shameerirfan124@gmail.com', 'Shameer Irfan', 'client'),
  ('user_2yyyyyy', 'shameerirfan126@gmail.com', 'Shameer Irfan', 'client');
```

Replace `user_2xxxxxx` with actual Clerk user IDs.

---

## 📞 Need Help?

The detailed guide is in **WEBHOOK_SETUP.md** - open it for:
- Step-by-step screenshots
- Troubleshooting guide
- Database schema requirements
- Testing with ngrok locally
