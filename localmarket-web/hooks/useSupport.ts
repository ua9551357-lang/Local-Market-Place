'use client';

import { useMutation,useQuery,useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useCreateTicket() {
  return useMutation({
    mutationFn: async (payload: { subject: string; message: string }) => {
      const { data } = await api.post('/support/tickets', payload);
      return data;
    },
  });
}
export function useAllTickets(status?: string) {
  return useQuery({
    queryKey: ['allTickets', status],
    queryFn: async () => {
      const { data } = await api.get('/support/admin/tickets', { params: status ? { status } : {} });
      return data;
    },
  });
}

export function useResolveTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/support/admin/tickets/${id}/resolve`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allTickets'] }),
  });
}