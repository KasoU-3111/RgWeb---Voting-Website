// src/components/VotingDashboard.tsx

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, Shield, LogOut, User, Zap, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { getCandidates, castVote } from "@/services/apiService";
import { Candidate } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";

interface VotingDashboardProps {
  onLogout: () => void;
}

const VotingDashboard = ({ onLogout }: VotingDashboardProps) => {
  const { currentUser } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  
  useEffect(() => {
    const fetchAndCheckStatus = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Check if user has already voted by attempting to fetch candidates
        // Our 'castVote' endpoint will tell us if they already voted.
        // A more direct approach would be a dedicated 'GET /api/vote/status' endpoint.
        const data = await getCandidates();
        setCandidates(data);
      } catch (err) {
        let errorMessage = "Failed to fetch candidates.";
        if (err instanceof Error) errorMessage = err.message;
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndCheckStatus();
  }, []);

  const handleVote = async () => {
    if (!selectedCandidate) return;
    setIsVoting(true);
    try {
      const result = await castVote(selectedCandidate);
      toast.success(result.message);
      setHasVoted(true);
    } catch (error) {
      if (error instanceof Error) {
        // If the error is "You have already voted", we should also show the voted screen.
        if (error.message.includes("already voted")) {
          setHasVoted(true);
        }
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred while voting.");
      }
    } finally {
      setIsVoting(false);
    }
  };

  // The "Voted" screen is now a full component
  if (hasVoted) {
    return (
      <div className="min-h-screen animated-gradient flex flex-col items-center justify-center p-4 text-center text-primary-foreground">
        <div className="animate-in fade-in-0 zoom-in-75 duration-700">
          <div className="mx-auto mb-8 h-24 w-24 rounded-full border-4 border-green-400/50 bg-green-400/20 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-300" />
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
            Thank You For Voting!
          </h1>
          <p className="mt-4 max-w-md mx-auto text-lg text-muted-foreground">
            Your vote has been securely and anonymously recorded. You have played a vital role in shaping our future.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" className="shadow-lg w-full sm:w-auto">
              View Results (When Available)
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/20 w-full sm:w-auto" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-gradient">
      <header className="sticky top-0 z-50 animate-in fade-in-0 duration-1000">
        <div className="container mx-auto px-4 py-4">
          <div className="rounded-lg border border-white/10 bg-black/10 px-4 py-2 backdrop-blur-lg">
            <nav className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Zap className="h-7 w-7 text-primary" />
                <h1 className="text-xl font-bold text-white">VoteSecure</h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="font-bold text-sm text-white">{currentUser?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                </div>
                <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/20" onClick={onLogout}>
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 animate-in fade-in-0 slide-in-from-bottom-5 duration-700">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
              Official Ballot
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">Select your chosen candidate and cast your vote.</p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => <Skeleton key={n} className="h-80 w-full bg-white/5" />)}
            </div>
          ) : error ? (
            <Card className="bg-destructive/20 border-destructive/50 text-center py-10"><p className="text-destructive-foreground">{error}</p></Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {candidates.map((candidate, index) => (
                <Card 
                  key={candidate.id}
                  className={`relative cursor-pointer transition-all duration-300 border-2 bg-black/20 backdrop-blur-md animate-in fade-in-0 slide-in-from-bottom-10`}
                  style={{ animationDelay: `${index * 150}ms` }}
                  onClick={() => setSelectedCandidate(candidate.id)}
                >
                  <div className={`absolute -inset-px rounded-xl transition-all duration-300 ${selectedCandidate === candidate.id ? 'border-2 border-primary shadow-lg shadow-primary/30' : 'border-transparent'}`} />
                  <CardHeader className="text-center relative z-10">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-background/50"><AvatarImage src={candidate.image_url || ''} /><AvatarFallback><User className="h-12 w-12" /></AvatarFallback></Avatar>
                    <CardTitle className="text-xl text-white">{candidate.name}</CardTitle>
                    <Badge variant="secondary" className="bg-white/10 text-white/80">{candidate.party}</Badge>
                  </CardHeader>
                  <CardContent className="text-center space-y-3 relative z-10">
                    <p className="text-sm text-muted-foreground h-16">{candidate.description}</p>
                  </CardContent>
                  <div className={`absolute top-3 right-3 h-6 w-6 rounded-full bg-background/50 flex items-center justify-center transition-all duration-300 ${selectedCandidate === candidate.id ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-12 text-center animate-in fade-in-0 duration-1000 delay-500">
            <Button 
              onClick={handleVote}
              disabled={!selectedCandidate || isVoting}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-105 min-w-[200px]"
            >
              {isVoting ? "Casting Vote..." : "Cast My Vote"}
              <ArrowRight className="h-4 w-4 ml-2"/>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VotingDashboard;