
"use client";

import { useState, useEffect, useMemo } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Activity, BookOpen, CalendarCheck, Brain, TrendingUp, ListChecks, ClockIcon, Edit, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data Structures
interface CourseProgress {
  id: string;
  name: string;
  overallCompletion: number; // 0-100
  modulesCompleted: number;
  totalModules: number;
  assignmentsPending: number;
  progressHistory: { date: string; value: number }[]; // value is completion %
}

interface ActivityEvent {
  id: string;
  timestamp: Date;
  description: string;
  icon: React.ElementType; // Lucide icon component
  iconColor?: string;
}

const mockCourseProgressData: CourseProgress[] = [
  {
    id: "course1",
    name: "Advanced JavaScript",
    overallCompletion: 75,
    modulesCompleted: 15,
    totalModules: 20,
    assignmentsPending: 2,
    progressHistory: [
      { date: "W1", value: 10 }, { date: "W2", value: 25 }, { date: "W3", value: 40 },
      { date: "W4", value: 55 }, { date: "W5", value: 65 }, { date: "W6", value: 75 },
    ],
  },
  {
    id: "course2",
    name: "Data Structures & Algorithms",
    overallCompletion: 50,
    modulesCompleted: 12,
    totalModules: 25,
    assignmentsPending: 3,
    progressHistory: [
      { date: "W1", value: 5 }, { date: "W2", value: 15 }, { date: "W3", value: 25 },
      { date: "W4", value: 35 }, { date: "W5", value: 45 }, { date: "W6", value: 50 },
    ],
  },
  {
    id: "course3",
    name: "Intro to Cyber Security",
    overallCompletion: 80,
    modulesCompleted: 12,
    totalModules: 15,
    assignmentsPending: 1,
    progressHistory: [
      { date: "W1", value: 20 }, { date: "W2", value: 30 }, { date: "W3", value: 50 },
      { date: "W4", value: 60 }, { date: "W5", value: 70 }, { date: "W6", value: 80 },
    ],
  },
];

const mockOverallStudyTrend: { week: string; hours: number }[] = [
  { week: "W1", hours: 5 }, { week: "W2", hours: 7 }, { week: "W3", hours: 6 },
  { week: "W4", hours: 8 }, { week: "W5", hours: 9 }, { week: "W6", hours: 7.5 },
];

const mockTimeDistribution: { name: string; value: number; fill: string }[] = [
  { name: "JavaScript", value: 40, fill: "hsl(var(--chart-1))" },
  { name: "Algorithms", value: 30, fill: "hsl(var(--chart-2))" },
  { name: "Cyber Security", value: 20, fill: "hsl(var(--chart-3))" },
  { name: "General Study", value: 10, fill: "hsl(var(--chart-4))" },
];

const initialActivities: ActivityEvent[] = [
  { id: "act1", timestamp: new Date(Date.now() - 3600000 * 2), description: "Completed 'Async/Await' module in Advanced JavaScript.", icon: CheckCircle, iconColor: "text-green-500" },
  { id: "act2", timestamp: new Date(Date.now() - 3600000 * 1), description: "Started 'Binary Trees' chapter in Data Structures.", icon: Edit, iconColor: "text-blue-500" },
];

const possibleActivities = [
  "Reviewing lecture notes for Cyber Security",
  "Working on 'Sorting Algorithms' coding challenge",
  "Watching 'Promises Deep Dive' video for JavaScript",
  "Reading Chapter 3 of 'Network Protocols'",
  "Debugging a data structure implementation",
];

// Chart Configurations
const barChartConfig = {
  completion: { label: "Completion", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

const lineChartConfig = {
  value: { label: "Progress %", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const overallTrendConfig = {
  hours: { label: "Study Hours", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;


export default function ProgressPage() {
  const [currentActivity, setCurrentActivity] = useState("Initializing activity...");
  const [activityLog, setActivityLog] = useState<ActivityEvent[]>(initialActivities);

  useEffect(() => {
    // Simulate current activity update
    const activityInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * possibleActivities.length);
      setCurrentActivity(possibleActivities[randomIndex]);
    }, 7000); // Update every 7 seconds

    // Simulate new activity log entry
    const logInterval = setInterval(() => {
      const newActivity: ActivityEvent = {
        id: `act${Date.now()}`,
        timestamp: new Date(),
        description: `Engaged with "${possibleActivities[Math.floor(Math.random() * possibleActivities.length)].substring(0,30)}..."`,
        icon: ClockIcon,
        iconColor: "text-yellow-500"
      };
      setActivityLog(prev => [newActivity, ...prev.slice(0,4)]); // Keep last 5
    }, 30000); // Add to log every 30 seconds


    return () => {
      clearInterval(activityInterval);
      clearInterval(logInterval);
    };
  }, []);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <TrendingUp className="mr-3 h-8 w-8 text-primary" />
            Your Learning Progress
          </h1>
          <p className="text-muted-foreground mt-1">
            Visualize your achievements and track your study habits.
          </p>
        </div>

        {/* Currently Active Task */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Activity className="mr-2 h-5 w-5 text-primary" />
              Currently Active Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-foreground animate-pulse">{currentActivity}</p>
            <p className="text-xs text-muted-foreground mt-1">
              This is a simulation of real-time activity tracking.
            </p>
          </CardContent>
        </Card>

        {/* Course-Specific Progress Section */}
        <section aria-labelledby="course-progress-heading">
          <h2 id="course-progress-heading" className="text-2xl font-semibold text-foreground mb-4 flex items-center">
            <BookOpen className="mr-2 h-6 w-6 text-primary" />
            Course Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCourseProgressData.map((course) => (
              <Card key={course.id} className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">{course.name}</CardTitle>
                  <CardDescription>
                    {course.modulesCompleted}/{course.totalModules} modules completed. {course.assignmentsPending} assignments pending.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Overall Completion: {course.overallCompletion}%</h4>
                    <ChartContainer config={barChartConfig} className="h-[100px] w-full">
                      <BarChart accessibilityLayer data={[{ name: course.name, completion: course.overallCompletion }]} layout="vertical">
                        <CartesianGrid horizontal={false} vertical={true} strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis type="category" dataKey="name" hide />
                        <Bar dataKey="completion" fill="var(--color-completion)" radius={4} barSize={20} />
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      </BarChart>
                    </ChartContainer>
                  </div>
                  <div>
                     <h4 className="text-sm font-medium mb-2">Progress Trend (Last 6 Weeks)</h4>
                    <ChartContainer config={lineChartConfig} className="h-[150px] w-full">
                      <LineChart data={course.progressHistory} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.toString()} />
                        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tickMargin={8} />
                        <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={true} />
                        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                      </LineChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Overall Progress Metrics Section */}
        <section aria-labelledby="overall-progress-heading">
          <h2 id="overall-progress-heading" className="text-2xl font-semibold text-foreground mb-4 flex items-center">
            <Brain className="mr-2 h-6 w-6 text-primary" />
            Overall Study Metrics
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Overall Study Trend (Hours/Week)</CardTitle>
                <CardDescription>Mock data showing study hours over the last 6 weeks.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={overallTrendConfig} className="h-[300px] w-full">
                  <LineChart data={mockOverallStudyTrend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                    <Legend content={<ChartLegendContent />} />
                    <Line type="monotone" dataKey="hours" stroke="var(--color-hours)" strokeWidth={2} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Study Time Distribution</CardTitle>
                <CardDescription>Mock breakdown of time spent by subject category.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ChartContainer config={{}} className="h-[300px] w-full max-w-xs">
                  <PieChart>
                    <Tooltip content={<ChartTooltipContent hideIndicator />} />
                    <Pie data={mockTimeDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                       {mockTimeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Legend content={<ChartLegendContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Activity Log */}
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-xl flex items-center">
                    <ListChecks className="mr-2 h-5 w-5 text-primary"/>
                    Recent Activity Log
                </CardTitle>
                <CardDescription>A simulated stream of your recent learning activities.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {activityLog.map(activity => {
                        const IconComponent = activity.icon;
                        return (
                            <li key={activity.id} className="flex items-start p-2 border-b last:border-b-0">
                                <IconComponent className={cn("h-5 w-5 mt-0.5 mr-3 flex-shrink-0", activity.iconColor || "text-primary")} />
                                <div className="flex-grow">
                                    <p className="text-sm text-foreground">{activity.description}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {activity.timestamp.toLocaleTimeString()} - {activity.timestamp.toLocaleDateString()}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
