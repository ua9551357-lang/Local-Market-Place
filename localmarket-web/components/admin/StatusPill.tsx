const styles: Record<string, string> = {
  paid: 'bg-brand-100 text-brand-700',
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
  succeeded: 'bg-brand-100 text-brand-700',
  failed: 'bg-red-100 text-red-700',
  active: 'bg-brand-100 text-brand-700',
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-pill capitalize ${styles[status] || 'bg-neutral-100 text-neutral-600'}`}>
      {status}
    </span>
  );
}