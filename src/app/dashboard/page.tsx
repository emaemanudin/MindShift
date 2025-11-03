
"use client";

import { useState, useEffect } from 'react';
import { AppLayout } from "@/components/layout/app-layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { PomodoroTimer } from "@/components/dashboard/pomodoro-timer";
import { ProgressOverview } from "@/components/dashboard/progress-overview";
import { CourseCard } from "@/components/dashboard/course-card";
import { TaskItem, type Task } from "@/components/dashboard/task-item";
import { StudyGroupItem } from "@/components/dashboard/study-group-item";
import { ActivityItem } from "@/components/dashboard/activity-item";
import { FloatingActionButton } from "@/components/shared/floating-action-button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { getDashboardData } from "@/lib/db/adapter";
import type { Course, StudyGroup, Activity } from '@/lib/db/data-models';

import {
  BookOpenCheck, CheckCircle2, ListTodo, Clock, Loader2,
} from "lucide-react";

// Simplified data structure for the dashboard state
interface DashboardData {
  stats: { activeCourses: number; completedTasks: number; pendingTasks: number; studyHours: number; };
  courses: Omit<Course, 'icon'>[];
  tasks: Task[];
  studyGroups: Omit<StudyGroup, 'icon'>[];
  recentActivities: Omit<Activity, 'icon' | 'actionIcon'>[];
}

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const dashboardData = await getDashboardData(user.id);

          // We need to map over the data to separate the Icon components
          // This is because functions (like React components) can't be passed from Server to Client Components directly
          // While this page is a client component, this pattern prepares us for that architecture.
          const mappedData: DashboardData = {
            stats: dashboardData.stats,
            courses: dashboardData.courses.map(({ icon, ...rest }) => rest),
            tasks: dashboardData.tasks.map(({ icon, ...rest }) => ({...rest, icon: icon})),
            studyGroups: dashboardData.studyGroups.map(({ icon, ...rest }) => rest),
            recentActivities: dashboardData.recentActivities.map(({ icon, actionIcon, ...rest }) => rest),
          };
          setData(mappedData);
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load dashboard data.",
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [user?.id, toast]);
  
  // Combine auth loading and data loading states
  const pageIsLoading = isAuthLoading || isLoading;

  if (pageIsLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }
  
  const userName = user?.displayName || 'User';

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userName}! Here's a snapshot of your learning journey.
          </p>
        </div>

        {/* Stats Cards - Now using fetched data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Active Courses" value={data?.stats.activeCourses || 0} iconElement={<BookOpenCheck className="h-5 w-5 text-blue-500" />} iconBgClass="bg-blue-500/10" />
          <StatsCard title="Completed Tasks" value={data?.stats.completedTasks || 0} iconElement={<CheckCircle2 className="h-5 w-5 text-green-500" />} iconBgClass="bg-green-500/10" />
          <StatsCard title="Pending Tasks" value={data?.stats.pendingTasks || 0} iconElement={<ListTodo className="h-5 w-5 text-yellow-500" />} iconBgClass="bg-yellow-500/10" />
          <StatsCard title="Study Hours" value={data?.stats.studyHours || 0} iconElement={<Clock className="h-5 w-5 text-primary" />} iconBgClass="bg-primary/10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PomodoroTimer />
          <ProgressOverview />
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-6">Your Courses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.courses.map((courseItem) => (
              <CourseCard key={courseItem.id} courseData={courseItem} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Upcoming Tasks</h3>
            {data?.tasks.map((task) => {
                const { icon: IconComponent, completed, ...restTaskProps } = task;
                return (
                  <TaskItem
                    key={task.id}
                    {...restTaskProps}
                    iconElement={<IconComponent className={cn("h-5 w-5", task.id === '1' ? 'text-red-500' : task.id === '2' ? 'text-yellow-500' : 'text-blue-500')} />}
                    iconBgClass={cn(task.id === '1' ? 'bg-red-500/10' : task.id === '2' ? 'bg-yellow-500/10' : 'bg-blue-500/10')}
                    completedProp={completed}
                  />
                );
            })}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Study Groups</h3>
            {data?.studyGroups.map((group) => {
              // The original mock data didn't have icon info, so we add it here based on ID
              const getGroupIcon = () => {
                  if (group.id === '1') return { icon: <Users className="h-5 w-5 text-purple-500" />, bg: "bg-purple-500/10"};
                  if (group.id === '2') return { icon: <Users className="h-5 w-5 text-blue-500" />, bg: "bg-blue-500/10"};
                  return { icon: <Users className="h-5 w-5 text-green-500" />, bg: "bg-green-500/10"};
              }
              const { icon, bg } = getGroupIcon();
              return (
                <StudyGroupItem
                  key={group.id}
                  groupData={group}
                  iconElement={icon}
                  iconBgClass={bg}
                />
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
             {data?.recentActivities.map((activity) => {
                const getActivityIcons = () => {
                    if (activity.id === '1') return { main: <BookOpenCheck className="h-5 w-5 text-primary" />, action: <CheckCircle2 className="h-5 w-5 text-green-500" />, bg: "bg-primary/10" };
                    if (activity.id === '2') return { main: <MessageSquare className="h-5 w-5 text-blue-500" />, action: <ArrowRight className="h-5 w-5 text-blue-500" />, bg: "bg-blue-500/10" };
                    return { main: <Trophy className="h-5 w-5 text-green-500" />, action: <Award className="h-5 w-5 text-green-500" />, bg: "bg-green-500/10" };
                }
                const { main, action, bg } = getActivityIcons();
                return (
                    <ActivityItem
                    key={activity.id}
                    activityData={activity}
                    mainIconElement={main}
                    actionIconElement={action}
                    iconBgClass={bg}
                    />
                );
            })}
          </div>
        </div>

      </div>
      <FloatingActionButton 
        aria-label="Add new item"
        onClick={() => toast({ title: "Placeholder", description: "This button is for demonstration purposes." })}
      />
    </AppLayout>
  );
}
