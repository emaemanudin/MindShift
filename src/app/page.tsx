"use client";

import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/header';
import { LoginDialog } from '@/components/landing/login-dialog';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      <LandingHeader />
      <main className="flex-1 flex items-center justify-center pt-20">
        <div className="container mx-auto text-center px-4">
          <div 
            className="inline-block px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full mb-4 animate-in fade-in duration-500"
            style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
          >
            New: AI-Powered Quiz Generation!
          </div>
          <h1 
            className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}
          >
            The Future of Learning, <br />
            <span className="text-primary">Powered by AI.</span>
          </h1>
          <p 
            className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: '600ms', animationFillMode: 'backwards' }}
          >
            MindShift is an intelligent platform designed to personalize your educational journey, streamline your studies, and unlock your full potential.
          </p>
          <div 
            className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: '800ms', animationFillMode: 'backwards' }}
          >
            <LoginDialog>
              <Button size="lg" className="text-lg px-8 py-6 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">Get Started</Button>
            </LoginDialog>
          </div>
        </div>
      </main>
      <footer className="py-6 animate-in fade-in duration-500" style={{ animationDelay: '1000ms', animationFillMode: 'backwards' }}>
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MindShift. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
