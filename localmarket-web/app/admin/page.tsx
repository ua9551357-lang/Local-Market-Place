'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  Users, Briefcase, CalendarCheck, Wallet, Download,
  Droplet, Hammer, Sparkles, Zap, GraduationCap, MoreVertical,
} from 'lucide-react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { MonthSelector } from '@/components/admin/MonthSelector';
import { useAdminStats, exportBookingsCsv } from '@/hooks/useAdmin';
import { getImageUrl } from '@/lib/image';

const DONUT_COLORS = ['#166534', '#F59E0B', '#EF4444'];

const CATEGORY_ICONS: Record<string, any> = {
  Plumbing: Droplet,
  Carpentry: Hammer,
  Cleaning: Sparkles,
  Electrician: Zap,
  Tutoring: GraduationCap,
};

const AVATAR_BG = ['bg-brand-100 text-brand-700', 'bg-amber-100 text-amber-700', 'bg-blue-100 text-blue-700', 'bg-rose-100 text-rose-700'];

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

function Avatar({ name, avatarUrl, colorClass, size = 'w-6 h-6 text-[10px]' }: { name: string; avatarUrl?: string | null; colorClass: string; size?: string }) {
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={getImageUrl(avatarUrl)!}
        alt={name}
        className={`${size} rounded-full object-cover shrink-0`}
      />
    );
  }
  return (
    <span className={`${size} rounded-full flex items-center justify-center font-semibold shrink-0 ${colorClass}`}>
      {initials(name)}
    </span>
  );
}

function statusPill(status: string) {
  const s = status?.toLowerCase();
  if (s === 'completed') return 'bg-brand-100 text-brand-700';
  if (s === 'pending') return 'bg-amber-100 text-amber-700';
  if (s === 'cancelled') return 'bg-red-100 text-red-600';
  return 'bg-neutral-100 text-neutral-600';
}

function AdminOverviewContent() {
  const [month, setMonth] = useState<string | undefined>(undefined);
  const { data: stats, isLoading } = useAdminStats(month);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportBookingsCsv(month);
      toast.success('Export downloaded successfully');
    } catch {
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading || !stats) {
    return (
      <div className="fixed inset-0 flex bg-neutral-100">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-neutral-400">Loading...</p>
        </main>
      </div>
    );
  }

  const revenueDonut = [
    { name: 'Completed', value: stats.revenueCompleted ?? stats.totalRevenue ?? 0 },
    { name: 'Pending', value: stats.revenuePending ?? 0 },
    { name: 'Cancelled', value: stats.revenueCancelled ?? 0 },
  ].filter((d) => d.value >= 0);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <AdminSidebar adminName="Admin" adminRole="Super Admin" />

      <main className="flex-1 h-full overflow-hidden flex flex-col p-4 lg:p-6 gap-4">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Overview</h1>
            <p className="text-sm text-neutral-400 mt-0.5">Welcome back, Admin! Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-2">
            <MonthSelector value={month} onChange={setMonth} />
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-1.5 bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition-colors disabled:opacity-60"
            >
              <Download size={14} /> {isExporting ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          <AdminStatCard label="Total Users" value={stats.totalUsers} icon={Users} />
          <AdminStatCard label="Total Providers" value={stats.totalProviders} icon={Briefcase} />
          <AdminStatCard label="Total Bookings" value={stats.totalBookings} icon={CalendarCheck} />
          <AdminStatCard label="Total Revenue" value={`PKR ${stats.totalRevenue}`} icon={Wallet} />
        </div>

        {/* Row 2: Bookings Overview + Popular Services */}
        <div className="grid lg:grid-cols-3 gap-4 flex-1 min-h-0">
          <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-card p-5 flex flex-col min-h-0">
            <h3 className="text-sm font-semibold text-neutral-900 shrink-0">Bookings Overview</h3>
            <div className="flex-1 min-h-0 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.bookingsOverview} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="bookingsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22C55E" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#EEF2F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 12 }} labelStyle={{ color: '#111827', fontWeight: 600 }} />
                  <Area type="monotone" dataKey="bookings" stroke="#22C55E" strokeWidth={2.5} fill="url(#bookingsFill)" dot={false} activeDot={{ r: 5, fill: '#22C55E', stroke: 'white', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-card p-5 flex flex-col min-h-0">
            <div className="flex items-center justify-between shrink-0">
              <h3 className="text-sm font-semibold text-neutral-900">Popular Services</h3>
            </div>
            <div className="flex-1 min-h-0 flex flex-col justify-around mt-1">
              {stats.popularServices?.length === 0 && (
                <p className="text-xs text-neutral-400">No bookings in this period.</p>
              )}
              {stats.popularServices?.map((s: any) => {
                const Icon = CATEGORY_ICONS[s.name] ?? Sparkles;
                const max = stats.popularServices[0]?.count || 1;
                return (
                  <div key={s.name} className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                      <Icon size={13} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-neutral-900 font-medium truncate">{s.name}</span>
                        <span className="text-neutral-400">{s.count}</span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-1.5">
                        <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: `${(s.count / max) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 3: Recent Bookings + Revenue Overview */}
        <div className="grid lg:grid-cols-3 gap-4 flex-1 min-h-0">
          <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-card p-5 flex flex-col min-h-0">
            <h3 className="text-sm font-semibold text-neutral-900 shrink-0">Recent Bookings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="text-xs text-neutral-400 text-left border-b border-neutral-100 sticky top-0 bg-white">
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Provider</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium w-6" />
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBookings?.length === 0 && (
                    <tr><td colSpan={5} className="py-6 text-center text-neutral-400 text-xs">No bookings in this period.</td></tr>
                  )}
                  {stats.recentBookings?.map((b: any, i: number) => (
                    <tr key={b.id} className="border-b border-neutral-50 last:border-0">
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <Avatar
                            name={b.customer.name}
                            avatarUrl={b.customer.avatarUrl}
                            colorClass={AVATAR_BG[i % AVATAR_BG.length]}
                          />
                          <span className="text-neutral-900">{b.customer.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-neutral-600">{b.provider.user.name}</td>
                      <td className="py-2.5 text-neutral-400 text-xs">{new Date(b.date).toLocaleDateString()}</td>
                      <td className="py-2.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-pill ${statusPill(b.status)}`}>{b.status}</span>
                      </td>
                      <td className="py-2.5 text-neutral-300"><MoreVertical size={14} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-card p-5 flex flex-col min-h-0">
            <h3 className="text-sm font-semibold text-neutral-900 shrink-0">Revenue Overview</h3>
            <div className="flex-1 min-h-0 flex items-center gap-3 mt-1">
              <div className="w-1/2 h-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={revenueDonut} dataKey="value" nameKey="name" innerRadius="65%" outerRadius="95%" paddingAngle={2} stroke="none">
                      {revenueDonut.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-neutral-400">PKR</span>
                  <span className="text-xl font-bold text-neutral-900">{stats.totalRevenue}</span>
                  <span className="text-[10px] text-neutral-400">Total Revenue</span>
                </div>
              </div>
              <div className="flex-1 space-y-2.5">
                {revenueDonut.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-neutral-600">
                      <span className="w-2 h-2 rounded-full" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                      {d.name}
                    </span>
                    <span className="font-semibold text-neutral-900">PKR {d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminOverviewPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminOverviewContent />
    </ProtectedRoute>
  );
}