"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, MessageSquareWarning, Award } from "lucide-react";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Sab Workers Verified",
    desc: "CNIC verification, address check, aur skill test ke baad hi koi worker platform pe aata hai.",
    accent: "#22c55e",
  },
  {
    icon: Lock,
    title: "Escrow Payment",
    desc: "Aap ki payment hum hold karte hain. Kaam complete hone tak worker ko nahi milti — 100% safe.",
    accent: "#3b82f6",
  },
  {
    icon: MessageSquareWarning,
    title: "24/7 Dispute Support",
    desc: "Koi masla? WhatsApp, call, ya chat — hum 30 minutes mein response dete hain. Roman Urdu mein bhi.",
    accent: "#f59e0b",
  },
  {
    icon: Award,
    title: "Quality Guarantee",
    desc: "Kaam pasand nahi aaya? Hum free re-do karwate hain ya 100% paisa wapas — koi sawal nahi.",
    accent: "#8b5cf6",
  },
];

export default function TrustSafety() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse 90% 60% at 50% 50%, rgba(34,197,94,0.05), transparent 60%)",
        }}
      />

      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left: copy */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <span className="inline-block text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 font-mono"
                  style={{ color: "var(--brand)" }}>
              — Trust & Safety
            </span>
            <h2 className="text-section mb-5">
              Aap ka <span className="text-grad-brand">paisa</span> aur <span className="text-grad-brand">waqt</span> — dono safe hain.
            </h2>
            <p className="text-[16px] leading-relaxed mb-7"
               style={{ color: "var(--text-secondary)" }}>
              Pakistan ka asli masla trust ka hai. Ham ne is platform ko us tarah design kiya hai
              ke har transaction transparent ho, har worker verified ho, aur har masle ka hal ho —
              roman urdu mein bhi, English mein bhi.
            </p>

            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-3 rounded-xl ring-soft inline-flex items-center gap-3"
                   style={{ background: "var(--bg-card)" }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                     style={{ background: "var(--brand-dim)", color: "var(--brand)" }}>
                  <Award className="w-[18px] h-[18px]" />
                </div>
                <div className="leading-tight">
                  <div className="text-[12.5px]" style={{ color: "var(--text-secondary)" }}>SECP Registered</div>
                  <div className="text-[13.5px] font-semibold">Pakistan Compliant</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: pillars grid */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: 0.06 * i, duration: 0.5, ease: "easeOut" }}
                  className="relative rounded-2xl p-6 ring-soft overflow-hidden"
                  style={{ background: "var(--bg-card)" }}
                >
                  {/* Accent corner */}
                  <div
                    className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                    style={{ background: `${p.accent}25` }}
                  />
                  <div
                    className="relative w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${p.accent}1F`, color: p.accent }}
                  >
                    <Icon className="w-[22px] h-[22px]" />
                  </div>
                  <h3 className="text-[17px] font-semibold mb-2 relative">{p.title}</h3>
                  <p className="text-[14px] leading-relaxed relative"
                     style={{ color: "var(--text-secondary)" }}>
                    {p.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
