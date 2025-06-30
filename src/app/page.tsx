"use client";

import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/header';
import { LoginDialog } from '@/components/landing/login-dialog';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <LandingHeader />
      <main className="flex-1 flex items-center justify-center pt-20">
        <div className="container mx-auto text-center px-4">
          <div className="inline-block px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full mb-4">
            New: AI-Powered Quiz Generation!
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">
            The Future of Learning, <br />
            <span className="text-primary">Powered by AI.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            MindShift is an intelligent platform designed to personalize your educational journey, streamline your studies, and unlock your full potential.
          </p>
          <div className="flex justify-center">
            <LoginDialog>
              <Button size="lg" className="text-lg px-8 py-6">Get Started</Button>
            </LoginDialog>
          </div>
        </div>
      </main>
      <footer className="py-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MindShift. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
