"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stats = [
  { value: 10000, suffix: "+", label: "Verified workers",  detail: "CNIC + skill test" },
  { value: 500,   suffix: "+", label: "Businesses served", detail: "Karachi to Peshawar" },
  { value: 50,    suffix: "+", label: "Pakistani cities",  detail: "Live coverage" },
  { value: 98,    suffix: "%", label: "Satisfaction",      detail: "Across 12,000 jobs" },
];

const fmt = (n: number) =>
  n >= 1000 ? Math.round(n).toLocaleString("en-US") : Math.round(n).toString();

export default function StatsBar() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, margin: "-15%" });

  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start end", "end start"],
  });
  const bgX = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      stats.forEach((s) => {
        const el = root.current!.querySelector<HTMLElement>(`[data-stat="${s.label}"]`);
        if (!el) return;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: s.value,
          duration: 2.0,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
          onUpdate: () => { el.textContent = fmt(obj.v) + s.suffix; },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative py-20 lg:py-28 overflow-hidden border-b"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Sliding huge background word */}
      <motion.div
        aria-hidden
        style={{ x: bgX }}
        className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none select-none"
      >
        <span
          className="text-stroke font-extrabold tracking-[-0.05em] whitespace-nowrap opacity-[0.07]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(220px, 28vw, 460px)",
            lineHeight: 0.8,
          }}
        >
          BY THE NUMBERS
        </span>
      </motion.div>

      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex items-end justify-between gap-6 flex-wrap mb-12"
        >
          <div>
            <span
              className="inline-block text-[11px] uppercase tracking-[0.24em] font-mono mb-3"
              style={{ color: "var(--brand)" }}
            >
              ✦ §02 — Receipts
            </span>
            <h2 className="text-section max-w-[18ch]">
              Numbers don't lie.{" "}
              <span className="text-editorial-italic" style={{ color: "var(--brand)" }}>
                Trust does.
              </span>
            </h2>
          </div>
          <p
            className="max-w-md text-[15px] leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Real workers, real households, real businesses across Pakistan —
            tracked since day one.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.15 + i * 0.08,
                type: "spring",
                stiffness: 180,
                damping: 22,
              }}
              className={`flex flex-col ${i < 3 ? "lg:border-r" : ""}`}
              style={{ borderColor: "var(--border)" }}
            >
              <div className="px-2 lg:px-6">
                <span
                  data-stat={s.label}
                  className="block font-display tabular-nums leading-[0.9] tracking-[-0.05em]"
                  style={{
                    fontSize: "clamp(54px, 7vw, 96px)",
                    fontWeight: 800,
                    color: "var(--brand)",
                    fontVariationSettings: '"opsz" 96',
                  }}
                >
                  0
                </span>
                <div className="mt-3 flex items-center gap-2">
                  <span className="w-6 h-px" style={{ background: "var(--brand)" }} />
                  <span className="text-[13px] uppercase tracking-[0.16em] font-semibold"
                        style={{ color: "var(--text-primary)" }}>
                    {s.label}
                  </span>
                </div>
                <p className="mt-1 text-[12px] font-mono" style={{ color: "var(--text-muted)" }}>
                  {s.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
