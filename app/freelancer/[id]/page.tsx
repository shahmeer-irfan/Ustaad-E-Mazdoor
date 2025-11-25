"use client";

import { use, useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  MapPin,
  Briefcase,
  Mail,
  Calendar,
  Award,
  CheckCircle,
} from "lucide-react";

export default function FreelancerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [freelancer, setFreelancer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFreelancerDetails();
  }, [id]);

  const fetchFreelancerDetails = async () => {
    try {
      const response = await fetch(`/api/freelancers/${id}`);
      if (!response.ok) throw new Error('Freelancer not found');
      const data = await response.json();
      setFreelancer(data);
    } catch (error) {
      console.error('Failed to fetch freelancer:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading freelancer profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground mb-8">This freelancer profile doesn't exist or has been removed.</p>
          <Button asChild>
            <a href="/freelancers">Browse Freelancers</a>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const profile = freelancer.profile || {};
  const skills = freelancer.skills || [];
  const education = freelancer.education || [];
  const certifications = freelancer.certifications || [];
  const portfolio = freelancer.portfolio || [];
  const reviews = freelancer.reviews || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="p-6">
              <div className="text-center mb-6">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                    {profile.full_name?.charAt(0) || 'F'}
                  </AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold mb-1">{profile.full_name}</h1>
                <p className="text-muted-foreground mb-3">{profile.professional_title}</p>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{profile.avg_rating?.toFixed(1) || 'N/A'}</span>
                  <span className="text-muted-foreground">
                    ({profile.review_count || 0} reviews)
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location || 'Pakistan'}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-sm text-muted-foreground">Hourly Rate</span>
                  <span className="font-bold text-lg">PKR {profile.hourly_rate || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-sm text-muted-foreground">Availability</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {profile.availability || 'Available'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-sm text-muted-foreground">Experience</span>
                  <span className="font-semibold text-sm">{profile.experience_years || 0} years</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full rounded-full bg-gradient-accent hover:opacity-90">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Freelancer
                </Button>
                <Button variant="outline" className="w-full rounded-full">
                  Hire Now
                </Button>
              </div>
            </Card>

            {/* Stats Card */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Statistics</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed Jobs</span>
                  <span className="font-semibold">{profile.completed_jobs || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-semibold">{profile.avg_rating?.toFixed(1) || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span className="font-semibold text-green-600">{profile.success_rate || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-semibold">
                    {new Date(profile.created_at).getFullYear()}
                  </span>
                </div>
              </div>
            </Card>

            {/* Languages Card */}
            {profile.languages && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Languages</h3>
                <div className="space-y-2">
                  {profile.languages.map((lang: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>{lang}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">About</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {profile.bio || 'No bio available'}
                  </p>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.length > 0 ? (
                      skills.map((skill: any) => (
                        <Badge key={skill.skill_id} variant="secondary" className="px-3 py-1">
                          {skill.skill_name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No skills listed</p>
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Education</h2>
                  <div className="space-y-4">
                    {education.length > 0 ? (
                      education.map((edu: any, idx: number) => (
                        <div key={idx} className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Award className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{edu.degree}</h3>
                            <p className="text-sm text-muted-foreground">{edu.institution}</p>
                            <p className="text-sm text-muted-foreground">
                              {edu.field_of_study} • {edu.start_year} - {edu.end_year || 'Present'}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No education listed</p>
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Certifications</h2>
                  <div className="space-y-3">
                    {certifications.length > 0 ? (
                      certifications.map((cert: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <h3 className="font-semibold">{cert.name}</h3>
                            <p className="text-sm text-muted-foreground">{cert.issuing_organization}</p>
                            {cert.issue_date && (
                              <p className="text-xs text-muted-foreground">
                                Issued: {new Date(cert.issue_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No certifications listed</p>
                    )}
                  </div>
                </Card>
              </TabsContent>

              {/* Portfolio Tab */}
              <TabsContent value="portfolio" className="space-y-6 mt-6">
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Portfolio</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {portfolio.length > 0 ? (
                      portfolio.map((item: any, idx: number) => (
                        <div key={idx} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="aspect-video bg-muted flex items-center justify-center">
                            <Briefcase className="w-12 h-12 text-muted-foreground" />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold mb-2">{item.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.description}
                            </p>
                            {item.project_url && (
                              <a 
                                href={item.project_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline mt-2 inline-block"
                              >
                                View Project →
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground col-span-2">No portfolio items yet</p>
                    )}
                  </div>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6 mt-6">
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Client Reviews</h2>
                  <div className="space-y-6">
                    {reviews.length > 0 ? (
                      reviews.map((review: any, idx: number) => (
                        <div key={idx} className="border-b last:border-b-0 pb-6 last:pb-0">
                          <div className="flex items-start gap-4 mb-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {review.client_name?.charAt(0) || 'C'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold">{review.client_name || 'Client'}</h3>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                                <span className="text-sm font-semibold ml-1">{review.rating}</span>
                              </div>
                              <p className="text-muted-foreground">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No reviews yet</p>
                    )}
                  </div>
                </Card>
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience" className="space-y-6 mt-6">
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Work Experience</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Calendar className="w-5 h-5 text-muted-foreground mt-1" />
                      <div>
                        <h3 className="font-semibold">Experience</h3>
                        <p className="text-muted-foreground">{profile.experience_years || 0} years of professional experience</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <h3 className="font-semibold">Completed Projects</h3>
                        <p className="text-muted-foreground">{profile.completed_jobs || 0} successfully completed jobs</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Star className="w-5 h-5 text-yellow-400 mt-1" />
                      <div>
                        <h3 className="font-semibold">Client Satisfaction</h3>
                        <p className="text-muted-foreground">{profile.success_rate || 0}% success rate</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
