import Link from 'next/link';

const services = [
  { name: 'Plumbing', count: 245, icon: '🔧' },
  { name: 'Electrician', count: 312, icon: '💡' },
  { name: 'Tutoring', count: 180, icon: '📚' },
  { name: 'Cleaning', count: 275, icon: '🧹' },
  { name: 'Carpentry', count: 132, icon: '🪚' },
  { name: 'More', count: 0, icon: '➕' },
];

export function PopularServices() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">Popular Services</h2>
        <Link href="/browse" className="text-sm font-medium text-brand-700">
          Browse all categories
        </Link>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {services.map((s) => (
          <Link
            key={s.name}
            href={`/browse?category=${s.name}`}
            className="bg-white border border-neutral-200 rounded-card shadow-card hover:shadow-cardHover transition-shadow p-4 flex flex-col items-center text-center gap-2"
          >
            <span className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-xl">
              {s.icon}
            </span>
            <p className="text-sm font-semibold text-neutral-900">{s.name}</p>
            {s.count > 0 && <p className="text-xs text-neutral-400">{s.count} providers</p>}
            {s.name === 'More' && <p className="text-xs text-neutral-400">See all</p>}
          </Link>
        ))}
      </div>
    </section>
  );
}