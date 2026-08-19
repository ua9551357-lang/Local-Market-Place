'use client';

import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { AuthResponse } from '@/types/user';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'provider';
  city?: string;
  phone?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export function useSignup() {
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: SignupPayload) => {
      const { data } = await api.post<AuthResponse>('/auth/signup', payload);
      return data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      const redirectPath =
        data.user.role === 'provider' ? '/provider-dashboard' : '/dashboard';
      router.push(redirectPath);
    },
  });
}

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post<AuthResponse & { providerStatus: string | null }>('/auth/login', payload);
      return data;
    },
    onSuccess: (data) => {
      setUser(data.user);

      if (data.providerStatus === 'pending') {
        toast.info('Your provider application is still under review. We\'ll notify you once it\'s approved.', {
          duration: 6000,
        });
        router.push('/dashboard');
        return;
      }

      if (data.providerStatus === 'rejected') {
        toast.error('Your provider application was not approved. Contact support for details.', {
          duration: 6000,
        });
        router.push('/dashboard');
        return;
      }

      const redirectPath =
        data.user.role === 'provider'
          ? '/provider-dashboard'
          : data.user.role === 'admin'
            ? '/admin'
            : '/dashboard';
      router.push(redirectPath);
    },
  });
}

export function useLogout() {
  const clearUser = useAuthStore((s) => s.clearUser);
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      clearUser();
      queryClient.clear();
      router.push('/login');
    },
  });
}
export function useCurrentUser() {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
        return data;
      } catch {
        setLoading(false);
        return null;
      }
    },
    retry: false,
  });
}