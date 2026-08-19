'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { Search, X, MessageCircle, HelpCircle } from 'lucide-react';
import { faqs } from '@/lib/faqData';
import { useCreateTicket } from '@/hooks/useSupport';

export function HelpSupportModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'faq' | 'contact'>('faq');
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const createTicket = useCreateTicket();

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase()),
  );

  const grouped = filteredFaqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    acc[faq.category] = acc[faq.category] || [];
    acc[faq.category].push(faq);
    return acc;
  }, {});

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in both fields');
      return;
    }
    createTicket.mutate(
      { subject, message },
      {
        onSuccess: () => {
          toast.success('Your message has been sent. We\'ll get back to you soon!');
          setSubject('');
          setMessage('');
        },
        onError: () => toast.error('Failed to send message'),
      },
    );
  };

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-card w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <h2 className="text-base font-semibold text-neutral-900">Help & Support</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-1 p-2 border-b border-neutral-100">
          <button
            onClick={() => setTab('faq')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'faq' ? 'bg-brand-50 text-brand-700' : 'text-neutral-500 hover:bg-neutral-50'
            }`}
          >
            <HelpCircle size={14} /> FAQs
          </button>
          <button
            onClick={() => setTab('contact')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'contact' ? 'bg-brand-50 text-brand-700' : 'text-neutral-500 hover:bg-neutral-50'
            }`}
          >
            <MessageCircle size={14} /> Contact Us
          </button>
        </div>

        {tab === 'faq' ? (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="relative mb-4">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for answers..."
                className="w-full border border-neutral-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {Object.keys(grouped).length === 0 ? (
              <p className="text-sm text-neutral-400 text-center py-8">
                No answers found. Try the Contact Us tab to reach our team directly.
              </p>
            ) : (
              Object.entries(grouped).map(([category, items]) => (
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
              ))
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-xs text-neutral-400 mb-4">
              Can&apos;t find what you&apos;re looking for? Send us a message and our team will respond within 24-48 hours.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-neutral-900">Subject</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What's this about?"
                  className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-900">Message</label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={createTicket.isPending}
                className="w-full bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg disabled:opacity-60"
              >
                {createTicket.isPending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}