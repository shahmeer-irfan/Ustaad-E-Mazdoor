import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <span className="text-primary font-bold text-xl">U</span>
              </div>
              <span className="text-2xl font-bold">Ustaad</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Connecting Pakistani freelancers with clients. Building careers,
              one job at a time.
            </p>
          </div>

          {/* For Freelancers */}
          <div>
            <h3 className="font-semibold mb-4">For Freelancers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/browse-jobs"
                  className="text-primary-foreground/80 hover:text-white hover:underline hover:translate-x-1 inline-block transition-all duration-300"
                >
                  Find Work
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-primary-foreground/80 hover:text-white hover:underline hover:translate-x-1 inline-block transition-all duration-300"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-primary-foreground/80 hover:text-white hover:underline hover:translate-x-1 inline-block transition-all duration-300"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* For Clients */}
          <div>
            <h3 className="font-semibold mb-4">For Clients</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/post-job"
                  className="text-primary-foreground/80 hover:text-white hover:underline hover:translate-x-1 inline-block transition-all duration-300"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  href="/freelancers"
                  className="text-primary-foreground/80 hover:text-white hover:underline hover:translate-x-1 inline-block transition-all duration-300"
                >
                  Find Freelancers
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-primary-foreground/80 hover:text-white hover:underline hover:translate-x-1 inline-block transition-all duration-300"
                >
                  How to Hire
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm mb-6">
              <li>
                <Link
                  href="/about"
                  className="text-primary-foreground/80 hover:text-white hover:underline hover:translate-x-1 inline-block transition-all duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-primary-foreground/80 hover:text-white hover:underline hover:translate-x-1 inline-block transition-all duration-300"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-primary-foreground/80 hover:text-white hover:underline hover:translate-x-1 inline-block transition-all duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>

            <div className="flex space-x-4">
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-white hover:scale-125 transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-white hover:scale-125 transition-all duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-white hover:scale-125 transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-white hover:scale-125 transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/70">
          <p>&copy; {new Date().getFullYear()} Ustaad. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
