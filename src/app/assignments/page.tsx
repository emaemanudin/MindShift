
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ListChecks,
  Clock,
  TrendingUp,
  Target,
  CalendarDays,
  FileText,
  Presentation,
  ClipboardCheck,
  Edit3,
  Activity,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Data types
interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: "Pending" | "In Progress" | "Submitted" | "Graded";
  estimatedTime: string; // e.g., "2h 30m"
  timeSpent: string; // e.g., "1h 15m"
  progress: number; // 0-100, calculated from timeSpent/estimatedTime
  icon: LucideIcon;
  iconColorClass: string;
  description?: string;
}

interface TimeTracking {
  totalAppTime: string;
  totalTaskTime: string;
}

interface ProgressGoals {
  daily: number;   // percentage
  weekly: number;  // percentage
  monthly: number; // percentage
}

// Mock Data
const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "Calculus Problem Set 3",
    course: "Mathematics 101",
    dueDate: "2025-07-15",
    status: "In Progress",
    estimatedTime: "4h 0m",
    timeSpent: "1h 30m",
    progress: 37, // (1.5 / 4) * 100
    icon: FileText,
    iconColorClass: "text-blue-500",
    description: "Chapters 5-7, focusing on integration techniques.",
  },
  {
    id: "2",
    title: "History Essay: The Roman Empire",
    course: "World History",
    dueDate: "2025-07-20",
    status: "Pending",
    estimatedTime: "6h 0m",
    timeSpent: "0h 0m",
    progress: 0,
    icon: Edit3,
    iconColorClass: "text-purple-500",
    description: "A 2000-word essay on the rise and fall of the Roman Empire.",
  },
  {
    id: "3",
    title: "Physics Lab Report: Optics",
    course: "Physics 202",
    dueDate: "2025-07-10",
    status: "Submitted",
    estimatedTime: "3h 0m",
    timeSpent: "3h 0m",
    progress: 100,
    icon: Activity,
    iconColorClass: "text-green-500",
    description: "Experiment on light refraction and reflection.",
  },
  {
    id: "4",
    title: "Group Presentation: AI Ethics",
    course: "Computer Science Ethics",
    dueDate: "2025-07-25",
    status: "Pending",
    estimatedTime: "5h 0m",
    timeSpent: "0h 30m",
    progress: 10,
    icon: Presentation,
    iconColorClass: "text-orange-500",
    description: "Prepare a 15-minute group presentation. My part: Introduction.",
  },
  {
    id: "5",
    title: "Coding Challenge: Sorting Algorithms",
    course: "Data Structures",
    dueDate: "2025-07-18",
    status: "Graded",
    estimatedTime: "2h 0m",
    timeSpent: "1h 45m",
    progress: 100, // Assuming graded means completed
    icon: ClipboardCheck,
    iconColorClass: "text-teal-500",
    description: "Implement and compare Bubble Sort, Merge Sort, and Quick Sort.",
  },
];

const mockTimeTracking: TimeTracking = {
  totalAppTime: "25h 45m",
  totalTaskTime: "12h 15m",
};

const mockProgressGoals: ProgressGoals = {
  daily: 75,
  weekly: 60,
  monthly: 80,
};

// Component for individual assignment item
function AssignmentItem({ assignment }: { assignment: Assignment }) {
  const { title, course, dueDate, status, estimatedTime, timeSpent, progress, icon: Icon, iconColorClass, description } = assignment;

  const getStatusBadgeVariant = (
    status: Assignment["status"]
  ): "default" | "secondary" | "outline" | "destructive" | null | undefined => {
    switch (status) {
      case "Pending":
        return "outline";
      case "In Progress":
        return "default"; // Using primary color
      case "Submitted":
        return "secondary"; // Or a custom "submitted" variant if defined
      case "Graded":
        return "secondary"; // Example: green
      default:
        return "outline";
    }
  };
  
  const getStatusBadgeClass = (status: Assignment["status"]): string => {
     switch (status) {
      case "Pending":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30";
      case "In Progress":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30";
      case "Submitted":
        return "bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30";
      case "Graded":
        return "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30";
      default:
        return "";
    }
  }


  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-md bg-card", iconColorClass && iconColorClass.replace('text-','bg-') + '/10')}>
              <Icon className={cn("h-6 w-6", iconColorClass)} />
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          <Badge variant={getStatusBadgeVariant(status)} className={cn(getStatusBadgeClass(status))}>{status}</Badge>
        </div>
        <CardDescription className="pt-1">{course}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-1.5" />
            <span>Due: {new Date(dueDate + 'T00:00:00').toLocaleDateString()}</span> {/* Ensure date is not parsed as UTC for display */}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1.5" />
            <span>{timeSpent} / {estimatedTime}</span>
          </div>
        </div>
        <div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1 text-right">{progress}% complete</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Component for Progress Display
function ProgressDisplayCard({ timeTracking }: { timeTracking: TimeTracking }) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Clock className="mr-2 h-5 w-5 text-primary" />
          Time Spent Overview
        </CardTitle>
        <CardDescription>Your activity across the platform and tasks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-accent/50 rounded-md">
          <span className="font-medium text-foreground">Total Time on App:</span>
          <span className="text-lg font-semibold text-primary">{timeTracking.totalAppTime}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-accent/50 rounded-md">
          <span className="font-medium text-foreground">Total Time on Tasks:</span>
          <span className="text-lg font-semibold text-primary">{timeTracking.totalTaskTime}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Component for Goal Progress
function GoalProgressCard({ goals }: { goals: ProgressGoals }) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Target className="mr-2 h-5 w-5 text-primary" />
          Goal Progress
        </CardTitle>
        <CardDescription>Track your progress towards your learning goals.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-1 flex justify-between items-baseline">
            <h4 className="font-medium text-foreground">Daily Goal</h4>
            <span className="text-sm font-semibold text-primary">{goals.daily}%</span>
          </div>
          <Progress value={goals.daily} aria-label="Daily goal progress" />
        </div>
        <div>
          <div className="mb-1 flex justify-between items-baseline">
            <h4 className="font-medium text-foreground">Weekly Goal</h4>
            <span className="text-sm font-semibold text-primary">{goals.weekly}%</span>
          </div>
          <Progress value={goals.weekly} aria-label="Weekly goal progress" />
        </div>
        <div>
          <div className="mb-1 flex justify-between items-baseline">
            <h4 className="font-medium text-foreground">Monthly Goal</h4>
            <span className="text-sm font-semibold text-primary">{goals.monthly}%</span>
          </div>
          <Progress value={goals.monthly} aria-label="Monthly goal progress" />
        </div>
      </CardContent>
    </Card>
  );
}


export default function AssignmentsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <ListChecks className="mr-3 h-8 w-8 text-primary" />
            Assignments & Progress
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your assignments and track your learning journey.
          </p>
        </div>

        {/* Progress Section */}
        <section aria-labelledby="progress-heading">
          <h2 id="progress-heading" className="text-2xl font-semibold text-foreground mb-4 flex items-center">
            <TrendingUp className="mr-2 h-6 w-6 text-primary" />
            Your Progress
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProgressDisplayCard timeTracking={mockTimeTracking} />
            <GoalProgressCard goals={mockProgressGoals} />
          </div>
        </section>

        {/* Assignments List Section */}
        <section aria-labelledby="assignments-heading">
          <h2 id="assignments-heading" className="text-2xl font-semibold text-foreground mb-4 flex items-center">
            <CalendarDays className="mr-2 h-6 w-6 text-primary" />
            Upcoming Assignments
          </h2>
          {mockAssignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockAssignments.map((assignment) => (
                <AssignmentItem key={assignment.id} assignment={assignment} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <ListChecks className="mx-auto h-12 w-12 mb-2" />
                No assignments found. Add some to get started!
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
