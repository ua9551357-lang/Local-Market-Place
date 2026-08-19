'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export function useSavedProviders() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['savedProviders'],
    queryFn: async () => {
      const { data } = await api.get('/providers/me/saved');
      return data;
    },
    enabled: !!user,
  });
}

export function useSavedProviderIds() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['savedProviderIds'],
    queryFn: async () => {
      const { data } = await api.get('/providers/me/saved-ids');
      return data as string[];
    },
    enabled: !!user,
  });
}

export function useToggleSaveProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (providerId: string) => {
      const { data } = await api.post(`/providers/${providerId}/save`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedProviders'] });
      queryClient.invalidateQueries({ queryKey: ['savedProviderIds'] });
    },
  });
}