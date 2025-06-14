
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // Removed useRouter
import {
  GraduationCap,
  Home,
  BookOpen,
  CalendarDays,
  ListChecks,
  LineChart,
  Users,
  Video,
  Settings,
  // LogOut, // Removed LogOut
  SearchCode,
  // Loader2, // Removed Loader2
} from "lucide-react";
// import { UserAvatar } from "@/components/shared/user-avatar"; // Removed UserAvatar
import {
  SidebarHeader,
  SidebarContent as SidebarMainContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button"; // Removed Button
// import { signOutUser } from "@/lib/firebase/auth"; // Removed signOutUser
// import { useToast } from "@/hooks/use-toast"; // Removed useToast
// import { useAuth } from "@/components/auth/auth-provider"; // Removed useAuth

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/courses", label: "My Courses", icon: BookOpen },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/assignments", label: "Assignments", icon: ListChecks, badge: "3" },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/study-groups", label: "Study Groups", icon: Users, badge: "2", badgeVariant: "default" as "default" | "secondary" | "destructive" | "outline" | null | undefined },
  { href: "/virtual-classroom", label: "Virtual Classroom", icon: Video },
  { href: "/resource-finder", label: "AI Resources", icon: SearchCode},
];

const bottomNavItems = [
 { href: "/settings", label: "Settings", icon: Settings },
];


export function AppSidebarContent() {
  const pathname = usePathname();
  // const router = useRouter();
  // const { toast } = useToast();
  // const { user, isLoading } = useAuth();

  // const handleLogout = async () => {
  //   try {
  //     await signOutUser();
  //     toast({
  //       title: "Logged Out",
  //       description: "You have been successfully logged out.",
  //     });
  //     router.push("/login");
  //   } catch (error) {
  //     console.error("Logout error:", error);
  //     toast({
  //       title: "Logout Failed",
  //       description: "Could not log out. Please try again.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  return (
    <>
      <SidebarHeader className="p-4 gradient-bg-sidebar text-primary-foreground">
        <Link href="/" className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8" />
          <h1 className="text-2xl font-bold">StudyGuru</h1>
        </Link>
      </SidebarHeader>
      <SidebarGroup className="p-4 border-b">
        {/* Removed user info display */}
         <div className="flex items-center">
             {/* <UserAvatar fallbackInitials="SG" /> Guest User / Placeholder */}
             <div className="ml-3">
                <p className="font-semibold text-sm">StudyGuru App</p>
                <p className="text-xs text-muted-foreground">Explore features</p>
            </div>
          </div>
      </SidebarGroup>

      <SidebarMainContent className="flex-grow">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
                className="justify-start"
                tooltip={item.label}
                // disabled={isLoading || (!user && item.href !== "/login" && item.href !== "/signup")} // Removed disabled logic
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant={item.badgeVariant || "destructive"} className="ml-auto h-5 px-2">{item.badge}</Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarMainContent>
      
      <SidebarSeparator />
      
      <SidebarFooter className="p-2">
         <SidebarMenu>
           {bottomNavItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className="justify-start"
                tooltip={item.label}
                // disabled={isLoading || !user} // Removed disabled logic
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
           {/* Removed Logout Button */}
         </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
