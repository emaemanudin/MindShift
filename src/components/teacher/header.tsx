
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { School, LogOut, LayoutDashboard, BookCopy, ClipboardCheck, FilePenLine, UserSquare, Menu } from "lucide-react";
import { DarkModeToggle } from "../shared/dark-mode-toggle";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
    { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/teacher/courses", label: "Courses", icon: BookCopy },
    { href: "/teacher/assignments", label: "Assignments", icon: ClipboardCheck },
    { href: "/teacher/quizzes", label: "Quizzes", icon: FilePenLine },
    { href: "/dashboard", label: "Student View", icon: UserSquare }, // Link to student dashboard
];

export function TeacherHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const handleLogout = () => {
    logout();
    toast({
        title: "Logged Out",
        description: "You have successfully logged out.",
    });
    router.push('/');
  };
  
  const NavLinks = ({ inSheet = false }: { inSheet?: boolean }) => (
    navItems.map(item => (
        <Button 
            key={item.href} 
            variant="ghost" 
            asChild 
            className={cn(
                "text-muted-foreground w-full justify-start", 
                (pathname.startsWith(item.href) && item.href !== '/dashboard') || (pathname === item.href) 
                    ? "text-primary bg-accent"
                    : "hover:text-primary hover:bg-accent/50",
                inSheet && "text-lg p-4 h-auto"
            )}
        >
            <Link href={item.href}>
              <item.icon className="mr-2 h-5 w-5" />
              {item.label}
            </Link>
        </Button>
    ))
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Link href="/teacher/dashboard" className="flex items-center gap-2 font-semibold shrink-0">
        <School className="h-6 w-6 text-primary" />
        <span className="text-lg hidden md:block">MindShift Teacher</span>
      </Link>
      
      {isMobile ? (
         <div className="ml-auto flex items-center gap-2">
            <DarkModeToggle />
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Open navigation</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-4">
                    <nav className="grid gap-4 text-lg font-medium mt-8">
                       <NavLinks inSheet />
                    </nav>
                </SheetContent>
            </Sheet>
         </div>
      ) : (
         <>
            <nav className="flex-1 flex justify-center items-center gap-2">
                <NavLinks />
            </nav>
            <div className="flex items-center gap-2">
              <DarkModeToggle />
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span className="hidden md:block">Logout</span>
              </Button>
            </div>
         </>
      )}
    </header>
  );
}
