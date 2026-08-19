'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { Search, X, LifeBuoy, Inbox } from 'lucide-react';
import { adminFaqs } from '@/lib/adminfaqData';
import { useAllTickets, useResolveTicket } from '@/hooks/useSupport';

export function AdminHelpSupportModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'faq' | 'tickets'>('tickets');
  const [search, setSearch] = useState('');
  const [ticketFilter, setTicketFilter] = useState<'open' | 'resolved' | 'all'>('open');

  const { data: tickets, isLoading: ticketsLoading } = useAllTickets(ticketFilter);
  const resolveTicket = useResolveTicket();

  const filteredFaqs = adminFaqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase()),
  );

  const grouped = filteredFaqs.reduce<Record<string, typeof adminFaqs>>((acc, faq) => {
    acc[faq.category] = acc[faq.category] || [];
    acc[faq.category].push(faq);
    return acc;
  }, {});

  const handleResolve = (id: string) => {
    resolveTicket.mutate(id, {
      onSuccess: () => toast.success('Ticket marked as resolved'),
      onError: () => toast.error('Failed to update ticket'),
    });
  };

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-card w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">Admin Support Center</h2>
            <p className="text-xs text-neutral-400">Manage tickets and platform documentation</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-1 p-2 border-b border-neutral-100">
          <button
            onClick={() => setTab('tickets')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'tickets' ? 'bg-brand-50 text-brand-700' : 'text-neutral-500 hover:bg-neutral-50'
            }`}
          >
            <Inbox size={14} /> Support Tickets
          </button>
          <button
            onClick={() => setTab('faq')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'faq' ? 'bg-brand-50 text-brand-700' : 'text-neutral-500 hover:bg-neutral-50'
            }`}
          >
            <LifeBuoy size={14} /> Admin Docs
          </button>
        </div>

        {tab === 'tickets' ? (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center gap-1 mb-3">
              {(['open', 'resolved', 'all'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setTicketFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                    ticketFilter === f ? 'bg-brand-700 text-white' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {ticketsLoading ? (
              <p className="text-sm text-neutral-400 text-center py-8">Loading tickets...</p>
            ) : tickets?.length === 0 ? (
              <p className="text-sm text-neutral-400 text-center py-8">No {ticketFilter !== 'all' ? ticketFilter : ''} tickets.</p>
            ) : (
              <div className="space-y-3">
                {tickets?.map((t: any) => (
                  <div key={t.id} className="border border-neutral-100 rounded-lg p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900">{t.subject}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {t.user.name} ({t.user.role}) · {new Date(t.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-pill shrink-0 ${
                          t.status === 'open' ? 'bg-amber-100 text-amber-700' : 'bg-brand-100 text-brand-700'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-2">{t.message}</p>
                    {t.status === 'open' && (
                      <button
                        onClick={() => handleResolve(t.id)}
                        disabled={resolveTicket.isPending}
                        className="mt-2 text-xs text-brand-700 font-medium hover:underline"
                      >
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="relative mb-4">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search admin docs..."
                className="w-full border border-neutral-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-5">
                <p className="text-xs font-semibold text-brand-700 uppercase tracking-wide mb-2">{category}</p>
                <div className="space-y-3">
                  {items.map((faq) => (
                    <details key={faq.question} className="group border border-neutral-100 rounded-lg p-3">
                      <summary className="text-sm font-medium text-neutral-900 cursor-pointer list-none flex items-center justify-between">
                        {faq.question}
                        <span className="text-neutral-400 group-open:rotate-180 transition-transform">▾</span>
                      </summary>
                      <p className="text-xs text-neutral-600 mt-2">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}