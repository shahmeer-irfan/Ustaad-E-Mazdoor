import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  count: string;
}

const CategoryCard = ({ icon: Icon, title, count }: CategoryCardProps) => {
  return (
    <Card className="group bg-white border border-[#E9D5FF] rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 ease-out hover:border-[#7C3AED] hover:shadow-[0_8px_30px_rgba(124,58,237,0.12)] hover:-translate-y-1">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDE9FE] transition-all duration-300 group-hover:bg-[#7C3AED]">
          <Icon className="h-8 w-8 text-[#7C3AED] transition-colors duration-300 group-hover:text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="mb-1 text-lg font-semibold text-[#0F0A1E]">{title}</h3>
          <p className="text-sm text-[#9CA3AF]">{count}</p>
        </div>
      </div>
    </Card>
  );
};

export default CategoryCard;
