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
      if (category !== "all") params.append("category", category);
      if (location !== "all") params.append("location", location);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/jobs?${params.toString()}`);
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />

      <main className="min-h-screen pt-[88px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
          {/* Header */}
          <div>
            <span
              className="inline-block text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 font-mono"
              style={{ color: "var(--brand)" }}
            >
              — Live Jobs
            </span>
            <h1 className="text-section">Available Kaam</h1>
            <p
              className="mt-3 text-[16px] sm:text-[17px]"
              style={{ color: "var(--text-secondary)" }}
            >
              Naya kaam dhundo aur aaj hi start karo — verified clients only.
            </p>
          </div>

          {/* Search & Filters */}
          <div
            className="mt-8 rounded-2xl p-4 sm:p-5 ring-soft"
            style={{ background: "var(--bg-card)" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2 relative">
                <Search
                  className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                />
                <Input
                  type="text"
                  placeholder="Kaunsa kaam dhundh rahe ho? (e.g. Electrician, Plumber…)"
                  className="rounded-xl pl-10 h-11"
                  style={{
                    background: "var(--bg)",
                    color: "var(--text-primary)",
                    boxShadow: "inset 0 0 0 1px var(--border)",
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  className="rounded-xl h-11"
                  style={{
                    background: "var(--bg)",
                    color: "var(--text-primary)",
                    boxShadow: "inset 0 0 0 1px var(--border)",
                  }}
                >
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
                <SelectTrigger
                  className="rounded-xl h-11"
                  style={{
                    background: "var(--bg)",
                    color: "var(--text-primary)",
                    boxShadow: "inset 0 0 0 1px var(--border)",
                  }}
                >
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

          {/* Results header */}
          <div className="mt-12 flex items-center justify-between mb-6">
            <h2 className="text-card-title">
              {loading ? "Searching…" : "Available Kaam"}
            </h2>
            {!loading && (
              <span
                className="text-[13px] font-mono px-3 py-1.5 rounded-full"
                style={{
                  color: "var(--brand)",
                  background: "var(--brand-dim)",
                  boxShadow: "inset 0 0 0 1px rgba(249,115,22,0.25)",
                }}
              >
                {jobs.length} kaam mil gaye
              </span>
            )}
          </div>

          {/* Listings */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div
              className="text-center py-20 rounded-2xl ring-soft"
              style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}
            >
              Koi kaam nahi mila — filters badal ke dobara try karo.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map((job) => (
                <JobCard key={job.id} {...job} />
              ))}
            </div>
          )}

          {!loading && jobs.length > 0 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                className="h-10 w-10 rounded-lg font-semibold text-white"
                style={{ background: "var(--grad-brand)" }}
              >
                1
              </button>
              {[2, 3].map((n) => (
                <button
                  key={n}
                  className="h-10 w-10 rounded-lg transition hover:text-[color:var(--brand)]"
                  style={{
                    color: "var(--text-secondary)",
                    background: "var(--bg-card)",
                    boxShadow: "inset 0 0 0 1px var(--border)",
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
