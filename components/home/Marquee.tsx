"use client";

import type { ReactNode } from "react";

type Props = {
  speed?: "slow" | "normal" | "fast";
  reverse?: boolean;
  className?: string;
  children: ReactNode;
};

export default function Marquee({
  speed = "normal",
  reverse = false,
  className = "",
  children,
}: Props) {
  const cls =
    reverse
      ? "marquee-reverse"
      : speed === "slow"
      ? "marquee-slow"
      : speed === "fast"
      ? "marquee-fast"
      : "marquee-track";

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className={`flex whitespace-nowrap will-change-transform ${cls}`}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
