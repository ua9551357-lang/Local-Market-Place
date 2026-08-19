'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { useBookingDetail } from '@/hooks/useBookingDetail';
import { useCreateReview } from '@/hooks/useReviews';
import { api } from '@/lib/api';

const statusStyles: Record<string, string> = {
  confirmed: 'bg-brand-100 text-brand-700',
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-600',
};

const steps = ['pending', 'confirmed', 'completed'];

function BookingDetailContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: booking, isLoading, refetch } = useBookingDetail(id);
  const createReview = useCreateReview();

  const [isMessaging, setIsMessaging] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleMessage = async () => {
    if (!booking) return;
    setIsMessaging(true);
    try {
      await api.post('/threads', { providerId: booking.providerId, bookingId: booking.id });
      router.push('/dashboard/messages');
    } catch {
      toast.error('Failed to open conversation');
    } finally {
      setIsMessaging(false);
    }
  };

  const handleSubmitReview = () => {
    createReview.mutate(
      { bookingId: id, rating, comment },
      {
        onSuccess: () => {
          toast.success('Review submitted');
          setShowReviewForm(false);
          refetch();
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to submit review'),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
        <DashboardSidebar />
        <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6">
          <p className="text-sm text-neutral-400">Loading...</p>
        </main>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
        <DashboardSidebar />
        <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6">
          <p className="text-sm text-neutral-400">Booking not found.</p>
        </main>
      </div>
    );
  }

  const currentStepIndex = steps.indexOf(booking.status);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <DashboardSidebar />
      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6">
        <button onClick={() => router.push('/dashboard/bookings')} className="text-xs text-brand-700 font-medium mb-3">
          ← Back to Bookings
        </button>

        <div className="grid lg:grid-cols-3 gap-4 max-w-4xl">
          {/* Main details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-neutral-200 rounded-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-bold text-neutral-900">{booking.service.title}</h1>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-pill capitalize ${statusStyles[booking.status]}`}>
                  {booking.status}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-sm font-semibold">
                  {booking.provider.user.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-medium text-neutral-900">{booking.provider.user.name}</p>
                  <p className="text-xs text-neutral-400">{booking.customer?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-neutral-400">Date</p>
                  <p className="text-neutral-900 font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400">Time</p>
                  <p className="text-neutral-900 font-medium">{booking.time}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400">Amount</p>
                  <p className="text-brand-700 font-bold">PKR {booking.amount}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400">Payment</p>
                  <p className="text-neutral-900 font-medium capitalize">
                    {booking.paymentMethod} · {booking.payment?.status || 'pending'}
                  </p>
                </div>
                {booking.address && (
                  <div className="col-span-2">
                    <p className="text-xs text-neutral-400">Address</p>
                    <p className="text-neutral-900">{booking.address}</p>
                  </div>
                )}
                {booking.issueDesc && (
                  <div className="col-span-2">
                    <p className="text-xs text-neutral-400">Issue Description</p>
                    <p className="text-neutral-900">{booking.issueDesc}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress tracker */}
            {booking.status !== 'cancelled' && (
              <div className="bg-white border border-neutral-200 rounded-card p-5">
                <h3 className="text-sm font-semibold text-neutral-900 mb-4">Status</h3>
                <div className="flex items-center">
                  {steps.map((step, i) => (
                    <div key={step} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            i <= currentStepIndex ? 'bg-brand-700 text-white' : 'bg-neutral-100 text-neutral-400'
                          }`}
                        >
                          {i < currentStepIndex ? '✓' : i + 1}
                        </div>
                        <p className="text-xs text-neutral-600 mt-1 capitalize">{step}</p>
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 ${i < currentStepIndex ? 'bg-brand-700' : 'bg-neutral-200'}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Review form (only for completed, unreviewed bookings) */}
            {booking.status === 'completed' && !booking.review && (
              <div className="bg-white border border-neutral-200 rounded-card p-5">
                {!showReviewForm ? (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="text-sm text-brand-700 font-medium"
                  >
                    ⭐ Write a review for this booking
                  </button>
                ) : (
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 mb-3">Write a Review</h3>
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setRating(star)} className="text-2xl">
                          <span className={star <= rating ? 'text-warning-500' : 'text-neutral-200'}>★</span>
                        </button>
                      ))}
                    </div>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience..."
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none mb-3"
                    />
                    <button
                      onClick={handleSubmitReview}
                      disabled={createReview.isPending}
                      className="bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg disabled:opacity-60"
                    >
                      {createReview.isPending ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {booking.status === 'completed' && booking.review && (
              <div className="bg-white border border-neutral-200 rounded-card p-5">
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">Your Review</h3>
                <p className="text-warning-500 text-sm">{'★'.repeat(booking.review.rating)}</p>
                {booking.review.comment && <p className="text-sm text-neutral-600 mt-1">{booking.review.comment}</p>}
              </div>
            )}
          </div>

          {/* Sidebar actions */}
          <div className="space-y-4">
            <div className="bg-white border border-neutral-200 rounded-card p-5">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Actions</h3>
              <button
                onClick={handleMessage}
                disabled={isMessaging}
                className="w-full border border-brand-700 text-brand-700 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-brand-50 transition-colors disabled:opacity-60"
              >
                {isMessaging ? 'Opening...' : '💬 Message Provider'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function BookingDetailPage() {
  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <BookingDetailContent />
    </ProtectedRoute>
  );
}