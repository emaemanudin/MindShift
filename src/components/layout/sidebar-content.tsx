
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Briefcase,
  SearchCode,
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
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

  return (
    <>
      <SidebarHeader className="p-4 gradient-bg-sidebar text-primary-foreground">
        <Link href="/" className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8" />
          <h1 className="text-2xl font-bold">StudyGuru</h1>
        </Link>
      </SidebarHeader>
      <SidebarGroup className="p-4 border-b">
         <div className="flex items-center">
            <UserAvatar src="https://placehold.co/40x40.png" alt="Sarah Johnson" fallbackInitials="SJ" aiHint="profile woman" />
            <div className="ml-3">
                <p className="font-semibold text-sm">Sarah Johnson</p>
                <p className="text-xs text-muted-foreground">Computer Science</p>
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
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
           <SidebarMenuItem>
             <Link href="/login" className="w-full">
              <Button variant="ghost" className="w-full justify-start h-8 text-sm font-normal hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <LogOut className="h-5 w-5 mr-2" />
                <span>Logout</span>
              </Button>
             </Link>
           </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
