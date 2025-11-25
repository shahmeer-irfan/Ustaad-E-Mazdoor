"use client";

import { SignIn } from "@clerk/nextjs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-background via-background to-muted/20">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your account
            </p>
          </div>
          
          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-xl",
              },
            }}
            routing="path"
            path="/sign-in"
            signUpUrl="/signup"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
