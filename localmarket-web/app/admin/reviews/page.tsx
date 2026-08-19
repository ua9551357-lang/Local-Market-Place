'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Pagination } from '@/components/admin/Pagination';
import { useAdminReviews, useDeleteReview } from '@/hooks/useAdmin';

const PAGE_SIZE = 6;

function ReviewsContent() {
  const { data: reviews, isLoading } = useAdminReviews();
  const deleteMutation = useDeleteReview();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = (reviews || []).filter((r: any) =>
    r.customer.name.toLowerCase().includes(search.toLowerCase()) ||
    r.provider.user.name.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (id: string) => {
    if (confirm('Delete this review?')) {
      deleteMutation.mutate(id, { onSuccess: () => toast.success('Review deleted') });
    }
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <AdminSidebar />
      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-6">Reviews</h1>

        <div className="bg-white border border-neutral-200 rounded-card overflow-hidden">
          <AdminPageHeader
            title="Reviews"
            subtitle="Manage user reviews"
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Search reviews..."
          />

          {isLoading ? (
            <p className="text-sm text-neutral-400 p-5">Loading...</p>
          ) : (
            <>
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="text-xs text-neutral-400 text-left border-b border-neutral-100">
                    <th className="p-4">Customer</th>
                    <th className="p-4">Provider</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Comment</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((r: any) => (
                    <tr key={r.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                      <td className="p-4 text-neutral-900 font-medium">{r.customer.name}</td>
                      <td className="p-4 text-neutral-600">{r.provider.user.name}</td>
                      <td className="p-4 text-warning-500">{'★'.repeat(r.rating)}</td>
                      <td className="p-4 text-neutral-600 max-w-xs truncate">{r.comment || '—'}</td>
                      <td className="p-4 text-neutral-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="text-xs text-danger-500 font-medium hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-neutral-400 text-sm">No reviews found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AdminReviewsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <ReviewsContent />
    </ProtectedRoute>
  );
}