"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { jobs } from "./data";

export default function FeaturedJobs() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(".job-card",
        { opacity: 0, y: 26 },
        {
          opacity: 1, y: 0, duration: 0.55, ease: "power2.out",
          stagger: 0.07,
          scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
        });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="py-24 lg:py-32 relative">
      {/* Soft band */}
      <div className="absolute inset-0 -z-10 pointer-events-none"
           style={{ background: "linear-gradient(180deg, transparent 0%, rgba(23,27,38,0.6) 50%, transparent 100%)" }} />

      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div className="max-w-2xl">
            <span className="inline-block text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 font-mono"
                  style={{ color: "var(--brand)" }}>
              — Live Jobs
            </span>
            <h2 className="text-section">Abhi Available Kaam</h2>
            <p className="mt-3 text-[16px]" style={{ color: "var(--text-secondary)" }}>
              In workers ki zaroorat hai aaj — abhi apply karo, jaldi reply lo.
            </p>
          </div>
          <a
            href="/browse-jobs"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold transition hover:gap-3"
            style={{ color: "var(--brand)" }}
          >
            Sab Kaam Dekho
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((j) => (
            <motion.article
              key={j.title}
              className="job-card group relative rounded-2xl p-6 flex flex-col cursor-pointer"
              style={{
                background: "var(--bg-card)",
                boxShadow: "inset 0 0 0 1px var(--border)",
              }}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 0 1px var(--brand), 0 24px 50px -16px var(--brand-glow)",
                }}
              />

              {/* Top row */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide"
                  style={{ background: `${j.categoryColor}1F`, color: j.categoryColor }}
                >
                  {j.category}
                </span>
                {j.urgent && (
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10.5px] font-bold uppercase tracking-[0.12em] font-mono"
                    style={{ background: "var(--brand-dim)", color: "var(--brand)" }}
                  >
                    <span className="pulse-dot" />
                    Urgent
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-[17px] font-semibold leading-snug mb-2.5">
                {j.title}
              </h3>

              {/* Description */}
              <p className="text-[14px] leading-relaxed clamp-2 mb-4"
                 style={{ color: "var(--text-secondary)" }}>
                {j.description}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-4 text-[12.5px] mb-5"
                   style={{ color: "var(--text-muted)" }}>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {j.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {j.posted}
                </span>
              </div>

              <div className="h-px mb-4" style={{ background: "var(--border)" }} />

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {j.tags.map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-md text-[11px] font-mono"
                        style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                    {t}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-auto flex items-end justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="inline-flex items-center gap-1.5 text-[11.5px]"
                        style={{ color: "var(--text-muted)" }}>
                    <Users className="w-3.5 h-3.5" />
                    {j.applicants} log apply kar chuke
                  </span>
                  <span className="font-mono font-bold text-[18px]"
                        style={{ color: "var(--text-primary)" }}>
                    {j.budget}
                    <span className="text-[11px] font-medium ml-1"
                          style={{ color: "var(--text-muted)" }}>
                      {j.budgetType === "fixed" ? "fixed" : "per hour"}
                    </span>
                  </span>
                </div>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-1 text-[13px] font-semibold px-4 py-2 rounded-full transition group/btn"
                  style={{
                    color: "var(--brand)",
                    boxShadow: "inset 0 0 0 1px var(--brand)",
                  }}
                >
                  Apply
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
