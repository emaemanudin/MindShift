
"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScheduleItem, type ScheduleEventData } from "@/components/schedule/schedule-item";
import { useToast } from "@/hooks/use-toast";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Users,
  ListChecks,
  ShieldCheck,
  SpellCheck,
  Atom,
  CalendarDays,
  Clock,
  PlusCircle,
  Bell,
  CalendarIcon, // Default icon
} from "lucide-react";
import { format, addDays, isToday, isTomorrow, parseISO, isValid } from "date-fns";

interface RawScheduleEvent {
  id: string;
  date: string; // ISO date string e.g., "2024-07-28"
  time: string; // e.g., "09:00 AM"
  title: string;
  type: "study" | "group-study" | "task" | "lecture";
  topic?: string;
  alarmSet: boolean;
  icon: LucideIcon;
  iconColorClass?: string;
  details?: string;
}

const initialScheduleEvents: RawScheduleEvent[] = [
  { id: "1", date: format(new Date(), "yyyy-MM-dd"), time: "09:00 AM", title: "Morning Calculus Review", type: "study", topic: "Derivatives and Integrals", alarmSet: true, icon: BookOpen, iconColorClass: "text-blue-500", details: "Focus on chapters 3 & 4." },
  { id: "2", date: format(new Date(), "yyyy-MM-dd"), time: "11:00 AM", title: "Web Dev Group Project", type: "group-study", topic: "JavaScript Frontend Logic", alarmSet: true, icon: Users, iconColorClass: "text-purple-500", details: "Meet on Discord, work on auth flow." },
  { id: "3", date: format(new Date(), "yyyy-MM-dd"), time: "02:00 PM", title: "Cybersecurity Lecture", type: "lecture", topic: "Network Protocols", alarmSet: false, icon: ShieldCheck, iconColorClass: "text-red-500", details: "Attend online via Zoom link." },
  { id: "4", date: format(new Date(), "yyyy-MM-dd"), time: "04:00 PM", title: "Algorithms Homework", type: "task", topic: "Complete Exercise Set 2", alarmSet: true, icon: ListChecks, iconColorClass: "text-yellow-500", details: "Submit by midnight." },
  { id: "5", date: format(addDays(new Date(), 1), "yyyy-MM-dd"), time: "10:00 AM", title: "EUEE English Prep", type: "study", topic: "Essay Writing Practice", alarmSet: true, icon: SpellCheck, iconColorClass: "text-orange-500" },
  { id: "6", date: format(addDays(new Date(), 1), "yyyy-MM-dd"), time: "03:00 PM", title: "Cambridge Physics Lab", type: "study", topic: "Experiment 4 Report", alarmSet: false, icon: Atom, iconColorClass: "text-green-500" },
  { id: "7", date: format(addDays(new Date(), 2), "yyyy-MM-dd"), time: "01:00 PM", title: "Software Eng. Code Review", type: "group-study", topic: "Review PR for feature X", alarmSet: true, icon: Users, iconColorClass: "text-purple-500" },
  { id: "8", date: format(addDays(new Date(), 3), "yyyy-MM-dd"), time: "09:30 AM", title: "Prepare for Math Exam", type: "task", topic: "Revise all EUEE math topics", alarmSet: true, icon: ListChecks, iconColorClass: "text-yellow-500" },
];

export default function SchedulePage() {
  const { toast } = useToast();
  const [events, setEvents] = useState<RawScheduleEvent[]>(initialScheduleEvents);
  const [activeTab, setActiveTab] = useState<"today" | "tomorrow" | "upcoming">("today");

  // Effect for setting up in-app reminders
  useEffect(() => {
    const now = new Date();
    const activeEvents = events.filter(event => {
      const eventDate = parseISO(event.date);
      return (
        (activeTab === "today" && isToday(eventDate)) ||
        (activeTab === "tomorrow" && isTomorrow(eventDate))
      ) && event.alarmSet;
    });

    const timers: NodeJS.Timeout[] = [];

    activeEvents.forEach(event => {
      const [timeStr, period] = event.time.split(" ");
      const [hoursStr, minutesStr] = timeStr.split(":");
      let hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);

      if (period === "PM" && hours < 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0; // Midnight

      const eventDateTime = parseISO(event.date);
      eventDateTime.setHours(hours, minutes, 0, 0);
      
      const timeToEvent = eventDateTime.getTime() - now.getTime();

      if (timeToEvent > 0 && timeToEvent < 24 * 60 * 60 * 1000) { // Only schedule for near future
        const timerId = setTimeout(() => {
          toast({
            title: `Reminder: ${event.title}`,
            description: `${event.topic || ""} is scheduled for ${event.time}. ${event.details || ""}`,
            duration: 10000, // 10 seconds
          });
        }, timeToEvent);
        timers.push(timerId);
      }
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [events, toast, activeTab]);


  const getFilteredEvents = (filterType: "today" | "tomorrow" | "upcoming"): ScheduleEventData[] => {
    const today = new Date();
    return events
      .filter(event => {
        const eventDate = parseISO(event.date);
        if (!isValid(eventDate)) return false;
        if (filterType === "today") return isToday(eventDate);
        if (filterType === "tomorrow") return isTomorrow(eventDate);
        if (filterType === "upcoming") return eventDate > addDays(today,1); // Everything after tomorrow
        return false;
      })
      .sort((a, b) => {
        // Sort by date first, then by time
        const dateA = parseISO(a.date).getTime();
        const dateB = parseISO(b.date).getTime();
        if (dateA !== dateB) return dateA - dateB;

        const timeToMinutes = (timeStr: string) => {
            const [time, period] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (period === 'PM' && hours < 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0; // Midnight case
            return hours * 60 + minutes;
        };
        return timeToMinutes(a.time) - timeToMinutes(b.time);
      })
      .map(event => {
        const { icon: IconComponent, ...restOfEvent } = event;
        const iconElement = IconComponent ? <IconComponent className={`h-6 w-6 ${event.iconColorClass || 'text-primary'}`} /> : <CalendarIcon className="h-6 w-6 text-muted-foreground" />;
        return { ...restOfEvent, iconElement };
      });
  };

  const renderEventList = (eventList: ScheduleEventData[]) => {
    if (eventList.length === 0) {
      return (
        <div className="text-center py-10">
          <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No events scheduled for this period.</p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {eventList.map(event => (
          <ScheduleItem key={event.id} {...event} />
        ))}
      </div>
    );
  };
  
  const todayEvents = getFilteredEvents("today");
  const tomorrowEvents = getFilteredEvents("tomorrow");
  const upcomingEvents = getFilteredEvents("upcoming");

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground flex items-center">
              <CalendarDays className="mr-3 h-8 w-8 text-primary" /> My Schedule
            </h2>
            <p className="text-muted-foreground">
              Stay organized and manage your study times and tasks.
            </p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-5 w-5" /> Add Event
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "today" | "tomorrow" | "upcoming")} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
          <TabsContent value="today">
            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Schedule</CardTitle>
                <CardDescription>{format(new Date(), "EEEE, MMMM do")}</CardDescription>
              </CardHeader>
              <CardContent>
                {renderEventList(todayEvents)}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tomorrow">
            <Card>
              <CardHeader>
                <CardTitle>Tomorrow&apos;s Schedule</CardTitle>
                <CardDescription>{format(addDays(new Date(), 1), "EEEE, MMMM do")}</CardDescription>
              </CardHeader>
              <CardContent>
                {renderEventList(tomorrowEvents)}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                 <CardDescription>Events scheduled after tomorrow.</CardDescription>
              </CardHeader>
              <CardContent>
                {renderEventList(upcomingEvents)}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
         <p className="text-sm text-muted-foreground mt-4">
            Note: In-app reminders will appear for events with alarms set if the application is open. Full offline notifications require PWA features.
        </p>
      </div>
    </AppLayout>
  );
}
