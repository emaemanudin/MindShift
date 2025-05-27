
"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth/auth-provider"; // Added import

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider> {/* Added AuthProvider */}
        <SidebarProvider defaultOpen>
          {children}
          <Toaster />
        </SidebarProvider>
      </AuthProvider>
    </NextThemesProvider>
  );
}
