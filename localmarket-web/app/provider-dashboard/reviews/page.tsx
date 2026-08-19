'use client';

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ProviderSidebar } from '@/components/dashboard/ProviderSidebar';
import { useProviderReviews } from '@/hooks/useProviderOnboarding';

function ReviewsContent() {
  const { data: reviews, isLoading } = useProviderReviews();

  const avgRating = reviews?.length
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews?.filter((r: any) => r.rating === star).length || 0,
  }));
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <ProviderSidebar />
      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">Reviews</h1>
        <p className="text-sm text-neutral-400 mb-4">See what your customers say about you</p>

        {isLoading ? (
          <p className="text-sm text-neutral-400">Loading...</p>
        ) : (
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="bg-white border border-neutral-200 rounded-card p-5">
              <p className="text-4xl font-bold text-neutral-900">{avgRating}</p>
              <p className="text-warning-500 text-lg mt-1">{'★'.repeat(Math.round(Number(avgRating)))}</p>
              <p className="text-xs text-neutral-400 mt-1">({reviews?.length || 0} reviews)</p>

              <div className="mt-4 space-y-1.5">
                {distribution.map((d) => (
                  <div key={d.star} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-neutral-600">{d.star}</span>
                    <div className="flex-1 bg-neutral-100 rounded-full h-1.5">
                      <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: `${(d.count / maxCount) * 100}%` }} />
                    </div>
                    <span className="w-4 text-neutral-400">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-card p-5">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Recent Reviews</h3>
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {reviews?.length === 0 && <p className="text-xs text-neutral-400">No reviews yet.</p>}
                {reviews?.map((r: any) => (
                  <div key={r.id} className="border-b border-neutral-100 pb-3 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-semibold">
                        {r.customer.name.charAt(0)}
                      </span>
                      <p className="text-sm font-medium text-neutral-900">{r.customer.name}</p>
                      <span className="text-xs text-warning-500">{'★'.repeat(r.rating)}</span>
                      <span className="text-xs text-neutral-400 ml-auto">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    {r.comment && <p className="text-sm text-neutral-600 mt-2">{r.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProviderReviewsPage() {
  return (
    <ProtectedRoute allowedRoles={['provider']}>
      <ReviewsContent />
    </ProtectedRoute>
  );
}