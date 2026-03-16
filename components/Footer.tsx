import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-20 bg-(--brand-purple-dark) text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <span className="text-xl font-bold text-(--brand-purple-dark)">U</span>
              </div>
              <span className="text-2xl font-bold">Ustaad</span>
            </div>
            <p className="text-sm text-purple-200">
              Pakistan ka Apna Kaam ka Platform
            </p>
          </div>

          {/* For Freelancers */}
          <div>
            <h3 className="mb-4 font-bold">For Freelancers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/browse-jobs"
                  className="inline-block text-purple-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  Find Work
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="inline-block text-purple-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="inline-block text-purple-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* For Clients */}
          <div>
            <h3 className="mb-4 font-bold">For Clients</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/post-job"
                  className="inline-block text-purple-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  href="/freelancers"
                  className="inline-block text-purple-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  Find Freelancers
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="inline-block text-purple-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  How to Hire
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 font-bold">Company</h3>
            <ul className="space-y-2 text-sm mb-6">
              <li>
                <Link
                  href="/about"
                  className="inline-block text-purple-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="inline-block text-purple-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="inline-block text-purple-200 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>

            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white transition-all duration-200 hover:scale-110 hover:text-(--brand-purple-light)"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-white transition-all duration-200 hover:scale-110 hover:text-(--brand-purple-light)"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-white transition-all duration-200 hover:scale-110 hover:text-(--brand-purple-light)"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-white transition-all duration-200 hover:scale-110 hover:text-(--brand-purple-light)"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-purple-300/25 bg-[color-mix(in_srgb,var(--brand-purple-dark)_85%,black)] px-4 pt-8 pb-2 text-center text-sm text-purple-200">
          <p>&copy; 2024 Ustaad. Sab haq mehfooz hain.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
