"use client";

import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { DarkModeToggle } from '@/components/shared/dark-mode-toggle';
import { Button } from '@/components/ui/button';
import { LoginDialog } from './login-dialog';

export function LandingHeader() {
  const navItems = [
    { href: '/about', label: 'About Us' },
    { href: '/team', label: 'Our Team' },
    { href: '/contact', label: 'Contact Us' },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <GraduationCap className="h-7 w-7 text-primary" />
          <span>MindShift</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className="text-muted-foreground hover:text-primary transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LoginDialog>
             <Button variant="ghost">Log In</Button>
          </LoginDialog>
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
