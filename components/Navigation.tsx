"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User as UserIcon, Briefcase, FileText, Sparkles } from "lucide-react";
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
  const pathname = usePathname();

  const userRole = user?.unsafeMetadata?.role as string | undefined;

  const handleSignOut = async () => {
    await signOut();
  };

  const navLinkClasses = (isActive: boolean) =>
    `px-1 text-sm transition-colors duration-200 font-medium ${
      isActive
        ? "text-[#7C3AED] font-semibold border-b-2 border-[#7C3AED] pb-1"
        : "text-[#4B5563] hover:text-[#7C3AED]"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E9D5FF] shadow-[0_1px_8px_rgba(124,58,237,0.06)]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--brand-purple-soft) transition-transform duration-200 group-hover:scale-105">
              <Sparkles className="h-5 w-5 text-(--brand-purple)" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-(--brand-purple-dark)">Ustaad</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/browse-jobs" className={navLinkClasses(pathname === "/browse-jobs")}>Kaam Dhundo</Link>
            <Link href="/freelancers" className={navLinkClasses(pathname === "/freelancers")}>Talent Dhundo</Link>
            <Link href="/how-it-works" className={navLinkClasses(pathname === "/how-it-works")}>Kaise Kaam Karta Hai</Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {!isLoaded ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
            ) : user ? (
              <>
                {userRole === 'freelancer' ? (
                  <Button variant="ghost" asChild className={navLinkClasses(pathname === "/browse-jobs")}>
                    <Link href="/browse-jobs">Browse Jobs</Link>
                  </Button>
                ) : (
                  <Button variant="ghost" asChild className={navLinkClasses(pathname === "/post-job")}>
                    <Link href="/post-job">Post Job</Link>
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full transition-all duration-200 hover:scale-105 hover:ring-2 hover:ring-(--brand-purple-light)">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
                        <AvatarFallback className="bg-(--brand-purple-soft) text-(--brand-purple) font-bold">
                          {user.firstName?.charAt(0) || user.emailAddresses[0].emailAddress.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 border-(--border)" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.fullName || user.firstName || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.emailAddresses[0].emailAddress}
                        </p>
                        {user.unsafeMetadata?.role ? (
                          <p className="text-xs leading-none text-muted-foreground capitalize mt-1">
                            {String(user.unsafeMetadata.role)}
                          </p>
                        ) : null}
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
                    {userRole === 'client' && (
                      <DropdownMenuItem asChild>
                        <Link href="/my-jobs" className="cursor-pointer">
                          <Briefcase className="mr-2 h-4 w-4" />
                          <span>My Jobs</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
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
                <Button variant="ghost" asChild className="text-[#7C3AED] font-semibold hover:text-[#5B21B6] transition-colors duration-200">
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="px-5 py-2 bg-[#7C3AED] hover:bg-[#5B21B6] text-white font-semibold rounded-full transition-all duration-200 hover:shadow-[0_4px_14px_rgba(124,58,237,0.35)]"
                >
                  <Link href="/signup">Abhi Join Karo</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-lg p-2 text-(--text-primary) transition-colors hover:bg-(--brand-purple-soft)"
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
          <div className="overflow-hidden md:hidden animate-fade-in">
            <div className="space-y-1 border-t border-(--border) py-6">
                <Link
                  href="/browse-jobs"
                  className="block rounded-lg px-4 py-3 text-(--text-secondary) transition-colors hover:bg-(--brand-purple-soft) hover:text-(--brand-purple)"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Kaam Dhundo
                </Link>
                <Link
                  href="/freelancers"
                  className="block rounded-lg px-4 py-3 text-(--text-secondary) transition-colors hover:bg-(--brand-purple-soft) hover:text-(--brand-purple)"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Talent Dhundo
                </Link>
                <Link
                  href="/how-it-works"
                  className="block rounded-lg px-4 py-3 text-(--text-secondary) transition-colors hover:bg-(--brand-purple-soft) hover:text-(--brand-purple)"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Kaise Kaam Karta Hai
                </Link>
                <div className="space-y-2 pt-4">
                  {user ? (
                    <>
                      <Button variant="ghost" asChild className="w-full justify-start font-medium text-(--text-secondary) hover:text-(--brand-purple)">
                        <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                          <UserIcon className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button variant="ghost" asChild className="w-full justify-start font-medium text-(--text-secondary) hover:text-(--brand-purple)">
                        <Link href="/post-job" onClick={() => setMobileMenuOpen(false)}>
                          <Briefcase className="mr-2 h-4 w-4" />
                          Post Job
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-(--border) font-medium text-(--text-secondary)"
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
                      <Button variant="ghost" asChild className="w-full text-[#7C3AED] font-semibold hover:text-[#5B21B6] transition-colors duration-200">
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                          Login
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className="px-5 py-2 bg-[#7C3AED] hover:bg-[#5B21B6] text-white font-semibold rounded-full transition-all duration-200 hover:shadow-[0_4px_14px_rgba(124,58,237,0.35)]"
                      >
                        <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                          Abhi Join Karo
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
