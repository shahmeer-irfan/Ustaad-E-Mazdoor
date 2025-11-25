# Clerk Authentication Setup Guide

## ✅ What's Been Implemented

I've successfully migrated your application from Supabase authentication to Clerk with role-based signup. Here's what's been done:

### 1. **Clerk Integration**
- ✅ Installed `@clerk/nextjs` package
- ✅ Configured ClerkProvider in `app/layout.tsx`
- ✅ Set up middleware with route protection
- ✅ Removed all Supabase auth dependencies

### 2. **Authentication Pages**
- ✅ **`/signup`** - Role selection page (Freelancer or Client)
- ✅ **`/sign-up`** - Clerk's actual signup form with role stored in metadata
- ✅ **`/login`** - Landing page that redirects to sign-in
- ✅ **`/sign-in`** - Clerk's signin form

### 3. **Navigation Component**
- ✅ Updated to use Clerk's `useUser` and `useClerk` hooks
- ✅ Displays user avatar and dropdown menu when logged in
- ✅ Shows user's role (freelancer/client) in dropdown
- ✅ Handles logout functionality

### 4. **Protected Routes**
The following routes are now protected (require authentication):
- `/dashboard`
- `/post-job`
- `/my-jobs`

### 5. **User Role System**
- Users select their role during signup (Freelancer or Client)
- Role is stored in `user.unsafeMetadata.role`
- Role is displayed in the navigation dropdown

---

## 🚀 How to Use

### **Signup Flow**
1. User visits `/signup`
2. Selects role: **Freelancer** or **Client**
3. Clicks "Continue" → Redirected to `/sign-up?role=<selected_role>`
4. Fills out Clerk's signup form
5. Role is automatically saved to user metadata

### **Login Flow**
1. User visits `/login` or `/sign-in`
2. Signs in with Clerk
3. Automatically redirected to homepage or protected page

### **Accessing User Data**
```tsx
import { useUser } from "@clerk/nextjs";

export default function MyComponent() {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) return <div>Loading...</div>;
  
  if (user) {
    console.log(user.firstName); // User's first name
    console.log(user.emailAddresses[0].emailAddress); // Email
    console.log(user.unsafeMetadata.role); // "freelancer" or "client"
  }
}
```

---

## 📋 Next Steps

### 1. **Test the Authentication Flow**
```bash
npm run dev
```
- Visit `http://localhost:3000/signup`
- Create a test account as Freelancer
- Create another as Client
- Verify role appears in navigation

### 2. **Customize Clerk Appearance (Optional)**
You can customize Clerk's components in `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx`:

```tsx
<SignIn 
  appearance={{
    elements: {
      rootBox: "mx-auto",
      card: "shadow-xl",
      formButtonPrimary: "bg-gradient-primary", // Custom button color
    },
  }}
/>
```

### 3. **Set Up Clerk Webhooks for Supabase** 
To sync Clerk users with your Supabase database:

1. Go to Clerk Dashboard → Webhooks
2. Create a new webhook endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Subscribe to `user.created` event
4. Create the webhook handler:

```tsx
// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key
);

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!WEBHOOK_SECRET) {
    throw new Error('Missing CLERK_WEBHOOK_SECRET');
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Verification failed', { status: 400 });
  }

  if (evt.type === 'user.created') {
    const { id, email_addresses, first_name, last_name, unsafe_metadata } = evt.data;
    
    // Insert user into Supabase
    const { error } = await supabase.from('profiles').insert({
      clerk_id: id,
      email: email_addresses[0].email_address,
      full_name: `${first_name || ''} ${last_name || ''}`.trim(),
      user_type: unsafe_metadata.role || 'freelancer',
    });

    if (error) {
      console.error('Error creating user in Supabase:', error);
      return new Response('Error creating user', { status: 500 });
    }
  }

  return new Response('Webhook processed', { status: 200 });
}
```

### 4. **Create Supabase Profiles Table**
```sql
CREATE TABLE public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  user_type TEXT CHECK (user_type IN ('freelancer', 'client')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (clerk_id = auth.jwt() ->> 'sub');

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (clerk_id = auth.jwt() ->> 'sub');
```

### 5. **Access Control Based on Role**
```tsx
import { useUser } from "@clerk/nextjs";

export default function PostJobPage() {
  const { user } = useUser();
  const role = user?.unsafeMetadata?.role;
  
  if (role === "freelancer") {
    return <div>Only clients can post jobs!</div>;
  }
  
  return <div>Post a job form...</div>;
}
```

---

## 🔐 Environment Variables

Make sure your `.env.local` has:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... # For webhooks only
```

---

## 📦 Removed Files
- ❌ `lib/auth/AuthContext.tsx`
- ❌ `lib/supabase/client.ts`
- ❌ `lib/supabase/server.ts`
- ❌ `lib/supabase/middleware.ts`
- ❌ `app/auth/callback/route.ts`
- ❌ Removed `@supabase/ssr` and `@supabase/supabase-js` from dependencies

---

## 🎯 Key Differences: Clerk vs Supabase Auth

| Feature | Supabase Auth | Clerk |
|---------|--------------|-------|
| User Management UI | Self-hosted | Managed Dashboard |
| Social Login Setup | Manual OAuth config | One-click enable |
| Session Management | JWT + Cookies | Automatic |
| User Metadata | Limited | Rich (public/private/unsafe) |
| Email Templates | Self-managed | Pre-built + customizable |
| MFA | Supported | Built-in |

---

## 🛠️ Troubleshooting

### Issue: "Invalid publishable key"
- Check your `.env.local` has the correct Clerk keys
- Restart dev server after adding keys

### Issue: Role not appearing in dropdown
- User signed up before role selection was implemented
- Re-signup or manually update in Clerk Dashboard → Users → [User] → Metadata

### Issue: Protected routes not working
- Check middleware.ts is properly configured
- Verify the route matcher includes your protected routes

---

Your authentication system is now fully set up with Clerk! 🎉
