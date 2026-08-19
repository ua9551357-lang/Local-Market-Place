'use client';

import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ProviderSidebar } from '@/components/dashboard/ProviderSidebar';
import { useAuthStore } from '@/store/authStore';
import { useProviderEarnings, useProviderBookings } from '@/hooks/useProviderOnboarding';

function AdminOverviewContent() {
  const { user } = useAuthStore();
  const { data: earnings, isLoading: earningsLoading } = useProviderEarnings();
  const { data: bookings, isLoading: bookingsLoading } = useProviderBookings();

  const pendingBookings = (bookings || []).filter((b: any) => b.status === 'pending');
  const upcomingBookings = (bookings || [])
    .filter((b: any) => b.status === 'confirmed')
    .slice(0, 4);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <ProviderSidebar />
      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-neutral-900">Good morning, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-sm text-neutral-400 mt-0.5">Here&apos;s what&apos;s happening with your business today.</p>
        </div>

        {earningsLoading || bookingsLoading ? (
          <p className="text-sm text-neutral-400">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-neutral-200 rounded-card p-5">
                <p className="text-xs text-neutral-400">Total Bookings</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{bookings?.length ?? 0}</p>
              </div>
              <div className="bg-white border border-neutral-200 rounded-card p-5">
                <p className="text-xs text-neutral-400">Completed Jobs</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{earnings?.completedCount ?? 0}</p>
              </div>
              <div className="bg-white border border-neutral-200 rounded-card p-5">
                <p className="text-xs text-neutral-400">Pending Requests</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{earnings?.pendingCount ?? 0}</p>
              </div>
              <div className="bg-white border border-neutral-200 rounded-card p-5">
                <p className="text-xs text-neutral-400">Total Earnings</p>
                <p className="text-3xl font-bold text-brand-700 mt-1">PKR {earnings?.totalEarnings ?? 0}</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 mt-4">
              <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-card p-5">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">Earnings Overview</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={[{ name: 'Mon', v: 0 }, { name: 'Tue', v: 0 }, { name: 'Wed', v: 0 }]}>
                    <defs>
                      <linearGradient id="earn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22C55E" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#EEF2F0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="v" stroke="#22C55E" fill="url(#earn)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white border border-neutral-200 rounded-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-neutral-900">Upcoming Bookings</h3>
                  <Link href="/provider-dashboard/bookings" className="text-xs text-brand-700 font-medium">View All</Link>
                </div>
                <div className="space-y-3">
                  {upcomingBookings.length === 0 && <p className="text-xs text-neutral-400">No upcoming bookings.</p>}
                  {upcomingBookings.map((b: any) => (
                    <div key={b.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-semibold">
                          {b.customer.name.charAt(0)}
                        </span>
                        <div>
                          <p className="text-xs font-medium text-neutral-900">{b.customer.name}</p>
                          <p className="text-[11px] text-neutral-400">{new Date(b.date).toLocaleDateString()}, {b.time}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-pill bg-brand-100 text-brand-700">Confirmed</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-card p-5 mt-4">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Pending Booking Requests</h3>
              {pendingBookings.length === 0 ? (
                <p className="text-sm text-neutral-400">No pending requests.</p>
              ) : (
                <div className="space-y-3">
                  {pendingBookings.map((b: any) => (
                    <div key={b.id} className="flex items-center justify-between border-b border-neutral-100 pb-2 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{b.customer.name}</p>
                        <p className="text-xs text-neutral-400">{b.service.title} · {new Date(b.date).toLocaleDateString()} at {b.time}</p>
                      </div>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-pill bg-amber-100 text-amber-700">Pending</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function ProviderDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['provider']}>
      <AdminOverviewContent />
    </ProtectedRoute>
  );
}