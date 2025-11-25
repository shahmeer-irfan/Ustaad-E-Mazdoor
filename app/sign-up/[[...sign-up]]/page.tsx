"use client";

import { SignUp } from "@clerk/nextjs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useSearchParams } from "next/navigation";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "freelancer";

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-background via-background to-muted/20">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight mb-2">
              Sign Up as {role === "freelancer" ? "Freelancer" : "Client"}
            </h1>
            <p className="text-muted-foreground">
              Create your account to get started
            </p>
          </div>
          
          <SignUp 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-xl",
              },
            }}
            unsafeMetadata={{
              role: role,
            }}
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
