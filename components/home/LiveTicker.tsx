"use client";

import Marquee from "./Marquee";

const items = [
  { icon: "⚡", label: "Wiring repair · DHA Phase 5, Karachi · 12 min ago" },
  { icon: "🔧", label: "Tap leak fix · Gulberg, Lahore · 27 min ago" },
  { icon: "🎨", label: "3-room paint · F-10, Islamabad · 1 hr ago" },
  { icon: "❄️", label: "AC service booked · North Nazimabad · 2 hr ago" },
  { icon: "🪚", label: "Wardrobe install · Bahria Town · 3 hr ago" },
  { icon: "🧹", label: "Office deep clean · Blue Area · 5 hr ago" },
  { icon: "🔌", label: "Geyser repair · Clifton · 6 hr ago" },
  { icon: "🌱", label: "Garden trim · Defence, Lahore · today" },
];

export default function LiveTicker() {
  return (
    <div
      className="relative border-y"
      style={{
        borderColor: "var(--border)",
        background:
          "linear-gradient(90deg, var(--bg) 0%, var(--bg-card) 50%, var(--bg) 100%)",
      }}
    >
      <Marquee speed="slow">
        {items.map((it, i) => (
          <span
            key={`a-${i}`}
            className="inline-flex items-center gap-3 px-7 py-3.5 text-[12.5px] font-mono"
            style={{ color: "var(--text-secondary)" }}
          >
            <span className="text-[15px]">{it.icon}</span>
            {it.label}
            <span className="opacity-30 mx-2" style={{ color: "var(--brand)" }}>✦</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
