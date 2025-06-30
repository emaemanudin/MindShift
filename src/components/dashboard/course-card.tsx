
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react"; // For Course data interface
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Book, Clock, BookOpen as BookOpenIcon } from "lucide-react"; // Renamed to avoid conflict
import Image from "next/image";
import { cn } from "@/lib/utils";

// Original Course interface for data structure
export interface Course {
  id: string;
  title: string;
  description: string;
  status: "Active" | "Completed" | "Upcoming";
  progress: number;
  lessons: number;
  duration: string;
  rating?: number;
  icon?: LucideIcon; // Icon component type in data
  iconBgColor?: string;
  coverImage?: {
    url: string;
    aiHint: string;
  };
}

// Props for the CourseCard component
interface CourseCardProps {
  courseData: Omit<Course, 'icon' | 'iconBgColor'>; // Serializable data
  iconElement?: ReactNode; // Icon as a ReactNode
  iconBgColor?: string;
}

export function CourseCard({ courseData, iconElement, iconBgColor }: CourseCardProps) {
  const { id, title, description, status, progress, lessons, duration, rating, coverImage } = courseData;

  return (
    <Card className="shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className={cn("h-40 flex items-center justify-center relative", iconBgColor || "bg-primary/10")}>
        {coverImage ? (
            <Image src={coverImage.url} alt={title} layout="fill" objectFit="cover" data-ai-hint={coverImage.aiHint} />
        ) : iconElement ? (
            iconElement
        ) : (
          <BookOpenIcon className="h-16 w-16 text-primary" /> // Default icon
        )}
        {rating && (
          <Badge variant="secondary" className="absolute top-3 right-3 bg-background/70 backdrop-blur-sm">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            {rating.toFixed(1)}
          </Badge>
        )}
      </div>
      <CardContent className="p-4 md:p-6">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-lg text-foreground">{title}</h4>
          <Badge 
            variant={status === "Active" ? "default" : status === "Completed" ? "secondary" : "outline"}
            className={cn(
              status === "Active" && "bg-primary/20 text-primary border-primary/30",
              status === "Completed" && "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
              status === "Upcoming" && "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30"
            )}
          >
            {status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4 h-10 overflow-hidden text-ellipsis">
          {description}
        </p>
        <div className="flex justify-between items-center mb-3">
          <Progress value={progress} className="h-2 flex-1" />
          <span className="ml-3 text-sm font-medium text-foreground">{progress}%</span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="flex items-center">
            <Book className="h-3 w-3 mr-1" /> {lessons} Lessons
          </span>
          <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" /> {duration}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
