# MindShift Learning Platform: Project Documentation

## 1. Project Overview

MindShift is an advanced, AI-powered learning platform designed to provide a comprehensive and integrated educational experience for students, teachers, and administrators. It combines robust course and task management with cutting-edge AI tools to enhance learning, streamline teaching workflows, and provide high-level administrative oversight.

The platform is built on a modern tech stack, prioritizing user experience, scalability, and developer efficiency.

---

## 2. Core Architecture & Tech Stack

- **Frontend Framework**: Next.js 15 with the App Router
- **Language**: TypeScript
- **UI Components**: ShadCN/UI, built on Radix UI and Tailwind CSS
- **Styling**: Tailwind CSS with a themable approach using CSS variables
- **AI Integration**: Google AI Platform via Genkit
- **Real-time Communication**: WebRTC for peer-to-peer video/data connections
- **Charts & Data Visualization**: Recharts

---

## 3. Platform Portals

The MindShift platform is divided into three distinct portals, each tailored to its user base. For this demo, authentication is bypassed.

### 3.1. Student Portal
- **Access**: Navigate to the root URL (`/`).
- **Description**: The primary interface for students to manage their learning journey.

### 3.2. Teacher Portal
- **Access**: Navigate to `/teacher/login`.
- **Credentials**:
  - **Email**: `teacher@teacher.com`
  - **Password**: `teacher`
- **Description**: A dedicated environment for educators to manage courses, grade assignments, and monitor student progress.

### 3.3. Admin Portal
- **Access**: Navigate to `/admin/login`.
- **Credentials**:
  - **Email**: `admin@admin.com`
  - **Password**: `admin`
- **Description**: A high-level dashboard for administrators to oversee platform-wide metrics and performance.

---

## 4. Feature Breakdown

### Student-Facing Features

#### **Dashboard (`/`)**
-   **At-a-Glance Stats**: Displays key metrics like active courses, completed tasks, and total study hours.
-   **Pomodoro Timer**: An integrated study timer to help students focus using the Pomodoro Technique.
-   **Progress Overview**: Visual rings showing progress in assignments and quizzes.
-   **Quick Access**: Lists ongoing courses, upcoming tasks, and recent study group activity.

#### **Courses (`/courses`)**
-   A comprehensive view of all enrolled courses.
-   Features filtering by curriculum and a search functionality.
-   Supports both grid and list views for user preference.

#### **Assignments & Quizzes (`/assignments`)**
-   Manages all academic tasks, including assignments and quizzes.
-   Tracks progress, time spent, and due dates for assignments.
-   Displays grades and feedback from teachers for completed tasks.
-   Provides the entry point for taking quizzes.

#### **AI-Powered Quiz System (`/quiz/start`)**
-   **Simulated Secure Environment**: A full-screen, distraction-free UI for taking assessments.
-   **Anti-Cheating Simulation**: Detects when a user navigates away from the tab and issues warnings. After three warnings, the quiz auto-submits.
-   **Instant Feedback**: Upon submission, students see their score and a question-by-question review of their answers.

#### **Collaboration Tools**
-   **Study Groups (`/study-groups`)**:
    -   A real-time chat interface for different subject groups.
    -   Features an **AI Group Assistant** that adapts its persona based on the group's subject and provides helpful, context-aware responses.
-   **Virtual Classroom (`/virtual-classroom`)**:
    -   A peer-to-peer video and chat room using **WebRTC**.
    -   Features call controls (mute, video off), screen sharing, and a participant list.
    -   Includes a manual signaling mechanism (copy/paste offer and answer) for establishing the P2P connection in a demo environment.

#### **AI Learning Tools**
-   **AI Resource Finder (`/resource-finder`)**: A smart search tool that takes a query and returns a curated list of relevant online learning resources and documentation links.
-   **Study Buddy (`/study-buddy`)**: A one-on-one AI tutor that provides step-by-step explanations, examples, and common misconceptions on any topic. It also generates and plays an audio version of its response.

### Teacher-Facing Features

#### **Teacher Dashboard (`/teacher/dashboard`)**
-   **Action-Oriented View**: Immediately highlights "At-Risk Students" who may need intervention.
-   **Performance Metrics**: Displays overall grade distribution across all classes and key stats like "Assignments to Grade".
-   **Upcoming Deadlines**: Lists all upcoming assignment due dates.

#### **Assignment Grading (`/teacher/assignments`)**
-   A streamlined interface for reviewing student submissions for both assignments and quizzes.
-   Allows teachers to enter a grade (0-100) and provide written feedback.
-   The system provides immediate confirmation upon grade submission.

#### **AI Quiz Generator (`/teacher/quizzes`)**
-   **Document-to-Quiz Engine**: Teachers can paste text from any document.
-   **AI-Powered Content Creation**: The AI analyzes the text and automatically generates a structured quiz with multiple-choice questions, plausible distractors, and correct-answer explanations.
-   **Configuration**: Allows teachers to set a quiz title, randomize questions and answers, and set time limits before assigning the quiz.

### Admin-Facing Features

#### **Admin Dashboard (`/admin/dashboard`)**
-   **Mission Control View**: Provides a high-level overview of the entire platform's health.
-   **Key Metrics**: Displays stats for total students, active teachers, departments, and courses.
-   **Department & Teacher Performance**: Features detailed tables and charts to monitor performance, including average scores, completion rates, and teacher performance trends (improving, stable, declining).
-   **Platform Engagement**: A line chart tracks user activity over time.
