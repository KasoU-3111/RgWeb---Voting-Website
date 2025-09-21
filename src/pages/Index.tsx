// src/pages/Index.tsx

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";
import VotingDashboard from "@/components/VotingDashboard";
import AdminPanel from "@/components/AdminPanel";
import HeroSection from "@/components/HeroSection";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { currentUser, isLoading, logout } = useAuth();
  // State to decide whether to show the login form or the hero page
  const [showAuthForm, setShowAuthForm] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-1/2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  // If a user is logged in, show their respective dashboard
  if (currentUser) {
    const handleLogout = () => {
      logout();
      setShowAuthForm(false); // Reset to show hero section on logout
    };

    if (currentUser.role === 'admin') {
      return <AdminPanel onLogout={handleLogout} />;
    }
    
    return <VotingDashboard onLogout={handleLogout} />;
  }

  // If no user is logged in, check whether to show the auth form or hero section
  if (showAuthForm) {
    return <AuthForm />;
  }

  return <HeroSection onNavigateToAuth={() => setShowAuthForm(true)} />;
};

export default Index;