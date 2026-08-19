'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { useMyReviews, useCreateReview } from '@/hooks/useReviews';
import { useMyBookings } from '@/hooks/useDashboard';

function WriteReviewForm() {
  const { data: bookings } = useMyBookings();
  const createReview = useCreateReview();

  const reviewableBookings = (bookings || []).filter((b: any) => b.status === 'completed' && !b.review);

  const [bookingId, setBookingId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (!bookingId) {
      toast.error('Select a completed booking to review');
      return;
    }
    createReview.mutate(
      { bookingId, rating, comment },
      {
        onSuccess: () => {
          toast.success('Review submitted');
          setBookingId('');
          setComment('');
          setRating(5);
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to submit review'),
      },
    );
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-card p-5">
      <h3 className="text-sm font-semibold text-neutral-900 mb-3">Write a Review</h3>
      <p className="text-xs text-neutral-400 mb-3">Share your experience with a provider.</p>

      {reviewableBookings.length === 0 ? (
        <p className="text-xs text-neutral-400">No completed bookings available to review right now.</p>
      ) : (
        <div className="space-y-3">
          <select
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Select a completed booking</option>
            {reviewableBookings.map((b: any) => (
              <option key={b.id} value={b.id}>{b.provider.user.name} — {b.service.title}</option>
            ))}
          </select>

          <div className="flex items-center gap-1">
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
            placeholder="Share your experience with a provider..."
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />

          <button
            onClick={handleSubmit}
            disabled={createReview.isPending}
            className="bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg disabled:opacity-60"
          >
            {createReview.isPending ? 'Submitting...' : 'Write Review'}
          </button>
        </div>
      )}
    </div>
  );
}

function ReviewsContent() {
  const { data: reviews, isLoading } = useMyReviews();

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <DashboardSidebar />
      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">My Reviews</h1>
        <p className="text-sm text-neutral-400 mb-4">Reviews you&apos;ve given to providers</p>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="bg-white border border-neutral-200 rounded-card p-5">
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Reviews You&apos;ve Written</h3>
            {isLoading ? (
              <p className="text-sm text-neutral-400">Loading...</p>
            ) : reviews?.length === 0 ? (
              <p className="text-sm text-neutral-400">You haven&apos;t written any reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r: any) => (
                  <div key={r.id} className="border-b border-neutral-100 pb-3 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-semibold">
                        {r.provider.user.name.charAt(0)}
                      </span>
                      <p className="text-sm font-medium text-neutral-900">{r.provider.user.name}</p>
                      <span className="text-xs text-warning-500 ml-auto">{'★'.repeat(r.rating)}</span>
                    </div>
                    {r.comment && <p className="text-sm text-neutral-600 mt-2">{r.comment}</p>}
                    <p className="text-xs text-neutral-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <WriteReviewForm />
        </div>
      </main>
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <ReviewsContent />
    </ProtectedRoute>
  );
}