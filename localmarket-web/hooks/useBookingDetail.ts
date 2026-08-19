'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useBookingDetail(id: string) {
  return useQuery({
    queryKey: ['bookingDetail', id],
    queryFn: async () => {
      const { data } = await api.get(`/bookings/${id}`);
      return data;
    },
    enabled: !!id,
  });
}