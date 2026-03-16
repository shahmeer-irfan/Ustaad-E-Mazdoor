import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import JobCard from "@/components/JobCard";
import FreelancerCard from "@/components/FreelancerCard";
import Hero2 from "@/components/ui/hero-2";
import AnimatedButton from "@/components/ui/animated-button";
import pool from "@/lib/db";
import {
  Code,
  Paintbrush,
  Video,
  PenTool,
  Megaphone,
  TrendingUp,
  Search,
  UserPlus,
  Briefcase,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

const iconMap: Record<string, any> = {
  Code,
  Paintbrush,
  Video,
  PenTool,
  Megaphone,
  TrendingUp,
};

async function getCategories() {
  try {
    const query = `
      SELECT
        id,
        name,
        slug,
        icon,
        job_count
      FROM categories
      ORDER BY job_count DESC
    `;

    const result = await pool.query(query);

    return result.rows.map((row) => ({
      id: row.id,
      title: row.name,
      slug: row.slug,
      icon: iconMap[row.icon] || Code,
      count: `${row.job_count} jobs`,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function getFeaturedJobs() {
  try {
    const query = `
      SELECT
        j.id,
        j.title,
        j.description,
        j.budget_min,
        j.budget_max,
        j.budget_type,
        j.location,
        j.duration,
        j.created_at,
        j.proposals_count,
        c.name as category,
        ARRAY_AGG(DISTINCT s.name) as skills
      FROM jobs j
      LEFT JOIN categories c ON j.category_id = c.id
      LEFT JOIN job_skills js ON j.id = js.job_id
      LEFT JOIN skills s ON js.skill_id = s.id
      WHERE j.status = 'open'
      GROUP BY j.id, c.name
      ORDER BY j.created_at DESC
      LIMIT 3
    `;

    const result = await pool.query(query);

    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      budget:
        row.budget_type === "fixed"
          ? `PKR ${row.budget_min.toLocaleString()} - ${row.budget_max.toLocaleString()}`
          : `PKR ${row.budget_min.toLocaleString()}/hr`,
      location: row.location,
      duration: row.duration,
      postedTime: getRelativeTime(row.created_at),
      category: row.category,
      proposals: row.proposals_count || 0,
      skills: row.skills.filter(Boolean),
    }));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours < 1) return "Abhi";
  if (hours < 24) return `${hours} ghantay pehle`;
  if (days === 1) return "1 din pehle";
  return `${days} din pehle`;
}

export default async function Home() {
  const categories = await getCategories();
  const featuredJobs = await getFeaturedJobs();
  const topFreelancers = [
    {
      id: "top-1",
      name: "Ahmed Raza",
      title: "Master Electrician",
      location: "Lahore",
      rating: 4.9,
      reviews: 178,
      skills: ["Wiring", "Maintenance", "Installations"],
      hourlyRate: "PKR 2,500",
    },
    {
      id: "top-2",
      name: "Sana Tariq",
      title: "Interior Painter",
      location: "Karachi",
      rating: 4.8,
      reviews: 126,
      skills: ["Wall Finishing", "Texture", "Color Matching"],
      hourlyRate: "PKR 2,000",
    },
    {
      id: "top-3",
      name: "Bilal Khan",
      title: "Plumbing Specialist",
      location: "Islamabad",
      rating: 4.9,
      reviews: 214,
      skills: ["Repairs", "Fittings", "Leak Detection"],
      hourlyRate: "PKR 2,800",
    },
  ];

  const howItWorks = [
    {
      icon: UserPlus,
      title: "Account Banao",
      description:
        "Free mein sign up karo - sirf 2 minute lagte hain",
    },
    {
      icon: Search,
      title: "Kaam Dhundo ya Post Karo",
      description:
        "Apni zaroorat ke mutabiq kaam dhundo ya apna kaam post karo",
    },
    {
      icon: Briefcase,
      title: "Kaam Shuru Karo",
      description: "Seedha baat karo, rate tay karo, aur kaam shuru karo. Itna simple.",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-(--text-primary)">
      <Navigation />
      <Hero2 />

      {/* Stats Strip */}
      <section className="bg-linear-to-r from-(--brand-purple-dark) to-(--brand-purple) py-6 text-white">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-4 text-center md:grid-cols-4">
          {[
            { value: "10,000+", label: "Registered Workers" },
            { value: "500+", label: "Companies" },
            { value: "50+", label: "Cities" },
            { value: "98%", label: "Success Rate" },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <p className="text-3xl font-extrabold">{item.value}</p>
              <p className="text-small text-white/85">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-(--text-primary)">Browse by Category</h2>
            <div className="mx-auto mt-3 h-1 w-24 rounded-full bg-(--brand-purple)" />
            <p className="mt-4 text-body-lg text-(--text-secondary)">
              Find the right worker for your project needs
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category: { title: string; icon: any; count: string; slug: string }) => (
              <CategoryCard key={category.title} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="bg-(--surface) py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-4xl font-bold text-(--text-primary)">Featured Jobs</h2>
              <p className="mt-4 text-body-lg text-(--text-secondary)">
                Latest opportunities waiting for you
              </p>
            </div>
            <AnimatedButton href="/browse-jobs" label="View All Jobs" variant="outline" className="px-5 py-2" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job: any) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Freelancers */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-(--text-primary)">Top Freelancers</h2>
            <p className="mt-4 text-body-lg text-(--text-secondary)">
              Skilled professionals trusted by clients across Pakistan
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topFreelancers.map((freelancer) => (
              <FreelancerCard key={freelancer.id} {...freelancer} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 text-center">
              <h2 className="text-4xl font-bold text-(--text-primary)">Kaise Kaam Karta Hai?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-body-lg text-(--text-secondary)">
              3 simple steps mein kaam start karein
            </p>
          </div>
          <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            <div className="pointer-events-none absolute left-1/2 top-10 hidden h-0.5 w-[68%] -translate-x-1/2 border-t-2 border-dashed border-(--brand-purple-light) md:block" />
            {howItWorks.map((step, index) => (
              <div
                key={index}
                className="group relative cursor-pointer rounded-2xl border border-(--border) bg-white p-8 text-center transition-all duration-300 hover:border-(--brand-purple-light) hover:shadow-purple-sm"
              >
                <div className="absolute -top-4 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-(--brand-purple) text-xl font-black text-white shadow-purple-sm transition-all duration-300 group-hover:scale-105">
                  {index + 1}
                </div>
                <div className="mb-6 mt-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--brand-purple-soft) transition-all duration-300 group-hover:bg-(--brand-purple)">
                    <step.icon className="h-8 w-8 text-(--brand-purple) transition-colors duration-300 group-hover:text-white" />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-(--text-primary)">
                  {step.title}
                </h3>
                <p className="text-body text-(--text-secondary)">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="rounded-3xl bg-linear-to-r from-(--brand-purple-dark) to-(--brand-purple) px-6 py-14 text-center text-white md:px-12">
            <h2 className="text-4xl font-bold md:text-5xl">Ready ho? Ab kaam start karo</h2>
            <p className="mx-auto mt-4 max-w-2xl text-body-lg text-white/90">
              Pakistan bhar ke freelancers aur clients ke saath aaj hi connect karo
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <AnimatedButton href="/signup" label="Abhi Join Karo" variant="primary" className="rounded-full border border-white/20 bg-white text-(--brand-purple-dark) hover:bg-white" />
              <Button asChild variant="outline" className="rounded-full border-2 border-white bg-transparent px-8 py-6 text-base font-semibold text-white hover:bg-white/10">
                <Link href="/post-job">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Kaam Post Karo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
