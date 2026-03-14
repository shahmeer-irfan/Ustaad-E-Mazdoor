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
      if (category !== 'all') params.append('category', category);
      if (location !== 'all') params.append('location', location);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/freelancers?${params.toString()}`);
      const data = await response.json();
      setFreelancers(data.freelancers || []);
    } catch (error) {
      console.error('Failed to fetch freelancers:', error);
      setFreelancers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchFreelancers();
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
                <FreelancerCardSkeleton key={i} />
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
            Find Talented Freelancers
          </h1>
          <p className="mb-8 mt-4 text-lg text-[#4B5563]">
            Connect with skilled professionals ready to bring your projects to
            life
          </p>

          {/* Search and Filters */}
          <div className="rounded-2xl border border-[#E9D5FF] bg-white p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9CA3AF]" />
                <Input
                  type="text"
                  placeholder="Search by name or skill..."
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
                  <SelectItem value="web">Web Development</SelectItem>
                  <SelectItem value="design">Graphic Design</SelectItem>
                  <SelectItem value="video">Video Editing</SelectItem>
                  <SelectItem value="writing">Content Writing</SelectItem>
                  <SelectItem value="marketing">Digital Marketing</SelectItem>
                </SelectContent>
              </Select>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="rounded-xl border-[#E9D5FF] bg-white focus:ring-2 focus:ring-[#7C3AED]">
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
        </div>
      </div>

      <div className="w-full py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-[#0F0A1E]">Hunar Wale Log</h1>
            <div className="w-10 h-1 rounded-full bg-[#7C3AED]" />
          </div>
          <span className="text-sm text-[#6B7280] bg-[#F5F3FF] px-4 py-2 rounded-full border border-[#E9D5FF]">
            {freelancers.length} freelancers found
          </span>
        </div>

        <div className="mb-6">
          <Select defaultValue="rating">
            <SelectTrigger className="w-48 rounded-xl border-[#E9D5FF] bg-white focus:ring-2 focus:ring-[#7C3AED]">
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

        {freelancers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#6B7280]">No freelancers found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {freelancers.map((freelancer) => (
              <FreelancerCard key={freelancer.id} {...freelancer} />
            ))}
          </div>
        )}

        {freelancers.length > 0 ? (
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
