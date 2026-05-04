"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stats = [
  { value: 10000, suffix: "+", label: "Registered Workers",   key: "workers" },
  { value: 500,   suffix: "+", label: "Businesses Served",    key: "biz" },
  { value: 50,    suffix: "+", label: "Pakistani Cities",     key: "cities" },
  { value: 98,    suffix: "%", label: "Client Satisfaction",  key: "sat" },
];

const fmt = (n: number) =>
  n >= 1000 ? n.toLocaleString("en-US") : Math.round(n).toString();

export default function StatsBar() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(root.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
        });

      stats.forEach((s) => {
        const el = root.current!.querySelector<HTMLElement>(`[data-stat="${s.key}"]`);
        if (!el) return;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: s.value,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
          onUpdate: () => { el.textContent = fmt(obj.v) + s.suffix; },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative py-14 border-y" style={{ borderColor: "var(--border)" }}>
      <div className="absolute inset-0 -z-10 pointer-events-none"
           style={{ background: "linear-gradient(180deg, transparent, rgba(249,115,22,0.04), transparent)" }} />

      <div ref={root} className="max-w-[1280px] mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10">
          {stats.map((s, i) => (
            <div
              key={s.key}
              className={`flex flex-col items-center text-center px-4 ${
                i < stats.length - 1 ? "lg:border-r" : ""
              }`}
              style={{ borderColor: "var(--border)" }}
            >
              <span
                data-stat={s.key}
                className="font-mono font-bold tabular-nums"
                style={{ fontSize: "var(--text-xl)", color: "var(--brand)", lineHeight: 1 }}
              >
                0
              </span>
              <span className="mt-2 text-[13px] uppercase tracking-[0.14em] font-semibold"
                    style={{ color: "var(--text-secondary)" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
