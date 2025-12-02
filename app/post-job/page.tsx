"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { ArrowRight, Briefcase, DollarSign, MapPin, Clock } from "lucide-react";

export default function PostJobPage() {
  const router = useRouter();
  const { isSignedIn, userId, isLoaded } = useAuth();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    budgetMin: "",
    budgetMax: "",
    budgetType: "fixed",
    location: "",
    duration: "",
    skillsRequired: "",
  });

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.push('/sign-in?redirect=/post-job');
      } else {
        setAuthChecked(true);
      }
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !authChecked) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      alert('Please sign in to post a job');
      router.push('/sign-in');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          budgetMin: parseInt(formData.budgetMin),
          budgetMax: parseInt(formData.budgetMax),
          skills: formData.skillsRequired.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create job');
      }

      const data = await response.json();
      alert('Job posted successfully!');
      router.push(`/job/${data.jobId}`);
    } catch (error: any) {
      console.error('Failed to post job:', error);
      alert(error.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Post a Job</h1>
          <p className="text-xl text-primary-foreground/80">
            Find the perfect freelancer for your project
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-lg font-semibold">
                  Job Title *
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="title"
                    type="text"
                    placeholder="e.g., Modern E-commerce Website Development"
                    className="pl-10"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Write a clear, descriptive title for your project
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-lg font-semibold">
                  Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleChange("category", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-dev">Web Development</SelectItem>
                    <SelectItem value="design">Graphic Design</SelectItem>
                    <SelectItem value="video">Video Editing</SelectItem>
                    <SelectItem value="writing">Content Writing</SelectItem>
                    <SelectItem value="marketing">Digital Marketing</SelectItem>
                    <SelectItem value="seo">SEO & Analytics</SelectItem>
                    <SelectItem value="mobile">Mobile App Development</SelectItem>
                    <SelectItem value="data">Data Entry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-lg font-semibold">
                  Project Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project in detail. Include requirements, deliverables, and any specific expectations..."
                  className="min-h-[150px]"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Minimum 50 characters. Be specific about what you need.
                </p>
              </div>

              {/* Budget */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="budgetType" className="text-lg font-semibold">
                    Budget Type *
                  </Label>
                  <Select
                    value={formData.budgetType}
                    onValueChange={(value) => handleChange("budgetType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
                      <SelectItem value="hourly">Hourly Rate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budgetMin" className="text-lg font-semibold">
                    Min Budget (PKR) *
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="budgetMin"
                      type="number"
                      placeholder="e.g., 50000"
                      className="pl-10"
                      value={formData.budgetMin}
                      onChange={(e) => handleChange("budgetMin", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budgetMax" className="text-lg font-semibold">
                    Max Budget (PKR) *
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="budgetMax"
                      type="number"
                      placeholder="e.g., 80000"
                      className="pl-10"
                      value={formData.budgetMax}
                      onChange={(e) => handleChange("budgetMax", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location & Duration */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-lg font-semibold">
                    Location *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Select
                      value={formData.location}
                      onValueChange={(value) => handleChange("location", value)}
                      required
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="karachi">Karachi</SelectItem>
                        <SelectItem value="lahore">Lahore</SelectItem>
                        <SelectItem value="islamabad">Islamabad</SelectItem>
                        <SelectItem value="rawalpindi">Rawalpindi</SelectItem>
                        <SelectItem value="faisalabad">Faisalabad</SelectItem>
                        <SelectItem value="multan">Multan</SelectItem>
                        <SelectItem value="peshawar">Peshawar</SelectItem>
                        <SelectItem value="quetta">Quetta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-lg font-semibold">
                    Project Duration *
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Select
                      value={formData.duration}
                      onValueChange={(value) => handleChange("duration", value)}
                      required
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-week">Less than 1 week</SelectItem>
                        <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                        <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                        <SelectItem value="1-3-months">1-3 months</SelectItem>
                        <SelectItem value="3-6-months">3-6 months</SelectItem>
                        <SelectItem value="6-months-plus">6+ months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Skills Required */}
              <div className="space-y-2">
                <Label htmlFor="skillsRequired" className="text-lg font-semibold">
                  Skills Required
                </Label>
                <Input
                  id="skillsRequired"
                  type="text"
                  placeholder="e.g., React, Node.js, MongoDB (comma separated)"
                  value={formData.skillsRequired}
                  onChange={(e) => handleChange("skillsRequired", e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Add relevant skills to help freelancers find your job
                </p>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-full bg-gradient-accent hover:opacity-90 transition-opacity group"
                  size="lg"
                >
                  {loading ? 'Posting...' : 'Post Job'}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  size="lg"
                  disabled={loading}
                  asChild
                >
                  <Link href="/">Cancel</Link>
                </Button>
              </div>
            </form>
          </Card>

          <div className="mt-8 p-6 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2">Tips for posting a great job:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Be specific about your requirements and deliverables</li>
              <li>• Set a realistic budget based on project complexity</li>
              <li>• Include examples or references if possible</li>
              <li>• Clearly state your timeline and milestones</li>
              <li>• Respond quickly to freelancer questions</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
