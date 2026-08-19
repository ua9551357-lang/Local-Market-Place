'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function usePayoutsOverview() {
  return useQuery({
    queryKey: ['payoutsOverview'],
    queryFn: async () => {
      const { data } = await api.get('/payouts/me');
      return data;
    },
  });
}

export function useAddPayoutMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { type: string; accountName: string; accountNumber: string }) => {
      const { data } = await api.post('/payouts/me/methods', payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payoutsOverview'] }),
  });
}

export function useRequestPayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { amount: number; payoutMethodId: string }) => {
      const { data } = await api.post('/payouts/me/request', payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payoutsOverview'] }),
  });
}