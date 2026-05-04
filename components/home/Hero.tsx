"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MapPin, Wrench, ArrowRight, ChevronDown, Check, Sparkles } from "lucide-react";
import { cities, categories } from "./data";

const line1 = ["Ghar", "ka", "Kaam", "Ho", "Ya"];
const line2 = ["Business", "—", "Ustaad", "Hai!"];

export default function Hero() {
  const root        = useRef<HTMLDivElement>(null);
  const badge       = useRef<HTMLDivElement>(null);
  const subline     = useRef<HTMLParagraphElement>(null);
  const search      = useRef<HTMLDivElement>(null);
  const trust       = useRef<HTMLDivElement>(null);
  const glow        = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Safety: if GSAP fails to run for any reason, reveal the words after 2s.
    const fallback = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>(
        ".hero-word-1 .word-mask > span, .hero-word-2 .word-mask > span"
      ).forEach(el => { el.style.transform = "none"; });
    }, 2000);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1, defaults: { ease: "power3.out" } });

      tl.fromTo(badge.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5 }, 0);

      tl.fromTo(".hero-word-1 .word-mask > span",
        { yPercent: 110 },
        { yPercent: 0, duration: 0.85, stagger: 0.06 }, 0.18);

      tl.fromTo(".hero-word-2 .word-mask > span",
        { yPercent: 110 },
        { yPercent: 0, duration: 0.85, stagger: 0.06 }, 0.42);

      tl.fromTo(subline.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.65 }, 0.78);

      tl.fromTo(search.current,
        { opacity: 0, y: 24, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.4)" }, 0.95);

      tl.fromTo(".trust-chip",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, 1.18);

      tl.fromTo(".scroll-cue",
        { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.3);

      tl.fromTo(glow.current,
        { scale: 1, opacity: 0.7 },
        { scale: 1.12, opacity: 1, duration: 1.3, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0);
    }, root);

    return () => {
      window.clearTimeout(fallback);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative min-h-[100svh] pt-[120px] pb-20 overflow-hidden flex items-center"
    >
      {/* Background layers */}
      <div ref={glow} className="absolute inset-0 -z-10 bg-grad-hero" />
      <div className="absolute inset-0 -z-10 hero-grid" />
      <div className="absolute inset-0 -z-10 hero-noise pointer-events-none" />

      {/* Brand-orange ambient orbs */}
      <div
        aria-hidden
        className="absolute -z-10 -top-32 left-1/2 -translate-x-1/2 w-[820px] h-[820px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(249,115,22,0.18), transparent)" }}
      />
      <div
        aria-hidden
        className="absolute -z-10 top-[40%] -left-32 w-[420px] h-[420px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(59,130,246,0.10), transparent)" }}
      />
      <div
        aria-hidden
        className="absolute -z-10 top-[30%] -right-24 w-[360px] h-[360px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(168,85,247,0.10), transparent)" }}
      />

      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 w-full">
        <div className="text-center max-w-[920px] mx-auto">
          {/* Pill badge */}
          <div ref={badge} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-7 ring-soft"
               style={{ background: "var(--brand-dim)", color: "var(--brand)", borderColor: "rgba(249,115,22,0.25)" }}>
            <span className="text-[14px]">🇵🇰</span>
            <span className="text-[12.5px] font-semibold tracking-wide font-mono">10,000+ Verified Workers Across Pakistan</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          {/* H1 */}
          <h1 className="text-hero font-extrabold mb-7">
            <span className="hero-word-1 block">
              {line1.map((w, i) => (
                <span key={i} className="word-mask mx-[0.18em]"><span>{w}</span></span>
              ))}
            </span>
            <span className="hero-word-2 block">
              {line2.map((w, i) => {
                const isBrand = w === "Ustaad" || w === "Hai!";
                return (
                  <span key={i} className="word-mask mx-[0.18em]">
                    <span className={isBrand ? "text-grad-brand" : ""}>{w}</span>
                  </span>
                );
              })}
            </span>
          </h1>

          {/* Subline */}
          <p
            ref={subline}
            className="text-[16px] sm:text-[18px] leading-relaxed max-w-[640px] mx-auto mb-9"
            style={{ color: "var(--text-secondary)" }}
          >
            Electrician, plumber, painter, mechanic — sab kuch ek jagah.
            Verified professionals, transparent pricing, guaranteed satisfaction.
          </p>

          {/* Search bar */}
          <form
            ref={search as any}
            action="/browse-jobs"
            method="get"
            className="relative max-w-[760px] mx-auto"
          >
            <div
              className="flex items-stretch rounded-full bg-white text-slate-900 overflow-hidden shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.08)]"
              style={{ minHeight: 64 }}
            >
              {/* City selector */}
              <div className="flex items-center gap-2.5 pl-5 pr-3 flex-1 min-w-0 group">
                <MapPin className="w-[18px] h-[18px]" style={{ color: "var(--brand)" }} />
                <div className="flex flex-col leading-tight min-w-0">
                  <span className="text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500">Shehar</span>
                  <select
                    name="location"
                    className="bg-transparent outline-none font-semibold text-[14px] text-slate-900 truncate cursor-pointer"
                    defaultValue="Karachi"
                    aria-label="Select city"
                  >
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="w-px my-3 bg-slate-200" />

              {/* Service */}
              <div className="flex items-center gap-2.5 pl-3 pr-3 flex-1 min-w-0">
                <Wrench className="w-[18px] h-[18px]" style={{ color: "var(--brand)" }} />
                <div className="flex flex-col leading-tight min-w-0">
                  <span className="text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500">Kaam Ka Qism</span>
                  <select
                    name="category"
                    className="bg-transparent outline-none font-semibold text-[14px] text-slate-900 truncate cursor-pointer"
                    defaultValue="Electrician"
                    aria-label="Select service"
                  >
                    {categories.map(c => <option key={c.nameEn} value={c.nameEn}>{c.nameEn}</option>)}
                  </select>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn-shine flex items-center gap-2 px-6 sm:px-8 m-1.5 rounded-full text-white text-[14px] sm:text-[15px] font-semibold transition hover:brightness-110"
                style={{ background: "var(--grad-brand)" }}
                aria-label="Search"
              >
                Dhundho
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust chips */}
            <div ref={trust} className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px]"
                 style={{ color: "var(--text-secondary)" }}>
              {["Free to browse", "Verified professionals", "No hidden fees"].map(t => (
                <span key={t} className="trust-chip inline-flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" style={{ color: "var(--success)" }} />
                  {t}
                </span>
              ))}
            </div>
          </form>
        </div>

        {/* Scroll cue */}
        <div className="scroll-cue mt-16 flex flex-col items-center gap-2"
             style={{ color: "var(--text-muted)" }}>
          <span className="text-[10px] uppercase tracking-[0.22em] font-semibold">Scroll</span>
          <ChevronDown className="w-4 h-4 scroll-bounce" />
        </div>
      </div>
    </section>
  );
}
