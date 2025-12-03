import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import JobCard from "@/components/JobCard";
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
  ArrowRight,
} from "lucide-react";

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
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/categories`, {
      cache: 'force-cache',
      next: { revalidate: 3600 } // Revalidate every hour
    });
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    return data.categories.map((cat: any) => ({
      ...cat,
      icon: iconMap[cat.icon] || Code
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function getFeaturedJobs() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/jobs`, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    return data.jobs.slice(0, 3); // Get first 3 jobs
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

export default async function Home() {
  const categories = await getCategories();
  const featuredJobs = await getFeaturedJobs();

  const howItWorks = [
    {
      icon: UserPlus,
      title: "Create Your Profile",
      description:
        "Sign up as a freelancer or client. Set up your profile in minutes.",
    },
    {
      icon: Search,
      title: "Find Opportunities",
      description:
        "Browse jobs that match your skills or search for the perfect freelancer.",
    },
    {
      icon: Briefcase,
      title: "Start Working",
      description: "Connect, collaborate, and get paid securely for your work.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4 animate-fade-in">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter cursor-default">
                <span className="inline-block hover:scale-105 transition-transform duration-300">
                  Find & Hire
                </span>
                <br />
                <span className="inline-block bg-gradient-to-r from-[hsl(262,83%,58%)] via-[hsl(237,89%,62%)] to-[hsl(25,95%,63%)] bg-clip-text text-transparent hover:scale-110 transition-transform duration-300 hover:drop-shadow-lg">
                  Local Talent
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto hover:text-foreground transition-colors duration-300">
                Connect with talented Pakistani freelancers or discover
                meaningful work in your community
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                asChild
                className="text-lg px-10 py-6 h-auto rounded-full bg-gradient-accent hover:opacity-90 hover:scale-105 hover:shadow-2xl transition-all duration-300 transform"
              >
                <Link href="/browse-jobs" className="group">
                  Find Work
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-lg px-10 py-6 h-auto rounded-full border-2 hover:border-primary hover:bg-primary/5 hover:scale-105 hover:shadow-xl transition-all duration-300 transform"
              >
                <Link href="/freelancers">Browse Talent</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-8 justify-center pt-12 text-center">
              <div className="group cursor-default hover:scale-110 transition-transform duration-300">
                <div className="text-4xl font-black bg-gradient-to-r from-[hsl(262,83%,58%)] via-[hsl(237,89%,62%)] to-[hsl(25,95%,63%)] bg-clip-text text-transparent inline-block group-hover:animate-pulse">
                  10K+
                </div>
                <div className="text-sm text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                  Active Freelancers
                </div>
              </div>
              <div className="group cursor-default hover:scale-110 transition-transform duration-300">
                <div className="text-4xl font-black bg-gradient-to-r from-[hsl(262,83%,58%)] via-[hsl(237,89%,62%)] to-[hsl(25,95%,63%)] bg-clip-text text-transparent inline-block group-hover:animate-pulse">
                  5K+
                </div>
                <div className="text-sm text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                  Jobs Posted
                </div>
              </div>
              <div className="group cursor-default hover:scale-110 transition-transform duration-300">
                <div className="text-4xl font-black bg-gradient-to-r from-[hsl(262,83%,58%)] via-[hsl(237,89%,62%)] to-[hsl(25,95%,63%)] bg-clip-text text-transparent inline-block group-hover:animate-pulse">
                  98%
                </div>
                <div className="text-sm text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                  Success Rate
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-secondary/30 transition-colors duration-500">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 hover:text-primary transition-colors cursor-default">
              Browse by Category
            </h2>
            <p className="text-xl text-muted-foreground">
              Find the perfect freelancer for your project
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category: { title: string; icon: any; count: string; slug: string }) => (
              <CategoryCard key={category.title} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4 hover:text-primary transition-colors cursor-default">
                Featured Jobs
              </h2>
              <p className="text-xl text-muted-foreground">
                Latest opportunities waiting for you
              </p>
            </div>
            <Button
              variant="outline"
              asChild
              className="hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-300 transform"
            >
              <Link href="/browse-jobs">View All Jobs</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job: any) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 hover:text-primary transition-colors cursor-default">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg font-light max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((step, index) => (
              <div
                key={index}
                className="group relative text-center p-8 rounded-2xl bg-gradient-card backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                  {index + 1}
                </div>
                <div className="flex justify-center mb-6 mt-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <step.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-muted-foreground font-light group-hover:text-foreground transition-colors">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-black hover:scale-105 transition-transform duration-300 cursor-default">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground font-light">
              Join thousands of freelancers and clients building the future of
              work in Pakistan
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                asChild
                className="text-lg px-10 py-6 h-auto rounded-full bg-gradient-accent hover:opacity-90 hover:scale-105 hover:shadow-2xl transition-all duration-300 transform"
              >
                <Link href="/signup" className="group">
                  Join as Freelancer
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-lg px-10 py-6 h-auto rounded-full border-2 hover:border-primary hover:bg-primary/5 hover:scale-105 hover:shadow-xl transition-all duration-300 transform"
              >
                <Link href="/post-job">Post a Job</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
