import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Book, Clock } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface Course {
  id: string;
  title: string;
  description: string;
  status: "Active" | "Completed" | "Upcoming";
  progress: number;
  lessons: number;
  duration: string;
  rating?: number;
  icon?: LucideIcon; // For simple icon display
  iconBgColor?: string; // Tailwind bg color class for icon background
  image?: string; // URL for image
  imageAiHint?: string; // AI hint for image
}

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const Icon = course.icon;

  return (
    <Card className="shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className={cn("h-40 flex items-center justify-center relative", course.iconBgColor || "bg-primary/10")}>
        {course.image ? (
            <Image src={course.image} alt={course.title} layout="fill" objectFit="cover" data-ai-hint={course.imageAiHint} />
        ) : Icon ? (
            <Icon className="h-16 w-16 text-primary" />
        ) : (
          <BookOpen className="h-16 w-16 text-primary" /> // Default icon
        )}
        {course.rating && (
          <Badge variant="secondary" className="absolute top-3 right-3 bg-background/70 backdrop-blur-sm">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            {course.rating.toFixed(1)}
          </Badge>
        )}
      </div>
      <CardContent className="p-4 md:p-6">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-lg text-foreground">{course.title}</h4>
          <Badge 
            variant={course.status === "Active" ? "default" : course.status === "Completed" ? "secondary" : "outline"}
            className={cn(
              course.status === "Active" && "bg-primary/20 text-primary border-primary/30",
              course.status === "Completed" && "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
              course.status === "Upcoming" && "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30"
            )}
          >
            {course.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4 h-10 overflow-hidden text-ellipsis">
          {course.description}
        </p>
        <div className="flex justify-between items-center mb-3">
          <Progress value={course.progress} className="h-2 flex-1" />
          <span className="ml-3 text-sm font-medium text-foreground">{course.progress}%</span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="flex items-center">
            <Book className="h-3 w-3 mr-1" /> {course.lessons} Lessons
          </span>
          <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" /> {course.duration}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
