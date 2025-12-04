"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RatingStars } from "@/components/RatingStars";
import { Star } from "lucide-react";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  freelancerId: string;
  freelancerName: string;
  jobTitle: string;
}

export function ReviewDialog({
  open,
  onOpenChange,
  jobId,
  freelancerId,
  freelancerName,
  jobTitle,
}: ReviewDialogProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          freelancerId,
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit review");
      }

      toast({
        title: "Success!",
        description: "Review submitted successfully!",
      });

      onOpenChange(false);
      setRating(0);
      setComment("");
      router.refresh();
    } catch (error: any) {
      console.error("Failed to submit review:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            Rate Freelancer
          </DialogTitle>
          <DialogDescription>
            Share your experience working with {freelancerName} on "{jobTitle}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Your Rating *</Label>
            <div className="flex items-center justify-center py-4">
              <RatingStars
                rating={rating}
                onRatingChange={setRating}
                size="lg"
              />
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                {rating === 5 && "Excellent! ⭐"}
                {rating === 4 && "Very Good! 👍"}
                {rating === 3 && "Good 👌"}
                {rating === 2 && "Fair 😐"}
                {rating === 1 && "Poor 👎"}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Your Review (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Share your experience with this freelancer..."
              className="min-h-[100px]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Help other clients make informed decisions
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading || rating === 0}
              className="flex-1"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
