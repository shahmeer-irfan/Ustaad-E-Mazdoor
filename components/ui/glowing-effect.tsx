"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GlowingEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  proximity?: number;
}

export function GlowingEffect({
  className,
  disabled = false,
  proximity = 48,
  ...props
}: GlowingEffectProps) {
  if (disabled) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100",
        className
      )}
      style={{
        background: `radial-gradient(${proximity}% ${proximity}% at 50% 50%, #A855F7 0%, #7C3AED 32%, #5B21B6 66%, #C4B5FD 100%)`,
      }}
      {...props}
    />
  );
}

export default GlowingEffect;
