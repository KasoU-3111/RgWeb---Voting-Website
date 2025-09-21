// src/components/AdminPanel.tsx

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Shield, Users, Plus, Edit, Trash2, LogOut, User, BarChart3, PieChart as PieChartIcon, Vote } from "lucide-react";
import { getAdminStats, getCandidates, addCandidate, updateCandidate, deleteCandidate, getVoteDistribution, getVoterTurnout } from "@/services/apiService";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
import { Candidate } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface AdminPanelProps { onLogout: () => void; }
type AdminStats = { totalVotes: number; registeredVoters: number; activeCandidates: number; };

const COLORS = ["hsl(var(--primary))", "hsl(var(--muted))"];

const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [voteDistribution, setVoteDistribution] = useState([]);
  const [voterTurnout, setVoterTurnout] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states and Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [formValues, setFormValues] = useState({ name: '', party: '', description: '' });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [statsData, candidatesData, voteDistData, turnoutData] = await Promise.all([
        getAdminStats(), getCandidates(), getVoteDistribution(), getVoterTurnout()
      ]);
      setStats(statsData);
      setCandidates(candidatesData);
      setVoteDistribution(voteDistData);
      setVoterTurnout(turnoutData);
    } catch (error) {
      if (error instanceof Error) toast.error(`Failed to load dashboard data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newCandidate = await addCandidate({
        name: formValues.name,
        party: formValues.party,
        description: formValues.description,
      });
      toast.success('Candidate added successfully!');
      setCandidates(prev => [...prev, newCandidate.candidate]); // Add new candidate to the list
      setFormValues({ name: '', party: '', description: '' }); // Reset form
      setIsAddDialogOpen(false); // Close dialog
      fetchData(); // Refresh all data
    } catch (error) {
      if (error instanceof Error) toast.error(`Failed to add candidate: ${error.message}`);
    }
  };

  const handleEditClick = (candidate: Candidate) => {
    setCurrentCandidate(candidate);
    setFormValues({
      name: candidate.name,
      party: candidate.party,
      description: candidate.description,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCandidate) return;

    try {
      await updateCandidate(currentCandidate.id, formValues);
      toast.success('Candidate updated successfully!');
      setIsEditDialogOpen(false);
      fetchData(); // Refresh data to show changes
    } catch (error) {
      if (error instanceof Error) toast.error(`Failed to update candidate: ${error.message}`);
    }
  };

  const handleDeleteCandidate = async (candidateId: number) => {
    try {
      await deleteCandidate(candidateId);
      toast.success('Candidate deleted successfully!');
      fetchData(); // Refresh data
    } catch (error) {
      if (error instanceof Error) toast.error(`Failed to delete candidate: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3"><Shield className="h-7 w-7 text-primary" /><h1 className="text-xl font-bold">Admin Dashboard</h1></div>
          <Button variant="outline" onClick={onLogout}><LogOut className="h-4 w-4 mr-2" />Logout</Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
              <CardHeader><CardTitle className="flex items-center"><BarChart3 className="mr-2"/>Vote Distribution</CardTitle></CardHeader>
              <CardContent className="h-80">
                {isLoading ? <Skeleton className="h-full w-full" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={voteDistribution} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{ fill: 'hsla(var(--muted))' }} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                      <Bar dataKey="votes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
            <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Manage Candidates</CardTitle>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm"><Plus className="h-4 w-4 mr-2" />Add</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Add New Candidate</DialogTitle></DialogHeader>
                      <form onSubmit={handleAddCandidate} className="space-y-4">
                        <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" name="name" value={formValues.name} onChange={handleInputChange} required /></div>
                        <div className="space-y-2"><Label htmlFor="party">Party</Label><Input id="party" name="party" value={formValues.party} onChange={handleInputChange} required /></div>
                        <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" value={formValues.description} onChange={handleInputChange} /></div>
                        <DialogFooter><Button type="submit">Add Candidate</Button></DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? <Skeleton className="h-20 w-full" /> : candidates.map((candidate) => (
                    <div key={candidate.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Avatar><AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback></Avatar>
                        <div><p className="font-semibold">{candidate.name}</p><p className="text-sm text-muted-foreground">{candidate.party}</p></div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEditClick(candidate)}><Edit className="h-4 w-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button variant="destructive" size="icon" className="h-8 w-8"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the candidate and all associated votes.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteCandidate(candidate.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-8">
            <Card className="animate-in fade-in-0 slide-in-from-left-4 duration-500">
              <CardHeader><CardTitle className="flex items-center"><Vote className="mr-2"/>Total Votes Cast</CardTitle></CardHeader>
              <CardContent>{isLoading || !stats ? <Skeleton className="h-10 w-1/3" /> : <div className="text-4xl font-bold text-primary">{stats.totalVotes}</div>}</CardContent>
            </Card>
            <Card className="animate-in fade-in-0 slide-in-from-left-4 duration-700">
              <CardHeader><CardTitle className="flex items-center"><PieChartIcon className="mr-2"/>Voter Turnout</CardTitle></CardHeader>
              <CardContent className="h-60">
                {isLoading ? <Skeleton className="h-full w-full" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={voterTurnout} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                        {voterTurnout.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                      </Pie>
                      <Legend iconSize={10} wrapperStyle={{fontSize: "0.8rem"}}/>
                      <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
             <Card className="animate-in fade-in-0 slide-in-from-left-4 duration-900">
              <CardHeader><CardTitle className="flex items-center"><Users className="mr-2"/>Registered Voters</CardTitle></CardHeader>
              <CardContent>{isLoading || !stats ? <Skeleton className="h-10 w-1/3" /> : <div className="text-4xl font-bold">{stats.registeredVoters}</div>}</CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Edit Candidate Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Candidate</DialogTitle></DialogHeader>
          <form onSubmit={handleUpdateCandidate} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" name="name" value={formValues.name} onChange={handleInputChange} required /></div>
            <div className="space-y-2"><Label htmlFor="party">Party</Label><Input id="party" name="party" value={formValues.party} onChange={handleInputChange} required /></div>
            <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" value={formValues.description} onChange={handleInputChange} /></div>
            <DialogFooter><Button type="submit">Save Changes</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;