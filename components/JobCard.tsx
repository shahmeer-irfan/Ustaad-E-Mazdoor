import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <Link href={`/job/${id}`}>
      <Card className="group p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-primary/50 border-2 bg-gradient-card backdrop-blur-sm h-full hover:scale-[1.02] hover:-translate-y-1">
        <div className="space-y-4 h-full flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors leading-tight">
                {title}
              </h3>
              <Badge variant="secondary" className="mb-3 font-semibold group-hover:bg-primary/20 transition-colors">
                {category}
              </Badge>
            </div>
          </div>

          <p className="text-muted-foreground line-clamp-2 flex-grow font-light group-hover:text-foreground/80 transition-colors">
            {description}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1.5 group-hover:text-primary transition-colors">
              <DollarSign className="w-4 h-4" strokeWidth={2.5} />
              <span className="font-bold text-foreground">{budget}</span>
            </div>
            <div className="flex items-center gap-1.5 group-hover:text-primary transition-colors">
              <MapPin className="w-4 h-4" strokeWidth={2.5} />
              <span className="font-medium">{location}</span>
            </div>
            <div className="flex items-center gap-1.5 group-hover:text-primary transition-colors">
              <Clock className="w-4 h-4" strokeWidth={2.5} />
              <span className="font-medium">{postedTime}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default JobCard;
