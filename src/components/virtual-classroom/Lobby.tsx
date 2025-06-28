
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import QRCode from "qrcode.react";

interface LobbyProps {
  onJoin: (name: string) => void;
  defaultName?: string;
}

export function Lobby({ onJoin, defaultName = '' }: LobbyProps) {
  const [name, setName] = useState(defaultName);
  const [pageUrl, setPageUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPageUrl(window.location.href);
    }
  }, []);

  const handleJoin = () => {
    if (name.trim()) {
      onJoin(name.trim());
    }
  };

  return (
    <div className="flex items-center justify-center h-full p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center"><Video className="mr-2 text-primary"/> Join Virtual Classroom</CardTitle>
            <CardDescription>Enter your name to join the session. Your name will be visible to other participants.</CardDescription>
          </CardHeader>
          <CardContent>
            <Input 
              placeholder="Enter your name"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleJoin()}
              className="text-lg p-4"
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleJoin} disabled={!name.trim()} className="w-full text-lg py-6">
              Join Classroom
            </Button>
          </CardFooter>
        </Card>
        <Card className="shadow-lg">
           <CardHeader>
            <CardTitle className="text-2xl">Invite a Peer</CardTitle>
            <CardDescription>Have someone on the same network scan this QR code to join you in this classroom.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
            {pageUrl ? <QRCode value={pageUrl} size={192} bgColor="hsl(var(--background))" fgColor="hsl(var(--foreground))" /> : <p>Loading QR Code...</p>}
             <p className="text-xs text-muted-foreground break-all bg-muted p-2 rounded-md max-w-full text-center">{pageUrl || "Loading URL..."}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
