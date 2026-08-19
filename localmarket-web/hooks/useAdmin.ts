'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useAdminStats(month?: string) {
  return useQuery({
    queryKey: ['adminStats', month],
    queryFn: async () => {
      const { data } = await api.get('/admin/stats', { params: month ? { month } : {} });
      return data;
    },
  });
}

export async function exportBookingsCsv(month?: string) {
  const response = await api.get('/admin/export', {
    params: month ? { month } : {},
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `bookings-${month || 'all-time'}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export function useAdminUsers(role?: string) {
  return useQuery({
    queryKey: ['adminUsers', role],
    queryFn: async () => {
      const { data } = await api.get('/admin/users', { params: role ? { role } : {} });
      return data;
    },
  });
}

export function useAdminProviders() {
  return useQuery({
    queryKey: ['adminProviders'],
    queryFn: async () => {
      const { data } = await api.get('/admin/providers');
      return data;
    },
  });
}

export function useVerifyProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, verified }: { id: string; verified: boolean }) => {
      const { data } = await api.post(`/admin/providers/${id}/verify`, { verified });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProviders'] });
    },
  });
}

export function useAdminBookings() {
  return useQuery({
    queryKey: ['adminBookings'],
    queryFn: async () => {
      const { data } = await api.get('/admin/bookings');
      return data;
    },
  });
}

export function useAdminPayments() {
  return useQuery({
    queryKey: ['adminPayments'],
    queryFn: async () => {
      const { data } = await api.get('/admin/payments');
      return data;
    },
  });
}

export function useAdminReviews() {
  return useQuery({
    queryKey: ['adminReviews'],
    queryFn: async () => {
      const { data } = await api.get('/admin/reviews');
      return data;
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/reviews/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminReviews'] }),
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ['adminCategories'],
    queryFn: async () => {
      const { data } = await api.get('/admin/categories');
      return data;
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; icon?: string }) => {
      const { data } = await api.post('/admin/categories', payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminCategories'] }),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; name?: string; icon?: string }) => {
      const { data } = await api.patch(`/admin/categories/${id}`, payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminCategories'] }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/categories/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminCategories'] }),
  });
}

export function useAdminReports() {
  return useQuery({
    queryKey: ['adminReports'],
    queryFn: async () => {
      const { data } = await api.get('/admin/reports');
      return data;
    },
  });
}

export function useAdminSettings() {
  return useQuery({
    queryKey: ['adminSettings'],
    queryFn: async () => {
      const { data } = await api.get('/admin/settings');
      return data;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      platformName?: string;
      supportEmail?: string;
      contactNumber?: string;
      timezone?: string;
      currency?: string;
    }) => {
      const { data } = await api.patch('/admin/settings', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
    },
  });
}
export function useProviderApplications(status?: string) {
  return useQuery({
    queryKey: ['providerApplications', status],
    queryFn: async () => {
      const { data } = await api.get('/admin/provider-applications', { params: status ? { status } : {} });
      return data;
    },
  });
}

export function useApproveProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/admin/provider-applications/${id}/approve`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['providerApplications'] }),
  });
}

export function useRejectProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/admin/provider-applications/${id}/reject`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['providerApplications'] }),
  });
}