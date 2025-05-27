
"use client";

import * from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, parse } from "date-fns";
import { CalendarIcon, BookOpen, Users, ListChecks, Presentation, PlusCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { RawScheduleEvent } from "@/app/schedule/page"; // Assuming this type is exported

const eventTypes = [
  { value: "study", label: "Study Session", icon: BookOpen, color: "text-blue-500" },
  { value: "group-study", label: "Group Study", icon: Users, color: "text-purple-500" },
  { value: "task", label: "Task", icon: ListChecks, color: "text-yellow-500" },
  { value: "lecture", label: "Lecture", icon: Presentation, color: "text-green-500" },
] as const;

type EventTypeValue = (typeof eventTypes)[number]["value"];

const addEventFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  date: z.date({ required_error: "A date is required." }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/i, {
    message: "Invalid time format. Use HH:MM AM/PM (e.g., 09:30 AM).",
  }),
  type: z.enum(eventTypes.map(et => et.value) as [EventTypeValue, ...EventTypeValue[]] , { required_error: "Event type is required." }),
  topic: z.string().optional(),
  details: z.string().optional(),
  alarmSet: z.boolean().default(false),
});

export type AddEventFormValues = z.infer<typeof addEventFormSchema>;

interface AddEventDialogProps {
  children: React.ReactNode; // For the trigger button
  onEventAdd: (newEvent: RawScheduleEvent) => void;
}

export function AddEventDialog({ children, onEventAdd }: AddEventDialogProps) {
  const [open, setOpen] = React.useState(false);
  const form = useForm<AddEventFormValues>({
    resolver: zodResolver(addEventFormSchema),
    defaultValues: {
      title: "",
      date: new Date(),
      time: format(new Date(), "hh:mm a"), // Default to current time
      type: "study",
      topic: "",
      details: "",
      alarmSet: false,
    },
  });

  function onSubmit(data: AddEventFormValues) {
    const selectedEventType = eventTypes.find(et => et.value === data.type);
    const newEvent: RawScheduleEvent = {
      id: crypto.randomUUID(),
      title: data.title,
      date: format(data.date, "yyyy-MM-dd"),
      time: data.time.toUpperCase(),
      type: data.type,
      topic: data.topic,
      details: data.details,
      alarmSet: data.alarmSet,
      icon: selectedEventType?.icon || BookOpen, // Default icon
      iconColorClass: selectedEventType?.color || "text-primary",
    };
    onEventAdd(newEvent);
    form.reset();
    setOpen(false); // Close the dialog
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Event
          </DialogTitle>
          <DialogDescription>
            Fill in the details for your new schedule item.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Morning Calculus Review" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } // Disable past dates
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 09:30 AM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventTypes.map(et => (
                        <SelectItem key={et.value} value={et.value}>
                          <div className="flex items-center">
                            <et.icon className={cn("mr-2 h-4 w-4", et.color)} />
                            {et.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Derivatives and Integrals" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Details (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Focus on chapters 3 & 4."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alarmSet"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Set Alarm</FormLabel>
                    <FormDescription>
                      Receive an in-app notification for this event.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <PlusCircle className="mr-2 h-4 w-4 animate-spin" />}
                Add Event
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
