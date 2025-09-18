import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Shield, Users, Plus, Edit, Trash2, LogOut, User } from "lucide-react";
import { getAdminStats, getCandidates, addCandidate, updateCandidate, deleteCandidate } from "@/services/apiService";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
import { Candidate } from "@/types";

interface AdminPanelProps {
  onLogout: () => void;
}

type AdminStats = {
  totalVotes: number;
  registeredVoters: number;
  activeCandidates: number;
};

const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateParty, setNewCandidateParty] = useState('');
  const [newCandidateDesc, setNewCandidateDesc] = useState('');

  // State for the Edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);

  // Fetches both stats and candidates data
  const fetchData = async () => {
    try {
      // Use Promise.all to fetch both sets of data concurrently
      const [statsData, candidatesData] = await Promise.all([
        getAdminStats(),
        getCandidates(),
      ]);
      setStats(statsData);
      setCandidates(candidatesData);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to load dashboard data: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on initial component load
  useEffect(() => {
    fetchData();
  }, []);
  
  // Handler to add a new candidate
  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCandidate({
        name: newCandidateName,
        party: newCandidateParty,
        description: newCandidateDesc,
      });
      toast.success("Candidate added successfully!");
      // Reset form and refetch all data to update the UI
      setNewCandidateName('');
      setNewCandidateParty('');
      setNewCandidateDesc('');
      fetchData();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to add candidate: ${error.message}`);
      }
    }
  };

  const handleEditClick = (candidate: Candidate) => {
    // Make a copy of the candidate to avoid direct state mutation
    setCurrentCandidate({ ...candidate });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCandidate) return;

    try {
      await updateCandidate(currentCandidate.id, {
        name: currentCandidate.name,
        party: currentCandidate.party,
        description: currentCandidate.description,
      });
      toast.success("Candidate updated successfully!");
      setIsEditDialogOpen(false);
      setCurrentCandidate(null);
      fetchData(); // Refresh data
    } catch (error) {
      if (error instanceof Error) toast.error(`Update failed: ${error.message}`);
    }
  };

  const handleDeleteCandidate = async (candidateId: number) => {
    try {
      await deleteCandidate(candidateId);
      toast.success("Candidate deleted successfully!");
      fetchData(); // Refresh data
    } catch (error) {
      if (error instanceof Error) toast.error(`Delete failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">VoteSecure Admin Panel</h1>
          </div>
          <Button variant="outline" onClick={onLogout}><LogOut className="h-4 w-4 mr-2" />Logout</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Votes</CardTitle></CardHeader><CardContent>{isLoading || !stats ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold text-primary">{stats.totalVotes}</div>}</CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Registered Voters</CardTitle></CardHeader><CardContent>{isLoading || !stats ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold text-success">{stats.registeredVoters}</div>}</CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Active Candidates</CardTitle></CardHeader><CardContent>{isLoading || !stats ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold text-secondary">{stats.activeCandidates}</div>}</CardContent></Card>
        </div>

        <Tabs defaultValue="candidates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="voters">Voters</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="candidates" className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center space-x-2"><Plus className="h-5 w-5" /><span>Add New Candidate</span></CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleAddCandidate} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" value={newCandidateName} onChange={(e) => setNewCandidateName(e.target.value)} placeholder="Candidate name" required /></div>
                    <div className="space-y-2"><Label htmlFor="party">Party</Label><Input id="party" value={newCandidateParty} onChange={(e) => setNewCandidateParty(e.target.value)} placeholder="Political party" required /></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={newCandidateDesc} onChange={(e) => setNewCandidateDesc(e.target.value)} placeholder="Candidate description and platform" /></div>
                  <Button type="submit"><Plus className="h-4 w-4 mr-2" />Add Candidate</Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Manage Candidates</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? <Skeleton className="h-12 w-full" /> : candidates.map((candidate) => (
                    <div key={candidate.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar><AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback></Avatar>
                        <div>
                          <p className="font-medium">{candidate.name}</p>
                          <p className="text-sm text-muted-foreground">{candidate.party}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(candidate)}><Edit className="h-4 w-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the candidate and cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCandidate(candidate.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Candidate</DialogTitle></DialogHeader>
          {currentCandidate && (
            <form onSubmit={handleUpdateCandidate} className="space-y-4">
              <div className="space-y-2"><Label htmlFor="edit-name">Name</Label><Input id="edit-name" value={currentCandidate.name} onChange={(e) => setCurrentCandidate({ ...currentCandidate, name: e.target.value })} required /></div>
              <div className="space-y-2"><Label htmlFor="edit-party">Party</Label><Input id="edit-party" value={currentCandidate.party} onChange={(e) => setCurrentCandidate({ ...currentCandidate, party: e.target.value })} required /></div>
              <div className="space-y-2"><Label htmlFor="edit-description">Description</Label><Textarea id="edit-description" value={currentCandidate.description || ''} onChange={(e) => setCurrentCandidate({ ...currentCandidate, description: e.target.value })} /></div>
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;