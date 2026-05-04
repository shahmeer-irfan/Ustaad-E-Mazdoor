# API Implementation Guide - Raw SQL with PostgreSQL

## Overview
All API routes use raw SQL queries with the `pg` library to connect directly to Supabase PostgreSQL database.

---

## Created API Routes

### 1. **GET /api/jobs**
Fetch all jobs with filters.

**Query Parameters:**
- `category` - Filter by category slug
- `location` - Filter by location
- `search` - Search in title/description

**Example:**
```
GET /api/jobs?category=web-development&location=Karachi
```

---

### 2. **GET /api/jobs/[id]**
Fetch single job details with client info and similar jobs.

**Example:**
```
GET /api/jobs/550e8400-e29b-41d4-a716-446655440000
```

---

### 3. **POST /api/jobs/create**
Create a new job posting (requires authentication).

**Body:**
```json
{
  "title": "Modern E-commerce Website",
  "category": "web-development",
  "description": "Full description...",
  "budget": "50000-80000",
  "budgetType": "fixed",
  "location": "Karachi, Pakistan",
  "duration": "2-4 weeks",
  "skillsRequired": "React, Node.js, MongoDB"
}
```

---

### 4. **GET /api/freelancers**
Fetch all freelancers with filters.

**Query Parameters:**
- `category` - Filter by category
- `location` - Filter by location  
- `search` - Search in name/bio

---

### 5. **GET /api/freelancers/[id]**
Fetch freelancer profile with skills, education, portfolio, and reviews.

---

### 6. **GET /api/categories**
Fetch all job categories.

---

## How to Update Frontend Pages

### Update `/app/browse-jobs/page.tsx`

Replace the static `jobs` array with API call:

```tsx
"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
// ... other imports

export default function BrowseJobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, [category, location, searchTerm]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (location !== 'all') params.append('location', location);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/jobs?${params.toString()}`);
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      {/* ... rest of the component */}
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs found</p>
        ) : (
          jobs.map((job: any) => <JobCard key={job.id} {...job} />)
        )}
      </div>
    </div>
  );
}
```

---

### Update `/app/job/[id]/page.tsx`

Replace `jobsData` with API call:

```tsx
"use client";

import { use, useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
// ... other imports

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [job, setJob] = useState<any>(null);
  const [similarJobs, setSimilarJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(`/api/jobs/${id}`);
      const data = await response.json();
      setJob(data.job);
      setSimilarJobs(data.similarJobs || []);
    } catch (error) {
      console.error('Failed to fetch job:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!job) return <div>Job not found</div>;

  return (
    <div className="min-h-screen">
      <Navigation />
      {/* ... render job data */}
    </div>
  );
}
```

---

### Update `/app/freelancers/page.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";
// ... imports

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  // ... other state

  useEffect(() => {
    fetchFreelancers();
  }, [category, location, searchTerm]);

  const fetchFreelancers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (location !== 'all') params.append('location', location);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/freelancers?${params.toString()}`);
      const data = await response.json();
      setFreelancers(data.freelancers || []);
    } catch (error) {
      console.error('Failed to fetch freelancers:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
}
```

---

### Update `/app/freelancer/[id]/page.tsx`

```tsx
"use client";

import { use, useEffect, useState } from "react";
// ... imports

export default function FreelancerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [freelancer, setFreelancer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFreelancer();
  }, [id]);

  const fetchFreelancer = async () => {
    try {
      const response = await fetch(`/api/freelancers/${id}`);
      const data = await response.json();
      setFreelancer(data.freelancer);
    } catch (error) {
      console.error('Failed to fetch freelancer:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!freelancer) return <div>Freelancer not found</div>;

  // ... render freelancer data
}
```

---

### Update `/app/post-job/page.tsx`

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
// ... other imports

export default function PostJobPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    budget: "",
    budgetType: "fixed",
    location: "",
    duration: "",
    skillsRequired: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your job has been posted successfully.",
        });
        router.push(`/job/${data.jobId}`);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to post job",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ... rest of component
}
```

---

### Update `/app/page.tsx` (Homepage)

```tsx
import { Suspense } from "react";
// ... imports

async function FeaturedJobs() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/jobs?limit=3`, {
    cache: 'no-store'
  });
  const data = await response.json();
  const jobs = data.jobs || [];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job: any) => (
        <JobCard key={job.id} {...job} />
      ))}
    </div>
  );
}

async function Categories() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/categories`, {
    cache: 'force-cache'
  });
  const data = await response.json();
  const categories = data.categories || [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category: any) => (
        <CategoryCard key={category.id} {...category} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section */}
      
      {/* Categories */}
      <section>
        <Suspense fallback={<div>Loading categories...</div>}>
          <Categories />
        </Suspense>
      </section>

      {/* Featured Jobs */}
      <section>
        <Suspense fallback={<div>Loading jobs...</div>}>
          <FeaturedJobs />
        </Suspense>
      </section>
    </div>
  );
}
```

---

## Environment Variables

Add to `.env.local`:

```env
DATABASE_URL=postgresql://postgres.jiqlhixpflsdyblflywp:[YOUR_PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Testing the Implementation

1. **Run the SQL schema** in Supabase SQL Editor
2. **Insert sample data** using the provided INSERT statements
3. **Update .env.local** with your database password
4. **Restart dev server**: `npm run dev`
5. **Test each endpoint**:
   - Browse to `/browse-jobs` to see jobs from database
   - Browse to `/freelancers` to see freelancer profiles
   - Click on individual items to see details
   - Try posting a job (requires authentication)

---

## Next Steps

1. ✅ Create all database tables
2. ✅ Insert sample data
3. ✅ Add DATABASE_URL to .env.local
4. 🔄 Update all frontend pages with API calls
5. 🔄 Test all CRUD operations
6. 🔄 Add error handling and loading states
7. 🔄 Implement pagination for large datasets

Your application will now use real PostgreSQL database with raw SQL queries instead of dummy data! 🎉
