"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { categories } from "./data";

export default function CategoryGrid() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(".cat-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.55, ease: "power2.out",
          stagger: { each: 0.04, from: "start" },
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
        });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="py-24 lg:py-32 relative">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div className="max-w-2xl">
            <span className="inline-block text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 font-mono"
                  style={{ color: "var(--brand)" }}>
              — Categories
            </span>
            <h2 className="text-section">Kaam Ka Qism Chunein</h2>
            <p className="mt-3 text-[16px]" style={{ color: "var(--text-secondary)" }}>
              50+ shehron mein 12 categories ke skilled professionals — sab verified, sab transparent.
            </p>
          </div>
          <a
            href="/browse-jobs"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold transition hover:gap-3"
            style={{ color: "var(--brand)" }}
          >
            Sab Categories
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <motion.a
                key={c.nameEn}
                href={`/browse-jobs?category=${encodeURIComponent(c.nameEn)}`}
                className="cat-card group relative rounded-[14px] p-4 sm:p-5 cursor-pointer overflow-hidden"
                style={{
                  background: "var(--bg-card)",
                  boxShadow: "inset 0 0 0 1px var(--border)",
                }}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                {/* Hover accent layer */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(160% 110% at 0% 0%, ${c.color}18 0%, transparent 60%)`,
                    boxShadow: `inset 0 0 0 1px ${c.color}55`,
                  }}
                />

                {/* Icon tile */}
                <div
                  className="relative w-11 h-11 rounded-[10px] flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-105"
                  style={{
                    background: `${c.color}1F`,
                    color: c.color,
                  }}
                >
                  <Icon className="w-[22px] h-[22px]" strokeWidth={2} />
                </div>

                {/* Name */}
                <div className="relative">
                  <div
                    className="text-[15px] font-semibold mb-0.5 leading-tight"
                    style={{ fontFamily: "var(--font-jakarta)" }}
                    dir="rtl"
                    lang="ur"
                  >
                    {c.nameUr}
                  </div>
                  <div className="text-[13px] mb-3" style={{ color: "var(--text-secondary)" }}>
                    {c.nameEn}
                  </div>
                  <div className="text-[11px] font-mono font-semibold tracking-wide"
                       style={{ color: "var(--brand)" }}>
                    {c.jobs} kaam available
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
