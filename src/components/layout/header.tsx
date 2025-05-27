"use client";

import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DarkModeToggle } from "@/components/shared/dark-mode-toggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar"; // Ensure this hook exists and works

// Mock notifications data
const notifications = [
  { id: 1, title: "New assignment posted", description: "Web Development - Due tomorrow", href: "#" },
  { id: 2, title: "Study group meeting", description: "Tomorrow at 3 PM", href: "#" },
  { id: 3, title: "New course material", description: "Machine Learning - Chapter 6", href: "#" },
  { id: 4, title: "Quiz reminder", description: "Data Structures quiz in 2 days", href: "#" },
  { id: 5, title: "Project deadline approaching", description: "Capstone project due next week", href: "#" },
];


export function AppHeader() {
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      {isMobile && (
         <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden -ml-2">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      )}
      <div className="flex-1">
        {/* Title can be dynamic based on page if needed */}
        {/* <h2 className="text-xl font-semibold hidden md:block">Dashboard</h2> */}
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses, materials..."
            className="pl-8 sm:w-[200px] md:w-[250px] lg:w-[300px] rounded-full h-9 bg-card"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full w-9 h-9 bg-card hover:bg-accent/80">
              <Bell className="h-5 w-5 text-foreground" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 flex h-5 w-5 -translate-y-1/3 translate-x-1/3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-primary p-1 text-xs items-center justify-center text-primary-foreground">
                    {notifications.length}
                  </span>
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <div className="p-3 border-b">
              <h3 className="font-semibold text-sm">Notifications</h3>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">No new notifications.</p>
              ) : (
                notifications.map((notification) => (
                  <Link
                    key={notification.id}
                    href={notification.href}
                    className="block px-4 py-3 border-b last:border-b-0 hover:bg-accent/50"
                  >
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {notification.description}
                    </p>
                  </Link>
                ))
              )}
            </div>
            {notifications.length > 0 && (
                <div className="p-2 text-center border-t">
                <Button variant="link" size="sm" className="text-primary" asChild>
                    <Link href="/notifications">View all notifications</Link>
                </Button>
                </div>
            )}
          </PopoverContent>
        </Popover>
        <DarkModeToggle />
      </div>
    </header>
  );
}
