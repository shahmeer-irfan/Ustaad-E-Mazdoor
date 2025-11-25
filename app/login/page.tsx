"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-background via-background to-muted/20">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <h1 className="text-4xl font-black tracking-tight mb-4">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mb-8">
            Sign in to continue to your account
          </p>
          
          <Button 
            size="lg" 
            className="w-full text-lg h-14"
            asChild
          >
            <Link href="/sign-in">
              Sign In
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
