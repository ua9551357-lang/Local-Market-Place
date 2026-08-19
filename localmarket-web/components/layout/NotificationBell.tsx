'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNotifications, useUnreadCount, useMarkAllRead } from '@/hooks/useNotifications';

const typeMessages: Record<string, (payload: any) => string> = {
  new_booking: (p) => `New booking request for ${p.serviceTitle}`,
  booking_status: (p) => `Your booking is now ${p.status}`,
  provider_application: (p) => `New provider application from ${p.applicantName}`,
  provider_approved: (p) => p.message,
  provider_rejected: (p) => p.message,
  support_ticket: (p) => `New support ticket: ${p.subject}`,
};

export function NotificationBell({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: notifications } = useNotifications();
  const { data: unreadCount } = useUnreadCount();
  const markAllRead = useMarkAllRead();

  const handleOpen = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 320;
      let left = rect.right - dropdownWidth;
      if (left < 8) left = rect.left;
      setCoords({ top: rect.bottom + 8, left });
    }
    setIsOpen((prev) => !prev);
    if (!isOpen && unreadCount > 0) {
      markAllRead.mutate();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buttonClass =
    variant === 'dark'
      ? 'relative p-2 hover:bg-white/10 rounded-lg text-white'
      : 'relative p-2 hover:bg-neutral-100 rounded-lg';

  return (
    <>
      <button ref={buttonRef} onClick={handleOpen} className={buttonClass}>
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-danger-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen &&
        typeof window !== 'undefined' &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{ position: 'fixed', top: coords.top, left: coords.left, width: 320 }}
            className="bg-white border border-neutral-200 rounded-card shadow-cardHover z-[9999] max-h-96 overflow-y-auto"
          >
            <div className="p-3 border-b border-neutral-100">
              <p className="text-sm font-semibold text-neutral-900">Notifications</p>
            </div>
            {notifications?.length === 0 && (
              <p className="text-sm text-neutral-400 p-4">No notifications yet.</p>
            )}
            {notifications?.map((n: any) => (
              <div key={n.id} className="p-3 border-b border-neutral-50 hover:bg-neutral-50">
                <p className="text-sm text-neutral-900">
                  {typeMessages[n.type]?.(n.payload) || 'New notification'}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}