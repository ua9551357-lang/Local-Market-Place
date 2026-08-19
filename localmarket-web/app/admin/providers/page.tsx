'use client';

import { useMemo, useState } from 'react';
import { Search, UserPlus, MoreVertical, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useAdminProviders, useVerifyProvider } from '@/hooks/useAdmin';

const AVATAR_BG = [
  'bg-brand-100 text-brand-700',
  'bg-amber-100 text-amber-700',
  'bg-blue-100 text-blue-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
];

const PAGE_SIZE = 6;

function initials(name = '') {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

/** Maps the provider's verified boolean (or an optional status field) to one of 3 states. */
function resolveStatus(p: any): 'approved' | 'pending' | 'rejected' {
  if (p.status) return p.status.toLowerCase();
  return p.verified ? 'approved' : 'pending';
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    approved: 'bg-brand-100 text-brand-700',
    pending: 'bg-amber-100 text-amber-700',
    rejected: 'bg-red-100 text-red-600',
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-pill capitalize ${styles[status] ?? styles.pending}`}>
      {status}
    </span>
  );
}

function ProvidersContent() {
  const { data: providers, isLoading } = useAdminProviders();
  const verifyMutation = useVerifyProvider();
  const [tab, setTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const withStatus = useMemo(
    () => (providers ?? []).map((p: any) => ({ ...p, _status: resolveStatus(p) })),
    [providers]
  );

  const counts = useMemo(
    () => ({
      all: withStatus.length,
      pending: withStatus.filter((p: any) => p._status === 'pending').length,
      approved: withStatus.filter((p: any) => p._status === 'approved').length,
      rejected: withStatus.filter((p: any) => p._status === 'rejected').length,
    }),
    [withStatus]
  );

  const filtered = useMemo(() => {
    return withStatus
      .filter((p: any) => (tab === 'all' ? true : p._status === tab))
      .filter((p: any) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return p.user?.name?.toLowerCase().includes(q) || p.category?.name?.toLowerCase().includes(q);
      });
  }, [withStatus, tab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const tabs: { key: typeof tab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'pending', label: 'Pending', count: counts.pending },
    { key: 'approved', label: 'Approved', count: counts.approved },
    { key: 'rejected', label: 'Rejected', count: counts.rejected },
  ];

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <AdminSidebar adminName="Admin" adminRole="Super Admin" />

      <main className="flex-1 h-full overflow-hidden flex flex-col p-4 lg:p-6 gap-4">
        {/* Header */}
        <div className="shrink-0">
          <h1 className="text-2xl font-bold text-neutral-900">Providers</h1>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-lg p-1 w-fit shrink-0">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === t.key
                  ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white border border-neutral-200 rounded-card flex-1 min-h-0 flex flex-col overflow-hidden">
          {isLoading ? (
            <p className="text-sm text-neutral-400 p-5">Loading...</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[640px]">
                  <thead>
                    <tr className="text-xs text-neutral-400 text-left border-b border-neutral-200 sticky top-0 bg-white">
                      <th className="p-4 font-medium">Provider</th>
                      <th className="p-4 font-medium">Category</th>
                      <th className="p-4 font-medium">Rating</th>
                      <th className="p-4 font-medium">Jobs</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium w-16">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((p: any, i: number) => (
                      <tr key={p.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/60">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                                AVATAR_BG[i % AVATAR_BG.length]
                              }`}
                            >
                              {initials(p.user.name)}
                            </span>
                            <div className="min-w-0">
                              <p className="text-neutral-900 font-medium truncate">{p.user.name}</p>
                              <p className="text-neutral-400 text-xs truncate">
                                {p.bio ? p.bio : `${p.category.name} Expert`}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-neutral-600">{p.category.name}</td>
                        <td className="p-4">
                          <span className="flex items-center gap-1 text-neutral-700 font-medium">
                            {p.rating ?? '—'}
                            <Star size={12} className="fill-warning-500 text-warning-500" />
                          </span>
                        </td>
                        <td className="p-4 text-neutral-600">{p.reviewCount ?? p.jobsCount ?? '—'}</td>
                        <td className="p-4">
                          <StatusBadge status={p._status} />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => verifyMutation.mutate({ id: p.id, verified: !p.verified })}
                              className="text-xs font-medium text-brand-700 hover:underline whitespace-nowrap"
                            >
                              {p.verified ? 'Revoke' : 'Verify'}
                            </button>
                            <button className="text-neutral-300 hover:text-neutral-600">
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paged.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-sm text-neutral-400">
                          No providers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-1.5 py-3 border-t border-neutral-100 shrink-0">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 disabled:opacity-30"
                >
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                  .slice(0, 3)
                  .map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-7 h-7 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                        page === n ? 'bg-brand-700 text-white' : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                {totalPages > 4 && <span className="text-neutral-300 px-0.5">…</span>}
                {totalPages > 3 && (
                  <button
                    onClick={() => setPage(totalPages)}
                    className={`w-7 h-7 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                      page === totalPages ? 'bg-brand-700 text-white' : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {totalPages}
                  </button>
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 disabled:opacity-30"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AdminProvidersPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <ProvidersContent />
    </ProtectedRoute>
  );
}