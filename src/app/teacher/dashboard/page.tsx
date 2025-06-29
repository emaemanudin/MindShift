
"use client";

import * as React from "react";
import { TeacherLayout } from "@/components/teacher/teacher-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Users, ClipboardCheck, BookOpen, AlertTriangle, CalendarClock } from "lucide-react";
import { UserAvatar } from "@/components/shared/user-avatar";
import type { ChartConfig } from "@/components/ui/chart";

// --- Data Interfaces ---
interface TeacherStats {
  totalStudents: number;
  coursesTaught: number;
  assignmentsToGrade: number;
}

interface StudentPerformance {
  id: string;
  name: string;
  avatarUrl: string;
  avatarAiHint: string;
  course: string;
  currentGrade: number;
  attendance: number; // percentage
  lastActivity: string;
}

interface Assignment {
    id: string;
    title: string;
    course: string;
    dueDate: string;
}

// --- Mock Data ---
const teacherStats: TeacherStats = {
  totalStudents: 124,
  coursesTaught: 3,
  assignmentsToGrade: 8,
};

const atRiskStudents: StudentPerformance[] = [
  { id: "s1", name: "Alex Johnson", avatarUrl: "https://randomuser.me/api/portraits/men/75.jpg", avatarAiHint: "profile man", course: "Advanced JavaScript", currentGrade: 68, attendance: 85, lastActivity: "2 days ago" },
  { id: "s2", name: "Maria Garcia", avatarUrl: "https://randomuser.me/api/portraits/women/76.jpg", avatarAiHint: "profile woman", course: "Database Systems", currentGrade: 71, attendance: 90, lastActivity: "1 day ago" },
  { id: "s3", name: "David Chen", avatarUrl: "https://randomuser.me/api/portraits/men/77.jpg", avatarAiHint: "profile man", course: "Web Development", currentGrade: 65, attendance: 75, lastActivity: "4 days ago" },
  { id: "s4", name: "Priya Patel", avatarUrl: "https://randomuser.me/api/portraits/women/78.jpg", avatarAiHint: "profile woman", course: "Advanced JavaScript", currentGrade: 72, attendance: 95, lastActivity: "Yesterday" },
];

const upcomingDeadlines: Assignment[] = [
    { id: 'a1', title: 'Web Dev Assignment 5', course: 'Web Development', dueDate: '2025-07-15' },
    { id: 'a2', title: 'Database Systems Midterm', course: 'Database Systems', dueDate: '2025-07-18' },
    { id: 'a3', title: 'JS Project Proposal', course: 'Advanced JavaScript', dueDate: '2025-07-20' },
];

const gradeDistribution = [
  { grade: "A", count: 28 }, { grade: "B", count: 45 }, { grade: "C", count: 32 }, { grade: "D", count: 12 }, { grade: "F", count: 7 },
];

const gradeDistributionChartConfig = {
  count: { label: "Students", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;


// --- Components ---
function StatsCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) {
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export default function TeacherDashboardPage() {
  return (
    <TeacherLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Dr. Emily Carter!</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard title="Total Students" value={teacherStats.totalStudents} icon={Users} />
          <StatsCard title="Courses Taught" value={teacherStats.coursesTaught} icon={BookOpen} />
          <StatsCard title="Assignments to Grade" value={teacherStats.assignmentsToGrade} icon={ClipboardCheck} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <Card className="lg:col-span-3 shadow-lg">
                <CardHeader>
                    <CardTitle>At-Risk Students</CardTitle>
                    <CardDescription>Students who may require additional attention and support.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead className="text-center">Grade</TableHead>
                                <TableHead className="text-right">Last Activity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {atRiskStudents.map(student => (
                                <TableRow key={student.id} className="hover:bg-red-500/5">
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <UserAvatar src={student.avatarUrl} aiHint={student.avatarAiHint} fallbackInitials={student.name.charAt(0)} size="sm" />
                                            <span className="font-medium">{student.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{student.course}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={student.currentGrade < 70 ? "destructive" : "secondary"}>{student.currentGrade}%</Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground text-xs">{student.lastActivity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card className="lg:col-span-2 shadow-lg">
                <CardHeader>
                    <CardTitle>Overall Grade Distribution</CardTitle>
                    <CardDescription>Performance across all your classes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={gradeDistributionChartConfig} className="h-[250px] w-full">
                        <BarChart data={gradeDistribution} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="grade" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>

         <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Assignments and quizzes due soon across your courses.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="space-y-4">
                    {upcomingDeadlines.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50">
                            <div>
                                <p className="font-medium">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.course}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CalendarClock className="h-4 w-4"/>
                                <span>Due: {new Date(item.dueDate + 'T00:00:00').toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                 </div>
            </CardContent>
        </Card>

      </div>
    </TeacherLayout>
  );
}
