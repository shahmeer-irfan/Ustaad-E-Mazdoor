"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Search, BadgeDollarSign, FileEdit, Inbox, Handshake } from "lucide-react";
import { workerSteps, clientSteps } from "./data";

const tabs = [
  { id: "workers", label: "Kaam Dhundhne Wale", sub: "For Workers" },
  { id: "clients", label: "Kaam Dene Wale",     sub: "For Clients" },
] as const;

const workerIcons = [UserPlus, Search, BadgeDollarSign];
const clientIcons = [FileEdit, Inbox, Handshake];

export default function HowItWorks() {
  const [tab, setTab] = useState<typeof tabs[number]["id"]>("workers");
  const data = tab === "workers" ? workerSteps : clientSteps;
  const Icons = tab === "workers" ? workerIcons : clientIcons;

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Subtle band */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "var(--border)" }} />

      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 font-mono"
                style={{ color: "var(--brand)" }}>
            — Process
          </span>
          <h2 className="text-section">Sirf 3 Qadmon Mein Shuru Karo</h2>
          <p className="mt-3 text-[16px]" style={{ color: "var(--text-secondary)" }}>
            Complex nahi — bilkul seedha. Sign up se lekar payment tak, har step transparent.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-14">
          <div
            role="tablist"
            className="inline-flex p-1 rounded-full ring-soft"
            style={{ background: "var(--bg-card)" }}
          >
            {tabs.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className={`relative px-5 sm:px-7 py-2.5 rounded-full text-[13px] sm:text-[14px] font-semibold transition-colors ${
                    active ? "text-white" : "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="how-tab-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: "var(--grad-brand)", boxShadow: "0 6px 18px -6px var(--brand-glow)" }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative"
          >
            {/* Dotted connector — desktop only */}
            <svg
              className="hidden md:block step-line absolute left-[16.66%] right-[16.66%] top-[64px]"
              height="2"
              preserveAspectRatio="none"
              viewBox="0 0 600 2"
              aria-hidden
            >
              <path d="M 0 1 L 600 1" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>

            <div className="grid md:grid-cols-3 gap-5 md:gap-6 relative">
              {data.map((s, i) => {
                const Icon = Icons[i];
                return (
                  <motion.div
                    key={s.num}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * i, duration: 0.5, ease: "easeOut" }}
                    className="relative rounded-2xl p-7 sm:p-8 ring-soft"
                    style={{ background: "var(--bg-card)" }}
                  >
                    {/* Step number background */}
                    <span
                      className="absolute right-5 top-4 font-mono font-extrabold leading-none select-none pointer-events-none"
                      style={{ fontSize: "64px", color: "var(--brand-dim)", letterSpacing: "-0.04em" }}
                    >
                      {s.num}
                    </span>

                    {/* Icon medallion */}
                    <div
                      className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-5 z-[1]"
                      style={{ background: "var(--brand-dim)", color: "var(--brand)" }}
                    >
                      <Icon className="w-[22px] h-[22px]" />
                      {/* tiny dot to anchor connector */}
                      <span className="absolute -right-2 -top-2 w-3 h-3 rounded-full"
                            style={{ background: "var(--brand)", boxShadow: "0 0 0 4px var(--bg)" }} />
                    </div>

                    <h3 className="text-card-title mb-2">{s.title}</h3>
                    <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {s.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
