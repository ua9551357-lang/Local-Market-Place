'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export function useApplyAsProvider() {
  return useMutation({
    mutationFn: async (payload: {
      categoryId: string;
      bio?: string;
      experienceYears: number;
      priceFrom: number;
      location?: string;
    }) => {
      const { data } = await api.post('/providers/apply', payload);
      return data;
    },
  });
}

export function useMyProviderProfile() {
  return useQuery({
    queryKey: ['myProviderProfile'],
    queryFn: async () => {
      const { data } = await api.get('/providers/me/profile');
      return data;
    },
  });
}

export function useProviderEarnings() {
  return useQuery({
    queryKey: ['providerEarnings'],
    queryFn: async () => {
      const { data } = await api.get('/providers/me/earnings');
      return data;
    },
  });
}

export function useProviderBookings() {
  return useQuery({
    queryKey: ['providerBookings'],
    queryFn: async () => {
      const { data } = await api.get('/bookings/provider/me');
      return data;
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.post(`/bookings/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providerBookings'] });
    },
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      categoryId: string;
      title: string;
      description?: string;
      price: number;
      durationMins: number;
    }) => {
      const { data } = await api.post('/providers/me/services', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProviderProfile'] });
    },
  });
}

export function useEarningsChart() {
  return useQuery({
    queryKey: ['earningsChart'],
    queryFn: async () => {
      const { data } = await api.get('/providers/me/earnings-chart');
      return data;
    },
  });
}

export function useUpdateProviderProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.patch('/providers/me/profile', payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myProviderProfile'] }),
  });
}

export function useUpdateNotificationPrefs() {
  return useMutation({
    mutationFn: async (payload: { notifyEmail?: boolean; notifySms?: boolean }) => {
      const { data } = await api.patch('/providers/me/notifications', payload);
      return data;
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: { currentPassword: string; newPassword: string }) => {
      const { data } = await api.patch('/auth/change-password', payload);
      return data;
    },
  });
}

export function useProviderReviews() {
  return useQuery({
    queryKey: ['myProviderReviews'],
    queryFn: async () => {
      const profile = await api.get('/providers/me/profile');
      const { data } = await api.get('/reviews', { params: { providerId: profile.data.id } });
      return data;
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      const { data } = await api.post('/providers/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['myProviderProfile'] });
      if (user) setUser({ ...user, avatarUrl: data.avatarUrl });
    },
  });
}