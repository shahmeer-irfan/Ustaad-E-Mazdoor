"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Kaam Dhundo",         href: "#" },
  { label: "Talent Dhundo",       href: "#" },
  { label: "Kaise Kaam Karta Hai", href: "#" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.05 }}
      className={`fixed inset-x-0 top-0 z-[100] transition-[background,backdrop-filter,border-color] duration-300 ${
        scrolled
          ? "bg-[rgba(15,17,23,0.85)] backdrop-blur-xl border-b"
          : "bg-transparent border-b border-transparent"
      }`}
      style={{ borderColor: scrolled ? "var(--border)" : "transparent" }}
    >
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 h-[68px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-[9px] flex items-center justify-center font-bold text-white text-[15px] shadow-[0_4px_14px_-2px_var(--brand-glow)] group-hover:scale-105 transition-transform"
            style={{ background: "var(--grad-brand)" }}
          >
            U
          </div>
          <span className="text-[18px] font-bold tracking-tight">Ustaad</span>
          <span className="hidden sm:inline-block text-[11px] font-medium px-1.5 py-0.5 rounded-[5px] font-mono"
                style={{ color: "var(--brand)", background: "var(--brand-dim)" }}>
            BETA
          </span>
        </Link>

        {/* Center links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="relative px-4 py-2 text-[14px] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors group"
            >
              {l.label}
              <span className="absolute left-4 right-4 -bottom-px h-px bg-[color:var(--brand)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </Link>
          ))}
        </div>

        {/* Right cluster */}
        <div className="hidden lg:flex items-center gap-2">
          <a
            href="tel:0300878223"
            className="flex items-center gap-1.5 text-[13px] font-medium font-mono px-3 py-1.5 rounded-full ring-soft hover:ring-soft-bright transition"
            style={{ color: "var(--brand)" }}
          >
            <Phone className="w-3.5 h-3.5" />
            0300-USTAAD
          </a>
          <Link
            href="#"
            className="px-4 py-2 text-[14px] font-medium text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition"
          >
            Login
          </Link>
          <Link
            href="#"
            className="btn-shine px-5 py-2.5 text-[14px] font-semibold rounded-full text-white transition-all hover:-translate-y-0.5"
            style={{ background: "var(--grad-brand)", boxShadow: "0 6px 20px -6px var(--brand-glow)" }}
          >
            Shuru Karo
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Open menu"
          className="lg:hidden p-2 -mr-2 text-[color:var(--text-primary)]"
          onClick={() => setOpen((s) => !s)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="lg:hidden overflow-hidden border-t"
            style={{
              background: "rgba(15,17,23,0.96)",
              backdropFilter: "blur(20px)",
              borderColor: "var(--border)",
            }}
          >
            <div className="px-5 py-5 flex flex-col gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 rounded-lg text-[15px] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-[color:var(--bg-elevated)]"
                >
                  {l.label}
                </Link>
              ))}
              <div className="h-px my-2" style={{ background: "var(--border)" }} />
              <a
                href="tel:0300878223"
                className="flex items-center gap-2 px-3 py-3 text-[14px] font-mono"
                style={{ color: "var(--brand)" }}
              >
                <Phone className="w-4 h-4" />
                0300-USTAAD
              </a>
              <Link
                href="#"
                onClick={() => setOpen(false)}
                className="px-3 py-3 text-[15px] text-[color:var(--text-primary)]"
              >
                Login
              </Link>
              <Link
                href="#"
                onClick={() => setOpen(false)}
                className="mt-2 px-5 py-3 text-center text-[15px] font-semibold rounded-full text-white"
                style={{ background: "var(--grad-brand)" }}
              >
                Shuru Karo →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
