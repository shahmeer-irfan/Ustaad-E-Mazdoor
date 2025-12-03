import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <Card className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:-translate-y-1 hover:border-primary/50 border-2">
      <div className="space-y-4">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold flex-shrink-0 group-hover:bg-primary/20 transition-colors">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              name.charAt(0)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate hover:text-primary transition-colors">{name}</h3>
            <p className="text-muted-foreground text-sm">{title}</p>
            <div className="flex items-center mt-1 text-sm">
              <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">{location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-semibold">{rating}</span>
          </div>
          <span className="text-muted-foreground text-sm">
            ({reviews} reviews)
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="hover:bg-primary/10 transition-colors">
              {skill}
            </Badge>
          ))}
          {skills.length > 3 && (
            <Badge variant="outline" className="hover:bg-primary/10 transition-colors">+{skills.length - 3} more</Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Starting at</p>
            <p className="font-semibold text-lg">{hourlyRate}/hr</p>
          </div>
          <Button asChild className="hover:scale-105 transition-transform">
            <Link href={`/freelancer/${id}`}>View Profile</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FreelancerCard;
