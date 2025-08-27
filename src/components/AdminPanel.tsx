import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  BarChart3,
  LogOut,
  User
} from "lucide-react";

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  const [candidates, setCandidates] = useState([
    {
      id: "1",
      name: "Candidate A",
      party: "Progressive Party",
      description: "Focused on education reform and healthcare accessibility",
      votes: 245,
      status: "active"
    },
    {
      id: "2", 
      name: "Candidate B",
      party: "Innovation Party",
      description: "Technology entrepreneur advocating for digital transformation",
      votes: 198,
      status: "active"
    },
    {
      id: "3",
      name: "Candidate C", 
      party: "Community First",
      description: "Environmental advocate with focus on sustainable development",
      votes: 167,
      status: "active"
    }
  ]);

  const [voters] = useState([
    { id: "1", name: "Voter 1", email: "V1@example.com", status: "approved", hasVoted: true },
    { id: "2", name: "Voter 2", email: "V2@example.com", status: "approved", hasVoted: false },
    { id: "3", name: "Voter 3", email: "V3@example.com", status: "pending", hasVoted: false },
    { id: "4", name: "Voter 4", email: "V4@example.com", status: "rejected", hasVoted: false },
  ]);

  const [newCandidate, setNewCandidate] = useState({
    name: "",
    party: "",
    description: ""
  });

  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);

  const handleAddCandidate = () => {
    if (newCandidate.name && newCandidate.party) {
      const candidate = {
        id: Date.now().toString(),
        ...newCandidate,
        votes: 0,
        status: "active"
      };
      setCandidates([...candidates, candidate]);
      setNewCandidate({ name: "", party: "", description: "" });
    }
  };

  const handleDeleteCandidate = (id: string) => {
    setCandidates(candidates.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">VoteSecure Admin Panel</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
              <Shield className="h-3 w-3 mr-1" />
              Administrator
            </Badge>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Overview Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-card border-0 shadow-civic">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{totalVotes}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-civic">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Candidates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">{candidates.length}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-civic">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Registered Voters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{voters.length}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-civic">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Turnout Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">
                  {Math.round((voters.filter(v => v.hasVoted).length / voters.length) * 100)}%
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="candidates" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
              <TabsTrigger value="voters">Voters</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="candidates" className="space-y-6">
              {/* Add New Candidate */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Add New Candidate</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newCandidate.name}
                        onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})}
                        placeholder="Candidate name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="party">Party</Label>
                      <Input
                        id="party"
                        value={newCandidate.party}
                        onChange={(e) => setNewCandidate({...newCandidate, party: e.target.value})}
                        placeholder="Political party"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newCandidate.description}
                      onChange={(e) => setNewCandidate({...newCandidate, description: e.target.value})}
                      placeholder="Candidate description and platform"
                    />
                  </div>
                  <Button onClick={handleAddCandidate} variant="civic">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Candidate
                  </Button>
                </CardContent>
              </Card>

              {/* Candidates List */}
              <div className="grid md:grid-cols-2 gap-6">
                {candidates.map((candidate) => (
                  <Card key={candidate.id} className="hover:shadow-card-hover transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              <User className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{candidate.name}</CardTitle>
                            <Badge variant="secondary">{candidate.party}</Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteCandidate(candidate.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{candidate.description}</p>
                      <div className="bg-primary/5 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Current Votes</span>
                          <span className="text-xl font-bold text-primary">{candidate.votes}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="voters">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Voter Management</span>
                  </CardTitle>
                  <CardDescription>
                    Manage voter registrations and approve new voters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {voters.map((voter) => (
                      <div key={voter.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>{voter.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{voter.name}</p>
                            <p className="text-sm text-muted-foreground">{voter.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge 
                            variant={
                              voter.status === 'approved' ? 'default' : 
                              voter.status === 'pending' ? 'secondary' : 
                              'destructive'
                            }
                          >
                            {voter.status}
                          </Badge>
                          {voter.hasVoted && (
                            <Badge variant="outline" className="text-success border-success/20 bg-success/10">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Voted
                            </Badge>
                          )}
                          {voter.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button variant="success" size="sm">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Live Results</span>
                  </CardTitle>
                  <CardDescription>
                    Real-time vote counts and statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {candidates.map((candidate) => {
                      const percentage = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0;
                      return (
                        <div key={candidate.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>
                                  <User className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{candidate.name}</p>
                                <p className="text-sm text-muted-foreground">{candidate.party}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold">{candidate.votes}</p>
                              <p className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</p>
                            </div>
                          </div>
                          <div className="w-full bg-muted rounded-full h-3">
                            <div 
                              className="bg-gradient-primary h-3 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;