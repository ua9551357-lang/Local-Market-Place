'use client';

import { NotificationBell } from '@/components/layout/NotificationBell';

export function DashboardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
        {subtitle && <p className="text-sm text-neutral-600 mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {action}
        <NotificationBell />
      </div>
    </div>
  );
}