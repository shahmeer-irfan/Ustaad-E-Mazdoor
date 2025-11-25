"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Briefcase, Users } from "lucide-react";
import { useSignUp } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const [userType, setUserType] = useState<"freelancer" | "client">("freelancer");
  const router = useRouter();
  const { toast } = useToast();
  const { isLoaded, signUp } = useSignUp();

  const handleRoleSelection = async (role: "freelancer" | "client") => {
    setUserType(role);
    
    if (!isLoaded) return;

    try {
      // Store role in public metadata for later use
      await signUp.update({
        unsafeMetadata: {
          role: role,
        },
      });
    } catch (error) {
      console.error("Error updating metadata:", error);
    }
  };

  const handleContinue = () => {
    // Redirect to Clerk's sign-up flow with role already set
    router.push(`/sign-up?role=${userType}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-background via-background to-muted/20">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Join Ustaad E-Mazdoor
            </h1>
            <p className="text-muted-foreground text-lg">
              Choose how you want to get started
            </p>
          </div>

          {/* Role Selection Cards */}
          <RadioGroup value={userType} onValueChange={(value) => handleRoleSelection(value as "freelancer" | "client")}>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Freelancer Card */}
              <Card 
                className={`relative p-8 cursor-pointer transition-all hover:shadow-xl border-2 ${
                  userType === "freelancer" 
                    ? "border-primary shadow-lg ring-2 ring-primary/20" 
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => handleRoleSelection("freelancer")}
              >
                <RadioGroupItem value="freelancer" id="freelancer" className="sr-only" />
                <Label htmlFor="freelancer" className="cursor-pointer">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
                      userType === "freelancer" ? "bg-gradient-primary" : "bg-muted"
                    }`}>
                      <Briefcase className={`w-8 h-8 ${userType === "freelancer" ? "text-white" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">I'm a Freelancer</h3>
                      <p className="text-sm text-muted-foreground">
                        Looking for projects and opportunities to showcase my skills
                      </p>
                    </div>
                    <ul className="text-sm text-left space-y-2 w-full">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Find local projects</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Build your portfolio</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Connect with clients</span>
                      </li>
                    </ul>
                  </div>
                </Label>
              </Card>

              {/* Client Card */}
              <Card 
                className={`relative p-8 cursor-pointer transition-all hover:shadow-xl border-2 ${
                  userType === "client" 
                    ? "border-primary shadow-lg ring-2 ring-primary/20" 
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => handleRoleSelection("client")}
              >
                <RadioGroupItem value="client" id="client" className="sr-only" />
                <Label htmlFor="client" className="cursor-pointer">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
                      userType === "client" ? "bg-gradient-primary" : "bg-muted"
                    }`}>
                      <Users className={`w-8 h-8 ${userType === "client" ? "text-white" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">I'm a Client</h3>
                      <p className="text-sm text-muted-foreground">
                        Looking to hire talented freelancers for my projects
                      </p>
                    </div>
                    <ul className="text-sm text-left space-y-2 w-full">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Post unlimited jobs</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Hire local talent</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Manage projects easily</span>
                      </li>
                    </ul>
                  </div>
                </Label>
              </Card>
            </div>
          </RadioGroup>

          {/* Continue Button */}
          <div className="space-y-4">
            <Button 
              size="lg" 
              className="w-full text-lg h-14"
              onClick={handleContinue}
            >
              Continue as {userType === "freelancer" ? "Freelancer" : "Client"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="text-xs text-muted-foreground text-center mt-8">
            By creating an account, you agree to our{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
