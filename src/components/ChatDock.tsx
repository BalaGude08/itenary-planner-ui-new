import { useState } from 'react';
import { useItineraryStore } from '@/store/itinerary.store';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export const ChatDock = () => {
  const { chatMessages, addChatMessage } = useItineraryStore();
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    addChatMessage('user', input);
    setInput('');
    
    // Mock assistant response
    setTimeout(() => {
      addChatMessage('assistant', 'I understand your request. Let me help you with that.');
    }, 500);
  };

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Trip Assistant</h2>
        <p className="text-sm text-muted-foreground">
          Ask me anything about your trip
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            Start a conversation to customize your trip
          </div>
        ) : (
          chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 border-t space-y-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your message..."
          className="min-h-[80px] resize-none"
        />
        <Button onClick={handleSend} className="w-full">
          Send
        </Button>
      </div>
    </div>
  );
};
