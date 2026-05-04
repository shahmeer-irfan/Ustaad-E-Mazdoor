import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@clerk/nextjs";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "@/components/home/SmoothScroll";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ustaad — Pakistan ka Apna Kaam ka Platform",
  description:
    "Ghar ka kaam ho ya business — electrician, plumber, painter, mechanic, sab kuch ek jagah. 10,000+ verified Pakistani professionals across 50+ cities.",
  keywords: [
    "Ustaad",
    "Pakistan freelancers",
    "electrician Pakistan",
    "plumber Pakistan",
    "AC repair",
    "local services",
    "kaam dhundo",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${jakarta.variable} ${mono.variable}`}>
        <body className="antialiased">
          <TooltipProvider>
            <SmoothScroll>{children}</SmoothScroll>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
