'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FilterSidebar } from '@/components/browse/FilterSidebar';
import { ProviderCard } from '@/components/browse/ProviderCard';
import { SortDropdown } from '@/components/browse/SortDropdown';
import { useCategories, useProviders } from '@/hooks/useProviders';
import { useDebounce } from '@/hooks/useDebounce';
import { Skeleton } from '@/components/ui/Skeleton';
function BrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [sort, setSort] = useState(searchParams.get('sort') || 'recommended');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search);

  const { data: categories } = useCategories();
  const { data: result, isLoading } = useProviders({
    search: debouncedSearch || undefined,
    category: category || undefined,
    minRating: minRating || undefined,
    maxPrice: priceRange[1] !== 20000 ? String(priceRange[1]) : undefined,
    sort: sort !== 'recommended' ? sort : undefined,
    page: String(page),
    limit: '10',
  });

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (category) params.set('category', category);
    if (minRating) params.set('minRating', minRating);
    if (sort !== 'recommended') params.set('sort', sort);
    router.replace(`/browse?${params.toString()}`, { scroll: false });
  }, [debouncedSearch, category, minRating, sort, router]);

  const clearAll = () => {
    setSearch('');
    setCategory('');
    setMinRating('');
    setPriceRange([0, 20000]);
    setSort('recommended');
    setPage(1);
  };

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <h1 className="text-2xl font-bold text-neutral-900">Browse Services</h1>
        <p className="text-sm text-neutral-400 mt-1">Home &gt; Browse Services</p>

        <div className="flex gap-3 mt-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="flex-1 border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <FilterSidebar
            categories={categories || []}
            selectedCategory={category}
            onCategoryChange={(c) => {
              setCategory(c);
              setPage(1);
            }}
            minRating={minRating}
            onMinRatingChange={(r) => {
              setMinRating(r);
              setPage(1);
            }}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            onClearAll={clearAll}
          />

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-neutral-600">
                {result ? `Showing ${(page - 1) * 10 + 1}-${Math.min(page * 10, result.meta.total)} of ${result.meta.total} services` : ''}
              </p>
              <SortDropdown value={sort} onChange={(s) => { setSort(s); setPage(1); }} />
            </div>

           {isLoading ? (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white border border-neutral-200 rounded-card p-4 flex gap-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    ))}
  </div>
) : result?.data.length === 0 ? (
  <p className="text-sm text-neutral-400">No providers found matching your filters.</p>
) : (
  <div className="space-y-4">
    {result?.data.map((provider) => (
      <ProviderCard key={provider.id} provider={provider} />
    ))}
  </div>
)}

            {result && result.meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                {Array.from({ length: result.meta.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium ${
                      p === page
                        ? 'bg-brand-700 text-white'
                        : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <BrowseContent />
    </Suspense>
  );
}