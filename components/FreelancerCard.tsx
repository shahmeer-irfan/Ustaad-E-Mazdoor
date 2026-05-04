import { Star, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

interface FreelancerCardProps {
  id: string;
  name: string;
  title: string;
  location: string;
  rating: number;
  reviews: number;
  skills: string[];
  hourlyRate: string;
  avatar?: string;
}

const FreelancerCard = ({
  id,
  name,
  title,
  location,
  rating,
  reviews,
  skills,
  hourlyRate,
  avatar,
}: FreelancerCardProps) => {
  return (
    <div
      className="group h-full rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 ease-out hover:-translate-y-1"
      style={{
        background: "var(--bg-card)",
        boxShadow: "inset 0 0 0 1px var(--border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "inset 0 0 0 1px var(--brand), 0 24px 50px -16px var(--brand-glow)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "inset 0 0 0 1px var(--border)";
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="h-14 w-14 shrink-0 rounded-full flex items-center justify-center text-white font-bold text-[16px]"
          style={{
            background: "var(--grad-brand)",
            boxShadow: "0 8px 22px -10px var(--brand-glow)",
          }}
        >
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            (name || "?").charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="truncate text-[16px] font-semibold leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {name}
          </h3>
          <p
            className="text-[13.5px] truncate"
            style={{ color: "var(--text-secondary)" }}
          >
            {title}
          </p>
          <div
            className="mt-1 inline-flex items-center text-[12.5px] gap-1"
            style={{ color: "var(--text-muted)" }}
          >
            <MapPin className="h-3 w-3" />
            {location}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 star-row">
        <div className="flex">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star
              key={i}
              className="w-3.5 h-3.5"
              style={{
                color:
                  i < Math.round(Number(rating) || 0)
                    ? "var(--brand)"
                    : "var(--border-bright)",
              }}
              fill="currentColor"
            />
          ))}
        </div>
        <span
          className="text-[13px] font-mono font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {rating}
        </span>
        <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
          ({reviews} reviews)
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {skills.slice(0, 3).map((skill: string) => (
          <span
            key={skill}
            className="rounded-md px-2 py-0.5 text-[11px] font-mono"
            style={{ background: "var(--brand-dim)", color: "var(--brand)" }}
          >
            {skill}
          </span>
        ))}
        {skills.length > 3 && (
          <span
            className="rounded-md px-2 py-0.5 text-[11px] font-mono"
            style={{
              background: "var(--bg-elevated)",
              color: "var(--text-secondary)",
            }}
          >
            +{skills.length - 3} more
          </span>
        )}
      </div>

      <div className="h-px mt-auto" style={{ background: "var(--border)" }} />

      <div className="flex items-center justify-between gap-3">
        <div className="leading-tight">
          <p
            className="text-[10.5px] uppercase tracking-[0.12em] font-semibold"
            style={{ color: "var(--text-muted)" }}
          >
            Starting at
          </p>
          <p
            className="font-mono font-bold text-[15.5px]"
            style={{ color: "var(--text-primary)" }}
          >
            {hourlyRate}/hr
          </p>
        </div>
        <Link
          href={`/freelancer/${id}`}
          className="btn-shine inline-flex items-center gap-1 rounded-full px-4 py-2 text-[13px] font-semibold text-white transition"
          style={{
            background: "var(--grad-brand)",
            boxShadow: "0 6px 18px -6px var(--brand-glow)",
          }}
        >
          Hire Karo
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default FreelancerCard;
