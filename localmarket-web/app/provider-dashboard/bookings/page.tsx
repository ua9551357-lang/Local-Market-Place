'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ProviderSidebar } from '@/components/dashboard/ProviderSidebar';
import { useProviderBookings, useUpdateBookingStatus } from '@/hooks/useProviderOnboarding';

const tabs = ['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const;
const statusStyles: Record<string, string> = {
  confirmed: 'bg-brand-100 text-brand-700',
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-600',
};

function BookingsContent() {
  const { data: bookings, isLoading } = useProviderBookings();
  const updateStatus = useUpdateBookingStatus();
  const [tab, setTab] = useState<typeof tabs[number]>('all');
  const [search, setSearch] = useState('');

  const filtered = (bookings || [])
    .filter((b: any) => (tab === 'all' ? true : b.status === tab))
    .filter((b: any) => b.customer.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <ProviderSidebar />
      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">Bookings</h1>
        <p className="text-sm text-neutral-400 mb-4">Manage all your bookings and visit orders</p>

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
                      {b.customer.name.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{b.customer.name}</p>
                      <p className="text-xs text-neutral-400">
                        {b.service.title} · {new Date(b.date).toLocaleDateString()}, {b.time} · PKR {b.amount}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-pill capitalize ${statusStyles[b.status]}`}>
                      {b.status}
                    </span>
                    {b.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus.mutate({ id: b.id, status: 'confirmed' })}
                          className="bg-brand-700 hover:bg-brand-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus.mutate({ id: b.id, status: 'cancelled' })}
                          className="border border-neutral-200 text-neutral-600 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-neutral-50"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => updateStatus.mutate({ id: b.id, status: 'completed' })}
                        className="bg-brand-700 hover:bg-brand-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                      >
                        Mark Complete
                      </button>
                    )}
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

export default function ProviderBookingsPage() {
  return (
    <ProtectedRoute allowedRoles={['provider']}>
      <BookingsContent />
    </ProtectedRoute>
  );
}