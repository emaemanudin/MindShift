'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { generateVideoContent, type VideoGeneratorOutput } from "@/ai/flows/video-generator";
import { Wand2, Loader2, Clapperboard, FileText, ListChecks, Gamepad2, Languages, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type GenerationState = 'idle' | 'loading' | 'generated';

export default function VideoGeneratorPage() {
  const { toast } = useToast();
  
  // Form State
  const [lessonText, setLessonText] = useState('');
  const [subject, setSubject] = useState('Science');
  const [studentInterest, setStudentInterest] = useState('Sports');
  const [languagePreference, setLanguagePreference] = useState('English');

  const [generationState, setGenerationState] = useState<GenerationState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<VideoGeneratorOutput | null>(null);

  const handleGenerate = async () => {
    if (!lessonText.trim()) {
      setError('Please provide some lesson text to generate content from.');
      return;
    }
    setError(null);
    setGenerationState('loading');
    setGeneratedContent(null);
    try {
      const result = await generateVideoContent({ 
        lessonText, 
        subject,
        studentInterest,
        languagePreference 
      });
      setGeneratedContent(result);
      setGenerationState('generated');
      toast({ title: "Content Generated!", description: "Review the script, summary, and quiz below." });
    } catch (err) {
      console.error(err);
      setError('Failed to generate content. The AI might be busy. Please try again.');
      setGenerationState('idle');
    }
  };
  
  const renderGeneratedContent = () => {
    if (!generatedContent) return null;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl"><Clapperboard className="mr-3 h-6 w-6 text-primary"/>Video Script (Coach Leo Persona)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap font-sans text-sm bg-muted/50 p-4 rounded-md max-h-96 overflow-y-auto">
                {generatedContent.videoScript}
            </pre>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl"><FileText className="mr-3 h-6 w-6 text-primary"/>Summary Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{generatedContent.summaryNotes}</p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-2xl"><ListChecks className="mr-3 h-6 w-6 text-primary"/>Quiz Questions</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="space-y-4">
                    {generatedContent.quizQuestions.map((q, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-muted/50">
                        <p className="font-semibold">{index + 1}. {q.questionText}</p>
                        <div className="mt-2 space-y-1 text-sm">
                          {q.options.map((opt, i) => (
                            <div key={i} className={cn("p-1 rounded", q.correctAnswer === opt && "bg-green-500/20")}>
                              {opt} {q.correctAnswer === opt && <span className="font-bold text-green-700 dark:text-green-400"> (Correct)</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
            </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Video Content Generator</h1>
          <p className="text-muted-foreground">Create personalized video scripts, summaries, and quizzes from any lesson text.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Input Column */}
          <Card className="lg:col-span-1 shadow-md sticky top-20">
            <CardHeader>
              <CardTitle className="flex items-center"><Wand2 className="mr-2 h-5 w-5"/>Generator Controls</CardTitle>
              <CardDescription>Input your lesson and student preferences to generate content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="lessonText">Lesson Text</Label>
                    <Textarea
                        id="lessonText"
                        placeholder="Paste your lesson content here..."
                        className="h-40"
                        value={lessonText}
                        onChange={(e) => setLessonText(e.target.value)}
                        disabled={generationState === 'loading'}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="subject"><BookOpen className="inline h-4 w-4 mr-1"/>Subject</Label>
                        <Input id="subject" value={subject} onChange={e => setSubject(e.target.value)} disabled={generationState === 'loading'}/>
                    </div>
                     <div>
                        <Label htmlFor="studentInterest"><Gamepad2 className="inline h-4 w-4 mr-1"/>Student Interest</Label>
                        <Input id="studentInterest" value={studentInterest} onChange={e => setStudentInterest(e.target.value)} disabled={generationState === 'loading'}/>
                    </div>
                </div>
                 <div>
                    <Label htmlFor="languagePreference"><Languages className="inline h-4 w-4 mr-1"/>Language</Label>
                    <Select value={languagePreference} onValueChange={setLanguagePreference} disabled={generationState === 'loading'}>
                        <SelectTrigger id="languagePreference"><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Amharic">Amharic</SelectItem>
                            <SelectItem value="Arabic">Arabic</SelectItem>
                            <SelectItem value="Chinese">Chinese</SelectItem>
                            <SelectItem value="Spanish">Spanish</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
              {error && <Alert variant="destructive" className="mt-4"><AlertDescription>{error}</AlertDescription></Alert>}
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerate} disabled={generationState === 'loading' || !lessonText.trim()} className="w-full">
                {generationState === 'loading' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Generate Content
              </Button>
            </CardFooter>
          </Card>

          {/* Output Column */}
          <div className="lg:col-span-2 space-y-6">
            {generationState === 'loading' && (
              <Card className="shadow-md animate-pulse">
                <CardHeader><div className="h-8 w-3/4 bg-muted rounded-md"></div></CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-40 w-full bg-muted rounded-lg"></div>
                  <div className="h-20 w-full bg-muted rounded-lg"></div>
                  <div className="h-32 w-full bg-muted rounded-lg"></div>
                </CardContent>
              </Card>
            )}
            {generationState === 'generated' ? (
              renderGeneratedContent()
            ) : generationState === 'idle' && !error ? (
              <Card className="shadow-md text-center text-muted-foreground p-10 border-dashed lg:sticky top-20">
                <Clapperboard className="mx-auto h-16 w-16 mb-4"/>
                <h3 className="font-semibold text-lg">Your AI-generated content will appear here.</h3>
                <p className="text-sm">Just paste your lesson, set the preferences, and click "Generate".</p>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
