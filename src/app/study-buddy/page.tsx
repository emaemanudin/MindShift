"use client";

import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Loader2, SendHorizonal, User, Volume2, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { studyBuddy, StudyBuddyOutput } from "@/ai/flows/study-buddy";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  audioDataUri?: string;
}

export default function StudyBuddyPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      setTimeout(() => {
        viewport.scrollTop = viewport.scrollHeight;
      }, 100);
    }
  };
  
  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await studyBuddy(input);
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: result.responseText,
        audioDataUri: result.audioDataUri,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Study Buddy Error:", error);
      const errorMessage: Message = {
        id: `assistant-error-${Date.now()}`,
        role: "assistant",
        text: "Sorry, I had trouble connecting. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (audioDataUri: string) => {
    if (audioRef.current) {
        audioRef.current.src = audioDataUri;
        audioRef.current.play().catch(e => console.error("Audio playback error:", e));
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-var(--header-height)-2rem)] max-w-4xl mx-auto w-full">
        <Card className="flex-grow flex flex-col shadow-lg">
          <CardHeader className="border-b text-center">
            <div className="flex items-center justify-center gap-2">
                <Bot className="h-8 w-8 text-primary" />
                <CardTitle className="text-3xl font-bold">Your Personal Study Buddy</CardTitle>
            </div>
            <CardDescription>
              Ask me anything about your coursework, and I'll help you understand it. I can even talk you through it!
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
                      "flex flex-col max-w-[80%]",
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
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
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
                placeholder="e.g., Explain the concept of recursion..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-grow"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizonal className="h-5 w-5" />}
                <span className="sr-only">Send</span>
              </Button>
            </form>
             <audio ref={audioRef} className="hidden" />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
