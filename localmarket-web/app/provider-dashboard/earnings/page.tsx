'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ProviderSidebar } from '@/components/dashboard/ProviderSidebar';
import { useEarningsChart } from '@/hooks/useProviderOnboarding';
import { useProviderBookings } from '@/hooks/useProviderOnboarding';

function EarningsContent() {
  const { data, isLoading } = useEarningsChart();
  const { data: bookings } = useProviderBookings();

  const recentTransactions = (bookings || [])
    .filter((b: any) => b.status === 'completed')
    .slice(0, 6);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <ProviderSidebar />
      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">Earnings</h1>
        <p className="text-sm text-neutral-400 mb-4">Track your earnings and payouts</p>

        {isLoading ? (
          <p className="text-sm text-neutral-400">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-neutral-200 rounded-card p-5">
                <p className="text-xs text-neutral-400">This Month</p>
                <p className="text-2xl font-bold text-brand-700 mt-1">PKR {data.thisMonth}</p>
              </div>
              <div className="bg-white border border-neutral-200 rounded-card p-5">
                <p className="text-xs text-neutral-400">Last Month</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">PKR {data.lastMonth}</p>
              </div>
              <div className="bg-white border border-neutral-200 rounded-card p-5">
                <p className="text-xs text-neutral-400">Pending Payout</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">PKR {data.pending}</p>
              </div>
              <div className="bg-white border border-neutral-200 rounded-card p-5">
                <p className="text-xs text-neutral-400">Transactions</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">{recentTransactions.length}</p>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-card p-5 mt-4">
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Earnings Chart</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.chart}>
                  <CartesianGrid vertical={false} stroke="#EEF2F0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#22C55E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-neutral-200 rounded-card p-5 mt-4">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Recent Transactions</h3>
              <div className="space-y-2">
                {recentTransactions.length === 0 && <p className="text-xs text-neutral-400">No transactions yet.</p>}
                {recentTransactions.map((b: any) => (
                  <div key={b.id} className="flex items-center justify-between text-sm border-b border-neutral-50 pb-2 last:border-0">
                    <div>
                      <p className="text-neutral-900 font-medium">Booking #{b.id.slice(0, 8)}</p>
                      <p className="text-xs text-neutral-400">{new Date(b.date).toLocaleDateString()}</p>
                    </div>
                    <span className="text-brand-700 font-semibold">PKR {b.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function ProviderEarningsPage() {
  return (
    <ProtectedRoute allowedRoles={['provider']}>
      <EarningsContent />
    </ProtectedRoute>
  );
}