"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User as UserIcon, Briefcase, FileText } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const userRole = user?.unsafeMetadata?.role as string | undefined;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white font-black text-xl">U</span>
            </div>
            <span className="text-2xl font-black tracking-tight">Ustaad</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" asChild className="font-medium">
              <Link href="/browse-jobs">Find Work</Link>
            </Button>
            <Button variant="ghost" asChild className="font-medium">
              <Link href="/freelancers">Find Talent</Link>
            </Button>
            <Button variant="ghost" asChild className="font-medium">
              <Link href="/how-it-works">How It Works</Link>
            </Button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {!isLoaded ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
            ) : user ? (
              <>
                <Button variant="ghost" asChild className="font-medium">
                  <Link href="/post-job">Post Job</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {user.firstName?.charAt(0) || user.emailAddresses[0].emailAddress.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.fullName || user.firstName || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.emailAddresses[0].emailAddress}
                        </p>
                        {user.unsafeMetadata?.role && (
                          <p className="text-xs leading-none text-muted-foreground capitalize mt-1">
                            {user.unsafeMetadata.role as string}
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    {userRole === 'freelancer' && (
                      <DropdownMenuItem asChild>
                        <Link href="/my-proposals" className="cursor-pointer">
                          <FileText className="mr-2 h-4 w-4" />
                          <span>My Proposals</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/my-jobs" className="cursor-pointer">
                        <Briefcase className="mr-2 h-4 w-4" />
                        <span>My Jobs</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="font-medium">
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-full bg-gradient-accent hover:opacity-90 transition-opacity font-semibold"
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 space-y-1 border-t border-border/50 animate-fade-in">
            <Link
              href="/browse-jobs"
              className="block py-3 px-4 rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Work
            </Link>
            <Link
              href="/freelancers"
              className="block py-3 px-4 rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Talent
            </Link>
            <Link
              href="/how-it-works"
              className="block py-3 px-4 rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <div className="pt-4 space-y-2">
              {user ? (
                <>
                  <Button variant="ghost" asChild className="w-full font-medium justify-start">
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full font-medium justify-start">
                    <Link href="/post-job" onClick={() => setMobileMenuOpen(false)}>
                      <Briefcase className="mr-2 h-4 w-4" />
                      Post Job
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full font-medium justify-start"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="w-full font-medium">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full rounded-full bg-gradient-accent hover:opacity-90 transition-opacity font-semibold"
                  >
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
