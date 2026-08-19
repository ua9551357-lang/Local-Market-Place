'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { useVoiceIntent } from '@/hooks/useVoice';

interface ConversationMessage {
  role: 'user' | 'assistant';
  text: string;
}

export function VoiceWidget() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const { isListening, isSupported, startListening } = useVoiceRecognition();
  const voiceIntent = useVoiceIntent();

  // Only show the floating voice assistant on the provider apply page
  if (pathname !== '/for-providers/apply') return null;

  const handleMicClick = () => {
    if (!isSupported) {
      alert('Voice recognition is not supported in this browser. Try Chrome.');
      return;
    }

    startListening(async (text) => {
      setMessages((prev) => [...prev, { role: 'user', text }]);

      const result = await voiceIntent.mutateAsync(text);
      setMessages((prev) => [...prev, { role: 'assistant', text: result.message }]);

      if (result.redirectUrl) {
        setTimeout(() => {
          router.push(result.redirectUrl!);
          setIsOpen(false);
        }, 1200);
      }
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-brand-700 hover:bg-brand-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-cardHover transition-colors z-50"
      >
        🎙️
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 bg-brand-900 text-white rounded-2xl p-4 w-80 shadow-cardHover z-50">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-semibold">Voice Assistant</p>
          <p className="text-xs text-brand-100 mt-0.5">How can I help you today?</p>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-brand-100 hover:text-white text-sm">
          ✕
        </button>
      </div>

      <div className="max-h-48 overflow-y-auto space-y-2 my-3">
        {messages.length === 0 && (
          <div className="text-xs text-brand-100">
            <p>Try saying:</p>
            <p className="mt-1 italic">"I need a plumber near me"</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-sm px-3 py-2 rounded-lg ${
              msg.role === 'user' ? 'bg-white/10 ml-4' : 'bg-brand-50 text-neutral-900 mr-4'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <button
        onClick={handleMicClick}
        disabled={isListening || voiceIntent.isPending}
        className={`w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center mx-auto transition-transform ${
          isListening ? 'animate-pulse scale-110' : ''
        }`}
      >
        🎙️
      </button>
      <p className="text-center text-xs text-brand-100 mt-2">
        {isListening ? 'AI is listening...' : voiceIntent.isPending ? 'Thinking...' : 'Tap to speak'}
      </p>
    </div>
  );
}