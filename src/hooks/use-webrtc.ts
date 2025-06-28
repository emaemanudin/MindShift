
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useToast } from "./use-toast";
import { saveAs } from "file-saver";

// Types
interface Participant {
  id: string;
  name: string;
  isHost?: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

interface DataChannelMessage {
  type: "chat" | "hand-raise" | "mute-request" | "name-update";
  payload: any;
}

const PC_CONFIG: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export function useWebRTC() {
  const { toast } = useToast();
  
  // Refs for core WebRTC objects and media
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  // State variables
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [connectionTime, setConnectionTime] = useState<{start: number | null, end: number | null}>({start: null, end: null});
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [localUsername, setLocalUsername] = useState("");

  const sendData = useCallback((message: DataChannelMessage) => {
    if (dataChannelRef.current?.readyState === "open") {
      dataChannelRef.current.send(JSON.stringify(message));
    }
  }, []);

  const handleDataChannelMessage = (event: MessageEvent) => {
    const msg: DataChannelMessage = JSON.parse(event.data);
    switch (msg.type) {
      case "chat":
        setChatMessages((prev) => [...prev, msg.payload]);
        break;
      case "hand-raise":
        setParticipants(prev => prev.map(p => p.id === 'remote' ? {...p, handRaised: msg.payload.raised} : p));
        toast({ title: "Notification", description: `${msg.payload.name} ${msg.payload.raised ? 'raised' : 'lowered'} their hand.` });
        break;
      case "mute-request":
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => track.enabled = false);
            setIsMuted(true);
            toast({ title: "Host Action", description: "The host has muted you." });
        }
        break;
       case "name-update":
        setParticipants(prev => prev.map(p => p.id === 'remote' ? {...p, name: msg.payload.name} : p));
        break;
    }
  };

  const setupDataChannel = useCallback((pc: RTCPeerConnection) => {
    const channel = pc.createDataChannel("chat");
    channel.onmessage = handleDataChannelMessage;
    channel.onopen = () => {
      sendData({ type: 'name-update', payload: { name: localUsername }});
    };
    dataChannelRef.current = channel;

    pc.ondatachannel = (event) => {
      const receiveChannel = event.channel;
      receiveChannel.onmessage = handleDataChannelMessage;
      dataChannelRef.current = receiveChannel;
    };
  }, [localUsername, sendData]);

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(PC_CONFIG);
    
    setupDataChannel(pc);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // In a real app, this would be sent to the signaling server
        console.log("ICE Candidate:", JSON.stringify(event.candidate));
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
    
    pc.onconnectionstatechange = () => {
        if(pc.connectionState === 'connected') {
            setConnectionTime(prev => ({...prev, start: Date.now()}));
            toast({ title: "Success!", description: "Peer connection established."});
            setParticipants(prev => [...prev, {id: 'remote', name: 'Remote User'}]);
        }
        if(pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
            setRemoteStream(null);
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        }
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    peerRef.current = pc;
    return pc;
  }, [setupDataChannel, toast]);
  
  const initialize = useCallback(async (name: string) => {
    setLocalUsername(name);
    setParticipants([{ id: 'local', name }]);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Media Error", description: "Could not access camera/microphone." });
      console.error("Media device error:", error);
    }
  }, [toast]);
  
  const hangUp = useCallback(() => {
    // Stop all streams
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    screenStreamRef.current?.getTracks().forEach(track => track.stop());
    
    // Stop recording if active
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    
    // Close peer connection
    peerRef.current?.close();

    // Reset state
    setLocalStream(null);
    setRemoteStream(null);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsScreenSharing(false);
    setIsRecording(false);
    setHandRaised(false);
    setChatMessages([]);
    peerRef.current = null;
    dataChannelRef.current = null;
    setConnectionTime(prev => ({...prev, end: Date.now()}));
  }, []);

  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => track.enabled = !track.enabled);
      setIsMuted(prev => !prev);
    }
  }, []);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => track.enabled = !track.enabled);
      setIsVideoOff(prev => !prev);
    }
  }, []);

  const toggleScreenShare = useCallback(async () => {
    const videoSender = peerRef.current?.getSenders().find(s => s.track?.kind === 'video');
    if (!videoSender) return;

    if (isScreenSharing) {
        // Stop screen share
        screenStreamRef.current?.getTracks().forEach(track => track.stop());
        const camTrack = localStreamRef.current?.getVideoTracks()[0];
        if (camTrack) {
            videoSender.replaceTrack(camTrack);
        }
        setIsScreenSharing(false);
        screenStreamRef.current = null;
    } else {
        // Start screen share
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const screenTrack = stream.getVideoTracks()[0];
            videoSender.replaceTrack(screenTrack);
            screenStreamRef.current = stream;
            setIsScreenSharing(true);
            screenTrack.onended = () => { // User clicked "Stop sharing" in browser UI
                 const camTrack = localStreamRef.current?.getVideoTracks()[0];
                 if(camTrack) videoSender.replaceTrack(camTrack);
                 setIsScreenSharing(false);
            };
        } catch (error) {
            toast({ variant: "destructive", title: "Screen Share Failed" });
            console.error("Screen share error", error);
        }
    }
  }, [isScreenSharing, toast]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
        const streamToRecord = screenStreamRef.current || remoteStream || localStream;
        if (!streamToRecord) {
            toast({variant: "destructive", title: "Recording Error", description: "No stream available to record."});
            return;
        }
        
        const recordedChunks: Blob[] = [];
        const combinedStream = new MediaStream([
            ...streamToRecord.getVideoTracks(),
            ...(localStreamRef.current?.getAudioTracks() || [])
        ]);
        
        mediaRecorderRef.current = new MediaRecorder(combinedStream, { mimeType: "video/webm" });

        mediaRecorderRef.current.ondataavailable = (e) => {
            if (e.data.size > 0) recordedChunks.push(e.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(recordedChunks, { type: "video/webm" });
            saveAs(blob, `mindshift-recording-${Date.now()}.webm`);
        };
        
        mediaRecorderRef.current.start();
        setIsRecording(true);
        toast({ title: "Recording Started", description: "The session is now being recorded locally." });
    }
  }, [isRecording, remoteStream, localStream, toast]);

  const raiseHand = useCallback(() => {
    const newHandRaisedState = !handRaised;
    setHandRaised(newHandRaisedState);
    sendData({ type: "hand-raise", payload: { raised: newHandRaisedState, name: localUsername } });
  }, [handRaised, localUsername, sendData]);

  const sendMessage = useCallback((text: string) => {
    const message = {
        id: crypto.randomUUID(),
        sender: localUsername,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    sendData({ type: "chat", payload: message });
    setChatMessages(prev => [...prev, message]); // Add to own chat immediately
  }, [localUsername, sendData]);

  return {
    localVideoRef,
    remoteVideoRef,
    peer: peerRef.current,
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
    actions: {
      initialize,
      createPeerConnection,
      setupDataChannel,
      hangUp,
      toggleMute,
      toggleVideo,
      toggleScreenShare,
      toggleRecording,
      raiseHand,
      sendMessage
    },
  };
}
