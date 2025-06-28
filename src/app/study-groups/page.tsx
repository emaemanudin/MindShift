
"use client";

import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { LucideIcon } from "lucide-react";
import { Users, MessageSquare, SendHorizonal, PlusCircle, Briefcase, FlaskConical, Code2, UserCircle2, CheckCircle, Info, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { studyGroupAssistant } from '@/ai/flows/study-group-assistant';

// Data types
interface DemoUser {
  id: string;
  name: string;
  avatarUrl: string;
  avatarAiHint?: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl: string;
  userAvatarAiHint?: string;
  text: string;
  timestamp: Date;
  isOwnMessage?: boolean;
}

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  teacher: DemoUser;
  members: DemoUser[];
  messages: ChatMessage[];
  icon: LucideIcon;
  iconColorClass?: string;
}

// Mock Users
const currentUser: DemoUser = { id: "user_current", name: "You (Alex)", avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg", avatarAiHint: "profile man" };
const aiAssistantUser: DemoUser = { id: "user_ai", name: "AI Assistant", avatarUrl: "/ai-avatar.png", avatarAiHint: "robot assistant" };
const demoUser1: DemoUser = { id: "user_1", name: "Sarah Day", avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg", avatarAiHint: "profile woman" };
const demoUser2: DemoUser = { id: "user_2", name: "John Smith", avatarUrl: "https://randomuser.me/api/portraits/men/46.jpg", avatarAiHint: "profile man" };
const demoUser3: DemoUser = { id: "user_3", name: "Maria Garcia", avatarUrl: "https://randomuser.me/api/portraits/women/47.jpg", avatarAiHint: "profile woman" };
const demoTeacher: DemoUser = { id: "teacher_1", name: "Dr. Emily Carter", avatarUrl: "https://randomuser.me/api/portraits/women/50.jpg", avatarAiHint: "teacher profile" };

// Initial Mock Data
const initialStudyGroups: StudyGroup[] = [
  {
    id: "group_1",
    name: "Web Development Wizards",
    description: "Discussing React, Next.js, and modern web tech.",
    teacher: demoTeacher,
    members: [currentUser, demoUser1, demoUser2, aiAssistantUser],
    icon: Code2,
    iconColorClass: "text-blue-500",
    messages: [
      { id: "msg_1_1", userId: demoUser1.id, userName: demoUser1.name, userAvatarUrl: demoUser1.avatarUrl, userAvatarAiHint: demoUser1.avatarAiHint, text: "Hey everyone! Excited to dive into Next.js 15 features.", timestamp: new Date(Date.now() - 1000 * 60 * 50) },
      { id: "msg_1_2", userId: demoTeacher.id, userName: demoTeacher.name, userAvatarUrl: demoTeacher.avatarUrl, userAvatarAiHint: demoTeacher.avatarAiHint, text: "Welcome Sarah! Let's start with Server Components. Any questions?", timestamp: new Date(Date.now() - 1000 * 60 * 48) },
      { id: "msg_1_3", userId: currentUser.id, userName: currentUser.name, userAvatarUrl: currentUser.avatarUrl, userAvatarAiHint: currentUser.avatarAiHint, text: "I'm curious about the new Turbopack improvements. AI, can you summarize?", timestamp: new Date(Date.now() - 1000 * 60 * 45), isOwnMessage: true },
    ],
  },
  {
    id: "group_2",
    name: "Chemistry Crew",
    description: "Organic chemistry, lab experiments, and study sessions.",
    teacher: demoTeacher,
    members: [currentUser, demoUser2, demoUser3, aiAssistantUser],
    icon: FlaskConical,
    iconColorClass: "text-green-500",
    messages: [
      { id: "msg_2_1", userId: demoUser2.id, userName: demoUser2.name, userAvatarUrl: demoUser2.avatarUrl, userAvatarAiHint: demoUser2.avatarAiHint, text: "Struggling with SN1 vs SN2 reactions, anyone have good mnemonics?", timestamp: new Date(Date.now() - 1000 * 60 * 30) },
      { id: "msg_2_2", userId: demoUser3.id, userName: demoUser3.name, userAvatarUrl: demoUser3.avatarUrl, userAvatarAiHint: demoUser3.avatarAiHint, text: "I usually think about the carbocation stability for SN1!", timestamp: new Date(Date.now() - 1000 * 60 * 28) },
    ],
  },
  {
    id: "group_3",
    name: "Project Management Pros",
    description: "Agile, Scrum, and project planning techniques.",
    teacher: demoTeacher,
    members: [currentUser, demoUser1, demoUser3, aiAssistantUser],
    icon: Briefcase,
    iconColorClass: "text-purple-500",
    messages: [
      { id: "msg_3_1", userId: demoUser1.id, userName: demoUser1.name, userAvatarUrl: demoUser1.avatarUrl, userAvatarAiHint: demoUser1.avatarAiHint, text: "Our sprint review is next week. How's everyone's progress?", timestamp: new Date(Date.now() - 1000 * 60 * 120) },
    ],
  },
];

// Component for individual chat message
interface ChatMessageItemProps {
  message: ChatMessage;
}
function ChatMessageItem({ message }: ChatMessageItemProps) {
  const { userName, userAvatarUrl, userAvatarAiHint, text, timestamp, isOwnMessage } = message;
  const isAI = message.userId === aiAssistantUser.id;

  return (
    <div className={cn("flex items-start gap-3 p-3 rounded-lg", isOwnMessage ? "flex-row-reverse" : "flex-row")}>
      <Avatar className="h-8 w-8 border">
        {isAI ? (
            <div className="flex items-center justify-center h-full w-full bg-primary/20 rounded-full">
                <Bot className="h-5 w-5 text-primary" />
            </div>
        ) : (
          <>
            <Image src={userAvatarUrl} alt={userName} width={32} height={32} data-ai-hint={userAvatarAiHint || 'profile generic'} />
            <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </>
        )}
      </Avatar>
      <div className={cn("flex flex-col max-w-[70%]", isOwnMessage ? "items-end" : "items-start")}>
        <div className={cn("p-3 rounded-xl", 
            isOwnMessage ? "bg-primary text-primary-foreground" : 
            isAI ? "bg-accent border" : "bg-muted")}>
          <p className="text-sm font-medium mb-0.5">{!isOwnMessage && userName}</p>
          <p className="text-sm whitespace-pre-wrap">{text}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1 px-1">{new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
}

// Component for Create Chat Dialog
interface CreateChatDialogProps {
  onChatCreate: (name: string, description: string) => void;
  children: React.ReactNode;
}

function CreateChatDialog({ onChatCreate, children }: CreateChatDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!name.trim() || !description.trim()) {
      toast({ title: "Error", description: "Chat name and description are required.", variant: "destructive" });
      return;
    }
    onChatCreate(name, description);
    setName("");
    setDescription("");
    setIsOpen(false);
    toast({ title: "Chat Created!", description: `The chat "${name}" has been successfully created.`, variant: "default"});
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center"><PlusCircle className="mr-2 h-5 w-5" /> Create New Study Chat</DialogTitle>
          <DialogDescription>
            Fill in the details to start a new study chat. The AI assistant will adapt to your chat's topic.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input placeholder="Chat Name (e.g., Advanced Calculus)" value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea placeholder="Chat Description (e.g., We focus on weekly problem sets and exam prep.)" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Create Chat</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function StudyGroupsPage() {
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(initialStudyGroups);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(studyGroups[0] || null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const [isAiTyping, setIsAiTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [selectedGroup?.messages]);
  
  const handleAiResponse = async (userMessage: string, group: StudyGroup) => {
    setIsAiTyping(true);
    const thinkingMessage: ChatMessage = {
      id: `msg_thinking_${group.id}`,
      userId: aiAssistantUser.id,
      userName: aiAssistantUser.name,
      userAvatarUrl: aiAssistantUser.avatarUrl,
      text: "MindShift AI is typing...",
      timestamp: new Date(),
      isOwnMessage: false,
    };

    // Add typing indicator
    setStudyGroups(prevGroups =>
      prevGroups.map(g =>
        g.id === group.id ? { ...g, messages: [...g.messages, thinkingMessage] } : g
      )
    );

    try {
      const result = await studyGroupAssistant({
        userMessage: userMessage,
        groupName: group.name,
        groupDescription: group.description,
      });

      const aiResponseMessage: ChatMessage = {
        id: `msg_ai_${group.id}_${Date.now()}`,
        userId: aiAssistantUser.id,
        userName: aiAssistantUser.name,
        userAvatarUrl: aiAssistantUser.avatarUrl,
        userAvatarAiHint: aiAssistantUser.avatarAiHint,
        text: result.response,
        timestamp: new Date(),
        isOwnMessage: false,
      };
      
      // Replace typing indicator with actual response
      setStudyGroups(prevGroups =>
        prevGroups.map(g => {
          if (g.id === group.id) {
            const updatedMessages = g.messages.filter(m => m.id !== thinkingMessage.id);
            return { ...g, messages: [...updatedMessages, aiResponseMessage] };
          }
          return g;
        })
      );

    } catch (error) {
      console.error("AI response error:", error);
      const errorMessage: ChatMessage = {
        id: `msg_error_${group.id}_${Date.now()}`,
        userId: aiAssistantUser.id,
        userName: aiAssistantUser.name,
        userAvatarUrl: aiAssistantUser.avatarUrl,
        text: "Sorry, I encountered an error and couldn't respond. Please try again.",
        timestamp: new Date(),
        isOwnMessage: false,
      };
       setStudyGroups(prevGroups =>
        prevGroups.map(g => {
          if (g.id === group.id) {
            const updatedMessages = g.messages.filter(m => m.id !== thinkingMessage.id);
            return { ...g, messages: [...updatedMessages, errorMessage] };
          }
          return g;
        })
      );
    } finally {
        setIsAiTyping(false);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;
    const messageToSend: ChatMessage = {
      id: `msg_${selectedGroup.id}_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatarUrl: currentUser.avatarUrl,
      userAvatarAiHint: currentUser.avatarAiHint,
      text: newMessage,
      timestamp: new Date(),
      isOwnMessage: true,
    };

    setStudyGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === selectedGroup.id
          ? { ...group, messages: [...group.messages, messageToSend] }
          : group
      )
    );
    
    // Check if AI should respond
    if (newMessage.toLowerCase().includes("ai") || newMessage.endsWith("?")) {
      handleAiResponse(newMessage, selectedGroup);
    }
    
    setNewMessage("");
  };
  
  const handleCreateGroup = (name: string, description: string) => {
    const newGroup: StudyGroup = {
      id: `group_${Date.now()}`,
      name,
      description,
      teacher: currentUser, // Current user creates and becomes the "teacher"/admin
      members: [currentUser, aiAssistantUser],
      icon: Info, // Default icon for new groups
      iconColorClass: "text-gray-500",
      messages: [
        { id: `msg_new_${Date.now()}`, userId: currentUser.id, userName: currentUser.name, userAvatarUrl: currentUser.avatarUrl, userAvatarAiHint: currentUser.avatarAiHint, text: "Welcome to the new group!", timestamp: new Date(), isOwnMessage: true}
      ],
    };
    setStudyGroups(prev => [...prev, newGroup]);
    setSelectedGroup(newGroup); // Auto-select the newly created group
  };

  const handleJoinGroup = useCallback((groupId: string) => {
    const groupToJoin = studyGroups.find(g => g.id === groupId);
    if (!groupToJoin) return;

    const isMember = groupToJoin.members.some(m => m.id === currentUser.id);
    if (isMember) {
      toast({ title: "Already a member", description: `You are already a member of "${groupToJoin.name}".` });
      return;
    }

    setStudyGroups(prevGroups => 
      prevGroups.map(g => 
        g.id === groupId 
          ? { ...g, members: [...g.members, currentUser] } 
          : g
      )
    );
    toast({ title: "Joined Chat!", description: `You have successfully joined "${groupToJoin.name}".`, variant: "default" });

  }, [studyGroups, toast]);


  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-var(--header-height)-2rem)]"> {/* Adjust for header and padding */}
        {/* Left Column: Group List */}
        <Card className="w-1/3 lg:w-1/4 h-full flex flex-col shadow-lg">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl flex items-center">
                <Bot className="mr-2 h-6 w-6 text-primary" />
                Study Buddy
              </CardTitle>
              <CreateChatDialog onChatCreate={handleCreateGroup}>
                <Button variant="ghost" size="icon" aria-label="Create new chat">
                  <PlusCircle className="h-5 w-5 text-primary" />
                </Button>
              </CreateChatDialog>
            </div>
          </CardHeader>
          <ScrollArea className="flex-grow">
            <CardContent className="p-0">
              {studyGroups.map(group => {
                const IconComponent = group.icon;
                const isMember = group.members.some(m => m.id === currentUser.id);
                return (
                  <div
                    key={group.id}
                    className={cn(
                      "p-4 border-b cursor-pointer hover:bg-accent/80 transition-colors",
                      selectedGroup?.id === group.id && "bg-accent"
                    )}
                    onClick={() => setSelectedGroup(group)}
                  >
                    <div className="flex items-center gap-3 mb-1">
                       <div className={cn("p-1.5 rounded-md", group.iconColorClass && group.iconColorClass.replace('text-','bg-') + '/10')}>
                        <IconComponent className={cn("h-5 w-5", group.iconColorClass || "text-primary")} />
                       </div>
                      <h4 className="font-semibold text-md truncate">{group.name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mb-1">{group.description}</p>
                     <div className="flex items-center justify-between">
                        <div className="flex -space-x-1 items-center">
                            {group.members.filter(m => m.id !== aiAssistantUser.id).slice(0,3).map(member => (
                                <Avatar key={member.id} className="h-5 w-5 border-2 border-background">
                                  <Image src={member.avatarUrl} alt={member.name} width={20} height={20} data-ai-hint={member.avatarAiHint || 'profile generic'}/>
                                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            ))}
                            {group.members.filter(m => m.id !== aiAssistantUser.id).length > 3 && <span className="text-xs text-muted-foreground ml-1.5 pl-1 pt-0.5">+{group.members.length-3}</span>}
                        </div>
                        {!isMember && (
                            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleJoinGroup(group.id); }} className="h-auto px-2 py-1 text-xs">Join</Button>
                        )}
                     </div>
                  </div>
                );
              })}
            </CardContent>
          </ScrollArea>
        </Card>

        {/* Right Column: Chat Area */}
        <div className="flex-grow h-full flex flex-col pl-4">
          {selectedGroup ? (
            <Card className="h-full flex flex-col shadow-lg">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        {React.createElement(selectedGroup.icon, { className: cn("h-6 w-6 mr-2", selectedGroup.iconColorClass || "text-primary") })}
                        <CardTitle className="text-xl">{selectedGroup.name}</CardTitle>
                    </div>
                    <div className="flex items-center">
                        <p className="text-sm text-muted-foreground mr-2">Teacher: {selectedGroup.teacher.name}</p>
                        <Avatar className="h-7 w-7 border">
                           <Image src={selectedGroup.teacher.avatarUrl} alt={selectedGroup.teacher.name} width={28} height={28} data-ai-hint={selectedGroup.teacher.avatarAiHint || 'profile teacher'} />
                           <AvatarFallback>{selectedGroup.teacher.name.substring(0,1)}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
                <CardDescription className="mt-1">
                  {selectedGroup.members.filter(m => m.id !== aiAssistantUser.id).length} member(s): {selectedGroup.members.filter(m => m.id !== aiAssistantUser.id).map(m => m.name).join(", ")}
                </CardDescription>
              </CardHeader>
              <ScrollArea className="flex-grow p-4 bg-muted/30">
                {selectedGroup.messages.map(msg => (
                  <ChatMessageItem key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </ScrollArea>
              <CardContent className="p-4 border-t">
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Ask the AI a question or chat with the group..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isAiTyping && handleSendMessage()}
                    className="flex-grow"
                    disabled={isAiTyping}
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim() || isAiTyping}>
                    <SendHorizonal className="h-5 w-5" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex flex-col items-center justify-center text-muted-foreground shadow-lg bg-muted/30">
              <MessageSquare className="h-16 w-16 mb-4" />
              <p className="text-lg">Select a chat to start</p>
              <p className="text-sm">or create a new one!</p>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
