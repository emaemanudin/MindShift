
"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserAvatar } from "@/components/shared/user-avatar";
import { useAuth } from "@/components/auth/auth-provider";
import {
  User,
  Palette,
  Bot,
  KeyRound,
  Info,
  ChevronRight,
  Globe,
  Link2,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState({
    name: user?.displayName || "Developer",
    email: user?.email || "dev@mindshift.com",
  });
  const [theme, setTheme] = useState("system");
  
  const isProfileEditable = role === 'admin';

  const handleProfileSave = () => {
    // This is a mock save.
    toast({
        title: "Profile Saved",
        description: "Your profile information has been updated.",
    });
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account, appearance, and platform configurations.
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" /> Profile & Appearance
            </TabsTrigger>
            <TabsTrigger value="account">
              <KeyRound className="mr-2 h-4 w-4" /> Account & Security
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Bot className="mr-2 h-4 w-4" /> AI Configuration
            </TabsTrigger>
            <TabsTrigger value="about">
              <Info className="mr-2 h-4 w-4" /> About
            </TabsTrigger>
          </TabsList>
          
          {/* Profile & Appearance Tab */}
          <TabsContent value="profile">
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>
                      This is how your profile appears to others.
                      {!isProfileEditable && " Only admins can change this information."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                      <UserAvatar
                        src={user?.photoURL}
                        fallbackInitials={userProfile.name.charAt(0) || "D"}
                        size="lg"
                      />
                      <Button variant="outline" disabled={!isProfileEditable}>Upload New Picture</Button>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={userProfile.name}
                          onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                          disabled={!isProfileEditable}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value={userProfile.email} disabled />
                    </div>
                    <Button onClick={handleProfileSave} disabled={!isProfileEditable}>Save Profile</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                      Customize the look and feel of the application.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System Default</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Note: Live theme toggling is in the header. This sets the default.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                       <Select defaultValue="en-us">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en-us">English (United States)</SelectItem>
                          <SelectItem value="es-es">Español (España)</SelectItem>
                          <SelectItem value="fr-fr">Français (France)</SelectItem>
                          <SelectItem value="am-et">አማርኛ (ኢትዮጵያ)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
            </div>
          </TabsContent>
          
           {/* Account & Security Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account & Security</CardTitle>
                <CardDescription>
                  Manage your password and other security settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Change Password</CardTitle>
                    </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input id="confirm-password" type="password" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Update Password</Button>
                    </CardFooter>
                 </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Platform Portals</CardTitle>
                        <CardDescription>Access other parts of the MindShift ecosystem based on your role.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {role === 'admin' && (
                            <Link href="/admin/dashboard" className="flex items-center justify-between p-3 rounded-lg hover:bg-accent">
                                <div>
                                    <h4 className="font-semibold">Admin Dashboard</h4>
                                    <p className="text-sm text-muted-foreground">Manage users, courses, and system-wide settings.</p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </Link>
                        )}
                         {(role === 'admin' || role === 'teacher') && (
                             <Link href="/teacher/dashboard" className="flex items-center justify-between p-3 rounded-lg hover:bg-accent">
                                 <div>
                                    <h4 className="font-semibold">Teacher Portal</h4>
                                    <p className="text-sm text-muted-foreground">Track student progress and manage classroom content.</p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </Link>
                         )}
                         <Link href="/dashboard" className="flex items-center justify-between p-3 rounded-lg hover:bg-accent">
                             <div>
                                <h4 className="font-semibold">Student Dashboard</h4>
                                <p className="text-sm text-muted-foreground">Access your courses, assignments, and study tools.</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </Link>
                    </CardContent>
                 </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Configuration Tab */}
          <TabsContent value="ai">
             <Card>
              <CardHeader>
                <CardTitle>AI Configuration</CardTitle>
                <CardDescription>
                  Fine-tune the behavior of the AI-powered features.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Study Buddy Defaults</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                        <Select defaultValue="general">
                          <SelectTrigger><SelectValue placeholder="Default Subject" /></SelectTrigger>
                          <SelectContent><SelectItem value="general">General</SelectItem></SelectContent>
                        </Select>
                        <Select defaultValue="high-school">
                          <SelectTrigger><SelectValue placeholder="Default Complexity" /></SelectTrigger>
                           <SelectContent><SelectItem value="high-school">High School</SelectItem></SelectContent>
                        </Select>
                         <Select defaultValue="English">
                          <SelectTrigger><SelectValue placeholder="Default Language" /></SelectTrigger>
                           <SelectContent><SelectItem value="English">English</SelectItem></SelectContent>
                        </Select>
                    </div>
                  </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">Personalize Learning Paths</Label>
                      <p className="text-sm text-muted-foreground">Allow AI to analyze performance to suggest study plans.</p>
                    </div>
                    <Switch defaultChecked/>
                  </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    <Globe className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl mt-2">MindShift Learning Platform</CardTitle>
                <CardDescription>
                    Version 1.0.0 (Developer Demo Build)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center justify-between p-4 border rounded-lg">
                    <p className="font-medium">System Status</p>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-green-600 font-semibold">All Systems Operational</span>
                    </div>
                 </div>
                 <div className="text-center text-xs text-muted-foreground pt-4">
                    <p>Built with Next.js, ShadCN/UI, Tailwind CSS, and Genkit.</p>
                    <p>&copy; {new Date().getFullYear()} MindShift. All Rights Reserved.</p>
                 </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
