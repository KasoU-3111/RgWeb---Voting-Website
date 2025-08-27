import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Shield, Trophy, Users, TrendingUp, User, ArrowLeft } from "lucide-react";

interface ResultsPageProps {
  onBack: () => void;
}

const ResultsPage = ({ onBack }: ResultsPageProps) => {
  const results = [
    { 
      id: "1", 
      name: "Voter A", 
      party: "Progressive Party", 
      votes: 245, 
      percentage: 40.2,
      color: "#3b82f6"
    },
    { 
      id: "2", 
      name: "Voter B", 
      party: "Innovation Party", 
      votes: 198, 
      percentage: 32.5,
      color: "#06b6d4"
    },
    { 
      id: "3", 
      name: "Voter C", 
      party: "Community First", 
      votes: 167, 
      percentage: 27.3,
      color: "#10b981"
    }
  ];

  const totalVotes = results.reduce((sum, candidate) => sum + candidate.votes, 0);
  const winner = results[0];

  const chartData = results.map(candidate => ({
    name: candidate.name.split(' ')[0], // First name only for chart
    votes: candidate.votes,
    percentage: candidate.percentage
  }));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Election Results</h1>
            </div>
          </div>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            <TrendingUp className="h-3 w-3 mr-1" />
            Final Results
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Winner Announcement */}
          <Card className="mb-8 bg-gradient-hero text-primary-foreground border-0">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="bg-white/20 rounded-full p-4">
                  <Trophy className="h-12 w-12" />
                </div>
              </div>
              <CardTitle className="text-3xl mb-2">Election Winner</CardTitle>
              <CardDescription className="text-primary-foreground/90">
                The results are in! Here's your elected representative.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex justify-center items-center space-x-4 mb-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="text-2xl bg-white/20">
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <h3 className="text-2xl font-bold">{winner.name}</h3>
                  <p className="text-primary-foreground/90">{winner.party}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-3xl font-bold">{winner.votes}</span>
                    <span className="text-primary-foreground/90">votes</span>
                    <Badge className="bg-white/20 text-primary-foreground">
                      {winner.percentage}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-card border-0 shadow-civic">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2 text-primary" />
                  Total Votes Cast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{totalVotes}</div>
                <p className="text-sm text-muted-foreground">Across all candidates</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-civic">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-secondary" />
                  Voter Turnout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">87.3%</div>
                <p className="text-sm text-muted-foreground">Of registered voters</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-civic">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Trophy className="h-4 w-4 mr-2 text-warning" />
                  Winning Margin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">7.7%</div>
                <p className="text-sm text-muted-foreground">Lead over runner-up</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Vote Distribution</CardTitle>
                <CardDescription>Number of votes per candidate</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        `${value} votes (${chartData.find(d => d.votes === value)?.percentage}%)`,
                        'Votes'
                      ]}
                    />
                    <Bar dataKey="votes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Vote Share</CardTitle>
                <CardDescription>Percentage breakdown by candidate</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={results}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="votes"
                      label={({ name, percentage }) => `${name.split(' ')[0]} ${percentage}%`}
                    >
                      {results.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value} votes`, 'Votes']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Results</CardTitle>
              <CardDescription>Complete breakdown of all candidates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((candidate, index) => (
                  <div key={candidate.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="text-2xl font-bold text-muted-foreground">
                          #{index + 1}
                        </div>
                        {index === 0 && <Trophy className="h-5 w-5 text-warning" />}
                      </div>
                      <Avatar>
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground">{candidate.party}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-2xl font-bold">{candidate.votes}</p>
                        <p className="text-sm text-muted-foreground">votes</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold" style={{ color: candidate.color }}>
                          {candidate.percentage}%
                        </p>
                        <p className="text-sm text-muted-foreground">of total</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Election Info */}
          <Card className="mt-8 bg-muted/30">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Election Information</h4>
                  <p>Election Date: August 15, 2025</p>
                  <p>Total Registered Voters: 698</p>
                  <p>Votes Cast: 610</p>
                  <p>Invalid Votes: 0</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Security & Transparency</h4>
                  <p>✓ All votes encrypted and verified</p>
                  <p>✓ Blockchain audit trail maintained</p>
                  <p>✓ Real-time result updates</p>
                  <p>✓ Zero tampering detected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;