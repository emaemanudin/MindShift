
"use client"; // Required because we use useAuth hook

import { AppLayout } from "@/components/layout/app-layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { PomodoroTimer } from "@/components/dashboard/pomodoro-timer";
import { ProgressOverview } from "@/components/dashboard/progress-overview";
import { CourseCard, type Course } from "@/components/dashboard/course-card";
import { TaskItem, type Task } from "@/components/dashboard/task-item";
import { StudyGroupItem, type StudyGroup } from "@/components/dashboard/study-group-item";
import { ActivityItem, type Activity } from "@/components/dashboard/activity-item";
import { ResourceFinderCard } from "@/components/dashboard/resource-finder-card";
import { FloatingActionButton } from "@/components/shared/floating-action-button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-provider"; // Added import

import {
  BookOpenCheck,
  CheckCircle2,
  ListTodo,
  Clock,
  Laptop,
  Database,
  BrainCircuit,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Users,
  MessageSquare,
  Trophy,
  Award,
  Check,
  ArrowRight,
  Filter,
  Plus,
  Star,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock Data
const stats = [
  { title: "Active Courses", value: "5", icon: BookOpenCheck, iconBg: "bg-blue-500/10", iconColor: "text-blue-500" },
  { title: "Completed", value: "12", icon: CheckCircle2, iconBg: "bg-green-500/10", iconColor: "text-green-500" },
  { title: "Pending Tasks", value: "3", icon: ListTodo, iconBg: "bg-yellow-500/10", iconColor: "text-yellow-500" },
  { title: "Study Hours", value: "42", icon: Clock, iconBg: "bg-primary/10", iconColor: "text-primary" },
];

const courses: Course[] = [
  { id: "1", title: "Web Development", description: "Learn modern web development with HTML, CSS, and JavaScript.", status: "Active", progress: 65, lessons: 12, duration: "8h 30m", rating: 4.8, icon: Laptop, iconBgColor: "bg-blue-500/10", image: "https://placehold.co/600x400.png", imageAiHint: "coding laptop" },
  { id: "2", title: "Database Systems", description: "Master SQL and database design principles.", status: "Active", progress: 80, lessons: 8, duration: "6h 15m", rating: 4.6, icon: Database, iconBgColor: "bg-purple-500/10", image: "https://placehold.co/600x400.png", imageAiHint: "database server" },
  { id: "3", title: "Machine Learning", description: "Introduction to AI and machine learning algorithms.", status: "Active", progress: 45, lessons: 5, duration: "4h 20m", rating: 4.9, icon: BrainCircuit, iconBgColor: "bg-green-500/10", image: "https://placehold.co/600x400.png", imageAiHint: "robot ai" },
];

const tasks: Task[] = [
  { id: "1", title: "Web Dev Assignment", dueDate: "Due tomorrow", icon: AlertCircle, iconBgClass: "bg-red-500/10", iconColorClass: "text-red-500", completed: false },
  { id: "2", title: "Database Quiz", dueDate: "Due in 3 days", icon: HelpCircle, iconBgClass: "bg-yellow-500/10", iconColorClass: "text-yellow-500", completed: true },
  { id: "3", title: "Read ML Chapter 5", dueDate: "Due in 5 days", icon: BookOpen, iconBgClass: "bg-blue-500/10", iconColorClass: "text-blue-500", completed: false },
];

const studyGroups: StudyGroup[] = [
  { id: "1", name: "Web Dev Study Group", description: "Next meeting: Tomorrow, 3 PM", icon: Users, iconBgClass: "bg-purple-500/10", iconColorClass: "text-purple-500", members: [{id:"m1", name:"Jane", avatarUrl:"https://placehold.co/32x32.png", avatarAiHint: "profile woman"}, {id:"m2", name:"John", avatarUrl:"https://placehold.co/32x32.png", avatarAiHint: "profile man"}, {id:"m3", name:"Alice", avatarUrl:"https://placehold.co/32x32.png", avatarAiHint: "profile woman"}] },
  { id: "2", name: "Database Team", description: "Working on final project", icon: Users, iconBgClass: "bg-blue-500/10", iconColorClass: "text-blue-500", members: [{id:"m4", name:"Bob", avatarUrl:"https://placehold.co/32x32.png", avatarAiHint: "profile man"}, {id:"m5", name:"Charlie", avatarUrl:"https://placehold.co/32x32.png", avatarAiHint: "profile woman"}] },
  { id: "3", name: "AI Research Club", description: "Monthly meeting: Friday, 4 PM", icon: Users, iconBgClass: "bg-green-500/10", iconColorClass: "text-green-500", members: [{id:"m6", name:"Dave", avatarUrl:"https://placehold.co/32x32.png", avatarAiHint: "profile man"}, {id:"m7", name:"Eve", avatarUrl:"https://placehold.co/32x32.png", avatarAiHint: "profile woman"}, {id:"m8", name:"Frank", avatarUrl:"https://placehold.co/32x32.png", avatarAiHint: "profile man"}] },
];

const recentActivities: Activity[] = [
  { id: "1", description: "Completed Web Development Chapter 4", timestamp: "2 hours ago", icon: BookOpen, iconBgClass: "bg-primary/10", iconColorClass: "text-primary", actionIcon: Check, actionIconColorClass: "text-green-500" },
  { id: "2", description: "New comment on your post in Database Group", timestamp: "5 hours ago", icon: MessageSquare, iconBgClass: "bg-blue-500/10", iconColorClass: "text-blue-500", actionIcon: ArrowRight, actionIconColorClass: "text-blue-500" },
  { id: "3", description: "Achievement unlocked: 50 Study Hours", timestamp: "Yesterday", icon: Trophy, iconBgClass: "bg-green-500/10", iconColorClass: "text-green-500", actionIcon: Award, actionIconColorClass: "text-green-500" },
];


export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
     return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }
  
  const userName = user?.displayName?.split(' ')[0] || 'User'; // Get first name or default to 'User'

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header Section from prototype (Welcome message) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back, {userName}! You have 3 tasks due soon.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                iconElement={<IconComponent className={cn("h-6 w-6", stat.iconColor)} />}
                iconBgClass={stat.iconBg}
              />
            );
          })}
        </div>

        {/* Study Timer and Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PomodoroTimer />
          <ProgressOverview />
        </div>
        
        {/* AI Resource Finder */}
        <div>
          <ResourceFinderCard />
        </div>

        {/* Courses Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-foreground">Your Courses</h3>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Course
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((courseItem) => {
              const { icon: IconComponent, iconBgColor, ...serializableCourseData } = courseItem;
              const iconElement = IconComponent ? <IconComponent className="h-16 w-16 text-primary" /> : undefined;
              return (
                <CourseCard
                  key={serializableCourseData.id}
                  courseData={serializableCourseData}
                  iconElement={iconElement}
                  iconBgColor={iconBgColor}
                />
              );
            })}
          </div>
        </div>

        {/* Tasks and Study Groups Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">Upcoming Tasks</CardTitle>
              <Button variant="link" size="sm" className="text-primary">View All</Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {tasks.map((task) => {
                const { icon: IconComponent, completed, iconBgClass, iconColorClass, ...restTaskProps } = task;
                return (
                  <TaskItem
                    key={task.id}
                    {...restTaskProps}
                    iconElement={<IconComponent className={cn("h-5 w-5", iconColorClass)} />}
                    iconBgClass={iconBgClass}
                    completedProp={completed}
                  />
                );
              })}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">Study Groups</CardTitle>
              <Button variant="link" size="sm" className="text-primary">View All</Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {studyGroups.map((group) => {
                const { icon: IconComponent, iconBgClass, iconColorClass, ...restGroupProps } = group;
                return (
                  <StudyGroupItem
                    key={group.id}
                    groupData={restGroupProps}
                    iconElement={<IconComponent className={cn("h-5 w-5", iconColorClass)} />}
                    iconBgClass={iconBgClass}
                  />
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
            <Button variant="link" size="sm" className="text-primary">View All</Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {recentActivities.map((activity) => {
              const { icon: MainIconComponent, actionIcon: ActionIconComponent, iconBgClass, iconColorClass, actionIconColorClass, ...restActivityProps } = activity;
              const mainIconElement = <MainIconComponent className={cn("h-5 w-5", iconColorClass)} />;
              const actionIconElement = ActionIconComponent ? <ActionIconComponent className="h-5 w-5" /> : undefined;
              return (
                <ActivityItem
                  key={activity.id}
                  activityData={restActivityProps}
                  mainIconElement={mainIconElement}
                  actionIconElement={actionIconElement}
                  iconBgClass={iconBgClass}
                  actionIconContainerClass={cn("ml-2", actionIconColorClass || "text-muted-foreground")}
                />
              );
            })}
          </CardContent>
        </Card>

      </div>
      <FloatingActionButton aria-label="Add new item"/>
    </AppLayout>
  );
}
