"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "./data";

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const t = testimonials[idx];

  // Auto rotate
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, []);

  const go = (dir: 1 | -1) =>
    setIdx((i) => (i + dir + testimonials.length) % testimonials.length);

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "var(--border)" }} />
      <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: "var(--border)" }} />

      {/* Marquee city ribbon */}
      <div className="absolute inset-x-0 top-0 h-12 overflow-hidden opacity-[0.07] pointer-events-none">
        <div className="marquee-track flex whitespace-nowrap text-[64px] font-extrabold tracking-tighter">
          {Array(2).fill(0).map((_, k) => (
            <span key={k} className="flex">
              {["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"].map(c => (
                <span key={c + k} className="px-8" style={{ color: "var(--text-primary)" }}>{c} ✦</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 font-mono"
                style={{ color: "var(--brand)" }}>
            — Testimonials
          </span>
          <h2 className="text-section">Log Kya Kehte Hain</h2>
          <p className="mt-3 text-[16px]" style={{ color: "var(--text-secondary)" }}>
            Pakistan bhar se asli stories — workers, clients, businesses.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-3xl p-8 sm:p-12 ring-soft"
               style={{ background: "var(--bg-card)" }}>
            <Quote
              className="absolute -top-6 left-8 w-12 h-12 p-2.5 rounded-2xl"
              style={{ background: "var(--bg)", color: "var(--brand)", boxShadow: "inset 0 0 0 1px var(--border)" }}
            />

            <AnimatePresence mode="wait">
              <motion.blockquote
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-[19px] sm:text-[22px] leading-relaxed font-medium mb-8"
                style={{ color: "var(--text-primary)" }}
              >
                "{t.quote}"
              </motion.blockquote>
            </AnimatePresence>

            <div className="flex items-center justify-between gap-4 flex-wrap">
              <AnimatePresence mode="wait">
                <motion.div
                  key={idx + "-meta"}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-[14px]"
                       style={{ background: `linear-gradient(135deg, ${t.accent}, var(--brand))` }}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-[15px]">{t.name}</div>
                    <div className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                      {t.role} · {t.city}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous"
                  className="w-10 h-10 rounded-full flex items-center justify-center ring-soft hover:ring-soft-bright transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white transition"
                  style={{ background: "var(--grad-brand)" }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Pager dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === idx ? 28 : 8,
                  background: i === idx ? "var(--brand)" : "var(--border-bright)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
