"use client";

import { ArrowRight, Building2, BriefcaseBusiness, MapPin } from "lucide-react";
import AnimatedButton from "@/components/ui/animated-button";
import GlowingEffect from "@/components/ui/glowing-effect";

export default function Hero2() {
  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-linear-to-b from-surface/70 to-transparent" />
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl animate-fade-in text-center">
          <p className="text-label text-(--text-muted)">Pakistan ka #1 Kaam ka Platform</p>
          <h1 className="mt-4 text-display text-(--text-primary)">
            Apna Kaam Dhundo,
            <span className="block bg-linear-to-r from-(--brand-purple-dark) to-(--brand-purple-light) bg-clip-text text-transparent">
              Apni Team Banao
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-body-lg text-(--text-secondary)">
            Chahe aap electrician ho, designer ho, ya ghar ka kaam chahiye - Ustaad pe sab kuch milta hai. Fast. Trusted. Pakistani.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <div className="group relative inline-flex animate-pulse">
              <GlowingEffect className="opacity-80" disabled={false} proximity={48} />
              <AnimatedButton
                href="/browse-jobs"
                label="Abhi Shuru Karo ->"
                variant="primary"
                className="rounded-full px-7 py-3 text-base shadow-purple-md"
              />
              <ArrowRight className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
            </div>

            <AnimatedButton
              href="/freelancers"
              label="Kaam Post Karo"
              variant="outline"
              className="rounded-full px-7 py-3 text-base shadow-sm hover:shadow-purple-sm"
            />
          </div>

          <div className="mx-auto mt-12 flex max-w-3xl items-center justify-center divide-x divide-(--border) rounded-2xl border border-(--border) bg-(--surface) px-4 py-4">
            <div className="flex flex-1 items-center justify-center gap-2 px-3">
              <BriefcaseBusiness className="h-4 w-4 text-(--brand-purple)" />
              <div>
                <p className="text-small font-semibold text-(--text-primary)">10,000+ Registered Workers</p>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-center gap-2 px-3">
              <Building2 className="h-4 w-4 text-(--brand-purple)" />
              <div>
                <p className="text-small font-semibold text-(--text-primary)">500+ Companies</p>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-center gap-2 px-3">
              <MapPin className="h-4 w-4 text-(--brand-purple)" />
              <div>
                <p className="text-small font-semibold text-(--text-primary)">50+ Cities</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
