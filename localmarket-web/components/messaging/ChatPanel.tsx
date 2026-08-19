'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { getSocket } from '@/lib/socket';
import { useThreadMessages } from '@/hooks/useMessages';
import { useAuthStore } from '@/store/authStore';
import { Message } from '@/types/message';

export function ChatPanel({
  threadId,
  receiverId,
  receiverName,
  onBack,
}: {
  threadId: string;
  receiverId: string;
  receiverName: string;
  onBack?: () => void;
}) {
  const { user } = useAuthStore();
  const { data: initialMessages } = useThreadMessages(threadId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessages) setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit('joinThread', threadId);

    const handleNewMessage = (msg: Message) => {
      if (msg.threadId === threadId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [threadId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const socket = getSocket();
    socket.emit('sendMessage', { threadId, receiverId, body: input.trim() });
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="border-b border-neutral-200 p-4 flex items-center gap-2">
        {onBack && (
          <button onClick={onBack} className="md:hidden text-neutral-600 hover:text-neutral-900 -ml-1 p-1">
            <ArrowLeft size={18} />
          </button>
        )}
        <p className="text-sm font-semibold text-neutral-900 truncate">{receiverName}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isMine = msg.senderId === user?.id;
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] md:max-w-xs px-3 py-2 rounded-lg text-sm ${
                  isMine ? 'bg-brand-700 text-white' : 'bg-neutral-100 text-neutral-900'
                }`}
              >
                {msg.body}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-neutral-200 p-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 min-w-0 border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          onClick={handleSend}
          className="bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex-shrink-0"
        >
          Send
        </button>
      </div>
    </div>
  );
}