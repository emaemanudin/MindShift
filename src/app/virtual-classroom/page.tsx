
"use client";

import { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { saveAs } from "file-saver";
import { Lobby } from "@/components/virtual-classroom/Lobby";
import { CallControls } from "@/components/virtual-classroom/CallControls";
import { ChatPanel } from "@/components/virtual-classroom/ChatPanel";
import { AttendanceList } from "@/components/virtual-classroom/AttendanceList";
import { useWebRTC } from "@/hooks/use-webrtc";
import { useToast } from "@/hooks/use-toast";
import { Download, Edit, Users, VideoOff } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

type CallState = "lobby" | "in-call" | "ended";

export default function VirtualClassroomPage() {
  const { toast } = useToast();
  const [userName, setUserName] = useState("");
  const [callState, setCallState] = useState<CallState>("lobby");
  const [notes, setNotes] = useState("");
  const [signalingState, setSignalingState] = useState({ offer: "", answer: "" });
  const [offerCreated, setOfferCreated] = useState(false);
  const [isPeerConnected, setIsPeerConnected] = useState(false);

  const {
    localVideoRef,
    remoteVideoRef,
    localStream,
    remoteStream,
    isMuted,
    isVideoOff,
    isScreenSharing,
    isRecording,
    handRaised,
    chatMessages,
    participants,
    connectionTime,
    actions,
  } = useWebRTC(userName, () => setIsPeerConnected(true));

  useEffect(() => {
    const savedName = localStorage.getItem("virtual-classroom-username");
    const savedNotes = localStorage.getItem("virtual-classroom-notes");
    if (savedName) setUserName(savedName);
    if (savedNotes) setNotes(savedNotes);
  }, []);

  const handleJoinCall = (name: string) => {
    setUserName(name);
    localStorage.setItem("virtual-classroom-username", name);
    actions.initializeStream();
    setCallState("in-call");
    toast({ title: "Welcome!", description: "You have entered the classroom. Create an offer to connect." });
  };
  
  const createOffer = async () => {
      const offer = await actions.createOffer();
      setSignalingState({ ...signalingState, offer: JSON.stringify(offer) });
      setOfferCreated(true);
      toast({title: "Offer Created", description: "Copy the offer and send it to your peer."});
  };
  
  const createAnswer = async () => {
      if (!signalingState.offer) {
          toast({variant: "destructive", title: "Error", description: "You must paste an offer first."});
          return;
      }
      try {
        const answer = await actions.createAnswer(JSON.parse(signalingState.offer));
        setSignalingState({ ...signalingState, answer: JSON.stringify(answer) });
        toast({title: "Answer Created", description: "Copy the answer and send it back to the first peer."});
      } catch (e) {
        toast({variant: "destructive", title: "Error", description: "Invalid offer format."});
      }
  };
  
  const addAnswer = async () => {
      if (!signalingState.answer) {
          toast({variant: "destructive", title: "Error", description: "You must paste an answer first."});
          return;
      }
      try {
        await actions.addAnswer(JSON.parse(signalingState.answer));
      } catch (e) {
        toast({variant: "destructive", title: "Error", description: "Invalid answer format."});
      }
  };

  const handleEndCall = () => {
    actions.hangUp();
    setCallState("ended");
    setSignalingState({ offer: "", answer: ""});
    setOfferCreated(false);
    setIsPeerConnected(false);
    toast({ title: "Meeting Ended", description: "You have left the meeting." });
  };
  
  const handleSaveNotes = () => {
    localStorage.setItem("virtual-classroom-notes", notes);
    toast({ title: "Notes Saved", description: "Your notes have been saved locally." });
  };

  const handleDownloadNotes = () => {
    const blob = new Blob([notes], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "classroom-notes.txt");
  };

  const renderContent = () => {
    switch (callState) {
      case "lobby":
        return <Lobby onJoin={handleJoinCall} defaultName={userName} />;
      
      case "in-call":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
            <div className="lg:col-span-3 flex flex-col gap-4">
               {/* Signaling Controls */}
              {!isPeerConnected && (
                <Card>
                  <CardHeader>
                    <CardTitle>Connection Setup</CardTitle>
                    <CardDescription>Use these controls to manually connect to your peer.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Textarea placeholder="1. Click 'Create Offer' or paste an offer here..." value={signalingState.offer} onChange={(e) => setSignalingState({...signalingState, offer: e.target.value})} />
                             <Button onClick={createOffer} disabled={offerCreated}>Create Offer</Button>
                        </div>
                        <div className="space-y-2">
                             <Textarea placeholder="2. Paste an answer here or generate one..." value={signalingState.answer} onChange={(e) => setSignalingState({...signalingState, answer: e.target.value})} />
                             <div className="flex gap-2">
                                <Button onClick={createAnswer}>Create Answer</Button>
                                <Button onClick={addAnswer} disabled={!offerCreated}>Add Answer</Button>
                             </div>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              <Card className="flex-grow relative bg-muted/30">
                <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-contain rounded-md" />
                {!remoteStream && (
                   <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center text-muted-foreground p-4">
                        <p className="text-xl font-medium">Waiting for peer...</p>
                        <p className="text-sm text-center">Once the peer connects via the signaling controls above, their video will appear here.</p>
                   </div>
                )}
                 <div className="absolute top-4 right-4 w-1/4 min-w-[150px] aspect-video">
                    <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover rounded-md border-2 border-background shadow-lg" />
                    {isVideoOff && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-md border-2 border-background text-white">
                            <VideoOff className="h-8 w-8"/>
                        </div>
                    )}
                </div>
              </Card>
              <CallControls 
                onHangUp={handleEndCall}
                onToggleMute={actions.toggleMute} isMuted={isMuted}
                onToggleVideo={actions.toggleVideo} isVideoOff={isVideoOff}
                onToggleScreenShare={actions.toggleScreenShare} isScreenSharing={isScreenSharing}
                onToggleRecording={actions.toggleRecording} isRecording={isRecording}
                onRaiseHand={actions.raiseHand} handRaised={handRaised}
                isConnected={!!localStream}
              />
            </div>
            <div className="lg:col-span-1 flex flex-col gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg"><Users className="mr-2"/>Participants</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <AttendanceList participants={participants} />
                    </CardContent>
                </Card>
                <ChatPanel messages={chatMessages} onSendMessage={actions.sendMessage} disabled={!isPeerConnected} />
            </div>
          </div>
        );

      case "ended":
        const duration = connectionTime.end && connectionTime.start 
            ? Math.round((connectionTime.end - connectionTime.start) / 1000) 
            : 0;
        return (
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold mb-2">Meeting Ended</h2>
            <p className="text-muted-foreground mb-4">You were in the meeting for {duration} seconds.</p>
            <Button onClick={() => setCallState("lobby")}>Re-join Lobby</Button>
          </div>
        )
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-var(--header-height)-2rem)] gap-4">
        {callState !== "lobby" && (
           <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center"><Edit className="mr-2"/>Personal Notes</CardTitle>
                <div>
                   <Button variant="outline" size="sm" onClick={handleSaveNotes} className="mr-2">Save Notes</Button>
                   <Button variant="outline" size="sm" onClick={handleDownloadNotes}><Download className="mr-2 h-4 w-4"/>Download</Button>
                </div>
              </div>
              <CardDescription>Your notes are saved in your browser and will persist after the call.</CardDescription>
            </CardHeader>
            <CardContent>
               <Textarea 
                value={notes} 
                onChange={e => setNotes(e.target.value)} 
                placeholder="Type your personal notes here..." 
                className="h-32"
                disabled={callState === 'ended'}
               />
            </CardContent>
          </Card>
        )}
        <div className="flex-grow">{renderContent()}</div>
      </div>
    </AppLayout>
  );
}
