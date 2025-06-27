
"use client";

import { useState, useRef, useEffect } from 'react';
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Copy, Users, Video, Mic, Info, CheckCircle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

// Configuration for the RTCPeerConnection, using a public Google STUN server.
const pcConfig = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

export default function P2PVideoChatPage() {
  const { toast } = useToast();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const [offerSdp, setOfferSdp] = useState('');
  const [answerSdp, setAnswerSdp] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);

  // 1. Get user media (camera and microphone)
  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        localStreamRef.current = stream;
        setHasPermissions(true);
        setIsReady(true);
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
  }, [toast]);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(pcConfig);

    pc.onicecandidate = (event) => {
        if (event.candidate) {
            // In a real app, this candidate would be sent to the other peer via the signaling server.
            // For this demo, we let the browser handle it automatically after exchanging offer/answer.
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
        if(pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
            setIsConnected(false);
        }
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    return pc;
  };

  // 2. Peer 1: Create an offer
  const handleCreateOffer = async () => {
    if (!isReady) return;
    peerConnectionRef.current = createPeerConnection();
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    setOfferSdp(JSON.stringify(peerConnectionRef.current.localDescription));
    toast({ title: "Offer Created", description: "Copy the offer text and send it to the other user."});
  };

  // 3. Peer 2: Create an answer
  const handleCreateAnswer = async () => {
    if (!isReady || !offerSdp) return;
    peerConnectionRef.current = createPeerConnection();
    try {
        const offer = JSON.parse(offerSdp);
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        setAnswerSdp(JSON.stringify(peerConnectionRef.current.localDescription));
        toast({ title: "Answer Created", description: "Copy the answer text and send it back to the first user."});
    } catch(e) {
        console.error(e);
        toast({ variant: "destructive", title: "Error", description: "Invalid offer format. Please ensure you copied correctly." });
    }
  };

  // 4. Peer 1: Add the answer
  const handleAddAnswer = async () => {
    if (!peerConnectionRef.current || !answerSdp) return;
     try {
        const answer = JSON.parse(answerSdp);
        if (!peerConnectionRef.current.currentRemoteDescription) {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        }
    } catch(e) {
        console.error(e);
        toast({ variant: "destructive", title: "Error", description: "Invalid answer format. Please ensure you copied correctly." });
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Text copied to clipboard." });
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center">
                    <Users className="mr-3 h-8 w-8 text-primary" />
                    P2P Video Chat Demo
                </h1>
                <p className="text-muted-foreground mt-1">
                    A live demo of WebRTC for one-to-one video calls using manual signaling.
                </p>
            </div>
        </div>

        {!hasPermissions && hasPermissions !== null && (
            <Alert variant="destructive">
              <Mic className="h-4 w-4"/>
              <AlertTitle>Permissions Required</AlertTitle>
              <AlertDescription>
                This feature requires access to your camera and microphone. Please grant permission in your browser when prompted.
              </AlertDescription>
            </Alert>
        )}
        
        {isConnected && (
            <Alert variant="default" className="bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400">
                <CheckCircle className="h-4 w-4 text-green-500"/>
                <AlertTitle>Connection Successful!</AlertTitle>
                <AlertDescription>
                   You are now connected to the other peer.
                </AlertDescription>
            </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Your Video</CardTitle></CardHeader>
            <CardContent>
              <video ref={localVideoRef} autoPlay playsInline muted className="w-full rounded-md bg-black aspect-video"></video>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Remote Video</CardTitle></CardHeader>
            <CardContent>
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full rounded-md bg-black aspect-video"></video>
            </CardContent>
          </Card>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Signaling Instructions</CardTitle>
                <CardDescription>Follow these steps on two different browser windows/tabs to connect.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <h3 className="font-semibold">Step 1: User 1 Creates an Offer</h3>
                    <Button onClick={handleCreateOffer} disabled={!isReady}>Create Offer</Button>
                </div>
                
                <div className="space-y-2">
                    <h3 className="font-semibold">Step 2: User 1 Copies Offer & User 2 Pastes It</h3>
                    <p className="text-sm text-muted-foreground">User 1, copy the text below. User 2, paste it into the "Paste Offer Here" box in your window.</p>
                    <div className="relative">
                        <Textarea readOnly value={offerSdp} placeholder="Offer SDP will appear here..." className="pr-12"/>
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => copyToClipboard(offerSdp)}><Copy className="h-4 w-4"/></Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold">Step 3: User 2 Creates an Answer</h3>
                    <p className="text-sm text-muted-foreground">User 2, paste the offer text from User 1 here, then click "Create Answer".</p>
                    <Textarea value={offerSdp} onChange={(e) => setOfferSdp(e.target.value)} placeholder="Paste Offer Here..."/>
                    <Button onClick={handleCreateAnswer} disabled={!isReady || !offerSdp.trim()}>Create Answer</Button>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold">Step 4: User 2 Copies Answer & User 1 Pastes It</h3>
                     <p className="text-sm text-muted-foreground">User 2, copy the text below. User 1, paste it into the "Paste Answer Here" box in your window.</p>
                     <div className="relative">
                        <Textarea readOnly value={answerSdp} placeholder="Answer SDP will appear here..." className="pr-12"/>
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => copyToClipboard(answerSdp)}><Copy className="h-4 w-4"/></Button>
                     </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold">Step 5: User 1 Finalizes Connection</h3>
                    <p className="text-sm text-muted-foreground">User 1, paste the answer from User 2 here, then click "Add Answer" to connect.</p>
                    <Textarea value={answerSdp} onChange={(e) => setAnswerSdp(e.target.value)} placeholder="Paste Answer Here..." />
                    <Button onClick={handleAddAnswer} disabled={!answerSdp.trim()}>Add Answer & Connect</Button>
                </div>

            </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
