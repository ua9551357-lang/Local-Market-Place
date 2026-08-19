'use client';

import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Booking, CreateBookingPayload } from '@/types/booking';
import { toast } from 'sonner';

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (payload: CreateBookingPayload) => {
      const { data } = await api.post<Booking>('/bookings', payload);
      return data;
    },
    onError: () => {
      toast.error('Failed to create booking. Please try again.');
    },
  });
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { data } = await api.post('/payments', { bookingId });
      return data;
    },
  });
}