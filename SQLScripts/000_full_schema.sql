-- Full initial database schema for Ustaad-E-Mazdoor
-- Run in Supabase SQL Editor (Project Settings > SQL Editor)

-- ─── PROFILES ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
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
  languages TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON public.profiles(clerk_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles(location);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (true);

-- ─── CATEGORIES (Pakistani skilled trades) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  job_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.categories (name, slug, icon, job_count) VALUES
  ('Plumbing',           'plumbing',         'Droplets',   156),
  ('Electrician',        'electrician',       'Zap',        234),
  ('Carpentry',          'carpentry',         'Hammer',     112),
  ('Painting',           'painting',          'Paintbrush',  98),
  ('AC & Refrigeration', 'ac-refrigeration',  'Wind',        87),
  ('Construction',       'construction',      'Building2',   73),
  ('Cleaning',           'cleaning',          'Sparkles',    65),
  ('Gardening',          'gardening',         'Leaf',        42),
  ('Tailoring',          'tailoring',         'Scissors',    38),
  ('Auto Mechanic',      'auto-mechanic',     'Car',         54),
  ('Welding',            'welding',           'Flame',       31),
  ('Home Appliances',    'home-appliances',   'Plug',        48)
ON CONFLICT (slug) DO NOTHING;

-- ─── SKILLS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.skills (name, slug) VALUES
  ('Pipe Installation',       'pipe-installation'),
  ('Leak Repair',             'leak-repair'),
  ('Bathroom Fitting',        'bathroom-fitting'),
  ('Wiring',                  'wiring'),
  ('Switchboard Installation','switchboard-installation'),
  ('Generator Repair',        'generator-repair'),
  ('Furniture Making',        'furniture-making'),
  ('Wood Polishing',          'wood-polishing'),
  ('Wall Painting',           'wall-painting'),
  ('Texture Painting',        'texture-painting'),
  ('AC Installation',         'ac-installation'),
  ('AC Gas Refilling',        'ac-gas-refilling'),
  ('Refrigerator Repair',     'refrigerator-repair'),
  ('Brickwork',               'brickwork'),
  ('Plastering',              'plastering'),
  ('House Cleaning',          'house-cleaning'),
  ('Deep Cleaning',           'deep-cleaning'),
  ('Lawn Mowing',             'lawn-mowing'),
  ('Tree Trimming',           'tree-trimming'),
  ('Stitching',               'stitching'),
  ('Embroidery',              'embroidery'),
  ('Engine Repair',           'engine-repair'),
  ('Oil Change',              'oil-change'),
  ('Arc Welding',             'arc-welding'),
  ('Washing Machine Repair',  'washing-machine-repair'),
  ('Fan Repair',              'fan-repair')
ON CONFLICT (slug) DO NOTHING;

-- ─── JOBS ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.jobs (
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
  project_duration TEXT,
  status TEXT CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')) DEFAULT 'open',
  proposal_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_client_id ON public.jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_jobs_category_id ON public.jobs(category_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "jobs_select" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "jobs_insert" ON public.jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "jobs_update" ON public.jobs FOR UPDATE USING (true);

-- ─── JOB_SKILLS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.job_skills (
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
  PRIMARY KEY (job_id, skill_id)
);

-- ─── FREELANCER_SKILLS ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.freelancer_skills (
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'expert')),
  PRIMARY KEY (profile_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_freelancer_skills_profile ON public.freelancer_skills(profile_id);

-- ─── PROPOSALS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.proposals (
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

CREATE INDEX IF NOT EXISTS idx_proposals_job ON public.proposals(job_id);
CREATE INDEX IF NOT EXISTS idx_proposals_freelancer ON public.proposals(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON public.proposals(status);

ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "proposals_all" ON public.proposals FOR ALL USING (true);

-- ─── REVIEWS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  freelancer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating DECIMAL(2, 1) CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_freelancer ON public.reviews(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_client ON public.reviews(client_id);
CREATE INDEX IF NOT EXISTS idx_reviews_job ON public.reviews(job_id);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_select" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON public.reviews FOR INSERT WITH CHECK (true);

-- ─── CLIENT_INFO ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.client_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  company_name TEXT,
  jobs_posted INTEGER DEFAULT 0,
  hire_rate DECIMAL(5, 2) DEFAULT 0,
  total_spent DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── EDUCATION ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  year TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── PORTFOLIO ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.portfolio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
