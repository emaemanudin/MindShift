
"use client";

import type { ReactNode } from "react";
import { useState, useCallback } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  PlayCircle,
  CheckCircle,
  PlusCircle,
  FileQuestion,
  Timer,
  MessageCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Data types
export interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  type: 'assignment' | 'quiz';
  status: "Pending" | "In Progress" | "Submitted" | "Graded" | "Completed" | "Take Quiz";
  icon: LucideIcon;
  iconColorClass: string;
  description?: string;
  // Assignment specific
  estimatedTimeHours?: number; 
  timeSpentHours?: number; 
  progress?: number; // 0-100
  // Quiz specific
  path?: string;
  timeLimitMinutes?: number;
  grade?: number; // 0-100
  feedback?: string;
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

// Helper to format hours to "Xh Ym"
const formatHoursToTime = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
};

// Helper to calculate progress
const calculateProgress = (timeSpentHours: number, estimatedTimeHours: number): number => {
  if (estimatedTimeHours === 0) return 0;
  return Math.min(Math.round((timeSpentHours / estimatedTimeHours) * 100), 100);
};


// Initial Mock Data
const initialAssignments: Assignment[] = [
  {
    id: "1",
    title: "Calculus Problem Set 3",
    course: "Mathematics 101",
    dueDate: "2025-07-15",
    type: 'assignment',
    status: "In Progress",
    estimatedTimeHours: 4,
    timeSpentHours: 1.5,
    progress: calculateProgress(1.5, 4),
    icon: FileText,
    iconColorClass: "text-blue-500",
    description: "Chapters 5-7, focusing on integration techniques.",
  },
  {
    id: "6",
    title: "Chemistry Midterm Quiz",
    course: "Chemistry Crew",
    dueDate: "2025-07-22",
    status: "Take Quiz",
    type: 'quiz',
    icon: FileQuestion,
    iconColorClass: "text-red-500",
    description: "A timed quiz covering chapters 1-5. This is a secure assessment.",
    path: '/quiz/start',
    timeLimitMinutes: 15
  },
   {
    id: "7",
    title: "History Midterm Quiz",
    course: "World History",
    dueDate: "2025-07-19",
    status: "Submitted",
    type: 'quiz',
    icon: ClipboardCheck,
    iconColorClass: "text-purple-500",
    description: "Your submission is awaiting a grade from your teacher.",
    path: '/quiz/start', // In a real app, this would link to a results summary
    timeLimitMinutes: 20,
  },
  {
    id: "8",
    title: "JavaScript Fundamentals Quiz",
    course: "Web Development",
    dueDate: "2025-07-12",
    status: "Graded",
    type: 'quiz',
    icon: CheckCircle,
    iconColorClass: "text-green-500",
    description: "Your quiz has been graded. See feedback below.",
    path: '/quiz/start',
    timeLimitMinutes: 10,
    grade: 88,
    feedback: "Great work on the fundamentals! Pay close attention to the difference between `let` and `const`."
  },
  {
    id: "2",
    title: "History Essay: The Roman Empire",
    course: "World History",
    dueDate: "2025-07-20",
    type: 'assignment',
    status: "Pending",
    estimatedTimeHours: 6,
    timeSpentHours: 0,
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
    type: 'assignment',
    status: "Submitted",
    estimatedTimeHours: 3,
    timeSpentHours: 3,
    progress: 100,
    icon: Activity,
    iconColorClass: "text-green-500",
    description: "Experiment on light refraction and reflection.",
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
interface AssignmentItemProps {
  assignment: Assignment;
  onLogTime: (id: string, timeHours: number) => void;
  onSetStatus: (id: string, status: Assignment["status"]) => void;
}

function AssignmentItem({ assignment, onLogTime, onSetStatus }: AssignmentItemProps) {
  const { id, title, course, dueDate, status, icon: Icon, iconColorClass, description, type, grade, feedback } = assignment;
  const { toast } = useToast();

  const getStatusBadgeClass = (currentStatus: Assignment["status"]): string => {
     switch (currentStatus) {
      case "Pending":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30";
      case "In Progress":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30";
      case "Submitted":
      case "Completed":
        return "bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30";
      case "Graded":
        return "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30";
      case "Take Quiz":
        return "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30";
      default:
        return "";
    }
  };
  
  const handleLogTimeClick = () => {
    if (status === "Graded" || status === "Submitted" || status === "Completed") {
        toast({ title: "Task Update", description: "Cannot log time for a task that is already submitted or graded.", variant: "default"});
        return;
    }
    onLogTime(id, 0.5); // Log 30 minutes (0.5 hours)
    if (status === "Pending") {
      onSetStatus(id, "In Progress");
    }
    toast({ title: "Time Logged", description: `Logged 30 minutes for "${title}".`, variant: "default"});
  };

  const handleCompleteClick = () => {
     if (status === "Graded" || status === "Submitted" || status === "Completed") {
        toast({ title: "Task Update", description: "Task is already marked as complete or submitted.", variant: "default"});
        return;
    }
    onSetStatus(id, "Completed");
    onLogTime(id, Math.max(0, (assignment.estimatedTimeHours || 0) - (assignment.timeSpentHours || 0))); 
    toast({ title: "Task Completed", description: `"${title}" marked as completed.`, variant: "default"});
  };
  
  const handleStartTaskClick = () => {
    if (status === "Pending") {
      onSetStatus(id, "In Progress");
      toast({ title: "Task Started", description: `"${title}" is now In Progress.`, variant: "default"});
    } else if (status === "In Progress") {
      toast({ title: "Task Update", description: `"${title}" is already In Progress.`, variant: "default"});
    } else {
      toast({ title: "Task Update", description: `Cannot start a task that is ${status.toLowerCase()}.`, variant: "default"});
    }
  };


  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-md bg-card", iconColorClass && iconColorClass.replace('text-','bg-') + '/10')}>
              <Icon className={cn("h-6 w-6", iconColorClass)} />
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Badge variant="outline" className={cn("text-xs whitespace-nowrap", getStatusBadgeClass(status))}>{status}</Badge>
        </div>
        <CardDescription className="pt-1 text-xs">{course}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {type === 'assignment' ? (
          <>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-1.5" />
                <span>Due: {new Date(dueDate + 'T00:00:00').toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1.5" />
                <span>{formatHoursToTime(assignment.timeSpentHours || 0)} / {formatHoursToTime(assignment.estimatedTimeHours || 0)}</span>
              </div>
            </div>
            <div>
              <Progress value={assignment.progress || 0} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1 text-right">{assignment.progress || 0}% complete</p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1.5" />
              <span>Due: {new Date(dueDate + 'T00:00:00').toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Timer className="h-4 w-4 mr-1.5" />
              <span>{assignment.timeLimitMinutes} min limit</span>
            </div>
          </div>
        )}
        {status === 'Graded' && grade !== undefined && (
          <div className="!mt-4 p-3 bg-green-500/10 rounded-md border border-green-500/20">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-green-800 dark:text-green-300">Grade: {grade}%</h4>
              </div>
              {feedback && (
                <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center"><MessageCircle className="h-3 w-3 mr-1.5"/>Teacher Feedback:</p>
                    <p className="text-sm text-foreground italic">"{feedback}"</p>
                </div>
              )}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t px-6 py-3">
        {type === 'assignment' ? (
            <div className="flex justify-end gap-2 w-full">
              {status === "Pending" && (
                <Button variant="ghost" size="sm" onClick={handleStartTaskClick} className="text-xs">
                  <PlayCircle className="mr-1.5 h-4 w-4" /> Start Task
                </Button>
              )}
              {(status === "Pending" || status === "In Progress") && (
                <>
                  <Button variant="outline" size="sm" onClick={handleLogTimeClick} className="text-xs">
                    <PlusCircle className="mr-1.5 h-4 w-4" /> Log 30m
                  </Button>
                  <Button variant="default" size="sm" onClick={handleCompleteClick} className="text-xs">
                    <CheckCircle className="mr-1.5 h-4 w-4" /> Complete
                  </Button>
                </>
              )}
              {(status === "Completed" || status === "Submitted" || status === "Graded") && (
                <p className="text-xs text-muted-foreground">No further actions.</p>
              )}
            </div>
        ) : (
            <div className="flex justify-end w-full">
                {status === "Take Quiz" ? (
                    <Link href={assignment.path || '#'} passHref>
                        <Button>
                            <PlayCircle className="mr-2 h-4 w-4"/>
                            Start Quiz
                        </Button>
                    </Link>
                ) : (
                     <Button variant="outline" disabled>
                        Quiz {status}
                    </Button>
                )}
            </div>
        )}
      </CardFooter>
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
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);

  const handleLogTime = useCallback((id: string, timeHoursToAdd: number) => {
    setAssignments(prevAssignments =>
      prevAssignments.map(asm => {
        if (asm.id === id) {
          const newTimeSpentHours = Math.min((asm.timeSpentHours || 0) + timeHoursToAdd, (asm.estimatedTimeHours || 0) * 2); // Cap at 2x estimated
          return {
            ...asm,
            timeSpentHours: newTimeSpentHours,
            progress: calculateProgress(newTimeSpentHours, asm.estimatedTimeHours || 0),
          };
        }
        return asm;
      })
    );
  }, []);

  const handleSetStatus = useCallback((id: string, newStatus: Assignment["status"]) => {
    setAssignments(prevAssignments =>
      prevAssignments.map(asm => {
        if (asm.id === id) {
          const updatedAssignment = { ...asm, status: newStatus };
          if (newStatus === "Completed" || newStatus === "Submitted" || newStatus === "Graded") {
            updatedAssignment.progress = 100;
            // Optionally adjust timeSpentHours to estimatedTimeHours if not already met or exceeded
            if (updatedAssignment.timeSpentHours && updatedAssignment.estimatedTimeHours && updatedAssignment.timeSpentHours < updatedAssignment.estimatedTimeHours) {
              updatedAssignment.timeSpentHours = updatedAssignment.estimatedTimeHours;
            }
          }
          return updatedAssignment;
        }
        return asm;
      })
    );
  }, []);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <ListChecks className="mr-3 h-8 w-8 text-primary" />
            Assignments & Progress
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your assignments and track your learning journey.
          </p>
        </div>

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

        <section aria-labelledby="assignments-heading">
          <h2 id="assignments-heading" className="text-2xl font-semibold text-foreground mb-4 flex items-center">
            <CalendarDays className="mr-2 h-6 w-6 text-primary" />
            Your Tasks & Quizzes
          </h2>
          {assignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {assignments.map((assignment) => (
                <AssignmentItem 
                  key={assignment.id} 
                  assignment={assignment}
                  onLogTime={handleLogTime}
                  onSetStatus={handleSetStatus} 
                />
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
