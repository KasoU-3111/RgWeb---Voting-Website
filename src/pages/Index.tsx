// src/pages/Index.tsx

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";
import VotingDashboard from "@/components/VotingDashboard";
import AdminPanel from "@/components/AdminPanel";
import HeroSection from "@/components/HeroSection"; // <-- Use the real component
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { currentUser, isLoading, logout } = useAuth();
  const [showAuthForm, setShowAuthForm] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* ... loading skeleton JSX ... */}
      </div>
    );
  }

  if (currentUser) {
    const handleLogout = () => {
      logout();
      setShowAuthForm(false);
    }
    
    if (currentUser.role === 'admin') {
      return <AdminPanel onLogout={handleLogout} />;
    }
    return <VotingDashboard onLogout={handleLogout} />;
  }
  
  // If user is logged out, show either the AuthForm or the full HeroSection
  if (showAuthForm) {
    return <AuthForm />;
  }

  return <HeroSection onNavigateToAuth={() => setShowAuthForm(true)} />;
};

export default Index;