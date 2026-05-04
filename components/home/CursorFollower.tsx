"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorFollower() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const [hovered, setHovered] = useState<"link" | "text" | null>(null);

  // Heavy spring for the trailing ring; stiff for the dot
  const dotX  = useSpring(x, { stiffness: 700, damping: 40, mass: 0.4 });
  const dotY  = useSpring(y, { stiffness: 700, damping: 40, mass: 0.4 });
  const ringX = useSpring(x, { stiffness: 140, damping: 18, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 140, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 1024px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.closest("a, button, [data-cursor='link']")) setHovered("link");
      else if (t.closest("h1, h2, h3, [data-cursor='text']")) setHovered("text");
      else setHovered(null);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  // Hide on touch / small screens
  if (typeof window !== "undefined" && window.matchMedia("(max-width: 1024px)").matches) {
    return null;
  }

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[200] mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full"
          animate={{
            width:  hovered === "link" ? 64 : hovered === "text" ? 96 : 36,
            height: hovered === "link" ? 64 : hovered === "text" ? 96 : 36,
            borderColor:
              hovered === "link" ? "#fdba74" : "rgba(255,255,255,0.7)",
            opacity: hovered ? 0.85 : 0.6,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          style={{
            border: "1.5px solid",
          }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[200] mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full bg-white"
          animate={{
            width:  hovered === "link" ? 0  : hovered === "text" ? 0 : 6,
            height: hovered === "link" ? 0  : hovered === "text" ? 0 : 6,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
        />
      </motion.div>
    </>
  );
}
