
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Shield, LogOut } from "lucide-react";
import { DarkModeToggle } from "../shared/dark-mode-toggle";

export function AdminHeader() {
  const router = useRouter();
  
  const handleLogout = () => {
    // In a real app, this would clear the admin session/token
    router.push('/admin/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
        <Shield className="h-6 w-6 text-primary" />
        <span className="text-lg">MindShift Admin</span>
      </Link>
      <div className="ml-auto flex items-center gap-2">
        <DarkModeToggle />
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
