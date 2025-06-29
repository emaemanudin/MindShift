
"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { User } from "firebase/auth";
// Keep this import for the type, but no firebase logic

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A mock user object to use when auth is disabled.
// Using a 'type assertion' for complex Firebase properties we don't need.
const mockUser = {
  uid: "mock-developer-id",
  email: "dev@mindshift.com",
  displayName: "Developer",
  photoURL: `https://randomuser.me/api/portraits/lego/1.jpg`,
  emailVerified: true,
  isAnonymous: false,
} as User;


// This is a mock AuthProvider to disable authentication for development.
export function AuthProvider({ children }: { children: ReactNode }) {
  const value = {
    user: mockUser, // Always provide a mock user
    isLoading: false, // Never in loading state
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
