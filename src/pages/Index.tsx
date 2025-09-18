// src/pages/Index.tsx

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";
import VotingDashboard from "@/components/VotingDashboard";
import AdminPanel from "@/components/AdminPanel"; // <-- Make sure this is imported
import HeroSection from "@/components/HeroSection";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { currentUser, isLoading, logout } = useAuth();
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

  // --- THIS IS THE UPDATED LOGIC ---
  if (currentUser) {
    const handleLogout = () => {
      logout();
      setShowAuthForm(false);
    }
    
    // Check the user's role and render the correct component
    if (currentUser.role === 'admin') {
      return <AdminPanel onLogout={handleLogout} />;
    }
    
    // If not an admin, they must be a voter
    return <VotingDashboard onLogout={handleLogout} />;
  }
  // --- END OF UPDATE ---
  
  if (showAuthForm) {
    return <AuthForm />;
  }

  return <HeroSection onNavigateToAuth={() => setShowAuthForm(true)} />;
};

export default Index;