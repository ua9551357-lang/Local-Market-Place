export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 p-4 border-t border-neutral-100">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
            p === page ? 'bg-brand-700 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}