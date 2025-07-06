
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { generateQuizFromDocument, type QuizGeneratorOutput } from "@/ai/flows/quiz-generator";
import { Wand2, Loader2, ListChecks, Settings, Lock, CalendarPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { DatePicker } from '../ui/date-picker';
import { format, addDays } from 'date-fns';

type QuizState = 'idle' | 'loading' | 'generated';

export function CreateQuizForm() {
  const { toast } = useToast();
  const [documentContent, setDocumentContent] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizGeneratorOutput | null>(null);
  const [dueDate, setDueDate] = useState<Date | undefined>(addDays(new Date(), 7));

  const handleGenerateQuiz = async () => {
    if (!documentContent.trim()) {
      setError('Please paste some document content to generate a quiz from.');
      return;
    }
    setError(null);
    setQuizState('loading');
    try {
      const result = await generateQuizFromDocument({ documentContent, questionCount });
      setGeneratedQuiz(result);
      setQuizState('generated');
      toast({ title: "Quiz Generated!", description: "Review the questions and settings below." });
    } catch (err) {
      console.error(err);
      setError('Failed to generate quiz. The AI might be busy. Please try again.');
      setQuizState('idle');
    }
  };

  const handleAssignQuiz = () => {
    if (!generatedQuiz) {
        toast({ variant: "destructive", title: "Cannot Assign", description: "No quiz has been generated yet."});
        return;
    }
    if (!dueDate) {
        toast({ variant: "destructive", title: "Cannot Assign", description: "Please select a due date for the quiz."});
        return;
    }

    // This is the object that will be passed to the student's page via localStorage
    const quizToAssign = {
        ...generatedQuiz,
        id: `quiz-ai-${Date.now()}`,
        course: "AI Generated Course",
        dueDate: format(dueDate, "yyyy-MM-dd"),
        status: "Take Quiz",
        timeLimitMinutes: questionCount * 1.5,
        path: '/quiz/start',
    };

    localStorage.setItem('newlyAssignedQuiz', JSON.stringify(quizToAssign));

    toast({
        title: "Quiz Assigned Successfully!",
        description: `The quiz "${generatedQuiz.quizTitle}" is now available on the student's 'My Quizzes' page.`,
        duration: 8000,
    });
  };

  const renderQuestionPreview = () => {
    if (!generatedQuiz) return null;
    
    return (
      <div className="space-y-4">
        {generatedQuiz.questions.map((q, index) => (
          <div key={index} className="p-4 border rounded-lg bg-muted/50">
            <p className="font-semibold">{index + 1}. {q.questionText}</p>
            <div className="mt-2 space-y-1 text-sm">
              {q.options.map((opt, i) => (
                <div key={i} className={cn("p-1 rounded", q.correctAnswer === opt && "bg-green-500/20")}>
                  {opt} {q.correctAnswer === opt && <span className="font-bold text-green-700 dark:text-green-400"> (Correct)</span>}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2 italic">Explanation: {q.explanation}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Column 1: Input & Generation */}
      <Card className="lg:col-span-1 shadow-md">
        <CardHeader>
          <CardTitle>1. Input Document</CardTitle>
          <CardDescription>Paste the content from your document (PDF, DOCX, etc.) below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your lecture notes, chapter text, or study guide here..."
            className="h-64"
            value={documentContent}
            onChange={(e) => setDocumentContent(e.target.value)}
            disabled={quizState === 'loading'}
          />
          <div>
            <Label>Number of Questions: {questionCount}</Label>
            <Slider
              defaultValue={[5]}
              min={1}
              max={20}
              step={1}
              onValueChange={(value) => setQuestionCount(value[0])}
              disabled={quizState === 'loading'}
            />
          </div>
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerateQuiz} disabled={quizState === 'loading' || !documentContent.trim()} className="w-full">
            {quizState === 'loading' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Generate Quiz
          </Button>
        </CardFooter>
      </Card>

      {/* Column 2: Quiz Preview & Settings */}
      <div className="lg:col-span-2 space-y-6">
        <Card className={cn("shadow-md", quizState !== 'generated' && "opacity-50 pointer-events-none")}>
          <CardHeader>
            <CardTitle className="flex items-center"><ListChecks className="mr-2 h-5 w-5" /> 2. Review & Edit Quiz</CardTitle>
            <CardDescription>Review the AI-generated questions. You can edit them before saving.</CardDescription>
          </CardHeader>
          <CardContent>
            {quizState === 'generated' && generatedQuiz ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="quizTitle">Quiz Title</Label>
                  <Input id="quizTitle" defaultValue={generatedQuiz.quizTitle} />
                </div>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>View Generated Questions</AccordionTrigger>
                        <AccordionContent>
                           {renderQuestionPreview()}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <p>Your generated quiz will appear here for review.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className={cn("shadow-md", quizState !== 'generated' && "opacity-50 pointer-events-none")}>
            <CardHeader>
                <CardTitle className="flex items-center"><Settings className="mr-2 h-5 w-5" /> 3. Configure Settings</CardTitle>
                <CardDescription>Set the rules and security options for this quiz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Due Date</Label>
                        <DatePicker date={dueDate} setDate={setDueDate} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="timeLimit">Total Time Limit (minutes)</Label>
                        <Input id="timeLimit" type="number" defaultValue={questionCount * 1.5} />
                    </div>
                 </div>
                 <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label>Question Randomization</Label>
                    <Switch defaultChecked/>
                 </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label>Option Shuffling</Label>
                    <Switch defaultChecked/>
                 </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                 <Button variant="secondary">Save as Draft</Button>
                 <Button onClick={handleAssignQuiz} disabled={quizState !== 'generated'}>
                    <CalendarPlus className="mr-2 h-4 w-4"/>
                    Assign Quiz
                 </Button>
            </CardFooter>
        </Card>
        
         <Card className={cn("shadow-md", quizState !== 'generated' && "opacity-50 pointer-events-none")}>
            <CardHeader>
                <CardTitle className="flex items-center text-orange-600"><Lock className="mr-2 h-5 w-5" /> Lockdown Browser Options (Future)</CardTitle>
                <CardDescription>These features require a secure client and are not yet implemented.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 opacity-50">
                 <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label>Enforce Strict Lockdown (Full Screen Lock)</Label>
                    <Switch disabled />
                 </div>
                 <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label>Auto-Submit on Tab Switch (3 Warnings)</Label>
                    <Switch disabled />
                 </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
