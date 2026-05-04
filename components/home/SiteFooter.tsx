"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const linkGroups = [
  {
    heading: "Workers Ke Liye",
    links: [
      { label: "Profile Banao",     href: "#" },
      { label: "Kaam Dhundo",       href: "#" },
      { label: "Skill Test",        href: "#" },
      { label: "Payment & Fees",    href: "#" },
    ],
  },
  {
    heading: "Clients Ke Liye",
    links: [
      { label: "Kaam Post Karo",    href: "#" },
      { label: "Talent Dhundo",     href: "#" },
      { label: "Pricing",           href: "#" },
      { label: "Business Plans",    href: "#" },
    ],
  },
  {
    heading: "Ustaad",
    links: [
      { label: "Hum Kon Hain",      href: "#" },
      { label: "Careers",           href: "#" },
      { label: "Press & Media",     href: "#" },
      { label: "Blog",              href: "#" },
    ],
  },
  {
    heading: "Madad",
    links: [
      { label: "Help Center",       href: "#" },
      { label: "Trust & Safety",    href: "#" },
      { label: "Terms",             href: "#" },
      { label: "Privacy",           href: "#" },
    ],
  },
];

const socials = [
  { Icon: Facebook,  href: "#", label: "Facebook"  },
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Twitter,   href: "#", label: "Twitter"   },
  { Icon: Youtube,   href: "#", label: "YouTube"   },
];

export default function SiteFooter() {
  return (
    <footer className="relative pt-20 pb-10 border-t" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
        {/* Top row */}
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Brand block */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center font-bold text-white"
                style={{ background: "var(--grad-brand)" }}
              >
                U
              </div>
              <span className="text-[20px] font-bold tracking-tight">Ustaad</span>
            </div>
            <p className="text-[14px] leading-relaxed mb-6 max-w-sm"
               style={{ color: "var(--text-secondary)" }}>
              Pakistan ka apna kaam ka platform. Verified workers, transparent pricing,
              guaranteed satisfaction — Karachi se Peshawar tak.
            </p>

            <div className="flex flex-col gap-2 text-[13px]"
                 style={{ color: "var(--text-secondary)" }}>
              <a href="tel:0300878223" className="inline-flex items-center gap-2 hover:text-[color:var(--brand)]">
                <Phone className="w-3.5 h-3.5" />
                <span className="font-mono">0300-USTAAD (878223)</span>
              </a>
              <a href="mailto:salam@ustaad.pk" className="inline-flex items-center gap-2 hover:text-[color:var(--brand)]">
                <Mail className="w-3.5 h-3.5" />
                salam@ustaad.pk
              </a>
              <span className="inline-flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                NIC, Plot 49, Korangi Creek, Karachi
              </span>
            </div>
          </div>

          {/* Link groups */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {linkGroups.map((g) => (
              <div key={g.heading}>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] mb-4 font-mono"
                     style={{ color: "var(--brand)" }}>
                  {g.heading}
                </div>
                <ul className="flex flex-col gap-2.5">
                  {g.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href}
                            className="text-[14px] transition hover:text-[color:var(--text-primary)]"
                            style={{ color: "var(--text-secondary)" }}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-14 pt-7 border-t flex flex-wrap items-center justify-between gap-4"
             style={{ borderColor: "var(--border)" }}>
          <div className="text-[12.5px]" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} Ustaad Technologies (Pvt) Ltd · Made in Pakistan 🇵🇰
          </div>

          <div className="flex items-center gap-1.5">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition hover:text-[color:var(--brand)]"
                style={{
                  color: "var(--text-secondary)",
                  background: "var(--bg-card)",
                  boxShadow: "inset 0 0 0 1px var(--border)",
                }}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
