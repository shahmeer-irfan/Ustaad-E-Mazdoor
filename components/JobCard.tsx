import { Clock, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

interface JobCardProps {
  id: string;
  title: string;
  description: string;
  budget: string;
  location: string;
  postedTime: string;
  category: string;
}

const JobCard = ({
  id,
  title,
  description,
  budget,
  location,
  postedTime,
  category,
}: JobCardProps) => {
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
      <div className="flex flex-col gap-2">
        <h3 className="clamp-2 text-[17px] font-semibold leading-snug">
          <Link
            href={`/job/${id}`}
            className="transition hover:text-[color:var(--brand)]"
          >
            {title}
          </Link>
        </h3>
        <span
          className="w-fit rounded-md px-2.5 py-1 text-[11px] font-semibold tracking-wide font-mono"
          style={{ background: "var(--brand-dim)", color: "var(--brand)" }}
        >
          {category}
        </span>
      </div>

      <p
        className="clamp-2 flex-1 text-[14px] leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        {description}
      </p>

      <div className="flex flex-wrap items-center gap-4 text-[12.5px]"
           style={{ color: "var(--text-muted)" }}>
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {location}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {postedTime}
        </span>
      </div>

      <div className="h-px" style={{ background: "var(--border)" }} />

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col leading-tight">
          <span
            className="text-[10.5px] uppercase tracking-[0.12em] font-semibold"
            style={{ color: "var(--text-muted)" }}
          >
            Budget
          </span>
          <span
            className="font-mono font-bold text-[16px]"
            style={{ color: "var(--text-primary)" }}
          >
            {budget}
          </span>
        </div>
        <Link
          href={`/job/${id}`}
          className="btn-shine inline-flex items-center gap-1 rounded-full px-4 py-2 text-[13px] font-semibold text-white transition"
          style={{
            background: "var(--grad-brand)",
            boxShadow: "0 6px 18px -6px var(--brand-glow)",
          }}
        >
          Apply Karo
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
