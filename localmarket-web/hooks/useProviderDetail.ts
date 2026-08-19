'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ProviderDetail, Review } from '@/types/provider';

export function useProviderDetail(id: string) {
  return useQuery({
    queryKey: ['provider', id],
    queryFn: async () => {
      const { data } = await api.get<ProviderDetail>(`/providers/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useProviderReviews(providerId: string) {
  return useQuery({
    queryKey: ['reviews', providerId],
    queryFn: async () => {
      const { data } = await api.get<Review[]>('/reviews', { params: { providerId } });
      return data;
    },
    enabled: !!providerId,
  });
}