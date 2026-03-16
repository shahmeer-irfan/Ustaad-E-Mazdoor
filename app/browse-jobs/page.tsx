"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { JobCardSkeleton } from "@/components/ui/skeleton-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export default function BrowseJobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [jobs, setJobs] = useState<any[]>([]);
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
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchJobs();
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col gap-1 mb-8">
              <div className="h-8 bg-[#F3F4F6] rounded w-48 animate-pulse" />
              <div className="w-10 h-1 rounded-full bg-[#EDE9FE] animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="py-2">
        <div className="w-full">
          <h1 className="text-4xl font-bold text-[#0F0A1E] md:text-5xl">
            Available Kaam
          </h1>
          <p className="mb-8 mt-4 text-lg text-[#4B5563]">
            Naya kaam dhundo aur aaj hi start karo
          </p>

          {/* Search and Filters */}
          <div className="rounded-2xl border border-[#E9D5FF] bg-white p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9CA3AF]" />
                <Input
                  type="text"
                  placeholder="Kaunsa kaam dhundh rahe ho? (e.g. Electrician, Plumber...)"
                  className="rounded-xl border-[#E9D5FF] bg-white pl-10 focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-xl border-[#E9D5FF] bg-white focus:ring-2 focus:ring-[#7C3AED]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="plumbing">🔧 Plumbing</SelectItem>
                  <SelectItem value="carpentry">🪚 Carpentry</SelectItem>
                  <SelectItem value="electrician">⚡ Electrician</SelectItem>
                  <SelectItem value="painting">🎨 Painting</SelectItem>
                  <SelectItem value="ac-refrigeration">❄️ AC & Refrigeration</SelectItem>
                  <SelectItem value="construction">🏗️ Construction</SelectItem>
                  <SelectItem value="cleaning">🧹 Cleaning</SelectItem>
                  <SelectItem value="gardening">🌱 Gardening</SelectItem>
                  <SelectItem value="tailoring">✂️ Tailoring</SelectItem>
                  <SelectItem value="auto-mechanic">🔩 Auto Mechanic</SelectItem>
                  <SelectItem value="welding">🔥 Welding</SelectItem>
                  <SelectItem value="home-appliances">🔌 Home Appliances</SelectItem>
                </SelectContent>
              </Select>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="rounded-xl border-[#E9D5FF] bg-white focus:ring-2 focus:ring-[#7C3AED]">
                  <SelectValue placeholder="Apna shehar chunein" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="karachi">Karachi</SelectItem>
                  <SelectItem value="lahore">Lahore</SelectItem>
                  <SelectItem value="islamabad">Islamabad</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-[#0F0A1E]">Available Kaam</h1>
            <div className="w-10 h-1 rounded-full bg-[#7C3AED]" />
          </div>
          <span className="text-sm text-[#6B7280] bg-[#F5F3FF] px-4 py-2 rounded-full border border-[#E9D5FF]">
            {jobs.length} kaam mil gaye
          </span>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#6B7280]">Koi kaam nahi mila - filters badal ke dobara try karo</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
        )}

        {!loading && jobs.length > 0 ? (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button className="h-10 w-10 rounded-lg bg-[#7C3AED] font-semibold text-white">1</button>
            <button className="h-10 w-10 rounded-lg border border-[#E9D5FF] bg-white text-[#6B7280] hover:border-[#A855F7] hover:text-[#7C3AED]">2</button>
            <button className="h-10 w-10 rounded-lg border border-[#E9D5FF] bg-white text-[#6B7280] hover:border-[#A855F7] hover:text-[#7C3AED]">3</button>
          </div>
        ) : null}
      </div>
      </div>
      </main>

      <Footer />
    </>
  );
}
