
"use client";

import { Hand, MicOff, User, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Participant {
  id: string;
  name: string;
  isHost?: boolean;
  isMuted?: boolean;
  handRaised?: boolean;
  isLocal?: boolean;
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
            { p.isLocal ? <UserCheck className="h-5 w-5 text-primary"/> : <User className="h-5 w-5 text-muted-foreground"/>}
            <span className={cn("text-sm font-medium", p.isLocal && "text-primary")}>{p.name} {p.isLocal && '(You)'}</span>
          </div>
          <div className="flex items-center gap-2">
            {p.handRaised && <Hand className="h-5 w-5 text-yellow-500" title={`${p.name} has raised their hand`} />}
            {p.isMuted && <MicOff className="h-5 w-5 text-red-500" title={`${p.name} is muted`} />}
          </div>
        </li>
      ))}
       {participants.length === 0 && (
        <li className="text-center text-sm text-muted-foreground py-4">No one is here yet.</li>
      )}
    </ul>
  );
}
