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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle: string;
  budgetRange?: { min: number; max: number };
}

export function ProposalDialog({
  open,
  onOpenChange,
  jobId,
  jobTitle,
  budgetRange,
}: ProposalDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    coverLetter: "",
    proposedBudget: "",
    proposedDuration: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          coverLetter: formData.coverLetter,
          proposedBudget: parseFloat(formData.proposedBudget),
          proposedDuration: formData.proposedDuration,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit proposal");
      }

      toast({
        title: "Success!",
        description: "Proposal submitted successfully!",
      });
      onOpenChange(false);
      router.refresh();
      
      // Reset form
      setFormData({
        coverLetter: "",
        proposedBudget: "",
        proposedDuration: "",
      });
    } catch (error: any) {
      console.error("Failed to submit proposal:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit proposal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background/100 backdrop-blur-none">
        <DialogHeader>
          <DialogTitle>Submit Proposal</DialogTitle>
          <DialogDescription>
            Submit your proposal for: <strong>{jobTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Letter */}
          <div className="space-y-2">
            <Label htmlFor="coverLetter">
              Cover Letter <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="coverLetter"
              placeholder="Explain why you're the best fit for this project. Highlight your relevant experience and skills..."
              className="min-h-[150px]"
              value={formData.coverLetter}
              onChange={(e) =>
                setFormData({ ...formData, coverLetter: e.target.value })
              }
              required
            />
            <p className="text-sm text-muted-foreground">
              Minimum 100 characters
            </p>
          </div>

          {/* Budget */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="proposedBudget">
                Your Proposed Budget (PKR) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="proposedBudget"
                type="number"
                placeholder="e.g., 50000"
                value={formData.proposedBudget}
                onChange={(e) =>
                  setFormData({ ...formData, proposedBudget: e.target.value })
                }
                required
              />
              {budgetRange && (
                <p className="text-sm text-muted-foreground">
                  Client budget: PKR {budgetRange.min.toLocaleString()} - {budgetRange.max.toLocaleString()}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="proposedDuration">
                Estimated Duration <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.proposedDuration}
                onValueChange={(value) =>
                  setFormData({ ...formData, proposedDuration: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-week">Less than 1 week</SelectItem>
                  <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                  <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                  <SelectItem value="1-3-months">1-3 months</SelectItem>
                  <SelectItem value="3-6-months">3-6 months</SelectItem>
                  <SelectItem value="6-months-plus">6+ months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Tips for a great proposal:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Be specific about how you'll approach the project</li>
              <li>• Mention relevant past projects or experience</li>
              <li>• Explain your timeline and availability</li>
              <li>• Keep your budget competitive but fair</li>
              <li>• Proofread for grammar and clarity</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || formData.coverLetter.length < 100}
              className="bg-gradient-accent"
            >
              {loading ? "Submitting..." : "Submit Proposal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
