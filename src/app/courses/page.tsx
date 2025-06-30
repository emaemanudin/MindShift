
"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { CourseCard, type Course } from "@/components/dashboard/course-card";
import type { LucideIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Code2,
  Binary,
  Combine,
  ShieldCheck,
  Network,
  TerminalSquare,
  Calculator,
  SpellCheck,
  Atom,
  FlaskConical,
  BookOpenCheck,
  Search,
  Filter,
  LayoutGrid,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CategorizedCourse extends Course {
  category: string;
  icon: LucideIcon; // Ensure icon is part of the type for data definition
}

const allCoursesData: CategorizedCourse[] = [
  // Software Engineering
  { id: "se1", title: "Advanced JavaScript", description: "Deep dive into modern JavaScript features and patterns.", status: "Active", progress: 75, lessons: 20, duration: "15h", rating: 4.9, category: "Software Engineering", icon: Code2, coverImage: { url: "https://placehold.co/600x400.png", aiHint: "javascript code" }, iconBgColor: "bg-blue-500/10" },
  { id: "se2", title: "Data Structures & Algorithms", description: "Fundamental concepts for efficient problem-solving.", status: "Active", progress: 50, lessons: 25, duration: "20h", rating: 4.7, category: "Software Engineering", icon: Binary, coverImage: { url: "https://placehold.co/600x400.png", aiHint: "algorithm flowchart" }, iconBgColor: "bg-green-500/10" },
  { id: "se3", title: "Full-Stack Web Development", description: "Build complete web applications with React and Node.js.", status: "Upcoming", progress: 0, lessons: 30, duration: "25h", rating: 4.8, category: "Software Engineering", icon: Combine, coverImage: { url: "https://placehold.co/600x400.png", aiHint: "web application" }, iconBgColor: "bg-indigo-500/10" },

  // Cyber Security
  { id: "cs1", title: "Intro to Cyber Security", description: "Basics of cyber threats and defenses.", status: "Active", progress: 80, lessons: 15, duration: "12h", rating: 4.6, category: "Cyber Security", icon: ShieldCheck, coverImage: { url: "https://placehold.co/600x400.png", aiHint: "security lock" }, iconBgColor: "bg-red-500/10" },
  { id: "cs2", title: "Network Security", description: "Learn to secure networks and protect data.", status: "Active", progress: 60, lessons: 18, duration: "14h", rating: 4.5, category: "Cyber Security", icon: Network, coverImage: { url: "https://placehold.co/600x400.png", aiHint: "network diagram" }, iconBgColor: "bg-yellow-500/10" },
  { id: "cs3", title: "Ethical Hacking", description: "Discover vulnerabilities before malicious actors do.", status: "Upcoming", progress: 0, lessons: 22, duration: "18h", rating: 4.9, category: "Cyber Security", icon: TerminalSquare, coverImage: { url: "https://placehold.co/600x400.png", aiHint: "hacker terminal" }, iconBgColor: "bg-gray-500/10" },

  // EUEE
  { id: "euee1", title: "EUEE Mathematics", description: "Comprehensive prep for EUEE Mathematics.", status: "Active", progress: 90, lessons: 30, duration: "20h", rating: 4.7, category: "EUEE", icon: Calculator, coverImage: { url: "https://placehold.co/600x400.png", aiHint: "math equations" }, iconBgColor: "bg-teal-500/10" },
  { id: "euee2", title: "EUEE English", description: "Master English language skills for the EUEE.", status: "Active", progress: 70, lessons: 25, duration: "18h", rating: 4.5, category: "EUEE", icon: SpellCheck, coverImage: { url: "https://placehold.co/600x400.png", aiHint: "english textbook" }, iconBgColor: "bg-orange-500/10" },

  // Cambridge Curriculum
  { id: "cam1", title: "IGCSE Physics", description: "Covering the IGCSE Physics syllabus.", status: "Active", progress: 65, lessons: 28, duration: "22h", rating: 4.8, category: "Cambridge Curriculum", icon: Atom, coverImage: { url: "https://placehold.co/600x400.png", aiHint: "physics experiment" }, iconBgColor: "bg-purple-500/10" },
  { id: "cam2", title: "A-Level Chemistry", description: "Advanced topics for A-Level students.", status: "Upcoming", progress: 10, lessons: 35, duration: "30h", rating: 4.9, category: "Cambridge Curriculum", icon: FlaskConical, coverImage: { url: "https://placehold.co/600x400.png", aiHint: "chemistry lab" }, iconBgColor: "bg-pink-500/10" },
];

const categories = [
  { value: "all", label: "All Curricula" },
  { value: "Software Engineering", label: "Software Engineering" },
  { value: "Cyber Security", label: "Cyber Security" },
  { value: "EUEE", label: "EUEE" },
  { value: "Cambridge Curriculum", label: "Cambridge Curriculum" },
];

export default function MyCoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid"); // Default to grid view
  const [filteredCourses, setFilteredCourses] = useState<CategorizedCourse[]>(allCoursesData);

  useEffect(() => {
    let courses = allCoursesData;
    if (selectedCategory !== "all") {
      courses = courses.filter(course => course.category === selectedCategory);
    }
    if (searchTerm) {
      courses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredCourses(courses);
  }, [selectedCategory, searchTerm]);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground flex items-center">
              <BookOpenCheck className="mr-3 h-8 w-8 text-primary" /> My Courses
            </h2>
            <p className="text-muted-foreground">
              Explore your enrolled courses and track your progress.
            </p>
          </div>
        </div>

        {/* Filters and Search Section */}
        <div className="flex flex-col md:flex-row gap-4 items-center p-4 bg-card rounded-lg shadow">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[240px] h-10">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filter by curriculum" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant={viewMode === 'grid' ? 'secondary' : 'outline'} size="icon" onClick={() => setViewMode('grid')} aria-label="Grid view">
              <LayoutGrid className="h-5 w-5"/>
            </Button>
            <Button variant={viewMode === 'list' ? 'secondary' : 'outline'} size="icon" onClick={() => setViewMode('list')} aria-label="List view">
              <List className="h-5 w-5"/>
            </Button>
          </div>
        </div>
        
        {/* Courses Grid/List */}
        {filteredCourses.length > 0 ? (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            )}
          >
            {filteredCourses.map((courseItem) => {
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
        ) : (
          <div className="text-center py-12">
            <BookOpenCheck className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground">No Courses Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter, or enroll in new courses!
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
