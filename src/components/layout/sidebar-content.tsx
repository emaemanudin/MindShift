
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  LogOut,
  SearchCode,
  Loader2,
  Bot,
} from "lucide-react";
import { UserAvatar } from "@/components/shared/user-avatar";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/auth-provider";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/courses", label: "My Courses", icon: BookOpen },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/assignments", label: "Assignments", icon: ListChecks, badge: "3" },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/resource-finder", label: "Resource Finder", icon: SearchCode },
  { href: "/study-groups", label: "Study Groups", icon: Users },
  { href: "/study-buddy", label: "Study Buddy", icon: Bot, badge: "New", badgeVariant: "default" as "default" | "secondary" | "destructive" | "outline" | null | undefined },
  { href: "/virtual-classroom", label: "Virtual Classroom", icon: Video },
];

const bottomNavItems = [
 { href: "/settings", label: "Settings", icon: Settings },
];


export function AppSidebarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { user, isLoading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push("/");
  };

  return (
    <>
      <SidebarHeader className="p-4 gradient-bg-sidebar text-primary-foreground">
        <Link href="/dashboard" className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8" />
          <h1 className="text-2xl font-bold">MindShift</h1>
        </Link>
      </SidebarHeader>
      <SidebarGroup className="p-4 border-b">
        {isLoading ? (
          <div className="flex items-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <div className="ml-3 space-y-1">
              <p className="text-sm font-semibold">Loading...</p>
            </div>
          </div>
        ) : user ? (
          <div className="flex items-center">
             <UserAvatar src={user.photoURL} fallbackInitials={user.displayName?.charAt(0) || "U"} size="md"/>
             <div className="ml-3">
                <p className="font-semibold text-sm truncate">{user.displayName || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        ) : (
         <div className="flex items-center">
             <UserAvatar fallbackInitials="MS" />
             <div className="ml-3">
                <p className="font-semibold text-sm">MindShift App</p>
                <p className="text-xs text-muted-foreground">Explore features</p>
            </div>
          </div>
        )}
      </SidebarGroup>

      <SidebarMainContent className="flex-grow">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                className="justify-start"
                tooltip={item.label}
                disabled={isLoading || !user}
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
                disabled={isLoading || !user}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {user && (
             <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="justify-start"
                  tooltip="Log Out"
                  disabled={isLoading}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Log Out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          )}
         </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
