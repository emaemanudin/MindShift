
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useToast } from "./use-toast";
import { saveAs } from "file-saver";
import type { ChatMessage } from "@/components/virtual-classroom/ChatPanel";

interface Participant {
  id: string;
  name: string;
  isHost?: boolean;
  isMuted?: boolean;
  handRaised?: boolean;
  isLocal?: boolean;
}

interface DataChannelMessage {
  type: "chat" | "hand-raise" | "name-update";
  payload: any;
}

const PC_CONFIG: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export function useWebRTC(userName: string, onPeerConnected: () => void) {
  const { toast } = useToast();
  
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  
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

  const sendData = useCallback((message: DataChannelMessage) => {
    if (dataChannelRef.current?.readyState === "open") {
      dataChannelRef.current.send(JSON.stringify(message));
    }
  }, []);

  const handleDataChannelMessage = useCallback((event: MessageEvent) => {
    const msg: DataChannelMessage = JSON.parse(event.data);
    switch (msg.type) {
      case "chat":
        setChatMessages((prev) => [...prev, msg.payload]);
        break;
      case "hand-raise":
        setParticipants(prev => prev.map(p => p.id === 'remote' ? {...p, handRaised: msg.payload.raised} : p));
        toast({ title: "Notification", description: `${msg.payload.name} ${msg.payload.raised ? 'raised' : 'lowered'} their hand.` });
        break;
      case "name-update":
        setParticipants(prev => {
          const remoteUserExists = prev.some(p => p.id === 'remote');
          if (remoteUserExists) {
            return prev.map(p => p.id === 'remote' ? {...p, name: msg.payload.name} : p);
          }
          return [...prev, { id: 'remote', name: msg.payload.name, isLocal: false }];
        });
        break;
    }
  }, [toast]);
  
  const setupDataChannel = useCallback((pc: RTCPeerConnection) => {
    pc.ondatachannel = (event) => {
      dataChannelRef.current = event.channel;
      dataChannelRef.current.onmessage = handleDataChannelMessage;
      dataChannelRef.current.onopen = () => {
        sendData({ type: 'name-update', payload: { name: userName }});
        onPeerConnected();
      };
    };
  }, [handleDataChannelMessage, onPeerConnected, sendData, userName]);
  
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(PC_CONFIG);
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ICE Candidate (send to peer):", JSON.stringify(event.candidate));
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
        }
        if(pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
            setRemoteStream(null);
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        }
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    peerRef.current = pc;
    setupDataChannel(pc);
    return pc;
  }, [setupDataChannel, toast]);
  
  const initializeStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setParticipants([{ id: 'local', name: userName, isLocal: true }]);
    } catch (error) {
      toast({ variant: "destructive", title: "Media Error", description: "Could not access camera/microphone." });
      console.error("Media device error:", error);
    }
  }, [toast, userName]);
  
  const createOffer = useCallback(async () => {
    const pc = createPeerConnection();
    const dataChannel = pc.createDataChannel("chat");
    dataChannel.onmessage = handleDataChannelMessage;
    dataChannel.onopen = () => {
      sendData({ type: 'name-update', payload: { name: userName }});
      onPeerConnected();
    };
    dataChannelRef.current = dataChannel;
    
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return offer;
  }, [createPeerConnection, handleDataChannelMessage, onPeerConnected, sendData, userName]);
  
  const createAnswer = useCallback(async (offer: RTCSessionDescriptionInit) => {
    const pc = createPeerConnection();
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return answer;
  }, [createPeerConnection]);

  const addAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
    if (peerRef.current && peerRef.current.signalingState !== 'stable') {
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }, []);

  const hangUp = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    screenStreamRef.current?.getTracks().forEach(track => track.stop());
    peerRef.current?.close();
    setLocalStream(null);
    setRemoteStream(null);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsScreenSharing(false);
    setParticipants([]);
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
        screenStreamRef.current?.getTracks().forEach(track => track.stop());
        const camTrack = localStreamRef.current?.getVideoTracks()[0];
        if (camTrack) await videoSender.replaceTrack(camTrack);
        setIsScreenSharing(false);
        screenStreamRef.current = null;
    } else {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            const screenTrack = stream.getVideoTracks()[0];
            await videoSender.replaceTrack(screenTrack);
            screenStreamRef.current = stream;
            setIsScreenSharing(true);
            screenTrack.onended = () => toggleScreenShare(); // Call again to revert
        } catch (error) {
            toast({ variant: "destructive", title: "Screen Share Failed" });
            console.error("Screen share error", error);
        }
    }
  }, [isScreenSharing, toast]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      toast({ title: "Recording Stopped", description: "Your recording is being prepared for download." });
    } else {
        const streamToRecord = remoteStream || localStream;
        if (!streamToRecord) {
            toast({variant: "destructive", title: "Recording Error", description: "No stream available to record."});
            return;
        }
        
        const audioTracks = [
            ...(localStreamRef.current?.getAudioTracks() || []),
            ...(remoteStream?.getAudioTracks() || [])
        ];
        const combinedStream = new MediaStream([ ...streamToRecord.getVideoTracks(), ...audioTracks ]);
        
        mediaRecorderRef.current = new MediaRecorder(combinedStream, { mimeType: "video/webm" });

        mediaRecorderRef.current.ondataavailable = (e) => {
            if (e.data.size > 0) recordedChunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
            saveAs(blob, `mindshift-recording-${Date.now()}.webm`);
            recordedChunksRef.current = [];
            setIsRecording(false);
        };
        
        mediaRecorderRef.current.start(1000); // 1s timeslice
        setIsRecording(true);
        toast({ title: "Recording Started", description: "The session is now being recorded locally." });
    }
  }, [isRecording, remoteStream, localStream, toast]);

  const raiseHand = useCallback(() => {
    const newHandRaisedState = !handRaised;
    setHandRaised(newHandRaisedState);
    sendData({ type: "hand-raise", payload: { raised: newHandRaisedState, name: userName } });
  }, [handRaised, userName, sendData]);

  const sendMessage = useCallback((text: string) => {
    const message = {
        id: crypto.randomUUID(),
        sender: 'You',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    sendData({ type: "chat", payload: {...message, sender: userName} });
    setChatMessages(prev => [...prev, message]);
  }, [userName, sendData]);

  return {
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
    actions: {
      initializeStream, createOffer, createAnswer, addAnswer, hangUp,
      toggleMute, toggleVideo, toggleScreenShare, toggleRecording,
      raiseHand, sendMessage
    },
  };
}
