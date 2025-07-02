
"use client";

import { useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/auth-provider';

interface LoginDialogProps {
  children: ReactNode; // This will be the trigger button
}

export function LoginDialog({ children }: LoginDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Unified login for all roles
    if (email === 'admin@admin.com' && password === 'admin') {
      toast({
        title: "Admin Login Successful",
        description: "Redirecting to the Admin Dashboard...",
      });
      login('admin');
      router.push('/admin/dashboard');
    } else if (email === 'teacher@teacher.com' && password === 'teacher') {
      toast({
        title: "Teacher Login Successful",
        description: "Redirecting to the Teacher Dashboard...",
      });
      login('teacher');
      router.push('/teacher/dashboard');
    } else if (email === 'dev@mindshift.com' && password === 'dev') {
      toast({
        title: "Student Login Successful",
        description: "Redirecting to your dashboard...",
      });
      login('student');
      router.push('/dashboard');
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid credentials. Please check your email and password.",
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">Welcome Back</DialogTitle>
          <DialogDescription className="text-center">
            Enter your credentials to access your dashboard.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-login">Email</Label>
            <Input
              id="email-login"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-login">Password</Label>
            <Input
              id="password-login"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Login"}
          </Button>
        </form>
        <div className="text-center text-xs text-muted-foreground mt-2 px-4 leading-relaxed">
          <p><strong>Demo Users:</strong></p>
          <p>Student: <strong>dev@mindshift.com</strong> (pw: dev)</p>
          <p>Teacher: <strong>teacher@teacher.com</strong> (pw: teacher)</p>
          <p>Admin: <strong>admin@admin.com</strong> (pw: admin)</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
