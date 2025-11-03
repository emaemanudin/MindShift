/**
 * @fileoverview This file acts as a temporary, centralized mock database.
 * It provides functions to fetch data, simulating an async API.
 * In a production environment, this file would be replaced by calls to a real database adapter.
 */

import {
  Code2, Binary, Combine, ShieldCheck, Network, TerminalSquare, Calculator,
  SpellCheck, Atom, FlaskConical, Laptop, Database, BrainCircuit, AlertCircle,
  HelpCircle, BookOpen, Users, MessageSquare, Trophy, Award, Check, ArrowRight,
  ListChecks, Presentation,
} from 'lucide-react';
import { format, addDays } from "date-fns";

import type {
  User, Course, Assignment, Task, StudyGroup, Activity, Quiz, TimeTracking, ProgressGoals, ScheduleEvent,
  ChatMessage,
} from './data-models';

// --- MOCK USERS ---
export const mockUsers: Record<string, User> = {
  "student-dev": { id: "student-dev", name: "Dev User", email: "dev@mindshift.com", role: 'student', avatarUrl: "https://randomuser.me/api/portraits/lego/1.jpg", avatarAiHint: "lego profile", status: 'Active' },
  "teacher-emily": { id: "teacher-emily", name: "Dr. Emily Carter", email: "teacher@teacher.com", role: 'teacher', avatarUrl: "https://randomuser.me/api/portraits/women/50.jpg", avatarAiHint: 'teacher profile', status: 'Active' },
  "admin-platform": { id: "admin-platform", name: "Platform Admin", email: "admin@admin.com", role: 'admin', avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg", avatarAiHint: 'admin profile', status: 'Active' },
  "user-sarah": { id: "user-sarah", name: "Sarah Day", email: "sarah@example.com", role: 'student', avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg", avatarAiHint: "profile woman" },
  "user-john": { id: "user-john", name: "John Smith", email: "john@example.com", role: 'student', avatarUrl: "https://randomuser.me/api/portraits/men/46.jpg", avatarAiHint: "profile man" },
  "user-maria": { id: "user-maria", name: "Maria Garcia", email: "maria@example.com", role: 'student', avatarUrl: "https://randomuser.me/api/portraits/women/47.jpg", avatarAiHint: "profile woman" },
};


// --- MOCK COURSES ---
const mockCourses: Course[] = [
  { id: "1", title: "Web Development", description: "Learn modern web development with HTML, CSS, and JavaScript.", status: "Active", progress: 65, lessons: 12, duration: "8h 30m", rating: 4.8, category: "Software Engineering", icon: Laptop, coverImage: { url: "https://placehold.co/600x400.png", aiHint: "coding laptop" } },
  { id: "2", title: "Database Systems", description: "Master SQL and database design principles.", status: "Active", progress: 80, lessons: 8, duration: "6h 15m", rating: 4.6, category: "Software Engineering", icon: Database, coverImage: { url: "https://placehold.co/600x400.png", aiHint: "database server" } },
  { id: "3", title: "Machine Learning", description: "Introduction to AI and machine learning algorithms.", status: "Active", progress: 45, lessons: 5, duration: "4h 20m", rating: 4.9, category: "Software Engineering", icon: BrainCircuit, coverImage: { url: "https://placehold.co/600x400.png", aiHint: "robot ai" } },
  { id: "se1", title: "Advanced JavaScript", description: "Deep dive into modern JavaScript features and patterns.", status: "Active", progress: 75, lessons: 20, duration: "15h", rating: 4.9, category: "Software Engineering", icon: Code2, coverImage: { url: "https://placehold.co/600x400.png", aiHint: "javascript code" }},
  { id: "se2", title: "Data Structures & Algorithms", description: "Fundamental concepts for efficient problem-solving.", status: "Active", progress: 50, lessons: 25, duration: "20h", rating: 4.7, category: "Software Engineering", icon: Binary, coverImage: { url: "https://placehold.co/600x400.png", aiHint: "algorithm flowchart" }},
  { id: "se3", title: "Full-Stack Web Development", description: "Build complete web applications with React and Node.js.", status: "Upcoming", progress: 0, lessons: 30, duration: "25h", rating: 4.8, category: "Software Engineering", icon: Combine, coverImage: { url: "https://placehold.co/600x400.png", aiHint: "web application" }},
  { id: "cs1", title: "Intro to Cyber Security", description: "Basics of cyber threats and defenses.", status: "Active", progress: 80, lessons: 15, duration: "12h", rating: 4.6, category: "Cyber Security", icon: ShieldCheck, coverImage: { url: "https://placehold.co/600x400.png", aiHint: "security lock" }},
  { id: "cs2", title: "Network Security", description: "Learn to secure networks and protect data.", status: "Active", progress: 60, lessons: 18, duration: "14h", rating: 4.5, category: "Cyber Security", icon: Network, coverImage: { url: "https://placehold.co/600x400.png", aiHint: "network diagram" }},
];

// --- MOCK TASKS & ASSIGNMENTS ---
const mockDashboardTasks: Task[] = [
  { id: "1", title: "Web Dev Assignment", dueDate: "Due tomorrow", icon: AlertCircle, completed: false },
  { id: "2", title: "Database Quiz", dueDate: "Due in 3 days", icon: HelpCircle, completed: true },
  { id: "3", title: "Read ML Chapter 5", dueDate: "Due in 5 days", icon: BookOpen, completed: false },
];

const mockAssignments: Assignment[] = [
  { id: "1", title: "Calculus Problem Set 3", course: "Mathematics 101", dueDate: "2025-07-15", status: "In Progress", estimatedTimeHours: 4, timeSpentHours: 1.5, progress: 38, icon: BookOpen, description: "Chapters 5-7, focusing on integration techniques." },
  { id: "2", title: "History Essay: The Roman Empire", course: "World History", dueDate: "2025-07-20", status: "Pending", estimatedTimeHours: 6, timeSpentHours: 0, progress: 0, icon: BookOpen, description: "A 2000-word essay on the rise and fall of the Roman Empire." },
];

// --- MOCK QUIZZES ---
const mockQuizzes: Quiz[] = [
    { id: "7", title: "History Midterm Quiz", course: "World History", dueDate: "2025-07-19", status: "Submitted", icon: ListChecks, description: "Your submission is awaiting a grade from your teacher.", path: '/quiz/start', timeLimitMinutes: 20, questions: [] },
    { id: "8", title: "JavaScript Fundamentals Quiz", course: "Web Development", dueDate: "2025-07-12", status: "Graded", icon: Check, grade: 88, feedback: "Great work! Pay attention to `let` vs `const`.", path: '/quiz/start', timeLimitMinutes: 10, questions: [] },
];

// --- MOCK STUDY GROUPS ---
const mockStudyGroups: StudyGroup[] = [
  { id: "1", name: "Web Dev Study Group", description: "Next meeting: Tomorrow, 3 PM", icon: Users, teacher: mockUsers['teacher-emily'], members: [mockUsers['student-dev'], mockUsers['user-sarah'], mockUsers['user-john']], messages: [] },
  { id: "2", name: "Database Team", description: "Working on final project", icon: Users, teacher: mockUsers['teacher-emily'], members: [mockUsers['student-dev'], mockUsers['user-john']], messages: [] },
  { id: "3", name: "AI Research Club", description: "Monthly meeting: Friday, 4 PM", icon: Users, teacher: mockUsers['teacher-emily'], members: [mockUsers['student-dev'], mockUsers['user-sarah']], messages: [] },
];

// --- MOCK ACTIVITIES ---
const mockRecentActivities: Activity[] = [
  { id: "1", description: "Completed Web Development Chapter 4", timestamp: "2 hours ago", icon: BookOpen, actionIcon: Check },
  { id: "2", description: "New comment on your post in Database Group", timestamp: "5 hours ago", icon: MessageSquare, actionIcon: ArrowRight },
  { id: "3", description: "Achievement unlocked: 50 Study Hours", timestamp: "Yesterday", icon: Trophy, actionIcon: Award },
];

// --- MOCK DASHBOARD STATS ---
const mockStats = { activeCourses: 5, completedTasks: 12, pendingTasks: 3, studyHours: 42 };

// --- MOCK SCHEDULE ---
const mockScheduleEvents: ScheduleEvent[] = [
  { id: "1", date: format(new Date(), "yyyy-MM-dd"), time: "09:00 AM", title: "Morning Calculus Review", type: "study", topic: "Derivatives and Integrals", alarmSet: true, icon: BookOpen, details: "Focus on chapters 3 & 4." },
  { id: "2", date: format(new Date(), "yyyy-MM-dd"), time: "11:00 AM", title: "Web Dev Group Project", type: "group-study", topic: "JavaScript Frontend Logic", alarmSet: true, icon: Users, details: "Meet on Discord, work on auth flow." },
];

/**
 * Simulates an async API call.
 * @param data The data to be returned.
 * @param delay The delay in milliseconds.
 */
const fetchSim = <T>(data: T, delay = 300): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay));


// --- API-like Functions ---

export const db = {
  getUser: (userId: string) => fetchSim(mockUsers[userId]),
  getDashboardData: (userId: string) => fetchSim({
    stats: mockStats,
    courses: mockCourses.slice(0, 3),
    tasks: mockDashboardTasks,
    studyGroups: mockStudyGroups,
    recentActivities: mockRecentActivities,
  }),
  getCourses: () => fetchSim(mockCourses),
  getAssignments: () => fetchSim(mockAssignments),
  getQuizzes: () => fetchSim(mockQuizzes),
  getScheduleEvents: () => fetchSim(mockScheduleEvents),
};
