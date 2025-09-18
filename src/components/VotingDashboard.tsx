// src/components/VotingDashboard.tsx

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, Shield, LogOut, User, Clock } from "lucide-react";
import { toast } from "sonner"; // Using Sonner for sleeker notifications
import { getCandidates, castVote } from "@/services/apiService"; // <-- IMPORT castVote
import { Candidate } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface VotingDashboardProps {
  onLogout: () => void;
}

const VotingDashboard = ({ onLogout }: VotingDashboardProps) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCandidates();
        setCandidates(data);
      } catch (err) {
        let errorMessage = "Failed to fetch candidates.";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  // --- THIS IS THE UPDATED FUNCTION ---
  const handleVote = async () => {
    if (!selectedCandidate) {
      toast.warning("Please select a candidate before casting your vote.");
      return;
    }
    
    setIsVoting(true);
    try {
      const result = await castVote(selectedCandidate);
      toast.success(result.message);
      setHasVoted(true); // Switch to the "Thank You" screen
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message); // Will show "You have already voted."
      } else {
        toast.error("An unexpected error occurred while voting.");
      }
    } finally {
      setIsVoting(false);
    }
  };

  if (hasVoted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-success/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Vote Cast Successfully!</h2>
            <p className="text-muted-foreground mb-8">
              Your vote has been recorded securely. Thank you for your participation.
            </p>
            <Button onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Skeleton className="h-10 w-1/3 mx-auto" />
          <Skeleton className="h-4 w-2/3 mx-auto mt-4" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((n) => <Skeleton key={n} className="h-80 w-full" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-destructive py-10">{error}</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">VoteSecure Dashboard</h1>
            </div>
            <Button variant="outline" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
            </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Cast Your Vote</h2>
            <p className="text-muted-foreground">
              Select your preferred candidate below. You can only vote once.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {candidates.map((candidate) => (
              <Card 
                key={candidate.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-card-hover ${
                  selectedCandidate === candidate.id 
                    ? 'ring-2 ring-primary shadow-civic' 
                    : ''
                }`}
                onClick={() => setSelectedCandidate(candidate.id)}
              >
                <CardHeader className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                        <AvatarImage src={candidate.image_url || ''} alt={candidate.name} />
                        <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl">{candidate.name}</CardTitle>
                    <Badge variant="secondary">{candidate.party}</Badge>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                    <p className="text-sm text-muted-foreground h-16">{candidate.description}</p>
                    {selectedCandidate === candidate.id && (
                        <div className="bg-primary/10 rounded-full p-2 w-fit mx-auto">
                            <CheckCircle className="h-5 w-5 text-primary" />
                        </div>
                    )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              onClick={handleVote}
              disabled={!selectedCandidate || isVoting}
              variant="civic"
              size="lg"
            >
              {isVoting ? "Casting Vote..." : "Cast My Vote"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VotingDashboard;