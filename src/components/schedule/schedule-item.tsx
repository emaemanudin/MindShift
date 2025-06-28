
"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, BellRing, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ScheduleEventData {
  id: string;
  time: string;
  title: string;
  type: "study" | "group-study" | "task" | "lecture";
  topic?: string;
  alarmSet: boolean;
  iconElement: ReactNode;
  iconColorClass?: string;
  details?: string;
  date?: string; // Optional, for upcoming items primarily
}

export function ScheduleItem({ 
  time, 
  title, 
  type, 
  topic, 
  alarmSet, 
  iconElement, 
  details,
  date // For upcoming items
}: ScheduleEventData) {
  const [clientFormattedDate, setClientFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    if (date) {
      // The `date` prop is a "yyyy-MM-dd" string.
      // `new Date(date)` parses this as UTC midnight on that day.
      // `toLocaleDateString` then formats this UTC Date object using the
      // client's specific locale and timezone settings.
      // This calculation is deferred to the client-side after hydration.
      setClientFormattedDate(
        new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { // Use T00:00:00 to avoid timezone issues
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      );
    } else {
      setClientFormattedDate(null);
    }
  }, [date]); // Rerun if the date prop changes
  
  const typeDisplayNames: Record<ScheduleEventData["type"], string> = {
    study: "Study Session",
    "group-study": "Group Study",
    task: "Task",
    lecture: "Lecture",
  };

  const typeBadgeColors: Record<ScheduleEventData["type"], string> = {
    study: "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30",
    "group-study": "bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30",
    task: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
    lecture: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-start gap-4">
        <div className="flex-shrink-0 pt-1">
          {iconElement}
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-semibold text-lg text-foreground">{title}</h4>
            <Badge variant="outline" className={cn("text-xs", typeBadgeColors[type])}>
              {typeDisplayNames[type]}
            </Badge>
          </div>
          {topic && <p className="text-sm text-primary mb-1">{topic}</p>}
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Clock className="h-4 w-4 mr-1.5" />
            <span>{time}</span>
            {/* Render the client-side formatted date only when available */}
            {date && clientFormattedDate && (
              <span className="ml-2 text-xs">(On {clientFormattedDate})</span>
            )}
          </div>
          {details && <p className="text-xs text-muted-foreground">{details}</p>}
        </div>
        <div className="flex-shrink-0 pt-1">
          {alarmSet ? (
            <BellRing className="h-5 w-5 text-primary" />
          ) : (
            <Bell className="h-5 w-5 text-muted-foreground/70" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
