'use client';

import { Mic } from 'lucide-react';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';

export function VoiceFillButton({ onResult }: { onResult: (text: string) => void }) {
  const { isListening, isSupported, startListening } = useVoiceRecognition();

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={() => startListening(onResult)}
      title="Fill this field with your voice"
      className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-colors flex-shrink-0 ${
        isListening
          ? 'bg-brand-700 border-brand-700 text-white animate-pulse'
          : 'border-neutral-200 text-neutral-400 hover:text-brand-700 hover:border-brand-300'
      }`}
    >
      <Mic className="w-4 h-4" />
    </button>
  );
}