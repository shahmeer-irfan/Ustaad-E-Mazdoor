"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden z-10 before:content-[''] before:absolute before:z-[-1] before:bg-primary before:h-[150px] before:w-[200px] before:rounded-[50%] before:top-[100%] before:left-[100%] before:transition-all before:duration-700 hover:before:top-[-30px] hover:before:left-[-30px] active:before:bg-primary/80",
  {
    variants: {
      variant: {
        default: "bg-transparent border-2 border-primary text-primary hover:text-primary-foreground",
        destructive:
          "bg-transparent border-2 border-destructive text-destructive hover:text-destructive-foreground before:bg-destructive active:before:bg-destructive/80",
        outline:
          "border-2 border-input bg-transparent hover:bg-accent hover:text-accent-foreground before:bg-accent",
        secondary:
          "bg-transparent border-2 border-secondary text-secondary-foreground hover:text-secondary before:bg-secondary active:before:bg-secondary/80",
        ghost: "border-0 before:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline border-0 before:hidden",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
