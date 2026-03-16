import { Clock, MapPin, DollarSign } from "lucide-react";
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
      className="group h-full cursor-pointer rounded-2xl border border-[#E9D5FF] bg-white p-6 flex flex-col gap-4 transition-all duration-200 ease-out hover:border-[#7C3AED] hover:shadow-[0_8px_30px_rgba(124,58,237,0.12)] hover:-translate-y-1"
    >
      <div className="flex flex-col gap-2">
        <h3 className="line-clamp-1 text-lg font-semibold leading-tight text-[#0F0A1E]">
          <Link href={`/job/${id}`}>{title}</Link>
        </h3>
        <span className="w-fit rounded-full bg-[#EDE9FE] px-3 py-1 text-xs font-semibold text-[#5B21B6]">
          {category}
        </span>
      </div>

      <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-[#4B5563]">
        {description}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 rounded-full border border-[#F3F4F6] bg-[#F9FAFB] px-2.5 py-1 text-xs text-[#6B7280]">
          <MapPin className="h-3 w-3 text-[#7C3AED]" />
          {location}
        </span>
        <span className="flex items-center gap-1 rounded-full border border-[#F3F4F6] bg-[#F9FAFB] px-2.5 py-1 text-xs text-[#6B7280]">
          <Clock className="h-3 w-3 text-[#7C3AED]" />
          {postedTime}
        </span>
      </div>

      <div className="border-t border-[#F3F4F6]" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4 text-[#7C3AED]" />
          <span className="text-base font-bold text-[#7C3AED]">{budget}</span>
      </div>
        <Link
          href={`/job/${id}`}
          className="rounded-xl bg-[#7C3AED] px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#5B21B6] hover:shadow-[0_4px_14px_rgba(124,58,237,0.35)] active:scale-95"
        >
          Apply Karo
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
