'use client';

import { useState } from 'react';
import { HelpSupportModal } from '@/components/layout/HelpSupportModal';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Calendar, MessageSquare, Heart, CreditCard,
  Star, Bell, Settings, HelpCircle, ShoppingBag, LogOut, Menu, X,
} from 'lucide-react';
import { useLogout } from '@/hooks/useAuth';
import { NotificationBell } from '@/components/layout/NotificationBell';
import { useAuthStore } from '@/store/authStore';
import { useUnreadCount } from '@/hooks/useNotifications';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/bookings', label: 'Bookings', icon: Calendar },
  { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { href: '/dashboard/saved', label: 'Saved Providers', icon: Heart },
  { href: '/dashboard/reviews', label: 'Reviews', icon: Star },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const logout = useLogout();
  const { user } = useAuthStore();
  const { data: unreadCount } = useUnreadCount();
  const [isOpen, setIsOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const sidebarContent = (
    <>
      <div className="flex items-center gap-2 px-2 pb-4 pt-1">
        <span className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white shrink-0">
          <ShoppingBag size={16} strokeWidth={2.5} />
        </span>
        <span className="font-bold text-white text-[15px] tracking-tight">LocalMarket</span>
      </div>

      <div className="flex items-center justify-between gap-2 px-2 pb-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">Welcome back, {user?.name?.split(' ')[0]}! 👋</p>
          <p className="text-[11px] text-brand-100/60">Here&apos;s what&apos;s happening today.</p>
        </div>
        <NotificationBell variant="dark" />
      </div>

      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? 'bg-brand-600 text-white shadow-sm' : 'text-brand-100/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={17} strokeWidth={2} />
              {item.label}
              {item.href === '/dashboard/notifications' && unreadCount > 0 && (
                <span className="ml-auto bg-danger-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <button
  onClick={() => setShowHelp(true)}
  className="mt-3 flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left border border-white/10"
>
  <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
    <HelpCircle size={16} />
  </span>
  <span className="flex-1 min-w-0">
    <span className="block text-xs font-semibold text-white">Help & Support</span>
    <span className="block text-[11px] text-brand-100/60">We&apos;re here to help</span>
  </span>
</button>

      <button
        onClick={() => logout.mutate()}
        className="mt-1 flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-brand-100/60 hover:text-white hover:bg-white/5 transition-colors"
      >
        <LogOut size={14} /> Log Out
      </button>
    </>
  );

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="md:hidden fixed top-4 left-4 z-40 bg-brand-950 text-white rounded-lg p-2 shadow-card">
        <Menu size={18} />
      </button>

      <aside className="hidden md:flex bg-gradient-to-b from-brand-950 to-brand-900 text-white w-60 h-full shrink-0 p-3 flex-col">
        {sidebarContent}
      </aside>

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-60 bg-gradient-to-b from-brand-950 to-brand-900 text-white p-3 flex flex-col h-full">
            <button onClick={() => setIsOpen(false)} className="self-end text-brand-100 mb-2 p-1"><X size={16} /></button>
            {sidebarContent}
          </div>
          <div className="flex-1 bg-black/30" onClick={() => setIsOpen(false)} />
        </div>
      )}
      {showHelp && <HelpSupportModal onClose={() => setShowHelp(false)} />}
    </>
  );
}