// src/components/AuthForm.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Mail, Lock, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { loginUser, registerUser } from "@/services/apiService";
import { LoginCredentials, RegisterUserData } from "@/types";
import { useAuth } from "@/context/AuthContext";

const AuthForm = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const credentials: LoginCredentials = { email: loginEmail, password: loginPassword };
    
    try {
      const data = await loginUser(credentials);
      login(data.user, data.token); 
      toast.success('Login successful!');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred during login.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // THIS IS THE CORRECTED FUNCTION
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const userData: RegisterUserData = {
      fullName: regFullName,
      email: regEmail,
      password: regPassword,
    };

    try {
      const data = await registerUser(userData);
      toast.success(data.message + " Please log in.");
      
      setRegFullName('');
      setRegEmail('');
      setRegPassword('');
      // In a real app, you might want to switch the tab to 'login' here
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred during registration.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">VoteSecure Access</CardTitle>
          <CardDescription>
            Secure authentication for digital voting
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="login-email" type="email" placeholder="Enter your email" className="pl-10" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="login-password" type="password" placeholder="Enter your password" className="pl-10" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" variant="civic" disabled={isLoading}>
                  {isLoading ? "Authenticating..." : "Login"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Full Name</Label>
                   <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="reg-name" type="text" placeholder="Enter your full name" className="pl-10" required value={regFullName} onChange={(e) => setRegFullName(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="reg-email" type="email" placeholder="Enter your email" className="pl-10" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="reg-password" type="password" placeholder="Create a password" className="pl-10" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" variant="hero" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;