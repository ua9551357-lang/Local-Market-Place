'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Category, PaginatedProviders, ProviderFilters } from '@/types/provider';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<Category[]>('/categories');
      return data;
    },
  });
}

export function useProviders(filters: ProviderFilters) {
  return useQuery({
    queryKey: ['providers', filters],
    queryFn: async () => {
      const { data } = await api.get<PaginatedProviders>('/providers', {
        params: filters,
      });
      return data;
    },
  });
}