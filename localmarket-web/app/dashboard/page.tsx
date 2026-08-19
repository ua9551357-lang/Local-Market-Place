'use client';

import Link from 'next/link';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { useAuthStore } from '@/store/authStore';
import { useDashboardSummary, useMyBookings } from '@/hooks/useDashboard';

const statusStyles: Record<string, string> = {
  confirmed: 'bg-brand-100 text-brand-700',
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-600',
};

function DashboardContent() {
  const { user } = useAuthStore();
  const { data: summary, isLoading } = useDashboardSummary();
  const { data: bookings } = useMyBookings();

  const upcoming = (bookings || []).filter((b: any) => ['pending', 'confirmed'].includes(b.status)).slice(0, 4);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <DashboardSidebar />
      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-neutral-900">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-sm text-neutral-400 mt-0.5 mb-4">Here&apos;s what&apos;s happening with your account today.</p>

        {isLoading ? (
          <p className="text-sm text-neutral-400">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-neutral-200 rounded-card p-5">
                <p className="text-xs text-neutral-400">Upcoming Bookings</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{summary?.upcomingBookings ?? 0}</p>
              </div>
              <div className="bg-white border border-neutral-200 rounded-card p-5">
                <p className="text-xs text-neutral-400">Completed Services</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{summary?.completedBookings ?? 0}</p>
              </div>
              <div className="bg-white border border-neutral-200 rounded-card p-5">
                <p className="text-xs text-neutral-400">Total Spent</p>
                <p className="text-3xl font-bold text-brand-700 mt-1">PKR {summary?.totalSpent ?? 0}</p>
              </div>
              <div className="bg-white border border-neutral-200 rounded-card p-5">
                <p className="text-xs text-neutral-400">Total Bookings</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{summary?.totalBookings ?? 0}</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 mt-4">
              {/* Upcoming Bookings */}
              <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-neutral-900">Upcoming Bookings</h3>
                  <Link href="/dashboard/bookings" className="text-xs text-brand-700 font-medium">View All</Link>
                </div>
                {upcoming.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-3xl mb-2">📅</p>
                    <p className="text-sm text-neutral-400">No upcoming bookings.</p>
                    <Link href="/browse" className="inline-block mt-2 text-xs text-brand-700 font-medium">Browse services →</Link>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100">
                    {upcoming.map((b: any) => (
                      <div key={b.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-semibold">
                            {b.provider.user.name.charAt(0)}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-neutral-900">{b.provider.user.name}</p>
                            <p className="text-xs text-neutral-400">{b.service.title} · {new Date(b.date).toLocaleDateString()} at {b.time}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-pill capitalize ${statusStyles[b.status]}`}>{b.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white border border-neutral-200 rounded-card p-5">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/browse" className="flex items-center gap-2 text-sm text-neutral-600 hover:text-brand-700 border border-neutral-100 rounded-lg px-3 py-2.5 transition-colors">
                    🔍 Book a Service
                  </Link>
                  <Link href="/browse" className="flex items-center gap-2 text-sm text-neutral-600 hover:text-brand-700 border border-neutral-100 rounded-lg px-3 py-2.5 transition-colors">
                    👥 Find Providers
                  </Link>
                  <Link href="/dashboard/messages" className="flex items-center gap-2 text-sm text-neutral-600 hover:text-brand-700 border border-neutral-100 rounded-lg px-3 py-2.5 transition-colors">
                    💬 View Messages
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <DashboardContent />
    </ProtectedRoute>
  );
}