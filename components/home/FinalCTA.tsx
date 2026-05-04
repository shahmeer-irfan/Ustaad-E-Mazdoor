"use client";

import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Search } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative rounded-[28px] overflow-hidden p-10 sm:p-16 lg:p-20 ring-soft"
          style={{
            background:
              "radial-gradient(ellipse 80% 100% at 0% 100%, rgba(249,115,22,0.18), transparent 60%)," +
              "radial-gradient(ellipse 60% 80% at 100% 0%, rgba(249,115,22,0.10), transparent 60%)," +
              "var(--bg-card)",
          }}
        >
          {/* Decorative grid */}
          <div className="absolute inset-0 hero-grid opacity-50 pointer-events-none" />
          {/* Accent ring */}
          <div className="absolute -bottom-20 -right-20 w-[420px] h-[420px] rounded-full pointer-events-none"
               style={{ background: "radial-gradient(closest-side, rgba(249,115,22,0.25), transparent)" }} />

          <div className="relative grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11.5px] font-mono font-semibold mb-5"
                    style={{ background: "var(--brand-dim)", color: "var(--brand)" }}>
                <span className="pulse-dot" />
                Aaj 247 naye kaam post hue
              </span>
              <h2 className="text-hero" style={{ fontSize: "clamp(36px, 5.5vw, 64px)" }}>
                Pakistan ka <br />
                <span className="text-grad-brand">Apna Kaam</span> ka Platform.
              </h2>
              <p className="mt-5 text-[16px] sm:text-[17px] leading-relaxed max-w-[520px]"
                 style={{ color: "var(--text-secondary)" }}>
                Sign up free hai. Verification 24 ghante mein. Pehla kaam aaj hi shuru ho sakta hai —
                bus ek click ki dair hai.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/sign-up"
                  className="btn-shine inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-white text-[15px] font-semibold transition hover:-translate-y-0.5"
                  style={{ background: "var(--grad-brand)", boxShadow: "0 12px 30px -10px var(--brand-glow)" }}
                >
                  <Briefcase className="w-4 h-4" />
                  Worker Sign Up
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="/post-job"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[15px] font-semibold transition hover:-translate-y-0.5"
                  style={{
                    color: "var(--text-primary)",
                    background: "var(--bg-elevated)",
                    boxShadow: "inset 0 0 0 1px var(--border-bright)",
                  }}
                >
                  <Search className="w-4 h-4" />
                  Kaam Post Karo
                </a>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-2 text-[13px]"
                   style={{ color: "var(--text-muted)" }}>
                <span>✓ No credit card required</span>
                <span>✓ Cancel anytime</span>
                <span>✓ 24/7 Roman Urdu support</span>
              </div>
            </div>

            {/* Right: stat tiles */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              {[
                { num: "10K+", label: "Verified workers" },
                { num: "98%",  label: "Satisfaction rate" },
                { num: "30m",  label: "Avg response time" },
                { num: "24/7", label: "Roman Urdu support" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl p-5 ring-soft relative"
                  style={{ background: "rgba(15,17,23,0.6)" }}
                >
                  <div className="font-mono text-[28px] font-bold leading-none"
                       style={{ color: "var(--brand)" }}>
                    {s.num}
                  </div>
                  <div className="mt-2 text-[12.5px] uppercase tracking-[0.1em] font-semibold"
                       style={{ color: "var(--text-secondary)" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
