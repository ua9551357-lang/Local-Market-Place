'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Calendar, Wrench, Clock, DollarSign,
  MessageSquare, Star, User, Wallet, Settings, Headset, HelpCircle,
  ChevronRight, ShoppingBag, LogOut, Menu, X,
} from 'lucide-react';
import { useLogout } from '@/hooks/useAuth';
import { NotificationBell } from '@/components/layout/NotificationBell';
import { useAuthStore } from '@/store/authStore';
import { getImageUrl } from '@/lib/image';
import { HelpSupportModal } from '@/components/layout/HelpSupportModal';

const navItems = [
  { href: '/provider-dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/provider-dashboard/bookings', label: 'Bookings', icon: Calendar },
  { href: '/provider-dashboard/services', label: 'Services', icon: Wrench },
  { href: '/provider-dashboard/availability', label: 'Availability', icon: Clock },
  { href: '/provider-dashboard/earnings', label: 'Earnings', icon: DollarSign },
  { href: '/provider-dashboard/messages', label: 'Messages', icon: MessageSquare },
  { href: '/provider-dashboard/reviews', label: 'Reviews', icon: Star },
  { href: '/provider-dashboard/profile', label: 'Profile', icon: User },
  { href: '/provider-dashboard/payouts', label: 'Payouts', icon: Wallet },
  { href: '/provider-dashboard/settings', label: 'Settings', icon: Settings },
];

export function ProviderSidebar() {
  const pathname = usePathname();
  const logout = useLogout();
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const sidebarContent = (
    <>
      <div className="flex items-center gap-2 px-2 pb-4 pt-1">
        <span className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white shrink-0">
          <ShoppingBag size={16} strokeWidth={2.5} />
        </span>
        <div>
          <span className="font-bold text-white text-[15px] tracking-tight block">LocalMarket</span>
          <span className="text-[10px] text-brand-100/60">Provider</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 px-2 pb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-brand-800 overflow-hidden flex items-center justify-center text-white/80 text-sm font-semibold shrink-0 ring-1 ring-white/10">
            {user?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={getImageUrl(user.avatarUrl)!} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0) || 'P'
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[11px] text-brand-100/60 truncate">Verified Provider</p>
          </div>
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
        <LogOut size={14} /> Logout
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