'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { useMyBookings } from '@/hooks/useDashboard';

const tabs = ['all', 'upcoming', 'completed', 'cancelled'] as const;
const statusStyles: Record<string, string> = {
  confirmed: 'bg-brand-100 text-brand-700',
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-600',
};

function BookingsContent() {
  const { data: bookings, isLoading } = useMyBookings();
  const [tab, setTab] = useState<typeof tabs[number]>('all');
  const [search, setSearch] = useState('');

  const filtered = (bookings || [])
    .filter((b: any) => {
      if (tab === 'all') return true;
      if (tab === 'upcoming') return ['pending', 'confirmed'].includes(b.status);
      return b.status === tab;
    })
    .filter((b: any) => b.provider.user.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <DashboardSidebar />
      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">My Bookings</h1>
        <p className="text-sm text-neutral-400 mb-4">Manage all your bookings and order status</p>

        <div className="flex items-center gap-3 mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookings..."
            className="flex-1 bg-white border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-lg p-1 w-fit mb-4">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3.5 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                tab === t ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="bg-white border border-neutral-200 rounded-card overflow-hidden">
          {isLoading ? (
            <p className="text-sm text-neutral-400 p-5">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-neutral-400 p-8 text-center">No bookings found.</p>
          ) : (
            <div className="divide-y divide-neutral-100">
              {filtered.map((b: any) => (
                <div key={b.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-semibold">
                      {b.provider.user.name.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{b.service.title}</p>
                      <p className="text-xs text-neutral-400">
                        {b.provider.user.name} · {new Date(b.date).toLocaleDateString()}, {b.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-brand-700">PKR {b.amount}</span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-pill capitalize ${statusStyles[b.status]}`}>{b.status}</span>
                    <Link href={`/dashboard/bookings/${b.id}`} className="text-xs text-brand-700 font-medium hover:underline">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function BookingsPage() {
  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <BookingsContent />
    </ProtectedRoute>
  );
}