import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  count: string;
}

const CategoryCard = ({ icon: Icon, title, count }: CategoryCardProps) => {
  return (
    <div
      className="group rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 ease-out hover:-translate-y-1"
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
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
          style={{ background: "var(--brand-dim)", color: "var(--brand)" }}
        >
          <Icon className="h-7 w-7" strokeWidth={2.2} />
        </div>
        <div>
          <h3 className="mb-1 text-[16px] font-semibold" style={{ color: "var(--text-primary)" }}>
            {title}
          </h3>
          <p className="text-[12.5px] font-mono" style={{ color: "var(--brand)" }}>
            {count}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
