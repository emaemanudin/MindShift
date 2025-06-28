
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
import { Download, Edit, Users, Video, VideoOff } from "lucide-react";

type CallState = "lobby" | "in-call" | "ended";

export default function VirtualClassroomPage() {
  const { toast } = useToast();
  const [userName, setUserName] = useState("");
  const [callState, setCallState] = useState<CallState>("lobby");
  const [notes, setNotes] = useState("");

  const {
    localVideoRef,
    remoteVideoRef,
    peer,
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
  } = useWebRTC();

  useEffect(() => {
    const savedName = localStorage.getItem("virtual-classroom-username");
    const savedNotes = localStorage.getItem("virtual-classroom-notes");
    if (savedName) setUserName(savedName);
    if (savedNotes) setNotes(savedNotes);
  }, []);

  const handleJoinCall = (name: string) => {
    setUserName(name);
    localStorage.setItem("virtual-classroom-username", name);
    actions.initialize(name);
    setCallState("in-call");
    toast({ title: "Welcome!", description: "You have entered the classroom. Use the signaling controls to connect to a peer." });
  };

  const handleEndCall = () => {
    actions.hangUp();
    setCallState("ended");
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
              <Card className="flex-grow relative bg-muted/30">
                <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-contain rounded-md" />
                {!remoteStream && (
                   <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <p>Waiting for remote user to connect...</p>
                   </div>
                )}
                 <div className="absolute top-4 right-4 w-1/4 min-w-[150px] aspect-video">
                    <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover rounded-md border-2 border-background shadow-lg" />
                    {isVideoOff && (
                        <div className="absolute inset-0 bg-black flex items-center justify-center rounded-md border-2 border-background text-white">
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
                isConnected={!!peer}
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
                <ChatPanel messages={chatMessages} onSendMessage={actions.sendMessage} />
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
                placeholder="Type your notes here..." 
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
