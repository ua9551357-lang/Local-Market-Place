'use client';

import { useState } from 'react';
import { AdminHelpSupportModal } from '@/components/admin/AdminSupportModal';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Wrench,
  Calendar,
  CreditCard,
  LayoutGrid,
  Star,
  BarChart3,
  Settings,
  Headset,
  HelpCircle,
  ChevronRight,
  ShoppingBag,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useLogout } from '@/hooks/useAuth';
import { NotificationBell } from '@/components/layout/NotificationBell';

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/providers', label: 'Providers', icon: Wrench },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/categories', label: 'Categories', icon: LayoutGrid },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar({
  adminName = 'Admin',
  adminRole = 'Super Admin',
  avatarUrl,
}: {
  adminName?: string;
  adminRole?: string;
  avatarUrl?: string;
}) {
  const pathname = usePathname();
  const logout = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 pb-5 pt-1">
        <span className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white shrink-0">
          <ShoppingBag size={16} strokeWidth={2.5} />
        </span>
        <span className="font-bold text-white text-[15px] tracking-tight">LocalMarket</span>
      </div>

      {/* Admin profile + notification bell */}
      <div className="flex items-center justify-between gap-2 px-2 pb-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-brand-800 shrink-0 ring-1 ring-white/10">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={adminName} width={40} height={40} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/70 text-sm font-semibold">
                {adminName.charAt(0)}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{adminName}</p>
            <p className="text-xs text-brand-100/70 truncate">{adminRole}</p>
          </div>
        </div>
        <NotificationBell variant="dark" />
      </div>

      {/* Nav */}
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
                active
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-brand-100/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={17} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Help card */}
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
        <LogOut size={14} />
        Logout
      </button>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 bg-brand-950 text-white rounded-lg p-2 shadow-card"
      >
        <Menu size={18} />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex bg-gradient-to-b from-brand-950 to-brand-900 text-white w-60 h-full shrink-0 p-3 flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-60 bg-gradient-to-b from-brand-950 to-brand-900 text-white p-3 flex flex-col h-full">
            <button onClick={() => setIsOpen(false)} className="self-end text-brand-100 mb-2 p-1">
              <X size={16} />
            </button>
            {sidebarContent}
          </div>
          <div className="flex-1 bg-black/30" onClick={() => setIsOpen(false)} />
        </div>
      )}
        {showHelp && <AdminHelpSupportModal onClose={() => setShowHelp(false)} />}
    </>
  );
}