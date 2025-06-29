
"use client";

import { TeacherLayout } from "@/components/teacher/teacher-layout";
import { CreateQuizForm } from "@/components/teacher/create-quiz-form";
import { FilePenLine } from "lucide-react";

export default function TeacherQuizzesPage() {
  return (
    <TeacherLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <FilePenLine className="mr-3 h-8 w-8 text-primary" />
            Quiz Generator & Manager
          </h1>
          <p className="text-muted-foreground">
            Create, configure, and assign secure quizzes using AI.
          </p>
        </div>
        <CreateQuizForm />
      </div>
    </TeacherLayout>
  );
}
