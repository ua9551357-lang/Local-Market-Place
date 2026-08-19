export function StatCard({
  label,
  value,
  sublabel,
  icon,
  accent = 'brand',
}: {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: string;
  accent?: 'brand' | 'info' | 'warning' | 'danger';
}) {
  const accentStyles: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-700',
    info: 'bg-blue-50 text-info-500',
    warning: 'bg-amber-50 text-warning-500',
    danger: 'bg-red-50 text-danger-500',
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-card p-5 hover:shadow-cardHover transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-neutral-400 font-medium">{label}</p>
          <p className="text-3xl font-bold text-neutral-900 mt-1.5">{value}</p>
          {sublabel && <p className="text-xs text-neutral-400 mt-1">{sublabel}</p>}
        </div>
        {icon && (
          <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${accentStyles[accent]}`}>
            {icon}
          </span>
        )}
      </div>
    </div>
  );
}