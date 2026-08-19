'use client';

interface AdminPageHeaderProps {
  title: string;
  subtitle: string;
  search?: string;
  onSearchChange?: (v: string) => void;
  searchPlaceholder?: string;
  action?: { label: string; onClick: () => void };
}

export function AdminPageHeader({
  title,
  subtitle,
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  action,
}: AdminPageHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
      <div>
        <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
        <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        {onSearchChange && (
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="border border-neutral-200 rounded-lg px-3 py-1.5 text-xs w-48 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        )}
        {action && (
          <button
            onClick={action.onClick}
            className="bg-brand-700 hover:bg-brand-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            + {action.label}
          </button>
        )}
      </div>
    </div>
  );
}