"use client";

import { use, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProposalDialog } from "@/components/ProposalDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Star,
  Send,
  Share2,
  Bookmark,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useUser();
  const [job, setJob] = useState<any>(null);
  const [similarJobs, setSimilarJobs] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [proposalDialogOpen, setProposalDialogOpen] = useState(false);
  const [updatingProposal, setUpdatingProposal] = useState<string | null>(null);

  const userRole = user?.unsafeMetadata?.role as string | undefined;
  const isClient = userRole === 'client';
  const isFreelancer = userRole === 'freelancer';

  useEffect(() => {
    fetchJobDetails();
    if (isClient) {
      fetchProposals();
    }
  }, [id, isClient]);

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(`/api/jobs/${id}`);
      if (!response.ok) throw new Error('Job not found');
      const data = await response.json();
      setJob(data.job);
      setSimilarJobs(data.similarJobs || []);
    } catch (error) {
      console.error('Failed to fetch job:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProposals = async () => {
    try {
      const response = await fetch(`/api/proposals?jobId=${id}`);
      if (response.ok) {
        const data = await response.json();
        setProposals(data.proposals || []);
      }
    } catch (error) {
      console.error('Failed to fetch proposals:', error);
    }
  };

  const handleProposalAction = async (proposalId: string, status: 'accepted' | 'rejected') => {
    if (!confirm(`Are you sure you want to ${status === 'accepted' ? 'accept' : 'reject'} this proposal?`)) {
      return;
    }

    setUpdatingProposal(proposalId);
    try {
      const response = await fetch(`/api/proposals/${proposalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update proposal');
      }

      alert(`Proposal ${status} successfully!`);
      fetchProposals();
      fetchJobDetails(); // Refresh job to update proposal count and status
    } catch (error: any) {
      console.error('Failed to update proposal:', error);
      alert(error.message || 'Failed to update proposal');
    } finally {
      setUpdatingProposal(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading job details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Job Not Found</h1>
          <p className="text-muted-foreground mb-8">The job you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/browse-jobs">Browse All Jobs</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card className="p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <Badge variant="secondary" className="mb-3">
                    {job.category_name}
                  </Badge>
                  <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.project_duration}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Bookmark className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-y">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {job.budget_type === 'fixed' ? 'Fixed Price' : 'Hourly Rate'}
                  </div>
                  <div className="text-2xl font-bold">
                    PKR {job.budget_min?.toLocaleString() || '0'} - {job.budget_max?.toLocaleString() || '0'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">
                    Proposals
                  </div>
                  <div className="text-2xl font-bold">{job.proposal_count || 0}</div>
                </div>
              </div>
            </Card>

            {/* Tabs for Job Details and Proposals */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Job Details</TabsTrigger>
                {isClient && (
                  <TabsTrigger value="proposals">
                    Proposals ({proposals.length})
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="details" className="space-y-6 mt-6">
                {/* Job Description */}
                <Card className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Job Description</h2>
                  <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                    {job.description}
                  </div>
                </Card>

                {/* Skills Required */}
                <Card className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Skills Required</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills?.map((skill: string) => (
                      <Badge key={skill} variant="outline" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>

                {/* Similar Jobs */}
                <Card className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Similar Jobs</h2>
                  <div className="space-y-4">
                    {similarJobs.length > 0 ? (
                      similarJobs.map((similarJob) => (
                        <Link
                          key={similarJob.id}
                          href={`/job/${similarJob.id}`}
                          className="block p-4 border rounded-lg hover:border-primary transition-colors"
                        >
                          <h3 className="font-semibold mb-2">{similarJob.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {similarJob.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">
                              PKR {similarJob.budget_min?.toLocaleString() || '0'} - {similarJob.budget_max?.toLocaleString() || '0'}
                            </span>
                            <span>{similarJob.location}</span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No similar jobs found</p>
                    )}
                  </div>
                </Card>
              </TabsContent>

              {isClient && (
                <TabsContent value="proposals" className="mt-6">
                  <Card className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Received Proposals</h2>
                    {proposals.length === 0 ? (
                      <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No proposals received yet</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {proposals.map((proposal) => (
                          <div
                            key={proposal.id}
                            className="border rounded-lg p-6 space-y-4"
                          >
                            {/* Freelancer Info */}
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <Avatar className="w-14 h-14">
                                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                    {proposal.freelancer_name?.charAt(0) || 'F'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <Link
                                    href={`/freelancer/${proposal.freelancer_id}`}
                                    className="font-semibold text-lg hover:text-primary transition-colors"
                                  >
                                    {proposal.freelancer_name}
                                  </Link>
                                  <div className="flex items-center gap-3 text-sm mt-1">
                                    <div className="flex items-center gap-1">
                                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                      <span className="font-semibold">
                                        {proposal.avg_rating?.toFixed(1) || 'N/A'}
                                      </span>
                                      <span className="text-muted-foreground">
                                        ({proposal.review_count || 0})
                                      </span>
                                    </div>
                                    <span className="text-muted-foreground">
                                      {proposal.success_rate}% success rate
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <Badge
                                variant={
                                  proposal.status === 'accepted'
                                    ? 'default'
                                    : proposal.status === 'rejected'
                                    ? 'destructive'
                                    : 'secondary'
                                }
                              >
                                {proposal.status}
                              </Badge>
                            </div>

                            {/* Proposal Details */}
                            <div className="grid md:grid-cols-2 gap-4 py-4 border-y">
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">
                                  Proposed Budget
                                </div>
                                <div className="text-xl font-bold">
                                  PKR {proposal.proposed_budget?.toLocaleString() || 'N/A'}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">
                                  Estimated Duration
                                </div>
                                <div className="text-xl font-bold">
                                  {proposal.proposed_duration || 'N/A'}
                                </div>
                              </div>
                            </div>

                            {/* Cover Letter */}
                            <div>
                              <h4 className="font-semibold mb-2">Cover Letter</h4>
                              <p className="text-sm text-muted-foreground whitespace-pre-line">
                                {proposal.cover_letter}
                              </p>
                            </div>

                            {/* Actions */}
                            {proposal.status === 'pending' && (
                              <div className="flex gap-3 pt-2">
                                <Button
                                  onClick={() => handleProposalAction(proposal.id, 'accepted')}
                                  disabled={updatingProposal === proposal.id}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Accept Proposal
                                </Button>
                                <Button
                                  onClick={() => handleProposalAction(proposal.id, 'rejected')}
                                  disabled={updatingProposal === proposal.id}
                                  variant="destructive"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </Button>
                              </div>
                            )}

                            <div className="text-xs text-muted-foreground">
                              Submitted {new Date(proposal.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            {isFreelancer && (
              <Card className="p-6 sticky top-4">
                <Button
                  size="lg"
                  className="w-full rounded-full bg-gradient-accent hover:opacity-90 transition-opacity mb-4 group"
                  onClick={() => setProposalDialogOpen(true)}
                  disabled={!user}
                >
                  <Send className="mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  Send Proposal
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Submit your proposal to this job
                </p>
              </Card>
            )}

            {/* Client Info */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">About the Client</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {job.client_name?.charAt(0) || 'C'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{job.client_name || 'Client'}</div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{job.client_rating?.toFixed(1) || 'N/A'}</span>
                      <span className="text-muted-foreground">
                        ({job.client_reviews || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jobs Posted</span>
                    <span className="font-semibold">{job.client_jobs_posted || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-semibold">{job.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-semibold capitalize">{job.status}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Job Activity */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Job Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Proposals</span>
                  <span className="font-semibold">{job.proposal_count || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Posted On</span>
                  <span className="font-semibold">{new Date(job.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Project Duration</span>
                  <span className="font-semibold">{job.project_duration}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Proposal Dialog */}
      <ProposalDialog
        open={proposalDialogOpen}
        onOpenChange={setProposalDialogOpen}
        jobId={id}
        jobTitle={job.title}
        budgetRange={
          job.budget_min && job.budget_max
            ? { min: job.budget_min, max: job.budget_max }
            : undefined
        }
      />

      <Footer />
    </div>
  );
}
