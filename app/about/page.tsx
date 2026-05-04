import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Target, Award, Heart } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Users,
      title: "Community First",
      description:
        "We believe in empowering Pakistani freelancers and building a supportive community where everyone can thrive.",
    },
    {
      icon: Target,
      title: "Quality & Trust",
      description:
        "We maintain high standards for both freelancers and clients, ensuring reliable and professional collaboration.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We celebrate exceptional work and recognize talent, helping freelancers build strong reputations.",
    },
    {
      icon: Heart,
      title: "Local Focus",
      description:
        "Built specifically for Pakistan, we understand local needs, payment methods, and business culture.",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Active Freelancers" },
    { value: "5,000+", label: "Jobs Completed" },
    { value: "PKR 50M+", label: "Paid to Freelancers" },
    { value: "98%", label: "Client Satisfaction" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Ustaad</h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            Connecting Pakistani freelancers with clients and building careers,
            one job at a time
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ustaad was created to bridge the gap between talented Pakistani
              professionals and clients seeking quality work. We're building a
              platform where freelancers can showcase their skills, find
              meaningful work, and build sustainable careers while clients can
              easily discover and hire local talent.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-[hsl(262,83%,58%)] via-[hsl(237,89%,62%)] to-[hsl(25,95%,63%)] bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
              <p>
                Ustaad was born from a simple observation: Pakistan is home to
                incredible talent, but freelancers often struggle to find
                quality work and clients find it difficult to discover reliable
                professionals.
              </p>
              <p>
                We set out to change that by creating a platform designed
                specifically for the Pakistani market—one that understands local
                payment methods, business culture, and the unique challenges
                freelancers face.
              </p>
              <p>
                Today, Ustaad is helping thousands of freelancers build
                sustainable careers while enabling businesses to access the
                talent they need to grow. We're proud to be part of Pakistan's
                growing digital economy and committed to supporting the next
                generation of professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Be part of Pakistan's fastest-growing freelance marketplace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="rounded-full"
            >
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-full border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
