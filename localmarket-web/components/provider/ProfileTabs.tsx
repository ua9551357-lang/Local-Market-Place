'use client';

import { useState } from 'react';
import { ProviderDetail, Review } from '@/types/provider';

export function ProfileTabs({
  provider,
  reviews,
}: {
  provider: ProviderDetail;
  reviews: Review[];
}) {
  const [tab, setTab] = useState<'overview' | 'services' | 'reviews' | 'about'>('overview');

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'services', label: 'Services' },
    { key: 'reviews', label: `Reviews (${reviews.length})` },
    { key: 'about', label: 'About' },
  ] as const;

  return (
    <div className="bg-white border border-neutral-200 rounded-card p-5">
      <div className="flex gap-6 border-b border-neutral-200 mb-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`text-sm font-medium pb-3 border-b-2 transition-colors ${
              tab === t.key
                ? 'border-brand-700 text-brand-700'
                : 'border-transparent text-neutral-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 mb-2">About</h4>
          <p className="text-sm text-neutral-600">{provider.bio}</p>
          <ul className="mt-4 space-y-1.5 text-sm text-neutral-600">
            <li>✓ Licensed & Insured</li>
            <li>✓ 24/7 Emergency Service</li>
            <li>✓ Satisfaction Guaranteed</li>
          </ul>
        </div>
      )}

      {tab === 'services' && (
        <div className="space-y-3">
          {provider.services.map((s) => (
            <div key={s.id} className="flex items-center justify-between border border-neutral-200 rounded-lg p-3">
              <div>
                <p className="text-sm font-medium text-neutral-900">{s.title}</p>
                <p className="text-xs text-neutral-400">{s.description}</p>
              </div>
              <span className="text-sm font-bold text-brand-700">PKR {s.price}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'reviews' && (
        <div className="space-y-4">
          {reviews.length === 0 && (
            <p className="text-sm text-neutral-400">No reviews yet.</p>
          )}
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-semibold">
                  {r.customer.name.charAt(0)}
                </span>
                <p className="text-sm font-medium text-neutral-900">{r.customer.name}</p>
                <span className="text-xs text-warning-500">{'★'.repeat(r.rating)}</span>
              </div>
              {r.comment && <p className="text-sm text-neutral-600 mt-2">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}

      {tab === 'about' && (
        <div>
          <p className="text-sm text-neutral-600">
            {provider.experienceYears} years of experience in {provider.category.name}.
          </p>
          <p className="text-sm text-neutral-600 mt-2">📍 {provider.location}</p>
        </div>
      )}
    </div>
  );
}