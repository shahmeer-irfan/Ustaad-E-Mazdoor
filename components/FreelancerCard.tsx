import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
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
    <Card className="group h-full cursor-pointer rounded-2xl border border-[#E9D5FF] bg-white p-5 flex flex-col gap-4 transition-all duration-200 ease-out hover:border-[#7C3AED] hover:shadow-[0_8px_30px_rgba(124,58,237,0.12)] hover:-translate-y-1">
      <div className="space-y-4">
        <div className="flex items-start space-x-4">
          <div className="h-16 w-16 shrink-0 rounded-full ring-2 ring-[#A855F7]">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#EDE9FE] text-2xl font-bold text-[#7C3AED]">
                {name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="truncate text-lg font-bold text-[#0F0A1E]">{name}</h3>
            <p className="text-sm text-[#4B5563]">{title}</p>
            <div className="mt-1 flex items-center text-sm">
              <MapPin className="mr-1 h-4 w-4 text-[#9CA3AF]" />
              <span className="text-[#4B5563]">{location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 fill-[#7C3AED] text-[#7C3AED]" />
            <span className="font-semibold text-[#0F0A1E]">{rating}</span>
          </div>
          <span className="text-sm text-[#4B5563]">
            ({reviews} reviews)
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 3).map((skill: string) => (
            <Badge key={skill} className="rounded-full bg-[#EDE9FE] px-3 py-1 text-xs font-semibold text-[#5B21B6]">
              {skill}
            </Badge>
          ))}
          {skills.length > 3 && (
            <Badge className="rounded-full bg-[#EDE9FE] px-3 py-1 text-xs font-semibold text-[#5B21B6]">+{skills.length - 3} more</Badge>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[#F3F4F6] pt-4">
          <div>
            <p className="text-sm text-[#4B5563]">Starting at</p>
            <p className="text-lg font-bold text-[#7C3AED]">{hourlyRate}/hr</p>
          </div>
          <Link
            href={`/freelancer/${id}`}
            className="rounded-xl bg-[#7C3AED] px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#5B21B6] hover:shadow-[0_4px_14px_rgba(124,58,237,0.35)] active:scale-95"
          >
            Hire Karo
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default FreelancerCard;
