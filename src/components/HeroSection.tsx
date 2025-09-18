// src/components/HeroSection.tsx

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Users, ChartBar, Lock } from "lucide-react";

// Define the props for the component, including our new function
interface HeroSectionProps {
  onNavigateToAuth: () => void;
}

const HeroSection = ({ onNavigateToAuth }: HeroSectionProps) => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary-foreground" />
            <h1 className="text-2xl font-bold text-primary-foreground">VoteSecure</h1>
          </div>
          <div className="space-x-4">
            {/* These buttons now call the function passed from the parent */}
            <Button onClick={onNavigateToAuth} variant="outline" className="border-white/20 text-primary-foreground hover:bg-white/10">
              Login
            </Button>
            <Button onClick={onNavigateToAuth} variant="secondary">
              Sign Up
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Content */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-primary-foreground mb-6">
            Secure Digital Voting Platform
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Cast your vote with confidence using our state-of-the-art secure voting system. 
            Transparent, accessible, and tamper-proof elections for the digital age.
          </p>
          <div className="space-x-4">
            <Button onClick={onNavigateToAuth} variant="secondary" size="lg">
              Start Voting
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 text-primary-foreground hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid - THIS IS THE MISSING CONTENT */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-primary-foreground">
            <CardHeader>
              <Shield className="h-12 w-12 text-secondary mb-4" />
              <CardTitle>Secure Authentication</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Multi-factor authentication with JWT tokens and OTP verification ensures only authorized voters can participate.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-primary-foreground">
            <CardHeader>
              <Users className="h-12 w-12 text-secondary mb-4" />
              <CardTitle>User Management</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Comprehensive admin panel for managing candidates, voters, and monitoring election progress in real-time.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-primary-foreground">
            <CardHeader>
              <ChartBar className="h-12 w-12 text-secondary mb-4" />
              <CardTitle>Real-time Results</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Live vote counting with dynamic visualizations and transparent result reporting for complete transparency.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Trust Indicators - THIS IS ALSO MISSING CONTENT */}
        <div className="mt-20 text-center">
          <div className="flex items-center justify-center space-x-8 text-primary-foreground/80">
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Audit Trail</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>One Vote Per User</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HeroSection;