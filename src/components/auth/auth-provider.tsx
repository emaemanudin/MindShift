
"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

// Mock User type, not real firebase
type User = {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
};
export type UserRole = "student" | "teacher" | "admin" | null;

// Mock users for different roles
const mockUsers: Record<Exclude<UserRole, null>, User> = {
  student: {
    uid: "student-id-01",
    email: "dev@mindshift.com",
    displayName: "Dev User",
    photoURL: "https://randomuser.me/api/portraits/lego/1.jpg",
  },
  teacher: {
    uid: "teacher-id-01",
    email: "teacher@teacher.com",
    displayName: "Dr. Emily Carter",
    photoURL: "https://randomuser.me/api/portraits/women/50.jpg",
  },
  admin: {
    uid: "admin-id-01",
    email: "admin@admin.com",
    displayName: "Platform Admin",
    photoURL: "https://randomuser.me/api/portraits/men/32.jpg",
  },
};

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isLoading: boolean;
  login: (role: Exclude<UserRole, null>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On initial load, try to get user from localStorage
    try {
      const storedUser = localStorage.getItem("mindshift-user");
      const storedRole = localStorage.getItem("mindshift-role") as UserRole;
      if (storedUser && storedRole) {
        setUser(JSON.parse(storedUser));
        setRole(storedRole);
      }
    } catch (error) {
      // localStorage is not available or error parsing
      console.error("Could not load user from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((loginRole: Exclude<UserRole, null>) => {
    const userToLogin = mockUsers[loginRole];
    localStorage.setItem("mindshift-user", JSON.stringify(userToLogin));
    localStorage.setItem("mindshift-role", loginRole);
    setUser(userToLogin);
    setRole(loginRole);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("mindshift-user");
    localStorage.removeItem("mindshift-role");
    setUser(null);
    setRole(null);
  }, []);

  const value = { user, role, isLoading, login, logout };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
