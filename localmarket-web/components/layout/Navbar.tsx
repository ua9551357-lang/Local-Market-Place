'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/hooks/useAuth';
import { NotificationBell } from './NotificationBell';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/browse', label: 'Browse Services' },
  { href: '/how-it-works', label: 'How it Works' },
  { href: '/for-providers', label: 'For Providers' },
  { href: '/about', label: 'About Us' },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isLoading } = useAuthStore();
  const logout = useLogout();

  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-neutral-900 flex-shrink-0">
          <span className="w-7 h-7 rounded-lg bg-brand-700 flex items-center justify-center text-white text-sm">
            L
          </span>
          LocalMarket
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-brand-700 bg-brand-50 font-semibold'
                    : 'text-neutral-600 hover:text-brand-700 hover:bg-neutral-50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 flex-shrink-0">
          {isLoading ? (
            <div className="w-24 h-9" />
          ) : user ? (
            <>
              <Link
                href={user.role === 'provider' ? '/provider-dashboard' : user.role === 'admin' ? '/admin' : '/dashboard'}
                className="text-sm font-medium text-neutral-900 hidden sm:block"
              >
                {user.name}
              </Link>
              <NotificationBell />
              <button
                onClick={() => logout.mutate()}
                className="border border-neutral-200 text-neutral-900 font-medium text-sm px-4 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-neutral-900 px-4 py-2 hover:text-brand-700">
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-brand-700 hover:bg-brand-600 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}