
"use client";

import { Hand, MicOff, User } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  isHost?: boolean;
  isMuted?: boolean;
  handRaised?: boolean;
}

interface AttendanceListProps {
  participants: Participant[];
}

export function AttendanceList({ participants }: AttendanceListProps) {
  return (
    <ul className="space-y-3">
      {participants.map(p => (
        <li key={p.id} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground"/>
            <span className="text-sm font-medium">{p.name} {p.isHost && '(Host)'}</span>
          </div>
          <div className="flex items-center gap-2">
            {p.handRaised && <Hand className="h-5 w-5 text-yellow-500" />}
            {p.isMuted && <MicOff className="h-5 w-5 text-red-500" />}
          </div>
        </li>
      ))}
    </ul>
  );
}
