import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, Clock, User, Shield, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Candidate {
  id: string;
  name: string;
  party: string;
  description: string;
  image: string;
  experience: string;
}

interface VotingDashboardProps {
  onLogout: () => void;
}

const VotingDashboard = ({ onLogout }: VotingDashboardProps) => {
  const { toast } = useToast();
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  const candidates: Candidate[] = [
    {
      id: "1",
      name: "Voter A",
      party: "Progressive Party",
      description: "Focused on education reform and healthcare accessibility",
      image: "/api/placeholder/120/120",
      experience: "Former Mayor, 15 years public service"
    },
    {
      id: "2",
      name: "Voter B",
      party: "Innovation Party",
      description: "Technology entrepreneur advocating for digital transformation",
      image: "/api/placeholder/120/120",
      experience: "Tech CEO, Economic Development Expert"
    },
    {
      id: "3",
      name: "Voter C",
      party: "Community First",
      description: "Environmental advocate with focus on sustainable development",
      image: "/api/placeholder/120/120",
      experience: "Environmental Lawyer, Community Organizer"
    }
  ];

  const handleVote = async () => {
    if (!selectedCandidate) return;
    
    setIsVoting(true);
    
    // Simulate voting process
    setTimeout(() => {
      setIsVoting(false);
      setHasVoted(true);
      toast({
        title: "Vote Cast Successfully!",
        description: "Your vote has been recorded securely. Thank you for participating in democracy.",
        variant: "default",
      });
    }, 2000);
  };

  if (hasVoted) {
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

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-success/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Vote Cast Successfully!</h2>
            <p className="text-muted-foreground mb-8">
              Your vote has been recorded securely and anonymously. Thank you for participating in the democratic process.
            </p>
            
            <Card className="bg-gradient-card border-0 shadow-civic">
              <CardHeader>
                <CardTitle>What happens next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium">Secure Storage</h4>
                    <p className="text-sm text-muted-foreground">Your vote is encrypted and stored securely with blockchain verification.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-secondary/10 rounded-full p-2">
                    <Clock className="h-4 w-4 text-secondary" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium">Results Available</h4>
                    <p className="text-sm text-muted-foreground">Live results will be available after the voting period ends.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">VoteSecure Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified Voter
            </Badge>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Cast Your Vote</h2>
            <p className="text-muted-foreground">
              Select your preferred candidate below. You can only vote once, so choose carefully.
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
                    <AvatarImage src={candidate.image} alt={candidate.name} />
                    <AvatarFallback>
                      <User className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{candidate.name}</CardTitle>
                  <Badge variant="secondary">{candidate.party}</Badge>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">{candidate.description}</p>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs font-medium text-primary">Experience</p>
                    <p className="text-sm">{candidate.experience}</p>
                  </div>
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
              className="min-w-48"
            >
              {isVoting ? "Casting Vote..." : "Cast My Vote"}
            </Button>
            
            {selectedCandidate && (
              <p className="text-sm text-muted-foreground mt-4">
                You have selected:{" "}
                <span className="font-medium text-foreground">
                  {candidates.find(c => c.id === selectedCandidate)?.name}
                </span>
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VotingDashboard;