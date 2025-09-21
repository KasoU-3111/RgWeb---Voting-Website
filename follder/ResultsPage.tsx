// src/components/ResultsPage.tsx

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Shield, Trophy, Users, TrendingUp, User, ArrowLeft, Zap } from "lucide-react";
import { getResults } from "@/services/apiService";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
import { Result } from "@/types"; // <-- IMPORT our new type

interface ResultsPageProps { onBack: () => void; }

const COLORS = ["hsl(var(--primary))", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F"];

const ResultsPage = ({ onBack }: ResultsPageProps) => {
  const [results, setResults] = useState<Result[]>([]); // <-- USE the new type
  const [totalVotes, setTotalVotes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        const data = await getResults();
        setResults(data.results);
        setTotalVotes(data.totalVotes);
      } catch (error) {
        if (error instanceof Error) toast.error(`Failed to load results: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, []);

  const winner = results.length > 0 ? results[0] : null;

  if (isLoading) {
    return <div className="min-h-screen animated-gradient flex items-center justify-center"><Skeleton className="h-96 w-3/4 bg-black/20"/></div>
  }

  return (
    <div className="min-h-screen animated-gradient text-primary-foreground">
      <header className="sticky top-0 z-50 animate-in fade-in-0 duration-1000">
        <div className="container mx-auto px-4 py-4">
          <div className="rounded-lg border border-white/10 bg-black/10 px-4 py-2 backdrop-blur-lg flex items-center justify-between">
            <div className="flex items-center space-x-3"><Zap className="h-7 w-7 text-primary" /><h1 className="text-xl font-bold">Election Results</h1></div>
            <Button onClick={onBack} variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/20"><ArrowLeft className="h-4 w-4 mr-2" />Back to Home</Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {winner && (
            <Card className="mb-12 border-primary/30 bg-black/20 backdrop-blur-lg animate-in fade-in-0 slide-in-from-bottom-10 duration-700">
              <CardHeader className="text-center pb-4"><div className="flex justify-center mb-4"><div className="rounded-full bg-primary/20 p-4 animate-glow border-2 border-primary/50"><Trophy className="h-12 w-12 text-primary" /></div></div><CardTitle className="text-4xl text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">Election Winner</CardTitle><CardDescription className="text-muted-foreground">The results are finalized. Here is your elected representative.</CardDescription></CardHeader>
              <CardContent className="text-center">
                <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-6 mb-4">
                  <Avatar className="w-24 h-24 border-4 border-primary/50 mb-4 sm:mb-0"><AvatarFallback className="text-4xl bg-background/80"><User className="h-12 w-12" /></AvatarFallback></Avatar>
                  <div>
                    <h3 className="text-3xl font-bold text-white">{winner.name}</h3>
                    <p className="text-primary/80 font-semibold">{winner.party}</p>
                    <div className="flex items-center justify-center space-x-4 mt-3"><span className="text-5xl font-bold">{winner.votes}</span><span className="text-muted-foreground mt-3">votes</span><Badge className="bg-primary/20 text-primary border-primary/50 text-lg">{winner.percentage}%</Badge></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="border-white/10 bg-black/20 backdrop-blur-lg animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-200"><CardHeader><CardTitle className="text-lg flex items-center"><Users className="mr-3 text-primary"/>Total Votes Cast</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold">{totalVotes}</p></CardContent></Card>
            <Card className="border-white/10 bg-black/20 backdrop-blur-lg animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-300"><CardHeader><CardTitle className="text-lg flex items-center"><TrendingUp className="mr-3 text-primary"/>Voter Turnout</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold">N/A</p></CardContent></Card>
            <Card className="border-white/10 bg-black/20 backdrop-blur-lg animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-400"><CardHeader><CardTitle className="text-lg flex items-center"><Shield className="mr-3 text-primary"/>Winning Margin</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold">N/A</p></CardContent></Card>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            <Card className="lg:col-span-3 border-white/10 bg-black/20 backdrop-blur-lg animate-in fade-in-0 slide-in-from-bottom-5 duration-700"><CardHeader><CardTitle>Vote Distribution</CardTitle></CardHeader><CardContent className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={results} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} /><Tooltip cursor={{ fill: 'hsla(var(--muted))' }} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} /><Bar dataKey="votes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="lg:col-span-2 border-white/10 bg-black/20 backdrop-blur-lg animate-in fade-in-0 slide-in-from-bottom-5 duration-700 delay-200"><CardHeader><CardTitle>Vote Share</CardTitle></CardHeader><CardContent className="h-80"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={results} dataKey="votes" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}><Cell key="cell-0" fill={COLORS[0]}/><Cell key="cell-1" fill={COLORS[1]}/><Cell key="cell-2" fill={COLORS[2]}/></Pie><Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;