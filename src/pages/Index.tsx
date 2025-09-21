// src/pages/Index.tsx

import { useAuth } from "@/context/AuthContext";
import VotingDashboard from "@/components/VotingDashboard";
import AdminPanel from "@/components/AdminPanel";
import HeroSection from "@/components/HeroSection";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { currentUser, isLoading, logout } = useAuth();

  // Show a loading state while checking the user's session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 w-1/2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  // If a user is logged in, show the appropriate dashboard
  if (currentUser) {
    const handleLogout = () => {
      logout();
    }
    
    // Check the user's role and render the correct component
    if (currentUser.role === 'admin') {
      return <AdminPanel onLogout={handleLogout} />;
    }
    
    // If not an admin, they must be a voter
    return <VotingDashboard onLogout={handleLogout} />;
  }
  
  // If no user is logged in, show the main landing page
  return <HeroSection />;
};

export default Index;