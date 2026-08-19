'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useMyReviews() {
  return useQuery({
    queryKey: ['myReviews'],
    queryFn: async () => {
      const { data } = await api.get('/reviews/my');
      return data;
    },
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { bookingId: string; rating: number; comment?: string }) => {
      const { data } = await api.post('/reviews', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myReviews'] });
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
    },
  });
}