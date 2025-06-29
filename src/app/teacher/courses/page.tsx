
"use client";

import { TeacherLayout } from "@/components/teacher/teacher-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, BarChart2 } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  studentCount: number;
  averageGrade: number;
}

const courses: Course[] = [
  { id: "c1", title: "Advanced JavaScript", description: "Deep dive into modern JS, including ES2025 features, performance optimization, and advanced patterns.", studentCount: 45, averageGrade: 88 },
  { id: "c2", title: "Database Systems", description: "Covers relational and NoSQL databases, data modeling, normalization, and query optimization with SQL and MongoDB.", studentCount: 38, averageGrade: 82 },
  { id: "c3", title: "Web Development", description: "Comprehensive full-stack development using Next.js, Tailwind CSS, and Firebase for modern web applications.", studentCount: 41, averageGrade: 91 },
];

export default function TeacherCoursesPage() {
  return (
    <TeacherLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
          <p className="text-muted-foreground">Manage your course materials, view rosters, and track class-specific progress.</p>
        </div>

        <div className="space-y-6">
          {courses.map(course => (
            <Card key={course.id} className="shadow-md">
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      <span className="font-medium">{course.studentCount} Students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart2 className="h-5 w-5" />
                      <span className="font-medium">{course.averageGrade}% Average Grade</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Manage Content</Button>
                    <Button>View Roster</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </TeacherLayout>
  );
}
