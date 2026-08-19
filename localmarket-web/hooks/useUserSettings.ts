'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useMyAccount() {
  return useQuery({
    queryKey: ['myAccount'],
    queryFn: async () => {
      const { data } = await api.get('/users/me');
      return data;
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name?: string; phone?: string; city?: string }) => {
      const { data } = await api.patch('/users/me', payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myAccount'] }),
  });
}

export function useUpdateNotificationPrefs() {
  return useMutation({
    mutationFn: async (payload: { notifyEmail?: boolean; notifySms?: boolean }) => {
      const { data } = await api.patch('/users/me/notifications', payload);
      return data;
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: { currentPassword: string; newPassword: string }) => {
      const { data } = await api.patch('/auth/change-password', payload);
      return data;
    },
  });
}