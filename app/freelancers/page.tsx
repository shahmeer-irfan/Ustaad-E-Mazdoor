"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FreelancerCard from "@/components/FreelancerCard";
import { Input } from "@/components/ui/input";
import { FreelancerCardSkeleton } from "@/components/ui/skeleton-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export default function FreelancersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFreelancers();
  }, [category, location, searchTerm]);

  const fetchFreelancers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "all") params.append("category", category);
      if (location !== "all") params.append("location", location);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/freelancers?${params.toString()}`);
      const data = await response.json();
      setFreelancers(data.freelancers || []);
    } catch (error) {
      console.error("Failed to fetch freelancers:", error);
      setFreelancers([]);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "var(--bg)",
    color: "var(--text-primary)",
    boxShadow: "inset 0 0 0 1px var(--border)",
  } as const;

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
              — Trusted Pros
            </span>
            <h1 className="text-section">Hunar Wale Log</h1>
            <p
              className="mt-3 text-[16px] sm:text-[17px]"
              style={{ color: "var(--text-secondary)" }}
            >
              Verified professionals — seedha hire karo, transparent rates.
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
                  placeholder="Search by name or skill…"
                  className="rounded-xl pl-10 h-11"
                  style={inputStyle}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-xl h-11" style={inputStyle}>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electrician">⚡ Electrician</SelectItem>
                  <SelectItem value="plumbing">🔧 Plumbing</SelectItem>
                  <SelectItem value="painting">🎨 Painting</SelectItem>
                  <SelectItem value="ac">❄️ AC & Cooling</SelectItem>
                  <SelectItem value="carpentry">🪚 Carpentry</SelectItem>
                  <SelectItem value="cleaning">🧹 Cleaning</SelectItem>
                </SelectContent>
              </Select>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="rounded-xl h-11" style={inputStyle}>
                  <SelectValue placeholder="Location" />
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

          {/* Sort + Results meta */}
          <div className="mt-12 flex items-center justify-between gap-4 flex-wrap mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-card-title">
                {loading ? "Searching…" : "Hunar Wale Log"}
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
                  {freelancers.length} mil gaye
                </span>
              )}
            </div>
            <Select defaultValue="rating">
              <SelectTrigger className="w-48 rounded-xl h-11" style={inputStyle}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="rate-low">Lowest Rate</SelectItem>
                <SelectItem value="rate-high">Highest Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Listings */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <FreelancerCardSkeleton key={i} />
              ))}
            </div>
          ) : freelancers.length === 0 ? (
            <div
              className="text-center py-20 rounded-2xl ring-soft"
              style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}
            >
              Koi freelancer nahi mila — filters change karo.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {freelancers.map((freelancer) => (
                <FreelancerCard key={freelancer.id} {...freelancer} />
              ))}
            </div>
          )}

          {!loading && freelancers.length > 0 && (
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
