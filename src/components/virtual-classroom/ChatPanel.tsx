
"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizonal, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

export function ChatPanel({ messages, onSendMessage }: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
             viewport.scrollTop = viewport.scrollHeight;
        }
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
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col">
              <div className="flex justify-between items-baseline">
                <p className="text-sm font-semibold">{msg.sender}</p>
                <p className="text-xs text-muted-foreground">{msg.timestamp}</p>
              </div>
              <p className="text-sm bg-muted p-2 rounded-md">{msg.text}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
      <CardContent className="p-4 border-t">
        <div className="flex gap-2">
          <Input 
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} size="icon">
            <SendHorizonal />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
