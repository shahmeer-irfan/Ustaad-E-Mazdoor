"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Star, BadgeCheck, Clock, Briefcase, ArrowRight } from "lucide-react";
import { freelancers } from "./data";

export default function TopFreelancers() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(".pro-card",
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.55, ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
        });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="py-24 lg:py-32 relative">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 font-mono"
                style={{ color: "var(--brand)" }}>
            — Trusted Pros
          </span>
          <h2 className="text-section">Trusted Professionals</h2>
          <p className="mt-3 text-[16px]" style={{ color: "var(--text-secondary)" }}>
            Pakistan ke sab se zyada reviewed workers — har ek verified, har ek rated.
          </p>
        </div>

        {/* Grid on desktop, horizontal scroll on mobile */}
        <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 flex md:overflow-visible overflow-x-auto no-scrollbar gap-4 -mx-5 px-5 lg:mx-0 lg:px-0 snap-x snap-mandatory">
          {freelancers.map((f) => (
            <motion.article
              key={f.name}
              className="pro-card group relative rounded-2xl p-6 cursor-pointer min-w-[300px] md:min-w-0 snap-start flex flex-col"
              style={{
                background: "var(--bg-card)",
                boxShadow: "inset 0 0 0 1px var(--border)",
              }}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 0 1px var(--brand), 0 24px 50px -16px var(--brand-glow)",
                }}
              />

              {/* Top: avatar + verified badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="relative w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-[16px] tracking-wide"
                    style={{
                      background: `linear-gradient(135deg, ${f.accent}, var(--brand))`,
                      boxShadow: `0 8px 22px -10px ${f.accent}80`,
                    }}
                  >
                    {f.initials}
                    {f.verified && (
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: "var(--bg)" }}>
                        <BadgeCheck className="w-5 h-5" style={{ color: "var(--brand)" }} />
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="text-[15.5px] font-semibold leading-tight">{f.name}</div>
                    <div className="text-[13px]" style={{ color: "var(--text-secondary)" }}>{f.role}</div>
                    <div className="text-[12px] inline-flex items-center gap-1 mt-1"
                         style={{ color: "var(--text-muted)" }}>
                      <MapPin className="w-3 h-3" />
                      {f.location}
                    </div>
                  </div>
                </div>
                {f.badge && (
                  <span
                    className="px-2.5 py-1 rounded-md text-[10.5px] font-bold uppercase tracking-[0.1em] whitespace-nowrap"
                    style={{ background: "var(--brand-dim)", color: "var(--brand)" }}
                  >
                    {f.badge}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4 star-row">
                <div className="flex">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5"
                      style={{ color: i < Math.round(f.rating) ? "var(--brand)" : "var(--border-bright)" }}
                      fill="currentColor"
                    />
                  ))}
                </div>
                <span className="text-[13px] font-mono font-semibold">{f.rating}</span>
                <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                  ({f.reviews} reviews)
                </span>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-2 mb-5 flex-wrap">
                <span
                  className="inline-flex items-center gap-1.5 text-[11.5px] px-2.5 py-1 rounded-md font-mono"
                  style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
                >
                  <Briefcase className="w-3 h-3" />
                  {f.completedJobs} jobs
                </span>
                <span
                  className="inline-flex items-center gap-1.5 text-[11.5px] px-2.5 py-1 rounded-md font-mono"
                  style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
                >
                  <Clock className="w-3 h-3" />
                  {f.responseTime}
                </span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {f.skills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-md text-[11px] font-mono"
                        style={{ background: `${f.accent}15`, color: f.accent }}>
                    {s}
                  </span>
                ))}
              </div>

              <div className="h-px mb-4" style={{ background: "var(--border)" }} />

              {/* Footer */}
              <div className="mt-auto flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-[0.12em]"
                        style={{ color: "var(--text-muted)" }}>
                    Starting from
                  </span>
                  <span className="font-mono font-bold text-[16px]">{f.rate}</span>
                </div>
                <button
                  className="btn-shine inline-flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-full text-white transition"
                  style={{ background: "var(--grad-brand)", boxShadow: "0 6px 18px -6px var(--brand-glow)" }}
                >
                  Hire Now
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
