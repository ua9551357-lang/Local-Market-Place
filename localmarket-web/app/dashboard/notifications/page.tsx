'use client';

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { useNotifications } from '@/hooks/useNotifications';

const typeMessages: Record<string, (payload: any) => string> = {
  new_booking: (p) => `New booking request for ${p.serviceTitle}`,
  booking_status: (p) => `Your booking is now ${p.status}`,
  provider_application: (p) => `New provider application from ${p.applicantName}`,
  provider_approved: (p) => p.message,
  provider_rejected: (p) => p.message,
};

const typeIcons: Record<string, string> = {
  new_booking: '📅',
  booking_status: '✅',
  provider_application: '📋',
  provider_approved: '🎉',
  provider_rejected: '❌',
};

function NotificationsContent() {
  const { data: notifications, isLoading } = useNotifications();

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <DashboardSidebar />
      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">Notifications</h1>
        <p className="text-sm text-neutral-400 mb-4">Stay updated with your activities</p>

        <div className="bg-white border border-neutral-200 rounded-card overflow-hidden max-w-2xl">
          {isLoading ? (
            <p className="text-sm text-neutral-400 p-5">Loading...</p>
          ) : notifications?.length === 0 ? (
            <p className="text-sm text-neutral-400 p-8 text-center">No notifications yet.</p>
          ) : (
            <div className="divide-y divide-neutral-100">
              {notifications?.map((n: any) => (
                <div key={n.id} className="p-4 flex items-start gap-3 hover:bg-neutral-50">
                  <span className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center text-lg shrink-0">
                    {typeIcons[n.type] || '🔔'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-900">
                      {typeMessages[n.type]?.(n.payload) || 'New notification'}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!n.readAt && <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-1.5" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <NotificationsContent />
    </ProtectedRoute>
  );
}