
"use client";

import { useState } from 'react';
import { TeacherLayout } from "@/components/teacher/teacher-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { generateCourseFromDocument, type CourseCreatorOutput } from "@/ai/flows/course-creator";
import { Wand2, Loader2, ListChecks, Youtube, BookCopy, FileUp } from "lucide-react";
import { cn } from "@/lib/utils";

type CourseGenState = 'idle' | 'loading' | 'generated';

// Helper function to extract YouTube video ID from URL
const getYoutubeVideoId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return videoId;
      }
    }
  } catch (error) {
    console.error("Invalid URL for YouTube video ID extraction:", url);
  }
  return null;
};

export default function CreateCoursePage() {
  const { toast } = useToast();
  const [documentContent, setDocumentContent] = useState('');
  const [courseState, setCourseState] = useState<CourseGenState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [generatedCourse, setGeneratedCourse] = useState<CourseCreatorOutput | null>(null);

  const handleGenerateCourse = async () => {
    if (!documentContent.trim()) {
      setError('Please paste some document content to generate a course from.');
      return;
    }
    setError(null);
    setCourseState('loading');
    try {
      const result = await generateCourseFromDocument({ documentContent });
      setGeneratedCourse(result);
      setCourseState('generated');
      toast({ title: "Course Generated!", description: "Review the content and assign to students." });
    } catch (err) {
      console.error(err);
      setError('Failed to generate course. The AI might be busy. Please try again.');
      setCourseState('idle');
    }
  };

  const handleAssignCourse = () => {
    if (!generatedCourse) {
      toast({ variant: "destructive", title: "Cannot Assign", description: "No course has been generated yet." });
      return;
    }
    const courseToAssign = {
      ...generatedCourse,
      id: `course-ai-${Date.now()}`,
    };
    localStorage.setItem('newlyAssignedCourse', JSON.stringify(courseToAssign));
    toast({
      title: "Course Assigned!",
      description: `"${generatedCourse.title}" is now available on the student 'My Courses' page.`,
      duration: 8000,
    });
  };

  const renderGeneratedCourse = () => {
    if (!generatedCourse) return null;
    const videoId = getYoutubeVideoId(generatedCourse.youtubeVideo.url);

    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl"><BookCopy className="mr-3 h-6 w-6 text-primary"/>{generatedCourse.title}</CardTitle>
          <CardDescription>{generatedCourse.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* YouTube Video Section */}
          <div>
            <h3 className="font-semibold text-lg flex items-center mb-2"><Youtube className="mr-2 h-5 w-5 text-red-500"/>Recommended Video</h3>
            {videoId ? (
              <iframe
                className="w-full aspect-video rounded-lg"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={generatedCourse.youtubeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <Alert>
                <AlertTitle>Video Unavailable</AlertTitle>
                <AlertDescription>
                  Could not embed the recommended video. You can access it here:
                  <a href={generatedCourse.youtubeVideo.url} target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">
                    {generatedCourse.youtubeVideo.title}
                  </a>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Quiz Section */}
          <div>
            <h3 className="font-semibold text-lg flex items-center mb-2"><ListChecks className="mr-2 h-5 w-5 text-yellow-500"/>Self-Assessment Quiz</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>{generatedCourse.quiz.quizTitle}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 p-2">
                    {generatedCourse.quiz.questions.map((q, index) => (
                      <div key={index} className="p-3 border rounded-md bg-muted/30">
                        <p className="font-medium">{index + 1}. {q.questionText}</p>
                        <ul className="mt-2 space-y-1 text-sm">
                          {q.options.map((opt, i) => (
                            <li key={i} className={cn("p-1 rounded", q.correctAnswer === opt && "bg-green-500/20 text-green-800 dark:text-green-300 font-semibold")}>
                              {opt}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAssignCourse} className="w-full">Assign Course to Students</Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <TeacherLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Course Generator</h1>
          <p className="text-muted-foreground">Create a new course module from document content in seconds.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Input Column */}
          <Card className="shadow-md sticky top-20">
            <CardHeader>
              <CardTitle className="flex items-center"><FileUp className="mr-2 h-5 w-5"/>Upload Content</CardTitle>
              <CardDescription>Paste the text from your document (e.g., a chapter, article, or notes).</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your content here..."
                className="h-80"
                value={documentContent}
                onChange={(e) => setDocumentContent(e.target.value)}
                disabled={courseState === 'loading'}
              />
              {error && <Alert variant="destructive" className="mt-4"><AlertDescription>{error}</AlertDescription></Alert>}
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerateCourse} disabled={courseState === 'loading' || !documentContent.trim()} className="w-full">
                {courseState === 'loading' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Generate Course
              </Button>
            </CardFooter>
          </Card>

          {/* Output Column */}
          <div className="space-y-6">
            {courseState === 'loading' && (
              <Card className="shadow-md animate-pulse">
                <CardHeader><div className="h-8 w-3/4 bg-muted rounded-md"></div><div className="h-4 w-1/2 bg-muted rounded-md mt-2"></div></CardHeader>
                <CardContent className="space-y-6">
                  <div className="h-56 w-full bg-muted rounded-lg"></div>
                  <div className="h-10 w-full bg-muted rounded-lg"></div>
                </CardContent>
              </Card>
            )}
            {courseState === 'generated' ? (
              renderGeneratedCourse()
            ) : courseState === 'idle' && !error ? (
              <Card className="shadow-md text-center text-muted-foreground p-10 border-dashed">
                <BookCopy className="mx-auto h-16 w-16 mb-4"/>
                <h3 className="font-semibold text-lg">Your AI-generated course will appear here.</h3>
                <p className="text-sm">Just paste your content and click "Generate Course" to start.</p>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
