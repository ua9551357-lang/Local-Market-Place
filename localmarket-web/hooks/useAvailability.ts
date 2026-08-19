'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useMyAvailability() {
  return useQuery({
    queryKey: ['myAvailability'],
    queryFn: async () => {
      const { data } = await api.get('/availability/me');
      return data;
    },
  });
}

export function useUpdateAvailabilitySlots() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (slots: any[]) => {
      const { data } = await api.put('/availability/me', { slots });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myAvailability'] }),
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { acceptingBookings?: boolean; advanceBookingDays?: number; bufferTimeMins?: number }) => {
      const { data } = await api.patch('/availability/me/preferences', payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myAvailability'] }),
  });
}