
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Video,
  ScreenShare,
  PenSquare,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Upload,
  Download,
  Users,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const mockSchedule = [
  { id: 1, title: "Calculus 101: Integration", time: "10:00 AM - 11:00 AM", teacher: "Dr. Evelyn Reed", isLive: true },
  { id: 2, title: "History of Ancient Rome", time: "11:30 AM - 12:30 PM", teacher: "Prof. Marcus Kane", isLive: false },
  { id: 3, title: "Intro to Python: Data Types", time: "01:00 PM - 02:00 PM", teacher: "Dr. Evelyn Reed", isLive: false },
  { id: 4, title: "Web Dev: React Hooks", time: "02:30 PM - 03:30 PM", teacher: "Prof. Alex Grant", isLive: false },
];

const mockParticipants = [
  { id: 1, name: "Dr. Evelyn Reed", role: "Host", avatar: "https://randomuser.me/api/portraits/women/50.jpg", avatarAiHint: "teacher profile" },
  { id: 2, name: "You", role: "Student", avatar: "https://randomuser.me/api/portraits/men/32.jpg", avatarAiHint: "profile man" },
  { id: 3, name: "Sarah Day", role: "Student", avatar: "https://randomuser.me/api/portraits/women/44.jpg", avatarAiHint: "profile woman" },
  { id: 4, name: "John Smith", role: "Student", avatar: "https://randomuser.me/api/portraits/men/46.jpg", avatarAiHint: "profile man" },
  { id: 5, name: "Maria Garcia", role: "Student", avatar: "https://randomuser.me/api/portraits/women/47.jpg", avatarAiHint: "profile woman" },
  { id: 6, name: "Kenji Tanaka", role: "Student", avatar: "https://randomuser.me/api/portraits/men/52.jpg", avatarAiHint: "profile man" },
];

const mockFiles = [
    { name: "Syllabus.pdf", size: "1.2 MB" },
    { name: "Lecture_Slides_Week_1.pptx", size: "5.8 MB" },
    { name: "assignment_1.docx", size: "45 KB" },
];


export default function VirtualClassroomPage() {
  const [selectedMeeting, setSelectedMeeting] = useState(mockSchedule[0]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        console.error("getUserMedia not supported on this browser");
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please enable camera permissions in your browser settings to use this feature.",
        });
      }
    };
    getCameraPermission();
  }, [toast]);

  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Left Column: Schedule List */}
        <Card className="lg:w-1/4 h-fit lg:max-h-[calc(100vh-8rem)] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center"><ClipboardList className="mr-2 h-6 w-6 text-primary"/> Today's Classes</CardTitle>
          </CardHeader>
          <ScrollArea className="flex-grow">
            <CardContent className="space-y-3">
              {mockSchedule.map(meeting => (
                <Card
                  key={meeting.id}
                  className={cn(
                    "cursor-pointer hover:shadow-md transition-shadow",
                    selectedMeeting?.id === meeting.id && "border-primary shadow-md"
                  )}
                  onClick={() => setSelectedMeeting(meeting)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-md">{meeting.title}</h4>
                      {meeting.isLive && <span className="flex items-center text-xs text-red-500 font-semibold"><span className="relative flex h-2 w-2 mr-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span>LIVE</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">{meeting.time}</p>
                    <p className="text-xs text-muted-foreground mt-1">Teacher: {meeting.teacher}</p>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </ScrollArea>
        </Card>

        {/* Right Column: Main Classroom Area */}
        <div className="flex-grow flex flex-col gap-4">
          <Card className="flex-grow">
            <CardHeader>
              <CardTitle className="text-2xl">{selectedMeeting?.title || "Virtual Classroom"}</CardTitle>
              <CardDescription>Teacher: {selectedMeeting?.teacher || "N/A"}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="video" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="video"><Video className="mr-2 h-4 w-4"/>Video Feed</TabsTrigger>
                  <TabsTrigger value="screenshare"><ScreenShare className="mr-2 h-4 w-4"/>Screen Share</TabsTrigger>
                  <TabsTrigger value="whiteboard"><PenSquare className="mr-2 h-4 w-4"/>Whiteboard</TabsTrigger>
                </TabsList>
                
                {/* Video Feed Content */}
                <TabsContent value="video" className="mt-4 p-2 border rounded-md min-h-[400px]">
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                     {/* User's Video */}
                     <div className="relative aspect-video bg-card rounded-lg overflow-hidden border-2 border-primary">
                        <video ref={videoRef} className={cn("w-full h-full object-cover", isVideoOff && "hidden")} autoPlay muted playsInline />
                        {isVideoOff && <div className="w-full h-full bg-black flex items-center justify-center"><VideoOff className="h-10 w-10 text-muted-foreground"/></div>}
                        {!isVideoOff && hasCameraPermission === false && (
                             <Alert variant="destructive" className="m-4">
                               <AlertTriangle className="h-4 w-4"/>
                               <AlertTitle>No Camera</AlertTitle>
                               <AlertDescription>Enable permissions or connect a camera.</AlertDescription>
                             </Alert>
                        )}
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">You</div>
                     </div>
                     {/* Other Participants */}
                     {mockParticipants.filter(p => p.name !== "You").slice(0,5).map(p => (
                        <div key={p.id} className="relative aspect-video bg-card rounded-lg overflow-hidden">
                            <Image src="https://placehold.co/400x300.png" layout="fill" objectFit="cover" alt={p.name} data-ai-hint="person video call" />
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">{p.name}</div>
                        </div>
                     ))}
                   </div>
                </TabsContent>
                
                {/* Screen Share Content */}
                <TabsContent value="screenshare" className="mt-4 p-2 border rounded-md min-h-[400px] flex items-center justify-center bg-muted/30">
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                        <Image src="https://placehold.co/800x450.png" width={800} height={450} alt="Screen share placeholder" className="rounded-md shadow-lg" data-ai-hint="desktop application" />
                        <p className="mt-4 text-sm">Dr. Evelyn Reed is sharing their screen.</p>
                    </div>
                </TabsContent>

                {/* Whiteboard Content */}
                <TabsContent value="whiteboard" className="mt-4 p-2 border rounded-md min-h-[400px] flex items-center justify-center bg-white dark:bg-card">
                   <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                        <svg viewBox="0 0 500 300" className="w-full h-auto max-h-[380px]">
                            <rect width="500" height="300" fill="none" stroke="hsl(var(--border))" strokeWidth="1"/>
                            {/* Mock drawings */}
                            <path d="M 50,50 Q 150,150 250,50 T 450,50" stroke="hsl(var(--primary))" fill="none" strokeWidth="2" />
                            <circle cx="80" cy="200" r="30" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive)/0.2)" strokeWidth="2" />
                            <text x="300" y="150" fontFamily="monospace" fontSize="16" fill="hsl(var(--foreground))" transform="rotate(-10, 300, 150)">y = mx + b</text>
                            <text x="100" y="250" fontFamily="sans-serif" fontSize="14" fill="hsl(var(--chart-4))">Key points!</text>
                        </svg>
                        <p className="mt-2 text-sm text-muted-foreground">Interactive Whiteboard</p>
                   </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Controls Bar */}
          <Card>
            <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex gap-2">
                    <Button variant={isMuted ? "destructive" : "outline"} onClick={() => setIsMuted(!isMuted)}>
                        {isMuted ? <MicOff className="mr-2 h-4 w-4"/> : <Mic className="mr-2 h-4 w-4"/>} {isMuted ? "Unmute" : "Mute"}
                    </Button>
                    <Button variant={isVideoOff ? "destructive" : "outline"} onClick={() => setIsVideoOff(!isVideoOff)}>
                       {isVideoOff ? <VideoOff className="mr-2 h-4 w-4"/> : <Video className="mr-2 h-4 w-4"/>} {isVideoOff ? "Start Video" : "Stop Video"}
                    </Button>
                </div>
                <Button variant="destructive" className="w-full sm:w-auto">
                    <PhoneOff className="mr-2 h-4 w-4"/> Leave Meeting
                </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Sidebar: Participants & Files */}
        <div className="lg:w-1/4 flex flex-col gap-4">
            <Card className="flex-1">
                <CardHeader>
                    <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5 text-primary"/> Participants</CardTitle>
                </CardHeader>
                <ScrollArea className="h-48">
                    <CardContent>
                        <ul className="space-y-3">
                            {mockParticipants.map(p => (
                                <li key={p.id} className="flex items-center gap-3">
                                    <Avatar>
                                        <Image src={p.avatar} alt={p.name} width={40} height={40} data-ai-hint={p.avatarAiHint || 'profile generic'}/>
                                        <AvatarFallback>{p.name.substring(0,2)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-sm">{p.name}</p>
                                        <p className="text-xs text-muted-foreground">{p.role}</p>
                                    </div>
                                    <Mic className="ml-auto h-4 w-4 text-green-500"/>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </ScrollArea>
            </Card>
             <Card className="flex-1">
                <CardHeader>
                    <CardTitle className="flex items-center"><Upload className="mr-2 h-5 w-5 text-primary"/> Shared Files</CardTitle>
                </CardHeader>
                <ScrollArea className="h-48">
                    <CardContent>
                       <ul className="space-y-2">
                            {mockFiles.map(file => (
                                <li key={file.name} className="flex justify-between items-center p-2 rounded-md hover:bg-accent/50">
                                    <div>
                                        <p className="font-medium text-sm">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{file.size}</p>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                        <Download className="h-4 w-4"/>
                                    </Button>
                                </li>
                            ))}
                       </ul>
                    </CardContent>
                </ScrollArea>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}

    