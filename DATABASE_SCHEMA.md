# Database Schema & Implementation Guide

## Complete SQL Schema for Supabase

Based on your application's data structure, here are all the tables you need to create in Supabase.

---

## 1. Database Schema (SQL DDL)

### Table: `profiles`
Stores user profile information from Clerk authentication.

```sql
CREATE TABLE public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  user_type TEXT CHECK (user_type IN ('freelancer', 'client')),
  phone TEXT,
  bio TEXT,
  location TEXT,
  avatar_url TEXT,
  hourly_rate DECIMAL(10, 2),
  availability TEXT CHECK (availability IN ('available', 'busy', 'not_available')),
  member_since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_earnings DECIMAL(12, 2) DEFAULT 0,
  completed_jobs INTEGER DEFAULT 0,
  success_rate DECIMAL(5, 2) DEFAULT 0,
  response_time TEXT,
  languages TEXT[], -- Array of languages
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_clerk_id ON public.profiles(clerk_id);
CREATE INDEX idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX idx_profiles_location ON public.profiles(location);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (clerk_id = auth.jwt() ->> 'sub');
```

---

### Table: `categories`
Stores job/freelancer categories.

```sql
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT, -- Icon name from lucide-react
  job_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO public.categories (name, slug, icon, job_count) VALUES
  ('Web Development', 'web-development', 'Code', 1234),
  ('Graphic Design', 'graphic-design', 'Paintbrush', 987),
  ('Video Editing', 'video-editing', 'Video', 654),
  ('Content Writing', 'content-writing', 'PenTool', 543),
  ('Digital Marketing', 'digital-marketing', 'Megaphone', 432),
  ('SEO & Analytics', 'seo-analytics', 'TrendingUp', 321);
```

---

### Table: `jobs`
Stores job postings.

```sql
CREATE TABLE public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  category_id UUID REFERENCES public.categories(id),
  budget_min DECIMAL(10, 2),
  budget_max DECIMAL(10, 2),
  budget_type TEXT CHECK (budget_type IN ('fixed', 'hourly')),
  location TEXT,
  duration TEXT,
  status TEXT CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')) DEFAULT 'open',
  proposals_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_jobs_client_id ON public.jobs(client_id);
CREATE INDEX idx_jobs_category_id ON public.jobs(category_id);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_created_at ON public.jobs(created_at DESC);

-- RLS Policies
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jobs are viewable by everyone"
  ON public.jobs FOR SELECT
  USING (true);

CREATE POLICY "Clients can insert their own jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (client_id IN (
    SELECT id FROM public.profiles WHERE clerk_id = auth.jwt() ->> 'sub'
  ));

CREATE POLICY "Clients can update their own jobs"
  ON public.jobs FOR UPDATE
  USING (client_id IN (
    SELECT id FROM public.profiles WHERE clerk_id = auth.jwt() ->> 'sub'
  ));
```

---

### Table: `job_skills`
Many-to-many relationship between jobs and skills.

```sql
CREATE TABLE public.skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.job_skills (
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
  PRIMARY KEY (job_id, skill_id)
);

-- Insert common skills
INSERT INTO public.skills (name, slug) VALUES
  ('React', 'react'),
  ('Node.js', 'nodejs'),
  ('MongoDB', 'mongodb'),
  ('PostgreSQL', 'postgresql'),
  ('TypeScript', 'typescript'),
  ('Next.js', 'nextjs'),
  ('Adobe Photoshop', 'adobe-photoshop'),
  ('Adobe Illustrator', 'adobe-illustrator'),
  ('Figma', 'figma'),
  ('Adobe Premiere', 'adobe-premiere'),
  ('After Effects', 'after-effects'),
  ('SEO Writing', 'seo-writing'),
  ('Copywriting', 'copywriting'),
  ('Facebook Ads', 'facebook-ads'),
  ('Google Ads', 'google-ads');
```

---

### Table: `freelancer_skills`
Skills associated with freelancer profiles.

```sql
CREATE TABLE public.freelancer_skills (
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'expert')),
  PRIMARY KEY (profile_id, skill_id)
);

CREATE INDEX idx_freelancer_skills_profile ON public.freelancer_skills(profile_id);
```

---

### Table: `education`
Freelancer education details.

```sql
CREATE TABLE public.education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  year TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_education_profile ON public.education(profile_id);
```

---

### Table: `certifications`
Freelancer certifications.

```sql
CREATE TABLE public.certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuing_organization TEXT,
  issue_date DATE,
  expiry_date DATE,
  credential_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_certifications_profile ON public.certifications(profile_id);
```

---

### Table: `portfolio`
Freelancer portfolio items.

```sql
CREATE TABLE public.portfolio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_portfolio_profile ON public.portfolio(profile_id);
```

---

### Table: `proposals`
Job proposals from freelancers.

```sql
CREATE TABLE public.proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  freelancer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  cover_letter TEXT NOT NULL,
  proposed_budget DECIMAL(10, 2),
  proposed_duration TEXT,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_proposals_job ON public.proposals(job_id);
CREATE INDEX idx_proposals_freelancer ON public.proposals(freelancer_id);
CREATE INDEX idx_proposals_status ON public.proposals(status);
```

---

### Table: `reviews`
Client reviews for freelancers.

```sql
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  freelancer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating DECIMAL(2, 1) CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reviews_freelancer ON public.reviews(freelancer_id);
CREATE INDEX idx_reviews_client ON public.reviews(client_id);
CREATE INDEX idx_reviews_job ON public.reviews(job_id);

-- RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Clients can create reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (client_id IN (
    SELECT id FROM public.profiles WHERE clerk_id = auth.jwt() ->> 'sub'
  ));
```

---

### Table: `client_info`
Additional client information.

```sql
CREATE TABLE public.client_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  company_name TEXT,
  jobs_posted INTEGER DEFAULT 0,
  hire_rate DECIMAL(5, 2) DEFAULT 0,
  total_spent DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 2. Sample Data Insertion

### Sample Freelancers

```sql
-- Insert sample freelancer profiles
INSERT INTO public.profiles (clerk_id, email, full_name, user_type, location, bio, hourly_rate, availability, completed_jobs, success_rate, response_time, languages) VALUES
  ('clerk_freelancer_1', 'ahmed.hassan@example.com', 'Ahmed Hassan', 'freelancer', 'Karachi, Pakistan', 
   'Experienced full-stack developer with 5+ years of expertise in building modern web applications.', 
   2500, 'available', 52, 98.00, 'Within 2 hours', ARRAY['English', 'Urdu']),
  ('clerk_freelancer_2', 'fatima.khan@example.com', 'Fatima Khan', 'freelancer', 'Lahore, Pakistan',
   'Creative graphic designer passionate about creating stunning visual identities.',
   1800, 'available', 98, 96.00, 'Within 1 hour', ARRAY['English', 'Urdu']),
  ('clerk_freelancer_3', 'ali.raza@example.com', 'Ali Raza', 'freelancer', 'Islamabad, Pakistan',
   'Professional video editor with expertise in creating engaging content.',
   2000, 'available', 45, 94.00, 'Within 3 hours', ARRAY['English', 'Urdu']);

-- Insert sample client profiles
INSERT INTO public.profiles (clerk_id, email, full_name, user_type, location) VALUES
  ('clerk_client_1', 'client1@example.com', 'Tech Solutions Pvt Ltd', 'client', 'Karachi, Pakistan'),
  ('clerk_client_2', 'client2@example.com', 'Digital Marketing Agency', 'client', 'Lahore, Pakistan');
```

### Sample Jobs

```sql
-- Get category and profile IDs first
DO $$
DECLARE
  web_dev_id UUID;
  design_id UUID;
  video_id UUID;
  client1_id UUID;
  client2_id UUID;
BEGIN
  SELECT id INTO web_dev_id FROM public.categories WHERE slug = 'web-development';
  SELECT id INTO design_id FROM public.categories WHERE slug = 'graphic-design';
  SELECT id INTO video_id FROM public.categories WHERE slug = 'video-editing';
  SELECT id INTO client1_id FROM public.profiles WHERE clerk_id = 'clerk_client_1';
  SELECT id INTO client2_id FROM public.profiles WHERE clerk_id = 'clerk_client_2';

  INSERT INTO public.jobs (client_id, title, description, long_description, category_id, budget_min, budget_max, budget_type, location, duration, status) VALUES
    (client1_id, 'Modern E-commerce Website Development', 
     'Looking for an experienced web developer to build a complete e-commerce platform with payment integration and admin panel.',
     'Full detailed description here...', web_dev_id, 50000, 80000, 'fixed', 'Karachi, Pakistan', '2-4 weeks', 'open'),
    (client2_id, 'Social Media Graphics Package',
     'Need creative graphics for Instagram, Facebook, and LinkedIn.',
     'Detailed requirements...', design_id, 15000, 25000, 'fixed', 'Lahore, Pakistan', '1-2 weeks', 'open');
END $$;
```

---

## 3. Getting Supabase Connection String

To get your PostgreSQL connection string from Supabase:

1. Go to your Supabase project dashboard
2. Navigate to **Project Settings** → **Database**
3. Scroll to **Connection string** section
4. Copy the **Connection pooling** string (recommended for serverless)
5. Format: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

Add to your `.env.local`:

```env
DATABASE_URL=postgresql://postgres.jiqlhixpflsdyblflywp:[YOUR_PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

Replace `[YOUR_PASSWORD]` with your actual database password.

---

## 4. Summary of Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (both freelancers and clients) |
| `categories` | Job categories |
| `skills` | Available skills |
| `jobs` | Job postings |
| `job_skills` | Skills required for each job |
| `freelancer_skills` | Skills possessed by freelancers |
| `education` | Freelancer education history |
| `certifications` | Freelancer certifications |
| `portfolio` | Freelancer portfolio items |
| `proposals` | Job proposals from freelancers |
| `reviews` | Client reviews for completed work |
| `client_info` | Additional client statistics |

---

## Next Steps

1. **Run all CREATE TABLE statements** in Supabase SQL Editor
2. **Insert sample data** (categories, skills, sample profiles)
3. **Add DATABASE_URL** to .env.local
4. **Update API routes** to use raw SQL queries (see separate files)
5. **Test the connection** with a simple query

The complete implementation with API routes will be provided in separate files.
