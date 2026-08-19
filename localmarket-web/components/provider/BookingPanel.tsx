'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Service } from '@/types/provider';

export function BookingPanel({
  providerId,
  services,
}: {
  providerId: string;
  services: Service[];
}) {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState(services[0]?.id || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [issueDesc, setIssueDesc] = useState('');

  const handleContinue = () => {
    const params = new URLSearchParams({
      providerId,
      serviceId: selectedService,
      date,
      time,
      issueDesc,
    });
    router.push(`/providers/${providerId}/booking?${params.toString()}`);
  };

  const canContinue = selectedService && date && time;

  return (
    <div className="bg-white border border-neutral-200 rounded-card p-5">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Book Service</h3>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-neutral-900">Select Service</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} — PKR {s.price}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-neutral-900">Select Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-neutral-900">Select Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-neutral-900">Describe your issue</label>
          <textarea
            value={issueDesc}
            onChange={(e) => setIssueDesc(e.target.value)}
            rows={3}
            placeholder="Please describe your plumbing issue..."
            className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full bg-brand-700 hover:bg-brand-600 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Book
        </button>
      </div>
    </div>
  );
}