
"use client";

import { useState } from 'react';
import { TeacherLayout } from "@/components/teacher/teacher-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/shared/user-avatar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { BookCheck, Check, Search, Filter, FileQuestion, CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


// --- Data Interfaces ---
interface QuizAnswer {
  questionId: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  studentAnswer: string;
}

interface Submission {
  studentId: string;
  studentName: string;
  studentAvatarUrl: string;
  studentAvatarAiHint: string;
  status: "Graded" | "Needs Grading" | "Not Submitted";
  submittedOn?: string; // ISO date string
  grade?: number; // 0-100
  answers?: QuizAnswer[];
}

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  type: 'assignment' | 'quiz';
  submissions: Submission[];
}

// --- Mock Data ---
const mockAssignments: Assignment[] = [
  {
    id: "assign1",
    title: "Web Dev Assignment 5",
    type: "assignment",
    course: "Web Development",
    dueDate: "2025-07-15",
    submissions: [
      { studentId: "s1", studentName: "Alex Johnson", studentAvatarUrl: "https://randomuser.me/api/portraits/men/75.jpg", studentAvatarAiHint: "profile man", status: "Graded", submittedOn: "2025-07-14T10:00:00Z", grade: 92 },
      { studentId: "s2", studentName: "Maria Garcia", studentAvatarUrl: "https://randomuser.me/api/portraits/women/76.jpg", studentAvatarAiHint: "profile woman", status: "Needs Grading", submittedOn: "2025-07-15T09:00:00Z" },
      { studentId: "s3", studentName: "David Chen", studentAvatarUrl: "https://randomuser.me/api/portraits/men/77.jpg", studentAvatarAiHint: "profile man", status: "Needs Grading", submittedOn: "2025-07-15T11:30:00Z" },
       { studentId: "s5", studentName: "Samantha Lee", studentAvatarUrl: "https://randomuser.me/api/portraits/women/79.jpg", studentAvatarAiHint: "profile woman", status: "Not Submitted" },
    ],
  },
  {
    id: "assign_quiz_1",
    title: "Chemistry Midterm Quiz",
    type: "quiz",
    course: "Chemistry Crew",
    dueDate: "2025-07-22",
    submissions: [
      { 
        studentId: "s_dev", 
        studentName: "Developer", 
        studentAvatarUrl: "https://randomuser.me/api/portraits/lego/1.jpg", 
        studentAvatarAiHint: "profile lego", 
        status: "Needs Grading", 
        submittedOn: "2025-07-21T14:00:00Z",
        answers: [
          { questionId: 'q1', questionText: "What is the chemical symbol for Gold?", options: ["Ag", "Au", "Ga", "Ge"], correctAnswer: "Au", studentAnswer: "Au" },
          { questionId: 'q2', questionText: "Which of the following is a noble gas?", options: ["Oxygen", "Hydrogen", "Neon", "Nitrogen"], correctAnswer: "Neon", studentAnswer: "Neon" },
          { questionId: 'q3', questionText: "What is the pH of a neutral solution?", options: ["5", "7", "9", "11"], correctAnswer: "7", studentAnswer: "9" },
        ]
      }
    ]
  },
  {
    id: "assign2",
    title: "JS Project Proposal",
    type: "assignment",
    course: "Advanced JavaScript",
    dueDate: "2025-07-20",
    submissions: [
       { studentId: "s4", studentName: "Priya Patel", studentAvatarUrl: "https://randomuser.me/api/portraits/women/78.jpg", studentAvatarAiHint: "profile woman", status: "Graded", submittedOn: "2025-07-19T14:00:00Z", grade: 95 },
       { studentId: "s6", studentName: "Ben Carter", studentAvatarUrl: "https://randomuser.me/api/portraits/men/80.jpg", studentAvatarAiHint: "profile man", status: "Needs Grading", submittedOn: "2025-07-20T08:00:00Z" },
    ],
  },
   {
    id: "assign3",
    title: "Database Systems Midterm",
    type: "assignment",
    course: "Database Systems",
    dueDate: "2025-07-18",
    submissions: [
       { studentId: "s7", studentName: "Olivia Wong", studentAvatarUrl: "https://randomuser.me/api/portraits/women/81.jpg", studentAvatarAiHint: "profile woman", status: "Graded", submittedOn: "2025-07-18T13:00:00Z", grade: 88 },
    ],
  }
];

// --- New Component for Submission Review Dialog ---
function SubmissionReviewDialog({ submission }: { submission: Submission }) {
    if (!submission.answers) return null;

    const calculatedScore = submission.answers.reduce((acc, ans) => acc + (ans.studentAnswer === ans.correctAnswer ? 1 : 0), 0);
    const totalQuestions = submission.answers.length;
    const percentage = Math.round((calculatedScore / totalQuestions) * 100);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Review</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Review Submission: {submission.studentName}</DialogTitle>
                    <DialogDescription>
                        AI Graded Score: {percentage}%. Review the answers below to confirm.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto space-y-4 p-1">
                    {submission.answers.map((ans, index) => {
                        const isCorrect = ans.studentAnswer === ans.correctAnswer;
                        return (
                            <div key={ans.questionId} className={cn("p-4 border rounded-lg", isCorrect ? 'border-green-300 bg-green-50/50 dark:bg-green-500/10' : 'border-red-300 bg-red-50/50 dark:bg-red-500/10')}>
                                <p className="font-semibold">{index + 1}. {ans.questionText}</p>
                                <div className="mt-2 space-y-1">
                                    <div className={cn("flex items-center gap-2 text-sm p-2 rounded", isCorrect ? 'bg-green-100 dark:bg-green-500/20' : 'bg-red-100 dark:bg-red-500/20')}>
                                        {isCorrect ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
                                        <span>Student's Answer: <span className="font-medium">{ans.studentAnswer || "Not answered"}</span></span>
                                    </div>
                                    {!isCorrect && (
                                         <div className="flex items-center gap-2 text-sm p-2 rounded bg-green-100 dark:bg-green-500/20">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <span>Correct Answer: <span className="font-medium">{ans.correctAnswer}</span></span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}


export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(mockAssignments[0]);
  const [grades, setGrades] = useState<Record<string, string>>({}); // studentId -> grade string
  const [feedback, setFeedback] = useState<Record<string, string>>({}); // studentId -> feedback string
  const { toast } = useToast();

  const handleGradeChange = (studentId: string, grade: string) => {
    setGrades(prev => ({ ...prev, [studentId]: grade }));
  };

  const handleFeedbackChange = (studentId: string, text: string) => {
    setFeedback(prev => ({ ...prev, [studentId]: text }));
  };

  const handleGradeSubmit = (studentId: string) => {
    if (!selectedAssignment) return;
    const gradeValue = parseInt(grades[studentId] || '', 10);
    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
      toast({ variant: "destructive", title: "Invalid Grade", description: "Please enter a number between 0 and 100." });
      return;
    }

    setAssignments(prev =>
      prev.map(assign =>
        assign.id === selectedAssignment.id
          ? {
              ...assign,
              submissions: assign.submissions.map(sub =>
                sub.studentId === studentId
                  ? { ...sub, status: "Graded", grade: gradeValue }
                  : sub
              ),
            }
          : assign
      )
    );
    
    // Also update the selected assignment to reflect the change immediately
    setSelectedAssignment(prev => prev && {
        ...prev,
        submissions: prev.submissions.map(sub => 
            sub.studentId === studentId
                ? { ...sub, status: "Graded", grade: gradeValue }
                : sub
        )
    });

    toast({ title: "Grade Submitted!", description: `Grade for ${selectedAssignment.submissions.find(s=>s.studentId === studentId)?.studentName} has been saved.` });
  };
  
   const getStatusBadgeClass = (status: Submission["status"]): string => {
     switch (status) {
      case "Needs Grading":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30";
      case "Graded":
        return "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30";
      case "Not Submitted":
        return "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30";
      default:
        return "";
    }
  };


  return (
    <TeacherLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assignments & Grading</h1>
          <p className="text-muted-foreground">Review submissions, assign grades, and provide feedback.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 shadow-md">
            <CardHeader>
              <CardTitle>Assignment List</CardTitle>
               <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search assignments..." className="pl-8" />
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {assignments.map(assign => (
                  <li
                    key={assign.id}
                    onClick={() => setSelectedAssignment(assign)}
                    className={cn(
                        "p-3 rounded-lg cursor-pointer border-l-4 transition-colors",
                        selectedAssignment?.id === assign.id
                            ? "bg-accent border-primary"
                            : "border-transparent hover:bg-accent/50"
                    )}
                  >
                    <div className="flex items-center gap-2">
                        {assign.type === 'quiz' ? <FileQuestion className="h-4 w-4 text-primary" /> : <BookCheck className="h-4 w-4 text-primary"/>}
                        <p className="font-semibold">{assign.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{assign.course}</p>
                    <p className="text-xs text-muted-foreground mt-1">Due: {new Date(assign.dueDate + 'T00:00:00').toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 shadow-md">
            {selectedAssignment ? (
              <>
                <CardHeader>
                  <CardTitle>{selectedAssignment.title}</CardTitle>
                  <CardDescription>Submissions for {selectedAssignment.course}. Due on {new Date(selectedAssignment.dueDate + 'T00:00:00').toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[120px]">Grade</TableHead>
                        <TableHead>Feedback</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedAssignment.submissions.map(sub => (
                        <TableRow key={sub.studentId}>
                          <TableCell>
                             <div className="flex items-center gap-2">
                                <UserAvatar src={sub.studentAvatarUrl} aiHint={sub.studentAvatarAiHint} fallbackInitials={sub.studentName.charAt(0)} size="sm" />
                                <span className="font-medium">{sub.studentName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn("text-xs", getStatusBadgeClass(sub.status))}>
                              {sub.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {sub.status === "Needs Grading" ? (
                              <Input 
                                type="number" 
                                placeholder="0-100" 
                                className="h-8"
                                value={grades[sub.studentId] || ''}
                                onChange={(e) => handleGradeChange(sub.studentId, e.target.value)}
                              />
                            ) : sub.status === "Graded" ? (
                              <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500"/>
                                <span className="font-semibold">{sub.grade}</span>
                              </div>
                            ) : (
                                <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                             {sub.status === "Needs Grading" ? (
                                <Textarea 
                                    placeholder="Add feedback..." 
                                    className="min-h-[40px] h-10 text-xs"
                                    value={feedback[sub.studentId] || ''}
                                    onChange={(e) => handleFeedbackChange(sub.studentId, e.target.value)}
                                />
                             ) : (
                               <span className="text-muted-foreground">-</span>
                             )}
                          </TableCell>
                          <TableCell className="text-right">
                             {sub.status === "Needs Grading" && (
                                <div className="flex gap-2 justify-end">
                                    {selectedAssignment.type === 'quiz' && sub.answers && <SubmissionReviewDialog submission={sub} />}
                                    <Button size="sm" onClick={() => handleGradeSubmit(sub.studentId)}>Submit Grade</Button>
                                </div>
                             )}
                              {sub.status === "Graded" && selectedAssignment.type === 'quiz' && (
                                <SubmissionReviewDialog submission={sub} />
                             )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-10 text-center">
                    <BookCheck className="h-16 w-16 mb-4"/>
                    <h3 className="text-lg font-semibold">Select an assignment</h3>
                    <p>Choose an assignment from the list to view submissions and start grading.</p>
                </div>
            )}
          </Card>
        </div>
      </div>
    </TeacherLayout>
  );
}
