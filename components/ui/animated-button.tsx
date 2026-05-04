"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps {
  href: string;
  label: string;
  className?: string;
  variant?: "primary" | "outline";
}

export function AnimatedButton({
  href,
  label,
  className,
  variant = "primary",
}: AnimatedButtonProps) {
  const isOutline = variant === "outline";

  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300",
        isOutline
          ? "border-2 border-(--brand-purple) bg-transparent text-(--brand-purple) hover:text-white"
          : "bg-(--brand-purple) text-white hover:bg-(--brand-purple-dark)",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-(--brand-purple) opacity-0 transition-all duration-500 group-hover:left-full group-hover:opacity-100",
          isOutline && "bg-(--brand-purple-dark)"
        )}
      />
      <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
        {label}
      </span>
    </Link>
  );
}

export default AnimatedButton;
