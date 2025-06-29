
"use client";

import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Loader2, SendHorizonal, User, Volume2, Mic, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { studyBuddy, StudyBuddyOutput } from "@/ai/flows/study-buddy";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  structuredContent?: {
    explanation: string;
    examples: string[];
    misconceptions: string[];
  };
  audioDataUri?: string;
}

const subjects = [
  { value: "general", label: "General" },
  { value: "math", label: "Mathematics" },
  { value: "science", label: "Science" },
  { value: "history", label: "History" },
  { value: "literature", label: "Literature" },
  { value: "computer-science", label: "Computer Science" },
];

const complexities = [
  { value: "middle-school", label: "Middle School" },
  { value: "high-school", label: "High School" },
  { value: "university", label: "University" },
];

const languages = [
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Amharic", label: "Amharic" },
];

export default function StudyBuddyPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const [subject, setSubject] = useState("general");
  const [complexity, setComplexity] = useState("high-school");
  const [language, setLanguage] = useState("English");
  
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Client-side only: initialize SpeechRecognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Stop listening after user pauses
        recognition.interimResults = true; // Get results as they come
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          setInput(transcript); // Update input field with live transcript
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          toast({ variant: "destructive", title: "Voice Error", description: `Speech recognition failed: ${event.error}` });
          setIsListening(false);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        toast({ title: "Unsupported Browser", description: "Voice recognition is not supported in this browser." });
      }
    }
  }, [toast]);

  const handleListen = () => {
    if (isLoading || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  const scrollToBottom = () => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      setTimeout(() => {
        viewport.scrollTop = viewport.scrollHeight;
      }, 100);
    }
  };
  
  useEffect(scrollToBottom, [messages]);
  
  const playAudio = (audioDataUri: string) => {
    if (audioRef.current) {
        audioRef.current.src = audioDataUri;
        audioRef.current.play().catch(e => console.error("Audio playback error:", e));
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Stop listening if user sends message manually
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await studyBuddy({
        question: userMessage.text,
        subject,
        complexity,
        language,
      });
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: "", // Not used for structured content
        structuredContent: {
          explanation: result.explanation,
          examples: result.examples,
          misconceptions: result.misconceptions,
        },
        audioDataUri: result.audioDataUri,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      if (result.audioDataUri) {
        playAudio(result.audioDataUri);
      }
    } catch (error) {
      console.error("Study Buddy Error:", error);
      const errorMessage: Message = {
        id: `assistant-error-${Date.now()}`,
        role: "assistant",
        text: "Sorry, I had trouble connecting or generating a response. Please check the inputs and try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <AppLayout>
        <div className="max-w-4xl mx-auto w-full space-y-4">
            {/* Control Panel */}
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center"><Settings className="mr-2 h-5 w-5"/>Smart Q&A Controls</CardTitle>
                    <CardDescription>Adjust the AI's response to fit your needs.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="subject-select">Subject</Label>
                        <Select value={subject} onValueChange={setSubject}>
                            <SelectTrigger id="subject-select"><SelectValue placeholder="Select subject..."/></SelectTrigger>
                            <SelectContent>
                                {subjects.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="complexity-select">Complexity Level</Label>
                        <Select value={complexity} onValueChange={setComplexity}>
                            <SelectTrigger id="complexity-select"><SelectValue placeholder="Select complexity..."/></SelectTrigger>
                            <SelectContent>
                                {complexities.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="language-select">Language</Label>
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger id="language-select"><SelectValue placeholder="Select language..."/></SelectTrigger>
                            <SelectContent>
                                {languages.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Chat Area */}
            <div className="flex flex-col h-[calc(100vh-var(--header-height)-18rem)]">
                <Card className="flex-grow flex flex-col shadow-lg">
                <CardHeader className="border-b text-center">
                    <div className="flex items-center justify-center gap-2">
                        <Bot className="h-8 w-8 text-primary" />
                        <CardTitle className="text-3xl font-bold">Your Personal Study Buddy</CardTitle>
                    </div>
                    <CardDescription>
                    Ask me anything about your coursework, and I'll help you understand it.
                    </CardDescription>
                </CardHeader>
                <ScrollArea className="flex-grow p-4 bg-muted/20" ref={scrollAreaRef}>
                    <div className="space-y-6">
                        {messages.length === 0 && (
                            <div className="text-center text-muted-foreground pt-10">
                                <p className="text-lg">No conversation yet.</p>
                                <p>Ask a question below to get started!</p>
                            </div>
                        )}
                    {messages.map((message) => (
                        <div
                        key={message.id}
                        className={cn(
                            "flex items-start gap-3 p-3 rounded-lg",
                            message.role === "user" ? "flex-row-reverse" : "flex-row"
                        )}
                        >
                        <Avatar className="h-8 w-8 border">
                            <AvatarFallback>
                            {message.role === "user" ? <User /> : <Bot />}
                            </AvatarFallback>
                        </Avatar>
                        <div
                            className={cn(
                            "flex flex-col max-w-[85%]",
                            message.role === "user" ? "items-end" : "items-start"
                            )}
                        >
                            <div
                            className={cn(
                                "p-3 rounded-xl",
                                message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-accent border"
                            )}
                            >
                                {message.role === 'user' ? (
                                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                ) : message.structuredContent ? (
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-1">Explanation</h4>
                                            <p className="whitespace-pre-wrap">{message.structuredContent.explanation}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-1">Examples</h4>
                                            <ul className="list-disc list-inside space-y-1">
                                                {message.structuredContent.examples.map((ex, i) => <li key={i}>{ex}</li>)}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-1">Common Misconceptions</h4>
                                            <ul className="list-disc list-inside space-y-1">
                                                {message.structuredContent.misconceptions.map((mc, i) => <li key={i}>{mc}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm whitespace-pre-wrap">{message.text}</p> // Fallback for error or simple messages
                                )}
                            </div>
                            {message.role === 'assistant' && message.audioDataUri && (
                                <Button variant="ghost" size="sm" className="mt-2 text-muted-foreground" onClick={() => playAudio(message.audioDataUri!)}>
                                    <Volume2 className="h-4 w-4 mr-2" />
                                    Read Aloud
                                </Button>
                            )}
                        </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3 p-3 rounded-lg flex-row">
                            <Avatar className="h-8 w-8 border"><AvatarFallback><Bot/></AvatarFallback></Avatar>
                            <div className="flex flex-col max-w-[80%] items-start">
                                <div className="p-3 rounded-xl bg-accent border">
                                    <p className="text-sm flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin"/>
                                        Thinking...
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    </div>
                </ScrollArea>
                <CardContent className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                      <Input
                          placeholder="Type or speak your question..."
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          disabled={isLoading}
                          className="flex-grow"
                      />
                      <Button type="button" variant="outline" size="icon" onClick={handleListen} disabled={isLoading || !recognitionRef.current} aria-label={isListening ? 'Stop listening' : 'Start listening'}>
                          <Mic className={cn("h-5 w-5", isListening && "text-destructive animate-pulse")} />
                      </Button>
                      <Button type="submit" disabled={isLoading || !input.trim()}>
                          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizonal className="h-5 w-5" />}
                          <span className="sr-only">Send</span>
                      </Button>
                    </form>
                    <audio ref={audioRef} className="hidden" />
                </CardContent>
                </Card>
            </div>
      </div>
    </AppLayout>
  );
}
