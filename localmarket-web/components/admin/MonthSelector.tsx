'use client';

import { ChevronDown } from 'lucide-react';

function getLastMonths(count: number) {
  const months = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    months.push({ value, label });
  }
  return months;
}

export function MonthSelector({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (v: string | undefined) => void;
}) {
  const months = getLastMonths(6);

  return (
    <div className="relative">
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="appearance-none bg-white border border-neutral-200 text-sm text-neutral-700 font-medium pl-3.5 pr-8 py-2 rounded-lg hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
      >
        <option value="">All Time</option>
        {months.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
    </div>
  );
}