'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export function useNotifications() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await api.get('/notifications');
      return data;
    },
    enabled: !!user,
    refetchInterval: 15000, // poll every 15s
  });
}

export function useUnreadCount() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['unreadCount'],
    queryFn: async () => {
      const { data } = await api.get('/notifications/unread-count');
      return data;
    },
    enabled: !!user,
    refetchInterval: 15000,
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.post('/notifications/mark-read');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}