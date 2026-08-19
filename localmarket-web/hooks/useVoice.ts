'use client';

import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface VoiceIntentResponse {
  intent: string;
  category?: string;
  city?: string;
  nearMe?: boolean;
  redirectUrl?: string;
  message: string;
}

export function useVoiceIntent() {
  return useMutation({
    mutationFn: async (transcript: string) => {
      const { data } = await api.post<VoiceIntentResponse>('/voice/intent', { transcript });
      return data;
    },
  });
}