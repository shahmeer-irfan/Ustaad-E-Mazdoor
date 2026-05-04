"use client";

import { useRef, type MouseEvent, type ReactNode, type CSSProperties } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type CommonProps = {
  className?: string;
  strength?: number;
  parallax?: number;
  children: ReactNode;
  style?: CSSProperties;
  ariaLabel?: string;
};

type AnchorProps = CommonProps & {
  as: "a";
  href: string;
  onClick?: () => void;
};

type ButtonProps = CommonProps & {
  as?: "button";
  type?: "button" | "submit";
  onClick?: () => void;
};

type Props = AnchorProps | ButtonProps;

export default function MagneticButton(props: Props) {
  const { className = "", strength = 26, parallax = 1.6, children, style, ariaLabel } = props;
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 260, damping: 18, mass: 0.6 });

  // Inner content slides further than the shell — gives a tactile, magnetic pull
  const ix = useTransform(sx, (v) => v * parallax);
  const iy = useTransform(sy, (v) => v * parallax);

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1024px)").matches) return;
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    mx.set(((e.clientX - cx) / r.width) * strength);
    my.set(((e.clientY - cy) / r.height) * strength);
  };
  const handleLeave = () => { mx.set(0); my.set(0); };

  const inner = (
    <motion.span style={{ x: ix, y: iy }} className="inline-flex items-center gap-2">
      {children}
    </motion.span>
  );

  if (props.as === "a") {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={props.href}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={props.onClick}
        aria-label={ariaLabel}
        whileTap={{ scale: 0.96 }}
        style={{ x: sx, y: sy, ...style }}
        className={className}
        data-cursor="link"
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={(props as ButtonProps).type ?? "button"}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={props.onClick}
      aria-label={ariaLabel}
      whileTap={{ scale: 0.96 }}
      style={{ x: sx, y: sy, ...style }}
      className={className}
      data-cursor="link"
    >
      {inner}
    </motion.button>
  );
}
