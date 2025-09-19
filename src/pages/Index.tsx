// src/pages/Index.tsx

import { useAuth } from "@/context/AuthContext";
import VotingDashboard from "@/components/VotingDashboard";
import AdminPanel from "@/components/AdminPanel";
import HeroSection from "@/components/HeroSection";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { currentUser, isLoading, logout } = useAuth();

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

  if (currentUser) {
    const handleLogout = () => {
      logout();
    }
    
    if (currentUser.role === 'admin') {
      return <AdminPanel onLogout={handleLogout} />;
    }
    
    return <VotingDashboard onLogout={handleLogout} />;
  }
  
  return <HeroSection />;
};

export default Index;