// src/components/AdminPanel.tsx

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface AdminPanelProps { onLogout: () => void; }
type AdminStats = { totalVotes: number; registeredVoters: number; activeCandidates: number; };

const COLORS = ["hsl(var(--primary))", "hsl(var(--muted))"];

const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [voteDistribution, setVoteDistribution] = useState([]);
  const [voterTurnout, setVoterTurnout] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states and Dialog states
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateParty, setNewCandidateParty] = useState('');
  const [newCandidateDesc, setNewCandidateDesc] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);

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

  // All handler functions (handleAdd, handleUpdate, handleDelete) are defined here
  const handleAddCandidate = async (e: React.FormEvent) => { /* ... */ };
  const handleEditClick = (candidate: Candidate) => { /* ... */ };
  const handleUpdateCandidate = async (e: React.FormEvent) => { /* ... */ };
  const handleDeleteCandidate = async (candidateId: number) => { /* ... */ };

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
              <CardHeader><CardTitle>Manage Candidates</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? <Skeleton className="h-12 w-full" /> : candidates.map((candidate) => (
                    <div key={candidate.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Avatar><AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback></Avatar>
                        <div><p className="font-semibold">{candidate.name}</p><p className="text-sm text-muted-foreground">{candidate.party}</p></div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEditClick(candidate)}><Edit className="h-4 w-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button variant="destructive" size="icon" className="h-8 w-8"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                          <AlertDialogContent>{/* ... AlertDialog for Delete ... */}</AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                ))}
                 <Dialog><DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add New Candidate</Button></DialogTrigger><DialogContent>{/* ... Dialog for Add Candidate Form ... */}</DialogContent></Dialog>
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
          </div>
        </div>
      </main>
      {/* All Dialogs and AlertDialogs for Add/Edit/Delete go here */}
    </div>
  );
};

export default AdminPanel;