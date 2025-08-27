import { useState } from "react";
import AuthForm from "@/components/AuthForm";
import VotingDashboard from "@/components/VotingDashboard";
import AdminPanel from "@/components/AdminPanel";
import ResultsPage from "@/components/ResultsPage";

type AppState = 'hero' | 'auth' | 'voting' | 'admin' | 'results';
type UserType = 'voter' | 'admin' | null;

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('hero');
  const [userType, setUserType] = useState<UserType>(null);

  const handleAuthSuccess = (type: 'voter' | 'admin') => {
    setUserType(type);
    if (type === 'admin') {
      setCurrentState('admin');
    } else {
      setCurrentState('voting');
    }
  };

  const handleLogout = () => {
    setUserType(null);
    setCurrentState('hero');
  };

  const handleShowAuth = () => {
    setCurrentState('auth');
  };

  const handleShowResults = () => {
    setCurrentState('results');
  };

  const handleBackToHero = () => {
    setCurrentState('hero');
  };

  // Clone HeroSection and add navigation handlers
  const HeroWithNavigation = () => (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary-foreground rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-sm">VS</span>
            </div>
            <h1 className="text-2xl font-bold text-primary-foreground">VoteSecure</h1>
          </div>
          <div className="space-x-4">
            <button 
              onClick={handleShowAuth}
              className="border border-white/20 text-primary-foreground hover:bg-white/10 px-4 py-2 rounded-md transition-colors"
            >
              Login
            </button>
            <button 
              onClick={handleShowAuth}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md transition-colors"
            >
              Sign Up
            </button>
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
            <button 
              onClick={handleShowAuth}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-8 py-3 rounded-md text-lg transition-colors"
            >
              Start Voting
            </button>
            <button 
              onClick={handleShowResults}
              className="border border-white/20 text-primary-foreground hover:bg-white/10 px-8 py-3 rounded-md text-lg transition-colors"
            >
              View Results
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-primary-foreground rounded-lg p-6">
            <div className="h-12 w-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-secondary text-2xl">🛡️</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure Authentication</h3>
            <p className="text-primary-foreground/80">
              Multi-factor authentication with JWT tokens and OTP verification ensures only authorized voters can participate.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-primary-foreground rounded-lg p-6">
            <div className="h-12 w-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-secondary text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">User Management</h3>
            <p className="text-primary-foreground/80">
              Comprehensive admin panel for managing candidates, voters, and monitoring election progress in real-time.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-primary-foreground rounded-lg p-6">
            <div className="h-12 w-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-secondary text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-time Results</h3>
            <p className="text-primary-foreground/80">
              Live vote counting with dynamic visualizations and transparent result reporting for complete transparency.
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <div className="flex items-center justify-center space-x-8 text-primary-foreground/80">
            <div className="flex items-center space-x-2">
              <span>🔒</span>
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🛡️</span>
              <span>Audit Trail</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✅</span>
              <span>One Vote Per User</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  switch (currentState) {
    case 'auth':
      return <AuthForm onAuthSuccess={handleAuthSuccess} />;
    case 'voting':
      return <VotingDashboard onLogout={handleLogout} />;
    case 'admin':
      return <AdminPanel onLogout={handleLogout} />;
    case 'results':
      return <ResultsPage onBack={handleBackToHero} />;
    default:
      return <HeroWithNavigation />;
  }
};

export default Index;
