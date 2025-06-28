
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import QRCode from "qrcode.react";
import {
  Video,
  ScreenShare,
  PenSquare,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Users,
  ClipboardList,
  AlertTriangle,
  QrCode,
  Copy,
  ScreenShareOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const mockSchedule = [
  { id: 1, title: "Calculus 101: Integration", time: "10:00 AM - 11:00 AM", teacher: "Dr. Evelyn Reed", isLive: true },
  { id: 2, title: "History of Ancient Rome", time: "11:30 AM - 12:30 PM", teacher: "Prof. Marcus Kane", isLive: false },
];

const mockParticipants = [
  { id: 1, name: "Dr. Evelyn Reed", role: "Host", avatar: "https://randomuser.me/api/portraits/women/50.jpg", avatarAiHint: "teacher profile" },
  { id: 2, name: "You", role: "Student", avatar: "https://randomuser.me/api/portraits/men/32.jpg", avatarAiHint: "profile man" },
  { id: 3, name: "Sarah Day", role: "Student", avatar: "https://randomuser.me/api/portraits/women/44.jpg", avatarAiHint: "profile woman" },
];

// WebRTC Configuration
const pcConfig = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

export default function VirtualClassroomPage() {
  const { toast } = useToast();
  // Video and stream refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  // Component State
  const [selectedMeeting, setSelectedMeeting] = useState(mockSchedule[0]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notes, setNotes] = useState("");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

  // Signaling state for manual connection
  const [offerSdp, setOfferSdp] = useState('');
  const [answerSdp, setAnswerSdp] = useState('');
  const [sdpToAccept, setSdpToAccept] = useState('');
  
  // Get user media on load
  useEffect(() => {
    setPageUrl(window.location.href);

    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        localStreamRef.current = stream;
        setHasPermissions(true);
      } catch (e) {
        console.error('Error accessing media devices.', e);
        setHasPermissions(false);
        toast({
            variant: "destructive",
            title: "Media Access Denied",
            description: "Please allow camera and microphone access to use this feature.",
        });
      }
    };
    getMedia();

    return () => {
      // Cleanup on component unmount
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      peerConnectionRef.current?.close();
    }
  }, [toast]);

  const createPeerConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    const pc = new RTCPeerConnection(pcConfig);
    
    pc.onicecandidate = (event) => {
        if (event.candidate && pc.localDescription) {
            // For manual signaling, we re-create the offer/answer with the new candidates.
            setOfferSdp(JSON.stringify(pc.localDescription));
        }
    };

    pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
        }
    };
    
    pc.onconnectionstatechange = () => {
        if(pc.connectionState === 'connected') {
            setIsConnected(true);
            toast({ title: "Success!", description: "Peer connection established."});
        }
        if(pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
            setIsConnected(false);
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        }
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    peerConnectionRef.current = pc;
    return pc;
  }, [toast]);

  // Signaling logic
  const handleCreateOffer = async () => {
    if (!hasPermissions) return;
    const pc = createPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    setOfferSdp(JSON.stringify(pc.localDescription));
    toast({ title: "Offer Created", description: "Copy the offer text and send it to the other user."});
  };

  const handleCreateAnswer = async () => {
    if (!hasPermissions || !sdpToAccept) return;
    const pc = createPeerConnection();
    try {
        const offer = JSON.parse(sdpToAccept);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        setAnswerSdp(JSON.stringify(pc.localDescription));
        toast({ title: "Answer Created", description: "Copy the answer text and send it back to the first user."});
    } catch(e) {
        console.error(e);
        toast({ variant: "destructive", title: "Error", description: "Invalid offer format." });
    }
  };

  const handleAddAnswer = async () => {
    if (!peerConnectionRef.current || !sdpToAccept) return;
     try {
        const answer = JSON.parse(sdpToAccept);
        if (!peerConnectionRef.current.currentRemoteDescription) {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        }
    } catch(e) {
        console.error(e);
        toast({ variant: "destructive", title: "Error", description: "Invalid answer format." });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Text copied to clipboard." });
  }
  
  // Feature controls
  const handleToggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => track.enabled = !track.enabled);
      setIsMuted(prev => !prev);
    }
  }

  const handleToggleVideo = () => {
     if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => track.enabled = !track.enabled);
      setIsVideoOff(prev => !prev);
    }
  }

  const handleShareScreen = async () => {
    if (isScreenSharing) {
        // Stop sharing
        screenStreamRef.current?.getTracks().forEach(track => track.stop());
        const videoTrack = localStreamRef.current?.getVideoTracks()[0];
        if (peerConnectionRef.current && videoTrack) {
            const sender = peerConnectionRef.current.getSenders().find(s => s.track?.kind === 'video');
            sender?.replaceTrack(videoTrack);
        }
        setIsScreenSharing(false);
        screenStreamRef.current = null;
    } else {
        // Start sharing
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const screenTrack = screenStream.getVideoTracks()[0];

            if (peerConnectionRef.current) {
                const sender = peerConnectionRef.current.getSenders().find(s => s.track?.kind === 'video');
                sender?.replaceTrack(screenTrack);
            }
            screenStreamRef.current = screenStream;
            setIsScreenSharing(true);
            
            // Listen for when user stops sharing via browser UI
            screenTrack.onended = () => {
                 if (localStreamRef.current) {
                    const videoTrack = localStreamRef.current.getVideoTracks()[0];
                     if (peerConnectionRef.current) {
                        const sender = peerConnectionRef.current.getSenders().find(s => s.track?.kind === 'video');
                        sender?.replaceTrack(videoTrack);
                     }
                 }
                setIsScreenSharing(false);
                screenStreamRef.current = null;
            };
        } catch (err) {
            console.error("Screen share error", err);
            toast({ variant: "destructive", title: "Screen Share Failed", description: "Could not start screen sharing." });
        }
    }
  };

  const handleEndMeeting = () => {
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    
    // Don't stop local stream so user can start a new call
    // But stop screen sharing if it's active
    if (isScreenSharing) {
      screenStreamRef.current?.getTracks().forEach(track => track.stop());
      setIsScreenSharing(false);
      screenStreamRef.current = null;
    }

    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    setIsConnected(false);
    setOfferSdp('');
    setAnswerSdp('');
    setSdpToAccept('');
    toast({ title: "Meeting Ended", description: "You have left the meeting." });
  };


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
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </ScrollArea>
        </Card>

        {/* Right Column: Main Classroom Area */}
        <div className="flex-grow flex flex-col gap-4">
          <Card className="flex-grow">
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">{selectedMeeting?.title || "Virtual Classroom"}</CardTitle>
                  <CardDescription>Teacher: {selectedMeeting?.teacher || "N/A"}</CardDescription>
                </div>
                 <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                    <DialogTrigger asChild>
                        <Button variant="outline"><QrCode className="mr-2 h-4 w-4"/> Invite</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Invite a Peer</DialogTitle>
                        <DialogDescription>
                            Have the other person scan this QR code or go to the URL to join the classroom. Then, use the signaling controls to connect.
                        </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-4 py-4">
                            <QRCode value={pageUrl} size={256} />
                            <p className="text-sm text-muted-foreground break-all">{pageUrl}</p>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="video" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="video"><Video className="mr-2 h-4 w-4"/>Video Feed</TabsTrigger>
                  <TabsTrigger value="whiteboard"><PenSquare className="mr-2 h-4 w-4"/>Note Board</TabsTrigger>
                </TabsList>
                
                <TabsContent value="video" className="mt-4 p-2 border rounded-md min-h-[400px] bg-muted/30">
                  {!isConnected ? (
                     <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                        <CardTitle className="mb-4">Connect to a Peer</CardTitle>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                           {/* Step 1 & 2 */}
                           <Card>
                                <CardHeader><CardTitle className="text-lg">User 1: Create & Send Offer</CardTitle></CardHeader>
                                <CardContent className="space-y-2">
                                    <Button onClick={handleCreateOffer} disabled={!hasPermissions} className="w-full">Step 1: Create Offer</Button>
                                    <div className="relative">
                                      <Textarea readOnly value={offerSdp} placeholder="Offer SDP appears here..." rows={4}/>
                                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => copyToClipboard(offerSdp)}><Copy className="h-4 w-4"/></Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">After creating, copy and send this to User 2.</p>
                                </CardContent>
                           </Card>
                           {/* Step 3 & 4 */}
                            <Card>
                                <CardHeader><CardTitle className="text-lg">User 2: Receive Offer & Send Answer</CardTitle></CardHeader>
                                <CardContent className="space-y-2">
                                     <Textarea value={sdpToAccept} onChange={(e) => setSdpToAccept(e.target.value)} placeholder="Step 2: Paste Offer here..." rows={4}/>
                                     <Button onClick={handleCreateAnswer} disabled={!hasPermissions || !sdpToAccept} className="w-full">Step 3: Create Answer</Button>
                                    <div className="relative">
                                      <Textarea readOnly value={answerSdp} placeholder="Answer SDP appears here..." rows={4}/>
                                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => copyToClipboard(answerSdp)}><Copy className="h-4 w-4"/></Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">After creating, copy and send this back to User 1.</p>
                                </CardContent>
                           </Card>
                           {/* Step 5 */}
                            <Card className="md:col-span-2">
                                <CardHeader><CardTitle className="text-lg">User 1: Receive Answer & Connect</CardTitle></CardHeader>
                                <CardContent className="space-y-2">
                                     <Textarea value={sdpToAccept} onChange={(e) => setSdpToAccept(e.target.value)} placeholder="Step 4: Paste Answer here..." rows={4}/>
                                     <Button onClick={handleAddAnswer} disabled={!sdpToAccept} className="w-full">Step 5: Connect</Button>
                                </CardContent>
                           </Card>
                        </div>
                     </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 relative">
                        <video ref={remoteVideoRef} autoPlay playsInline className="w-full rounded-md bg-black aspect-video" />
                         <div className="absolute top-4 right-4 w-1/4 min-w-[150px] aspect-video">
                            <video ref={localVideoRef} autoPlay muted playsInline className={cn("w-full rounded-md object-cover border-2 border-background", isVideoOff && "hidden")} />
                            {isVideoOff && <div className="w-full h-full bg-black flex items-center justify-center rounded-md border-2 border-background"><VideoOff className="h-8 w-8 text-muted-foreground"/></div>}
                         </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="whiteboard" className="mt-4 p-2 border rounded-md min-h-[400px]">
                   <Textarea
                     placeholder="Take your personal notes here... they will persist even after the call ends."
                     className="w-full h-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                     value={notes}
                     onChange={(e) => setNotes(e.target.value)}
                   />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex gap-2">
                    <Button variant={isMuted ? "secondary" : "outline"} onClick={handleToggleMute} disabled={!isConnected}>
                        {isMuted ? <MicOff className="mr-2 h-4 w-4"/> : <Mic className="mr-2 h-4 w-4"/>} {isMuted ? "Unmute" : "Mute"}
                    </Button>
                    <Button variant={isVideoOff ? "secondary" : "outline"} onClick={handleToggleVideo} disabled={!isConnected}>
                       {isVideoOff ? <VideoOff className="mr-2 h-4 w-4"/> : <Video className="mr-2 h-4 w-4"/>} {isVideoOff ? "Start Video" : "Stop Video"}
                    </Button>
                    <Button variant={isScreenSharing ? "secondary" : "outline"} onClick={handleShareScreen} disabled={!isConnected}>
                       {isScreenSharing ? <ScreenShareOff className="mr-2 h-4 w-4"/> : <ScreenShare className="mr-2 h-4 w-4"/>} {isScreenSharing ? "Stop Sharing" : "Share Screen"}
                    </Button>
                </div>
                <Button variant="destructive" className="w-full sm:w-auto" onClick={handleEndMeeting} disabled={!isConnected}>
                    <PhoneOff className="mr-2 h-4 w-4"/> Leave Meeting
                </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:w-1/4 flex flex-col gap-4">
            <Card className="flex-1">
                <CardHeader>
                    <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5 text-primary"/> Participants</CardTitle>
                </CardHeader>
                <ScrollArea className="h-60">
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
        </div>
      </div>
    </AppLayout>
  );
}

    