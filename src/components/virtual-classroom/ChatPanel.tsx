
"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizonal, MessageSquare } from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export function ChatPanel({ messages, onSendMessage, disabled = false }: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <Card className="flex flex-col flex-grow">
      <CardHeader>
        <CardTitle className="flex items-center text-lg"><MessageSquare className="mr-2"/>Chat</CardTitle>
      </CardHeader>
      <ScrollArea className="flex-grow p-4 bg-muted/20" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col">
              <div className="flex justify-between items-baseline">
                <p className="text-sm font-semibold">{msg.sender}</p>
                <p className="text-xs text-muted-foreground">{msg.timestamp}</p>
              </div>
              <p className="text-sm bg-background p-2 rounded-md border">{msg.text}</p>
            </div>
          ))}
           {messages.length === 0 && (
            <div className="text-center text-sm text-muted-foreground pt-10">
                {disabled ? "Connect to a peer to enable chat." : "No messages yet."}
            </div>
           )}
        </div>
      </ScrollArea>
      <CardContent className="p-4 border-t">
        <div className="flex gap-2">
          <Input 
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={disabled}
          />
          <Button onClick={handleSend} size="icon" disabled={disabled || !newMessage.trim()}>
            <SendHorizonal />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
