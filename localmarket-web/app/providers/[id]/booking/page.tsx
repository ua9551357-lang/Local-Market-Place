'use client';

import { useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useProviderDetail } from '@/hooks/useProviderDetail';
import { useCreateBooking, useCreatePayment } from '@/hooks/useBookings';

export default function BookingPage() {
  const { id: providerId } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const serviceId = searchParams.get('serviceId') || '';
  const date = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';
  const issueDesc = searchParams.get('issueDesc') || '';

  const { data: provider } = useProviderDetail(providerId);
  const service = provider?.services.find((s) => s.id === serviceId);

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
  const [confirmedBooking, setConfirmedBooking] = useState<string | null>(null);

  const createBooking = useCreateBooking();
  const createPayment = useCreatePayment();

  const handleConfirm = async () => {
    if (!service) return;

    const booking = await createBooking.mutateAsync({
      providerId,
      serviceId,
      date,
      time,
      issueDesc,
      amount: Number(service.price),
      paymentMethod,
    });

    await createPayment.mutateAsync(booking.id);

    setConfirmedBooking(booking.id);
  };

  if (confirmedBooking) {
    return (
      <>
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-3xl mx-auto mb-4">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Booking Confirmed!</h1>
          <p className="text-sm text-neutral-600 mt-2">
            Your booking has been created successfully. You'll receive a confirmation shortly.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-6 bg-brand-700 hover:bg-brand-600 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
        </main>
        <Footer />
      </>
    );
  }

  if (!provider || !service) {
    return (
      <>
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-20 text-sm text-neutral-400">Loading booking details...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 md:px-6 py-8">
        <p className="text-sm text-neutral-400 mb-4">
          Home &gt; {provider.user.name} &gt; Booking Summary
        </p>

        {/* Booking Summary */}
        <div className="bg-white border border-neutral-200 rounded-card p-5 mb-4">
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">Booking Summary</h3>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm">
              {provider.user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">{provider.user.name}</p>
              <p className="text-xs text-neutral-400">{provider.category.name}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Date</span>
              <span className="text-neutral-900 font-medium">{date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Time</span>
              <span className="text-neutral-900 font-medium">{time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Service</span>
              <span className="text-neutral-900 font-medium">{service.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Amount</span>
              <span className="text-brand-700 font-bold">PKR {service.price}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white border border-neutral-200 rounded-card p-5 mb-4">
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">Payment Method</h3>
          <div className="space-y-3">
            <label
              className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer transition-colors ${
                paymentMethod === 'cash' ? 'border-brand-700 bg-brand-50' : 'border-neutral-200'
              }`}
            >
              <input
                type="radio"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
                className="text-brand-700 focus:ring-brand-500"
              />
              <div>
                <p className="text-sm font-medium text-neutral-900">Cash on Service</p>
                <p className="text-xs text-neutral-400">Pay after service completion</p>
              </div>
            </label>

            <label
              className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer transition-colors ${
                paymentMethod === 'online' ? 'border-brand-700 bg-brand-50' : 'border-neutral-200'
              }`}
            >
              <input
                type="radio"
                checked={paymentMethod === 'online'}
                onChange={() => setPaymentMethod('online')}
                className="text-brand-700 focus:ring-brand-500"
              />
              <div>
                <p className="text-sm font-medium text-neutral-900">Online Payment</p>
                <p className="text-xs text-neutral-400">Pay securely online — Visa, Mastercard, Easypaisa</p>
              </div>
            </label>
          </div>
        </div>

        {/* Total + Confirm */}
        <div className="bg-white border border-neutral-200 rounded-card p-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-neutral-900">Total Amount</span>
            <span className="text-lg font-bold text-brand-700">PKR {service.price}</span>
          </div>

          {(createBooking.isError || createPayment.isError) && (
            <p className="text-xs text-danger-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
              Something went wrong. Please try again.
            </p>
          )}

          <button
            onClick={handleConfirm}
            disabled={createBooking.isPending || createPayment.isPending}
            className="w-full bg-brand-700 hover:bg-brand-600 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {createBooking.isPending || createPayment.isPending
              ? 'Confirming...'
              : 'Confirm Booking'}
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}