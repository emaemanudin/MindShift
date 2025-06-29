
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { ShieldAlert, Timer, PlayCircle, FileQuestion, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Mock Data ---
const quizData = {
    id: "chem101-midterm",
    title: "Chemistry Midterm Quiz",
    timeLimitMinutes: 0.5, // Shortened for demo purposes
    questions: [
        {
            id: 'q1',
            questionText: "What is the chemical symbol for Gold?",
            options: ["Ag", "Au", "Ga", "Ge"],
            correctAnswer: "Au"
        },
        {
            id: 'q2',
            questionText: "Which of the following is a noble gas?",
            options: ["Oxygen", "Hydrogen", "Neon", "Nitrogen"],
            correctAnswer: "Neon"
        },
        {
            id: 'q3',
            questionText: "What is the pH of a neutral solution?",
            options: ["5", "7", "9", "11"],
            correctAnswer: "7"
        }
    ]
};

type QuizState = "intro" | "active" | "results";
type Answers = Record<string, string>;

export default function QuizStartPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [quizState, setQuizState] = useState<QuizState>("intro");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answers>({});
    const [timeLeft, setTimeLeft] = useState(quizData.timeLimitMinutes * 60);
    const [warningCount, setWarningCount] = useState(0);

    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const calculateScore = useCallback(() => {
        return quizData.questions.reduce((score, question) => {
            return answers[question.id] === question.correctAnswer ? score + 1 : score;
        }, 0);
    }, [answers]);

    const handleSubmit = useCallback(() => {
        setQuizState("results");
        setTimeLeft(0); // Stop timer
        // In a real app, you would send answers to the backend here.
        // For the demo, we change the status on the assignments page manually.
    }, []);

    // Timer Effect
    useEffect(() => {
        if (quizState !== "active" || timeLeft <= 0) {
            if(timeLeft <= 0 && quizState === 'active') {
                toast({ title: "Time's Up!", description: "Your quiz has been automatically submitted." });
                handleSubmit();
            }
            return;
        };

        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [quizState, timeLeft, handleSubmit, toast]);
    
    // Anti-Cheating Simulation Effect
    useEffect(() => {
        if (quizState !== 'active') return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                const newCount = warningCount + 1;
                setWarningCount(newCount);
                toast({
                    variant: "destructive",
                    title: `Warning ${newCount} of 3: Focus Lost`,
                    description: "Leaving the quiz tab is prohibited. Your quiz will be submitted after 3 warnings."
                });
                if (newCount >= 3) {
                    toast({
                        variant: "destructive",
                        title: "Quiz Terminated",
                        description: "You have left the quiz tab too many times. Your quiz has been submitted with a score of 0.",
                        duration: 10000
                    });
                    setAnswers({}); // Void all answers
                    handleSubmit();
                }
            }
        };

        window.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleVisibilityChange);

        return () => {
            window.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleVisibilityChange);
        };
    }, [quizState, warningCount, toast, handleSubmit]);

    const renderIntro = () => (
        <Card className="w-full max-w-2xl shadow-2xl">
            <CardHeader className="text-center">
                <FileQuestion className="mx-auto h-12 w-12 text-primary mb-2" />
                <CardTitle className="text-3xl">{quizData.title}</CardTitle>
                <CardDescription>You are about to start a secure assessment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert variant="destructive">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>Important Rules</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc list-inside">
                            <li>You have **{quizData.timeLimitMinutes} minutes** to complete the quiz.</li>
                            <li>**Do not leave this tab or window.** Doing so 3 times will automatically fail the quiz.</li>
                            <li>Once you start, the timer will not stop.</li>
                        </ul>
                    </AlertDescription>
                </Alert>
            </CardContent>
            <CardFooter className="flex-col gap-4">
                <Button size="lg" className="w-full" onClick={() => setQuizState("active")}>
                    <PlayCircle className="mr-2 h-5 w-5"/> I understand, Start Quiz
                </Button>
                <Button variant="link" onClick={() => router.push('/assignments')}>Cancel and Go Back</Button>
            </CardFooter>
        </Card>
    );
    
    const renderQuiz = () => {
        const currentQuestion = quizData.questions[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        return (
            <div className="w-full max-w-4xl h-[90vh] flex flex-col">
                <header className="flex justify-between items-center p-4 bg-card rounded-t-lg border-b">
                    <h2 className="text-xl font-bold">{quizData.title}</h2>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive text-destructive-foreground font-mono text-lg font-semibold">
                       <Timer className="h-6 w-6" />
                       {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </div>
                </header>
                <Card className="flex-grow shadow-none rounded-t-none">
                    <CardContent className="p-6 h-full flex flex-col">
                        <div className="mb-4">
                            <p className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {quizData.questions.length}</p>
                            <Progress value={progress} className="w-full mt-1 h-2" />
                        </div>
                        <div className="flex-grow">
                            <p className="text-lg font-semibold mb-6">{currentQuestion.questionText}</p>
                            <RadioGroup
                                value={answers[currentQuestion.id] || ""}
                                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                                className="space-y-4"
                            >
                                {currentQuestion.options.map(option => (
                                    <div key={option} className="flex items-center space-x-3 p-4 border rounded-lg has-[:checked]:bg-accent has-[:checked]:border-primary">
                                        <RadioGroupItem value={option} id={option} />
                                        <Label htmlFor={option} className="text-base font-normal cursor-pointer w-full">{option}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                        <div className="flex justify-between mt-6">
                            {currentQuestionIndex > 0 ? (
                                <Button variant="outline" onClick={() => setCurrentQuestionIndex(prev => prev - 1)}>Previous</Button>
                            ) : (
                                <div></div> // Placeholder for alignment
                            )}
                            {currentQuestionIndex < quizData.questions.length - 1 ? (
                                <Button onClick={() => setCurrentQuestionIndex(prev => prev + 1)}>Next Question</Button>
                            ) : (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button className="bg-green-600 hover:bg-green-700">Submit Quiz</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you ready to submit?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            You will not be able to change your answers after submitting.
                                            Your quiz will be sent to your teacher for review.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Review Answers</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleSubmit}>Yes, Submit Now</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    const renderResults = () => {
        const score = calculateScore();
        const totalQuestions = quizData.questions.length;
        const percentage = Math.round((score / totalQuestions) * 100);
        return (
            <Card className="w-full max-w-3xl shadow-2xl">
                 <CardHeader className="text-center items-center">
                    <div className={cn("h-16 w-16 rounded-full flex items-center justify-center", percentage >= 70 ? 'bg-green-100' : 'bg-red-100')}>
                        <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", percentage >= 70 ? 'bg-green-200' : 'bg-red-200')}>
                            {percentage >= 70 ? <CheckCircle className="h-8 w-8 text-green-700" /> : <XCircle className="h-8 w-8 text-red-700" />}
                        </div>
                    </div>
                    <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
                    <p className="text-5xl font-bold text-primary">{percentage}%</p>
                    <CardDescription>You scored {score} out of {totalQuestions} correct.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[40vh] overflow-y-auto p-6">
                    <h3 className="font-bold text-lg">Review Your Answers:</h3>
                    {quizData.questions.map((q, index) => {
                        const userAnswer = answers[q.id];
                        const isCorrect = userAnswer === q.correctAnswer;
                        return (
                            <div key={q.id} className={cn("p-4 border rounded-lg", isCorrect ? 'border-green-300 bg-green-50/50' : 'border-red-300 bg-red-50/50')}>
                                <p className="font-semibold">{index + 1}. {q.questionText}</p>
                                <p className="text-sm mt-2">Your answer: <span className={cn(isCorrect ? "text-green-700" : "text-red-700")}>{userAnswer || "No answer"}</span></p>
                                {!isCorrect && <p className="text-sm">Correct answer: <span className="text-green-700">{q.correctAnswer}</span></p>}
                            </div>
                        )
                    })}
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={() => router.push('/assignments')}>Back to Assignments</Button>
                </CardFooter>
            </Card>
        );
    }
    
    const renderContent = () => {
        switch (quizState) {
            case 'intro':
                return renderIntro();
            case 'active':
                return renderQuiz();
            case 'results':
                return renderResults();
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 font-sans">
           {renderContent()}
        </div>
    );
}
