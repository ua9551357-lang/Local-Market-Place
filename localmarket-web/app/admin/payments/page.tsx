'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatusPill } from '@/components/admin/StatusPill';
import { Pagination } from '@/components/admin/Pagination';
import { useAdminPayments } from '@/hooks/useAdmin';

const PAGE_SIZE = 6;

function PaymentsContent() {
  const { data: payments, isLoading } = useAdminPayments();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = (payments || []).filter((p: any) =>
    p.booking.customer.name.toLowerCase().includes(search.toLowerCase()) ||
    p.booking.provider.user.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <AdminSidebar />
      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-6">Payments</h1>

        <div className="bg-white border border-neutral-200 rounded-card overflow-hidden">
          <AdminPageHeader
            title="Payments"
            subtitle="Manage all payments"
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Search payments..."
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
                    <th className="p-4">Amount</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((p: any) => (
                    <tr key={p.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                      <td className="p-4 text-neutral-900 font-medium">{p.booking.customer.name}</td>
                      <td className="p-4 text-neutral-600">{p.booking.provider.user.name}</td>
                      <td className="p-4 text-neutral-900 font-medium">PKR {p.amount}</td>
                      <td className="p-4 text-neutral-600 capitalize">{p.method}</td>
                      <td className="p-4 text-neutral-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="p-4"><StatusPill status={p.status} /></td>
                    </tr>
                  ))}
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-neutral-400 text-sm">
                        No payments found.
                      </td>
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

export default function AdminPaymentsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <PaymentsContent />
    </ProtectedRoute>
  );
}