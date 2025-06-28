
"use client";

import { Button } from '@/components/ui/button';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  ScreenShareOff,
  PhoneOff,
  Hand,
  Disc,
  RectangleHorizontal,
} from 'lucide-react';

interface CallControlsProps {
  onHangUp: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
  onToggleVideo: () => void;
  isVideoOff: boolean;
  onToggleScreenShare: () => void;
  isScreenSharing: boolean;
  onToggleRecording: () => void;
  isRecording: boolean;
  onRaiseHand: () => void;
  handRaised: boolean;
  isConnected: boolean;
}

export function CallControls({
  onHangUp,
  onToggleMute,
  isMuted,
  onToggleVideo,
  isVideoOff,
  onToggleScreenShare,
  isScreenSharing,
  onToggleRecording,
  isRecording,
  onRaiseHand,
  handRaised,
  isConnected,
}: CallControlsProps) {
  return (
    <div className="flex justify-center items-center gap-2 p-4 bg-card rounded-lg shadow-lg">
      <Button variant={isMuted ? 'secondary' : 'outline'} size="icon" onClick={onToggleMute} disabled={!isConnected} aria-label={isMuted ? 'Unmute' : 'Mute'}>
        {isMuted ? <MicOff className="h-6 w-6"/> : <Mic className="h-6 w-6"/>}
      </Button>
      <Button variant={isVideoOff ? 'secondary' : 'outline'} size="icon" onClick={onToggleVideo} disabled={!isConnected} aria-label={isVideoOff ? 'Start Video' : 'Stop Video'}>
        {isVideoOff ? <VideoOff className="h-6 w-6"/> : <Video className="h-6 w-6"/>}
      </Button>
      <Button variant={isScreenSharing ? 'secondary' : 'outline'} size="icon" onClick={onToggleScreenShare} disabled={!isConnected} aria-label={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}>
        {isScreenSharing ? <ScreenShareOff className="h-6 w-6"/> : <ScreenShare className="h-6 w-6"/>}
      </Button>
      <Button variant={handRaised ? 'secondary' : 'outline'} size="icon" onClick={onRaiseHand} disabled={!isConnected} aria-label={handRaised ? 'Lower Hand' : 'Raise Hand'}>
        <Hand className="h-6 w-6"/>
      </Button>
       <Button variant={isRecording ? 'destructive' : 'outline'} size="icon" onClick={onToggleRecording} disabled={!isConnected} aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}>
         {isRecording ? <RectangleHorizontal className="h-6 w-6 animate-pulse"/> : <Disc className="h-6 w-6"/>}
      </Button>
      <Button variant="destructive" size="icon" onClick={onHangUp} disabled={!isConnected} className="ml-4" aria-label="Hang Up">
        <PhoneOff className="h-6 w-6"/>
      </Button>
    </div>
  );
}
