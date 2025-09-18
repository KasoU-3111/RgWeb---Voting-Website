// src/components/AuthForm.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

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
      setIsRegisterOpen(false);
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
          <div className="flex justify-center mb-4"><Shield className="h-12 w-12 text-primary" /></div>
          <CardTitle className="text-2xl">VoteSecure Access</CardTitle>
          <CardDescription>Secure authentication for digital voting</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="voter_login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="voter_login">Voter Login</TabsTrigger>
              <TabsTrigger value="admin_login">Admin Login</TabsTrigger>
            </TabsList>
            
            <TabsContent value="voter_login">
              <form onSubmit={handleLogin} className="space-y-4 pt-4">
                <div className="space-y-2"><Label htmlFor="login-email">Email</Label><Input id="login-email" type="email" placeholder="Enter your email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="login-password">Password</Label><Input id="login-password" type="password" placeholder="Enter your password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} /></div>
                <Button type="submit" className="w-full" variant="civic" disabled={isLoading}>{isLoading ? "Authenticating..." : "Login"}</Button>
              </form>
            </TabsContent>
            
            <TabsContent value="admin_login">
               <form onSubmit={handleLogin} className="space-y-4 pt-4">
                <div className="space-y-2"><Label htmlFor="admin-email">Email</Label><Input id="admin-email" type="email" placeholder="Enter admin email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="admin-password">Password</Label><Input id="admin-password" type="password" placeholder="Enter admin password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} /></div>
                <Button type="submit" className="w-full" variant="hero" disabled={isLoading}>{isLoading ? "Authenticating..." : "Admin Login"}</Button>
              </form>
            </TabsContent>
          </Tabs>

          <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Not registered yet?{" "}
              <DialogTrigger asChild>
                <Button variant="link" className="p-0 h-auto">Register</Button>
              </DialogTrigger>
            </div>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register an Account</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="voter_register" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="voter_register">Voter Registration</TabsTrigger>
                  <TabsTrigger value="admin_register">Admin Registration</TabsTrigger>
                </TabsList>
                <TabsContent value="voter_register">
                  <form onSubmit={handleRegister} className="space-y-4 pt-4">
                    <p className="text-sm text-center text-muted-foreground">Create a new voter account.</p>
                    <div className="space-y-2"><Label htmlFor="reg-name">Full Name</Label><Input id="reg-name" type="text" placeholder="Enter your full name" required value={regFullName} onChange={(e) => setRegFullName(e.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="reg-email">Email</Label><Input id="reg-email" type="email" placeholder="Enter your email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="reg-password">Password</Label><Input id="reg-password" type="password" placeholder="Create a password" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} /></div>
                    <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Registering..." : "Create Account"}</Button>
                  </form>
                </TabsContent>
                <TabsContent value="admin_register">
                  <div className="text-center p-6 space-y-4">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto" />
                    <h3 className="font-semibold">Admin Registration is Restricted</h3>
                    <p className="text-sm text-muted-foreground">For security, new administrator accounts must be created by an existing admin from the Admin Panel.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;