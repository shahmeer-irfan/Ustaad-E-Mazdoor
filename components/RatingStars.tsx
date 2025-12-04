"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function RatingStars({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
  showLabel = false,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => handleClick(value)}
          onMouseEnter={() => !readonly && setHoverRating(value)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          disabled={readonly}
          className={cn(
            "transition-all duration-200",
            !readonly && "cursor-pointer hover:scale-110",
            readonly && "cursor-default"
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              "transition-all duration-200",
              value <= displayRating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-muted-foreground",
              !readonly && "hover:scale-110"
            )}
          />
        </button>
      ))}
      {showLabel && (
        <span className="ml-2 text-sm font-medium text-muted-foreground">
          {displayRating > 0 ? `${displayRating} / 5` : "Not rated"}
        </span>
      )}
    </div>
  );
}

interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
}

export function RatingDisplay({
  rating,
  reviewCount,
  size = "md",
}: RatingDisplayProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            className={cn(
              sizeClasses[size],
              "transition-all duration-200",
              starValue <= fullStars
                ? "fill-yellow-400 text-yellow-400"
                : starValue === fullStars + 1 && hasHalfStar
                ? "fill-yellow-400/50 text-yellow-400"
                : "fill-none text-muted-foreground"
            )}
          />
        );
      })}
      <span className="ml-1 text-sm font-semibold">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-sm text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  );
}
