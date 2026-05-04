"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import {
  UserPlus,
  Search,
  Briefcase,
  Shield,
  CreditCard,
  MessageSquare,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

export default function HowItWorksPage() {
  const freelancerSteps = [
    {
      icon: UserPlus,
      title: "Create Your Profile",
      description:
        "Sign up for free and create a compelling profile showcasing your skills, experience, and portfolio. Add your certifications and past work samples.",
    },
    {
      icon: Search,
      title: "Browse & Apply",
      description:
        "Search through hundreds of job listings tailored to your skills. Filter by category, budget, and location to find the perfect match.",
    },
    {
      icon: MessageSquare,
      title: "Connect with Clients",
      description:
        "Communicate directly with clients, discuss project details, and negotiate terms. Build relationships that lead to long-term partnerships.",
    },
    {
      icon: Briefcase,
      title: "Deliver Quality Work",
      description:
        "Complete projects on time and exceed client expectations. Use our platform tools to collaborate, share files, and track progress.",
    },
    {
      icon: CreditCard,
      title: "Get Paid Securely",
      description:
        "Receive payments safely through our secure payment system. Track your earnings and withdraw funds easily to your local bank account.",
    },
  ];

  const clientSteps = [
    {
      icon: UserPlus,
      title: "Create Your Account",
      description:
        "Sign up as a client and tell us about your business. It's quick, free, and takes less than 2 minutes to get started.",
    },
    {
      icon: Briefcase,
      title: "Post Your Job",
      description:
        "Describe your project requirements, set your budget, and add any relevant details. The more specific you are, the better matches you'll get.",
    },
    {
      icon: Search,
      title: "Review Proposals",
      description:
        "Receive proposals from qualified freelancers. Review their profiles, portfolios, ratings, and choose the best fit for your project.",
    },
    {
      icon: MessageSquare,
      title: "Collaborate & Manage",
      description:
        "Work closely with your chosen freelancer through our platform. Share feedback, request revisions, and track project milestones.",
    },
    {
      icon: CheckCircle,
      title: "Approve & Pay",
      description:
        "Review the completed work, request any final changes, and approve. Release payment securely through our protected payment system.",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Payments",
      description:
        "All transactions are protected with escrow services and secure payment gateways.",
    },
    {
      icon: MessageSquare,
      title: "Direct Communication",
      description:
        "Chat directly with clients or freelancers in real-time through our messaging system.",
    },
    {
      icon: TrendingUp,
      title: "Build Your Reputation",
      description:
        "Earn ratings and reviews that showcase your reliability and quality of work.",
    },
    {
      icon: CreditCard,
      title: "Flexible Payments",
      description:
        "Support for multiple payment methods including bank transfers and mobile wallets.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            How Ustaad Works
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            Whether you're a freelancer looking for work or a client seeking
            talent, we make it simple and secure
          </p>
        </div>
      </section>

      {/* For Freelancers */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">For Freelancers</h2>
            <p className="text-xl text-muted-foreground">
              Start earning by offering your skills to clients across Pakistan
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            {freelancerSteps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-start gap-6 group"
              >
                <div className="shrink-0">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-lg">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              asChild
              className="rounded-full bg-gradient-accent hover:opacity-90 transition-opacity"
            >
              <Link href="/signup">Start as a Freelancer</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* For Clients */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">For Clients</h2>
            <p className="text-xl text-muted-foreground">
              Find and hire the perfect freelancer for your project
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            {clientSteps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-start gap-6 group"
              >
                <div className="shrink-0">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-lg">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              asChild
              className="rounded-full bg-gradient-accent hover:opacity-90 transition-opacity"
            >
              <Link href="/post-job">Post Your First Job</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Ustaad?</h2>
            <p className="text-xl text-muted-foreground">
              Built specifically for the Pakistani freelance market
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of freelancers and clients already using Ustaad to
            build their success
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="rounded-full"
            >
              <Link href="/signup">Sign Up Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-full border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link href="/browse-jobs">Browse Jobs</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
