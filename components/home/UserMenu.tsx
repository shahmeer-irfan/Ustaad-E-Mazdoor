"use client";

/**
 * UserMenu — avatar dropdown shown in the Navbar when a user is signed in.
 *
 * Provides three things the previous build didn't have:
 *   1. A visible Sign Out action (Clerk's useClerk().signOut)
 *   2. A "Switch to Freelancer / Customer" toggle (POSTs /api/profile/switch-role)
 *   3. A direct link to /dashboard
 *
 * The current role is fetched once on mount via GET /api/profile/switch-role.
 * After a successful switch we hard-reload so every server component picks
 * up the new role (cheaper than threading a context everywhere).
 */

import { useEffect, useRef, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  LogOut,
  ArrowLeftRight,
  ChevronDown,
  Loader2,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type Role = "client" | "freelancer";

export default function UserMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { t } = useLanguage();

  const [open, setOpen]     = useState(false);
  const [role, setRole]     = useState<Role | null>(null);
  const [busy, setBusy]     = useState(false);
  const [toast, setToast]   = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Fetch current role once
  useEffect(() => {
    let alive = true;
    fetch("/api/profile/switch-role")
      .then(r => (r.ok ? r.json() : null))
      .then(j => { if (alive && j?.role) setRole(j.role as Role); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  // Click-away close
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  const initials =
    (user?.firstName?.[0] ?? user?.username?.[0] ?? user?.primaryEmailAddress?.emailAddress?.[0] ?? "U")
      .toUpperCase();

  const displayName =
    user?.fullName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "Account";

  async function handleSwitchRole() {
    setBusy(true);
    try {
      const res = await fetch("/api/profile/switch-role", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "switch failed");
      setRole(data.role as Role);
      setToast({
        kind: "ok",
        msg: data.role === "freelancer" ? t("nav.role_switched_to_f") : t("nav.role_switched_to_c"),
      });
      // Hard refresh so server components re-render with the new role
      setTimeout(() => window.location.reload(), 600);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t("nav.role_switch_failed");
      setToast({ kind: "err", msg });
    } finally {
      setBusy(false);
      setOpen(false);
    }
  }

  async function handleSignOut() {
    setOpen(false);
    await signOut({ redirectUrl: "/" });
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(s => !s)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("nav.account")}
        data-cursor="link"
        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-colors hover:bg-[color:var(--bg-elevated)]"
        style={{ boxShadow: "inset 0 0 0 1px var(--border)" }}
      >
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[12px] font-bold"
          style={{ background: "var(--grad-brand)", fontFamily: "var(--font-display)" }}
        >
          {initials}
        </span>
        <span className="text-[13px] font-medium hidden xl:inline" style={{ color: "var(--text-primary)" }}>
          {displayName}
        </span>
        <ChevronDown
          className="w-3.5 h-3.5 transition-transform"
          style={{
            color: "var(--text-secondary)",
            transform: open ? "rotate(180deg)" : "none",
          }}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute right-0 top-[calc(100%+8px)] w-[260px] rounded-2xl overflow-hidden z-[120]"
            style={{
              background: "rgba(15,17,23,0.95)",
              backdropFilter: "blur(18px)",
              boxShadow:
                "inset 0 0 0 1px var(--border-bright), " +
                "0 24px 50px -12px rgba(0,0,0,0.6)",
            }}
          >
            {/* Identity header */}
            <div className="px-4 py-3.5 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[14px] font-bold"
                  style={{ background: "var(--grad-brand)", fontFamily: "var(--font-display)" }}
                >
                  {initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                    {displayName}
                  </div>
                  <div className="text-[11.5px] font-mono truncate" style={{ color: "var(--text-muted)" }}>
                    {user?.primaryEmailAddress?.emailAddress ?? ""}
                  </div>
                </div>
              </div>

              {/* Current role badge */}
              {role && (
                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-mono uppercase tracking-[0.12em] font-bold"
                     style={{
                       color: "var(--brand)",
                       background: "var(--brand-dim)",
                       boxShadow: "inset 0 0 0 1px rgba(249,115,22,0.3)",
                     }}>
                  <UserIcon className="w-3 h-3" />
                  {role === "freelancer" ? t("nav.role_freelancer") : t("nav.role_client")}
                </div>
              )}
            </div>

            {/* Items */}
            <ul className="py-1.5">
              <li>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  role="menuitem"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] transition-colors hover:bg-[color:var(--bg-elevated)]"
                  style={{ color: "var(--text-primary)" }}
                >
                  <LayoutDashboard className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
                  {t("nav.dashboard")}
                </Link>
              </li>

              <li>
                <button
                  type="button"
                  onClick={handleSwitchRole}
                  disabled={busy || !role}
                  role="menuitem"
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] transition-colors hover:bg-[color:var(--bg-elevated)] disabled:opacity-60"
                  style={{ color: "var(--text-primary)" }}
                >
                  {busy ? (
                    <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--brand)" }} />
                  ) : (
                    <ArrowLeftRight className="w-4 h-4" style={{ color: "var(--brand)" }} />
                  )}
                  {role === "freelancer"
                    ? t("nav.switch_to_client")
                    : t("nav.switch_to_freelancer")}
                </button>
              </li>

              <li className="my-1 mx-3 h-px" style={{ background: "var(--border)" }} />

              <li>
                <button
                  type="button"
                  onClick={handleSignOut}
                  role="menuitem"
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] transition-colors hover:bg-[rgba(239,68,68,0.08)]"
                  style={{ color: "#fca5a5" }}
                >
                  <LogOut className="w-4 h-4" />
                  {t("nav.sign_out")}
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[80px] right-5 z-[200] max-w-[340px] px-4 py-3 rounded-xl text-[13px] leading-snug"
            style={{
              background: toast.kind === "ok" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
              color:      toast.kind === "ok" ? "#86efac"               : "#fca5a5",
              boxShadow: `inset 0 0 0 1px ${toast.kind === "ok" ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`,
              backdropFilter: "blur(18px)",
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
