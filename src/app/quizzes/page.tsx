
"use client";

import { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileQuestion,
  CalendarDays,
  Timer,
  PlayCircle,
  CheckCircle,
  ClipboardCheck,
  MessageCircle,
  ListOrdered
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Data types for Quizzes
export interface Quiz {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: "Take Quiz" | "Submitted" | "Graded";
  icon: LucideIcon;
  iconColorClass: string;
  description?: string;
  path?: string;
  timeLimitMinutes?: number;
  grade?: number; // 0-100
  feedback?: string;
}

// Initial Mock Data for quizzes
const initialQuizzes: Quiz[] = [
    {
        id: "6",
        title: "Chemistry Midterm Quiz",
        course: "Chemistry Crew",
        dueDate: "2025-07-22",
        status: "Take Quiz",
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
        icon: CheckCircle,
        iconColorClass: "text-green-500",
        description: "Your quiz has been graded. See feedback below.",
        path: '/quiz/start',
        timeLimitMinutes: 10,
        grade: 88,
        feedback: "Great work on the fundamentals! Pay close attention to the difference between `let` and `const`."
    },
];

// Component for individual quiz item
function QuizItem({ quiz }: { quiz: Quiz }) {
  const { title, course, dueDate, status, icon: Icon, iconColorClass, description, grade, feedback, timeLimitMinutes, path } = quiz;

  const getStatusBadgeClass = (currentStatus: Quiz["status"]): string => {
     switch (currentStatus) {
      case "Submitted":
        return "bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30";
      case "Graded":
        return "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30";
      case "Take Quiz":
        return "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30";
      default:
        return "";
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
        <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1.5" />
              <span>Due: {new Date(dueDate + 'T00:00:00').toLocaleDateString()}</span>
            </div>
            {timeLimitMinutes && (
              <div className="flex items-center">
                <Timer className="h-4 w-4 mr-1.5" />
                <span>{timeLimitMinutes} min limit</span>
              </div>
            )}
        </div>
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
        <div className="flex justify-end w-full">
            {status === "Take Quiz" ? (
                <Link href={path || '#'} passHref>
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
      </CardFooter>
    </Card>
  );
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <ListOrdered className="mr-3 h-8 w-8 text-primary" />
            My Quizzes
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and complete your quizzes and assessments here.
          </p>
        </div>

        <section aria-labelledby="quizzes-heading">
          {quizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <QuizItem 
                  key={quiz.id} 
                  quiz={quiz}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <FileQuestion className="mx-auto h-12 w-12 mb-2" />
                No quizzes found. Your teacher hasn't assigned any yet.
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
