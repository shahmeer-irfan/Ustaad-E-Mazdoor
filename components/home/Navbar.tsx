"use client";

import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
} from "framer-motion";
import { Menu, X, Phone, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import MagneticButton from "./MagneticButton";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@clerk/nextjs";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const { lang, setLang, t }    = useLanguage();
  const { isSignedIn }          = useAuth();

  // Top scroll-progress bar
  const { scrollYProgress } = useScroll();
  const progressX = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: t("nav.browse_jobs"),  href: "/browse-jobs"  },
    { label: t("nav.freelancers"),  href: "/freelancers"  },
    { label: t("nav.how_it_works"), href: "/how-it-works" },
  ];

  return (
    <motion.nav
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.05 }}
      className={`fixed inset-x-0 top-0 z-[100] transition-[background,backdrop-filter,border-color] duration-300 ${
        scrolled
          ? "bg-[rgba(15,17,23,0.78)] backdrop-blur-xl border-b"
          : "bg-transparent border-b border-transparent"
      }`}
      style={{ borderColor: scrolled ? "var(--border)" : "transparent" }}
    >
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 h-[68px] flex items-center justify-between gap-6">
        {/* Logo — animated */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          data-cursor="link"
          aria-label="Ustaad — Home"
        >
          <motion.div
            whileHover={{ rotate: -8, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 380, damping: 18 }}
            className="relative w-9 h-9 rounded-[10px] flex items-center justify-center font-extrabold text-white text-[16px] shadow-[0_6px_22px_-6px_var(--brand-glow)] overflow-hidden"
            style={{ background: "var(--grad-brand)", fontFamily: "var(--font-display)" }}
          >
            <span className="relative z-[1]">U</span>
            <motion.span
              aria-hidden
              className="absolute inset-0"
              initial={{ x: "-110%" }}
              whileHover={{ x: "110%" }}
              transition={{ duration: 0.6 }}
              style={{
                background:
                  "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
              }}
            />
          </motion.div>
          <span
            className="text-[19px] font-bold tracking-[-0.025em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ustaad
          </span>
          <span
            className="hidden sm:inline-block text-[10.5px] font-bold px-1.5 py-0.5 rounded-[5px] font-mono uppercase tracking-[0.12em]"
            style={{ color: "var(--brand)", background: "var(--brand-dim)" }}
          >
            Beta
          </span>
        </Link>

        {/* Center links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-cursor="link"
              className="relative px-4 py-2 text-[14px] font-medium text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors group"
            >
              <span className="relative z-[1]">{l.label}</span>
              <motion.span
                aria-hidden
                className="absolute inset-1 rounded-full opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.25 }}
                style={{ background: "var(--bg-elevated)" }}
              />
              <span className="absolute left-4 right-4 -bottom-px h-px bg-[color:var(--brand)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </Link>
          ))}
        </div>

        {/* Right cluster */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Language Toggle */}
          <button
            id="lang-toggle"
            onClick={() => setLang(lang === "en" ? "ur" : "en")}
            aria-label="Toggle language"
            className="px-3 py-1.5 rounded-full text-[13px] font-semibold font-mono transition-all hover:scale-105 active:scale-95"
            style={{
              color: "var(--brand)",
              background: "var(--brand-dim)",
              boxShadow: "inset 0 0 0 1px rgba(249,115,22,0.3)",
            }}
          >
            {t("nav.lang_toggle")}
          </button>

          <a
            href="tel:0300878223"
            data-cursor="link"
            className="flex items-center gap-1.5 text-[13px] font-medium font-mono px-3 py-1.5 rounded-full ring-soft hover:ring-soft-bright transition"
            style={{ color: "var(--brand)" }}
          >
            <Phone className="w-3.5 h-3.5" />
            0300-USTAAD
          </a>

          {isSignedIn ? (
            <Link
              href="/dashboard"
              data-cursor="link"
              className="px-4 py-2 text-[14px] font-medium text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition"
            >
              {t("nav.dashboard")}
            </Link>
          ) : (
            <Link
              href="/sign-in"
              data-cursor="link"
              className="px-4 py-2 text-[14px] font-medium text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition"
            >
              {t("nav.sign_in")}
            </Link>
          )}

          <MagneticButton
            as="a"
            href={isSignedIn ? "/post-job" : "/sign-up"}
            strength={20}
            parallax={1.4}
            className="px-5 py-2.5 text-[14px] font-semibold rounded-full text-white"
            style={{
              background: "var(--grad-brand)",
              boxShadow: "0 8px 24px -8px var(--brand-glow)",
              fontFamily: "var(--font-display)",
            }}
          >
            {isSignedIn ? t("nav.post_job") : t("nav.sign_up")} <ArrowUpRight className="w-4 h-4" />
          </MagneticButton>
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

      {/* Scroll progress */}
      <motion.div
        aria-hidden
        className="absolute left-0 right-0 bottom-0 h-px origin-left"
        style={{ scaleX: progressX, background: "var(--grad-brand)" }}
      />

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
            className="lg:hidden overflow-hidden border-t"
            style={{
              background: "rgba(15,17,23,0.96)",
              backdropFilter: "blur(20px)",
              borderColor: "var(--border)",
            }}
          >
            <div className="px-5 py-5 flex flex-col gap-1">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-3 rounded-lg text-[15px] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-[color:var(--bg-elevated)]"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <div className="h-px my-2" style={{ background: "var(--border)" }} />

              {/* Mobile language toggle */}
              <button
                onClick={() => setLang(lang === "en" ? "ur" : "en")}
                className="px-3 py-3 text-left text-[14px] font-semibold"
                style={{ color: "var(--brand)" }}
              >
                🌐 {t("nav.lang_toggle")}
              </button>

              <a
                href="tel:0300878223"
                className="flex items-center gap-2 px-3 py-3 text-[14px] font-mono"
                style={{ color: "var(--brand)" }}
              >
                <Phone className="w-4 h-4" />
                0300-USTAAD
              </a>
              {isSignedIn ? (
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 text-[15px] text-[color:var(--text-primary)]"
                >
                  {t("nav.dashboard")}
                </Link>
              ) : (
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 text-[15px] text-[color:var(--text-primary)]"
                >
                  {t("nav.sign_in")}
                </Link>
              )}
              <Link
                href={isSignedIn ? "/post-job" : "/sign-up"}
                onClick={() => setOpen(false)}
                className="mt-2 px-5 py-3 text-center text-[15px] font-semibold rounded-full text-white"
                style={{ background: "var(--grad-brand)" }}
              >
                {isSignedIn ? t("nav.post_job") : t("nav.sign_up")} →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
