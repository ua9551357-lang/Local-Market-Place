'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { useAdminReports } from '@/hooks/useAdmin';

function ReportsContent() {
  const { data: reports, isLoading } = useAdminReports();

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <AdminSidebar />
      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Reports</h1>
            <p className="text-sm text-neutral-400 mt-0.5">Analytics and insights</p>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-neutral-400">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <AdminStatCard label="Total Bookings" value={reports.totalBookings} />
              <AdminStatCard label="Total Revenue" value={`PKR ${reports.totalRevenue}`} />
              <AdminStatCard label="Completed" value={reports.completedCount} />
              <AdminStatCard label="Active Providers" value={reports.activeProviders} />
            </div>

            <div className="bg-white border border-neutral-200 rounded-card p-5 mt-6">
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Bookings Over Time</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={reports.bookingsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#166534" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" fill="#22C55E" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cancelled" fill="#9CA3AF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function AdminReportsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <ReportsContent />
    </ProtectedRoute>
  );
}