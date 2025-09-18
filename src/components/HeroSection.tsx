// src/components/HeroSection.tsx

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Users, BarChart, Lock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
  onNavigateToAuth: () => void;
}

const FeatureCard = ({ icon, title, description, className }: { icon: React.ReactNode, title: string, description: string, className?: string }) => (
  <div className={cn("relative overflow-hidden rounded-lg p-px animate-in fade-in-0 slide-in-from-bottom-10 duration-1000", className)}>
    <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-secondary/50" />
    <div className="relative h-full rounded-lg bg-background/95 p-6 backdrop-blur-xl">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

const HeroSection = ({ onNavigateToAuth }: HeroSectionProps) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden animated-gradient text-primary-foreground">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float" />
      <div className="absolute -bottom-48 -right-48 h-96 w-96 rounded-full bg-secondary/20 blur-3xl animate-float animation-delay-3000" />
      
      <header className="sticky top-0 z-50 animate-in fade-in-0 duration-1000">
        <div className="container mx-auto px-4 py-4">
          <div className="rounded-lg border border-white/10 bg-black/10 px-4 py-2 backdrop-blur-lg">
            <nav className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Zap className="h-7 w-7 text-primary" />
                <h1 className="text-xl font-bold">VoteSecure</h1>
              </div>
              <Button onClick={onNavigateToAuth} variant="secondary" className="shadow-lg">
                Login
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container relative z-10 mx-auto px-4 py-20 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="animate-in fade-in-0 slide-in-from-bottom-10 duration-1000">
            <Badge variant="outline" className="mb-6 border-primary/50 bg-primary/10 py-1 px-4 text-primary">
              The Future of Digital Democracy
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
              Secure, Transparent & Instant Voting
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
              Welcome to VoteSecure, a next-generation platform engineered for integrity. Cast your vote with cryptographic certainty and witness democracy evolve.
            </p>
          </div>
          <div className="mt-10 flex justify-center gap-4 animate-in fade-in-0 slide-in-from-bottom-10 duration-1000 delay-300">
            <Button onClick={onNavigateToAuth} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-105">
              Start Voting Now
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 bg-white/5 text-white hover:bg-white/20 backdrop-blur-sm">
              Learn More
            </Button>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Shield size={24} />}
            title="Cryptographic Security"
            description="Every vote is encrypted, timestamped on a distributed ledger, and anonymized to ensure absolute voter privacy and integrity."
          />
          <FeatureCard 
            icon={<Users size={24} />}
            title="Decentralized Identity"
            description="Our robust multi-factor verification ensures one voter, one vote. No duplicates, no fraud, just verified participation."
            className="delay-200"
          />
          <FeatureCard 
            icon={<BarChart size={24} />}
            title="Real-Time Audits"
            description="Monitor the election's integrity live. Our transparent, real-time results and audit trails build unparalleled public trust."
            className="delay-400"
          />
        </div>
      </main>
    </div>
  );
};

export default HeroSection;