
"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import type { LucideIcon } from "lucide-react"; // Still useful for data definition
import { Button } from "@/components/ui/button";
import { Check, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// This interface describes the shape of the task data in page.tsx
export interface Task {
  id: string;
  title: string;
  dueDate: string;
  icon: LucideIcon; // The component type for the icon
  iconBgClass: string;
  iconColorClass: string;
  completed?: boolean;
}

// Props for the TaskItem component
interface TaskItemProps {
  id: string;
  title: string;
  dueDate: string;
  iconElement: ReactNode; // Expect a ReactNode (element) for the icon
  iconBgClass: string;
  completedProp?: boolean; // Initial completed state
  onToggleComplete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TaskItem({
  id,
  title,
  dueDate,
  iconElement,
  iconBgClass,
  completedProp,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const [isCompleted, setIsCompleted] = useState(completedProp || false);

  const handleToggle = () => {
    setIsCompleted(!isCompleted);
    if (onToggleComplete) {
      onToggleComplete(id);
    }
  };

  return (
    <div className={cn(
      "flex items-center p-3 border rounded-lg hover:bg-accent/50 transition-colors",
      isCompleted && "opacity-70"
    )}>
      <div className={cn("p-2 rounded-full mr-4", iconBgClass)}>
        {iconElement} {/* Render the passed icon element */}
      </div>
      <div className="flex-grow">
        <h4 className={cn("font-medium text-foreground", isCompleted && "line-through")}>{title}</h4>
        <p className="text-xs text-muted-foreground">{dueDate}</p>
      </div>
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", isCompleted ? "text-green-500 hover:text-green-600" : "text-muted-foreground hover:text-foreground")}
          onClick={handleToggle}
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          <Check className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" aria-label="Task options">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit && onEdit(id)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete && onDelete(id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
