import { LucideIcon, ArrowUp, ArrowDown, Minus } from 'lucide-react';

export function AdminStatCard({
  label,
  value,
  change,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  /** e.g. "12% from last month" or "-4% from last month" or "0% from last month" */
  change?: string;
  icon?: LucideIcon;
}) {
  const trend = !change ? 'flat' : change.trim().startsWith('-') ? 'down' : /^0%|^0(\.0+)?%/.test(change.trim()) ? 'flat' : 'up';
  const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : Minus;
  const trendColor =
    trend === 'up' ? 'text-brand-600' : trend === 'down' ? 'text-danger-500' : 'text-neutral-400';

  return (
    <div className="bg-white border border-neutral-200 rounded-card p-4 lg:p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs text-neutral-400 font-medium">{label}</p>
        {Icon && (
          <span className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 shrink-0">
            <Icon size={16} strokeWidth={2.25} />
          </span>
        )}
      </div>
      <p className="text-2xl lg:text-3xl font-bold text-neutral-900 mt-1">{value}</p>
      {change && (
        <p className={`flex items-center gap-1 text-xs font-medium mt-1.5 ${trendColor}`}>
          <TrendIcon size={12} strokeWidth={2.5} />
          {change}
        </p>
      )}
    </div>
  );
}