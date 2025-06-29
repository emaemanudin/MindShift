
"use client";

import * as React from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Users, BookOpen, Building, BarChart2, LineChartIcon, Activity, Star, TrendingUp, TrendingDown } from "lucide-react";
import { UserAvatar } from "@/components/shared/user-avatar";
import type { ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

// --- Data Interfaces ---
interface OverallStats {
  totalStudents: number;
  activeTeachers: number;
  departments: number;
  courses: number;
}

interface Department {
  id: string;
  name: string;
  head: string;
  teachers: number;
  students: number;
  avgScore: number;
  completionRate: number;
}

interface Teacher {
  id: string;
  name: string;
  avatarUrl: string;
  avatarAiHint?: string;
  department: string;
  coursesTaught: number;
  studentEngagement: number; // percentage
  avgStudentScore: number;
  performanceTrend: 'up' | 'down' | 'stable';
}

// --- Mock Data ---
const overallStats: OverallStats = {
  totalStudents: 1250,
  activeTeachers: 78,
  departments: 6,
  courses: 45,
};

const departments: Department[] = [
  { id: "dep1", name: "Computer Science", head: "Dr. Alan Turing", teachers: 15, students: 350, avgScore: 88, completionRate: 92 },
  { id: "dep2", name: "Mathematics", head: "Dr. Ada Lovelace", teachers: 12, students: 280, avgScore: 85, completionRate: 88 },
  { id: "dep3", name: "Physics", head: "Dr. Marie Curie", teachers: 10, students: 210, avgScore: 82, completionRate: 85 },
  { id: "dep4", name: "History", head: "Dr. Herodotus", teachers: 8, students: 150, avgScore: 91, completionRate: 95 },
  { id: "dep5", name: "Literature", head: "Dr. Maya Angelou", teachers: 13, students: 180, avgScore: 89, completionRate: 94 },
  { id: "dep6", name: "Chemistry", head: "Dr. Rosalind Franklin", teachers: 11, students: 200, avgScore: 86, completionRate: 90 },
];

const teachers: Teacher[] = [
  { id: "t1", name: "Prof. John Doe", avatarUrl: "https://randomuser.me/api/portraits/men/34.jpg", avatarAiHint: "profile man", department: "Computer Science", coursesTaught: 3, studentEngagement: 95, avgStudentScore: 92, performanceTrend: 'up' },
  { id: "t2", name: "Prof. Jane Smith", avatarUrl: "https://randomuser.me/api/portraits/women/45.jpg", avatarAiHint: "profile woman", department: "Mathematics", coursesTaught: 2, studentEngagement: 91, avgStudentScore: 88, performanceTrend: 'stable' },
  { id: "t3", name: "Dr. Robert Brown", avatarUrl: "https://randomuser.me/api/portraits/men/36.jpg", avatarAiHint: "profile man", department: "Physics", coursesTaught: 4, studentEngagement: 88, avgStudentScore: 80, performanceTrend: 'down' },
  { id: "t4", name: "Dr. Emily White", avatarUrl: "https://randomuser.me/api/portraits/women/47.jpg", avatarAiHint: "profile woman", department: "History", coursesTaught: 2, studentEngagement: 98, avgStudentScore: 94, performanceTrend: 'up' },
  { id: "t5", name: "Prof. Michael Green", avatarUrl: "https://randomuser.me/api/portraits/men/38.jpg", avatarAiHint: "profile man", department: "Literature", coursesTaught: 3, studentEngagement: 93, avgStudentScore: 90, performanceTrend: 'stable' },
];

const platformEngagementData = [
    { month: "Jan", users: 800 }, { month: "Feb", users: 950 }, { month: "Mar", users: 1000 },
    { month: "Apr", users: 1100 }, { month: "May", users: 1250 }, { month: "Jun", users: 1400 },
];

// --- Chart Configurations ---
const departmentChartConfig = {
  avgScore: { label: "Avg. Score", color: "hsl(var(--chart-1))" },
  completionRate: { label: "Completion %", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const engagementChartConfig = {
  users: { label: "Active Users", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;


// --- Components ---
function StatsCard({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) {
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

function PerformanceTrend({ trend }: { trend: Teacher['performanceTrend'] }) {
    const trendMap = {
        up: { icon: TrendingUp, color: "text-green-500", label: "Improving" },
        down: { icon: TrendingDown, color: "text-red-500", label: "Declining" },
        stable: { icon: Activity, color: "text-yellow-500", label: "Stable" },
    };
    const { icon: Icon, color, label } = trendMap[trend];
    return <span className={`flex items-center text-xs ${color}`}><Icon className="mr-1 h-3 w-3"/>{label}</span>
}

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">High-level overview of the MindShift platform.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Students" value={overallStats.totalStudents.toLocaleString()} icon={Users} />
          <StatsCard title="Active Teachers" value={overallStats.activeTeachers} icon={Users} />
          <StatsCard title="Departments" value={overallStats.departments} icon={Building} />
          <StatsCard title="Total Courses" value={overallStats.courses} icon={BookOpen} />
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Average scores and completion rates by department.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={departmentChartConfig} className="h-[300px] w-full">
                <BarChart data={departments} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend content={<ChartLegendContent />} />
                  <Bar dataKey="avgScore" fill="var(--color-avgScore)" radius={4} />
                  <Bar dataKey="completionRate" fill="var(--color-completionRate)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Platform Engagement</CardTitle>
              <CardDescription>Monthly active users trend.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={engagementChartConfig} className="h-[300px] w-full">
                <LineChart data={platformEngagementData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8}/>
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                    <Legend content={<ChartLegendContent />} />
                    <Line type="monotone" dataKey="users" stroke="var(--color-users)" strokeWidth={2} dot={true}/>
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Department & Teacher Tables */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Department Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Avg. Score</TableHead>
                    <TableHead className="text-right">Completion Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dep) => (
                    <TableRow key={dep.id}>
                      <TableCell>
                          <div className="font-medium">{dep.name}</div>
                          <div className="text-xs text-muted-foreground">{dep.teachers} teachers, {dep.students} students</div>
                      </TableCell>
                      <TableCell>{dep.avgScore}%</TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span>{dep.completionRate}%</span>
                          <Progress value={dep.completionRate} className="h-1.5 w-24 mt-1" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Top Teacher Performance</CardTitle>
            </CardHeader>
            <CardContent>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Avg. Score</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>
                         <div className="flex items-center gap-2">
                             <UserAvatar src={teacher.avatarUrl} aiHint={teacher.avatarAiHint} fallbackInitials={teacher.name.split(' ').map(n=>n[0]).join('')} size="sm" />
                             <div>
                                <p className="font-medium">{teacher.name}</p>
                                <p className="text-xs text-muted-foreground">{teacher.department}</p>
                             </div>
                         </div>
                      </TableCell>
                      <TableCell>{teacher.studentEngagement}%</TableCell>
                      <TableCell>{teacher.avgStudentScore}%</TableCell>
                      <TableCell><PerformanceTrend trend={teacher.performanceTrend} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

      </div>
    </AdminLayout>
  );
}
