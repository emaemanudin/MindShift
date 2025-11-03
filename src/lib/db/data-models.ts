/**
 * @fileoverview This file defines the single source of truth for all data models
 * used across the MindShift application.
 */

import type { LucideIcon } from "lucide-react";

// --- Base & User Models ---

export type UserRole = "student" | "teacher" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  avatarAiHint?: string;
  status?: "Active" | "Suspended"; // Primarily for Admin view
}

// --- Course & Content Models ---

export interface Course {
  id: string;
  title: string;
  description: string;
  status: "Active" | "Completed" | "Upcoming";
  progress: number;
  lessons: number;
  duration: string;
  rating?: number;
  category: string;
  icon: LucideIcon;
  coverImage: {
    url: string;
    aiHint: string;
  };
}

// --- Task & Assignment Models ---

export interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: "Pending" | "In Progress" | "Submitted" | "Completed";
  icon: LucideIcon;
  description?: string;
  estimatedTimeHours?: number;
  timeSpentHours?: number;
  progress?: number;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  questionType: 'mcq' | 'tf';
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Quiz {
  id:string;
  title: string;
  course: string;
  dueDate: string;
  status: "Take Quiz" | "Submitted" | "Graded";
  icon: LucideIcon;
  description?: string;
  path?: string;
  timeLimitMinutes?: number;
  grade?: number; // 0-100
  feedback?: string;
  questions: QuizQuestion[];
}


// --- Progress & Tracking Models ---

export interface TimeTracking {
  totalAppTime: string;
  totalTaskTime: string;
}

export interface ProgressGoals {
  daily: number;
  weekly: number;
  monthly: number;
}


// --- Collaboration Models ---

export interface StudyGroupMember {
  id: string;
  name: string;
  avatarUrl: string;
  avatarAiHint?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl: string;
  userAvatarAiHint?: string;
  text: string;
  timestamp: Date;
  isOwnMessage?: boolean;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  teacher: User;
  members: StudyGroupMember[];
  messages: ChatMessage[];
  icon: LucideIcon;
}

export interface Activity {
  id: string;
  description: string;
  timestamp: string;
  icon: LucideIcon;
  actionIcon?: LucideIcon;
}


// --- Schedule Models ---

export interface ScheduleEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  type: "study" | "group-study" | "task" | "lecture";
  topic?: string;
  alarmSet: boolean;
  icon: LucideIcon;
  details?: string;
}
