'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/summary');
      return data;
    },
  });
}

export function useMyBookings() {
  return useQuery({
    queryKey: ['myBookings'],
    queryFn: async () => {
      const { data } = await api.get('/bookings/me');
      return data;
    },
  });
}