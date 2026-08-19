'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Search, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useProviderApplications, useApproveProvider, useRejectProvider } from '@/hooks/useAdmin';
import { getImageUrl } from '@/lib/image';

const AVATAR_BG = [
  'bg-brand-100 text-brand-700',
  'bg-amber-100 text-amber-700',
  'bg-blue-100 text-blue-700',
  'bg-rose-100 text-rose-700',
];

const PAGE_SIZE = 6;

function initials(name = '') {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

function Avatar({ name, avatarUrl, colorClass }: { name: string; avatarUrl?: string | null; colorClass: string }) {
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={getImageUrl(avatarUrl)!}
        alt={name}
        className="w-9 h-9 rounded-full object-cover shrink-0"
      />
    );
  }
  return (
    <span className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${colorClass}`}>
      {initials(name)}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-brand-100 text-brand-700',
    rejected: 'bg-red-100 text-red-600',
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-pill capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}

function UsersContent() {
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const { data: applications, isLoading } = useProviderApplications(tab);
  const approveMutation = useApproveProvider();
  const rejectMutation = useRejectProvider();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = (applications || []).filter((a: any) =>
    a.user.name.toLowerCase().includes(search.toLowerCase()) ||
    a.user.email.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const tabs = [
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'all', label: 'All' },
  ] as const;

  const handleApprove = (id: string, name: string) => {
    approveMutation.mutate(id, {
      onSuccess: () => toast.success(`${name}'s provider application approved`),
      onError: () => toast.error('Failed to approve application'),
    });
  };

  const handleReject = (id: string, name: string) => {
    if (confirm(`Reject ${name}'s provider application?`)) {
      rejectMutation.mutate(id, {
        onSuccess: () => toast.success(`${name}'s application rejected`),
        onError: () => toast.error('Failed to reject application'),
      });
    }
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <AdminSidebar adminName="Admin" adminRole="Super Admin" />

      <main className="flex-1 h-full overflow-hidden flex flex-col p-4 lg:p-6 gap-4">
        <div className="shrink-0">
          <h1 className="text-2xl font-bold text-neutral-900">Provider Applications</h1>
          <p className="text-sm text-neutral-400 mt-0.5">Review and approve provider registration requests.</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or email..."
              className="w-full bg-white border border-neutral-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-lg p-1 w-fit shrink-0">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setPage(1); }}
              className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === t.key ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="bg-white border border-neutral-200 rounded-card flex-1 min-h-0 flex flex-col overflow-hidden">
          {isLoading ? (
            <p className="text-sm text-neutral-400 p-5">Loading...</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[640px]">
                  <thead>
                    <tr className="text-xs text-neutral-400 text-left border-b border-neutral-200 sticky top-0 bg-white">
                      <th className="p-4 font-medium">Applicant</th>
                      <th className="p-4 font-medium">Category</th>
                      <th className="p-4 font-medium">Experience</th>
                      <th className="p-4 font-medium">Applied</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((a: any, i: number) => (
                      <tr key={a.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/60">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar
                              name={a.user.name}
                              avatarUrl={a.user.avatarUrl}
                              colorClass={AVATAR_BG[i % AVATAR_BG.length]}
                            />
                            <div className="min-w-0">
                              <p className="text-neutral-900 font-medium truncate">{a.user.name}</p>
                              <p className="text-neutral-400 text-xs truncate">{a.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-neutral-600">{a.category.name}</td>
                        <td className="p-4 text-neutral-600">{a.experienceYears} yrs</td>
                        <td className="p-4 text-neutral-400">
                          {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="p-4"><StatusBadge status={a.status} /></td>
                        <td className="p-4">
                          {a.status === 'pending' ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleApprove(a.id, a.user.name)}
                                disabled={approveMutation.isPending}
                                className="flex items-center gap-1 bg-brand-700 hover:bg-brand-600 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg disabled:opacity-60"
                              >
                                <Check size={13} /> Accept
                              </button>
                              <button
                                onClick={() => handleReject(a.id, a.user.name)}
                                disabled={rejectMutation.isPending}
                                className="flex items-center gap-1 border border-neutral-200 text-neutral-600 text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-neutral-50 disabled:opacity-60"
                              >
                                <X size={13} /> Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-neutral-400">
                              {a.status === 'approved' ? 'Approved' : 'Rejected'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {paged.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-sm text-neutral-400">
                          No {tab !== 'all' ? tab : ''} applications found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-center gap-1.5 py-3 border-t border-neutral-100 shrink-0">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 disabled:opacity-30"
                >
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-7 h-7 flex items-center justify-center rounded-md text-sm font-medium ${
                      page === n ? 'bg-brand-700 text-white' : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {n}
                  </button>
                ))}
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

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <UsersContent />
    </ProtectedRoute>
  );
}