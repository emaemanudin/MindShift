
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { School, LogIn } from "lucide-react";
import Link from 'next/link';
import { useAuth } from '@/components/auth/auth-provider';

export default function TeacherLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    
    // Simple check for demo purposes. NOT FOR PRODUCTION.
    if (email === 'teacher@teacher.com' && password === 'teacher') {
      toast({
        title: "Login Successful",
        description: "Redirecting to the Teacher Dashboard...",
      });
      login('teacher');
      router.push('/teacher/dashboard');
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-primary/10 p-3 rounded-full">
            <School className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Teacher Portal</CardTitle>
          <CardDescription>
            Enter credentials to access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="teacher@teacher.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button className="w-full text-lg py-6" onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "Signing In..." : (
                <>
                    <LogIn className="mr-2 h-5 w-5"/> Login
                </>
            )}
          </Button>
           <p className="text-center text-xs text-muted-foreground">
                For demo: use <strong>teacher@teacher.com</strong> and password <strong>teacher</strong>.
            </p>
        </CardFooter>
      </Card>
        <Link href="/" className="text-sm text-primary hover:underline mt-6">
            &larr; Back to Main Portal
        </Link>
    </div>
  );
}
