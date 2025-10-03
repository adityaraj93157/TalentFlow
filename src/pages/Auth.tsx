import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const DEMO_ACCOUNTS = {
  recruiter: { email: "recruiter@demo.com", password: "demo123" },
  candidate: { email: "candidate@demo.com", password: "demo123" }
};

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<'recruiter' | 'candidate'>('recruiter');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, signUp, user, userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && userRole) {
      navigate(userRole === 'recruiter' ? '/' : '/candidate-portal');
    }
  }, [user, userRole, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
      } else {
        const { error } = await signUp(email, password, role, fullName);
        if (error) throw error;
        
        toast({
          title: "Account created!",
          description: "Welcome to TalentFlow.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (accountType: 'recruiter' | 'candidate') => {
    setIsLoading(true);
    const demoAccount = DEMO_ACCOUNTS[accountType];
    
    try {
      // Try to sign in first
      const { error: signInError } = await signIn(demoAccount.email, demoAccount.password);
      
      // If invalid credentials, create the demo account first
      if (signInError?.message?.includes('Invalid login credentials')) {
        const { error: signUpError } = await signUp(
          demoAccount.email, 
          demoAccount.password, 
          accountType,
          `Demo ${accountType.charAt(0).toUpperCase() + accountType.slice(1)}`
        );
        
        if (signUpError) throw signUpError;
        
        // Then sign in
        const { error: retrySignInError } = await signIn(demoAccount.email, demoAccount.password);
        if (retrySignInError) throw retrySignInError;
      } else if (signInError) {
        throw signInError;
      }
      
      toast({
        title: "Demo login successful!",
        description: `Logged in as ${accountType}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Demo login failed.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">T</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Welcome to TalentFlow</CardTitle>
          <CardDescription className="text-center">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={isLogin ? "login" : "signup"} onValueChange={(v) => setIsLogin(v === "login")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>

              <div className="mt-6 space-y-2">
                <p className="text-sm text-center text-muted-foreground">Try demo accounts:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleDemoLogin('recruiter')}
                    disabled={isLoading}
                  >
                    Recruiter Demo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDemoLogin('candidate')}
                    disabled={isLoading}
                  >
                    Candidate Demo
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label>I am a:</Label>
                  <Tabs value={role} onValueChange={(v) => setRole(v as 'recruiter' | 'candidate')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
                      <TabsTrigger value="candidate">Candidate</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
