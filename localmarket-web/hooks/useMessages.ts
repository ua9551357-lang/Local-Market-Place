'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Thread, Message } from '@/types/message';

export function useThreads() {
  return useQuery({
    queryKey: ['threads'],
    queryFn: async () => {
      const { data } = await api.get<Thread[]>('/threads');
      return data;
    },
  });
}

export function useThreadMessages(threadId: string) {
  return useQuery({
    queryKey: ['messages', threadId],
    queryFn: async () => {
      const { data } = await api.get<Message[]>('/messages', { params: { threadId } });
      return data;
    },
    enabled: !!threadId,
  });
}