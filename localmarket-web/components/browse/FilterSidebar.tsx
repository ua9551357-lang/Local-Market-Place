'use client';

import { Category } from '@/types/provider';

interface FilterSidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  minRating: string;
  onMinRatingChange: (rating: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  onClearAll: () => void;
}

export function FilterSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  minRating,
  onMinRatingChange,
  priceRange,
  onPriceRangeChange,
  onClearAll,
}: FilterSidebarProps) {
  return (
    <aside className="bg-white border border-neutral-200 rounded-card p-5 w-full md:w-72 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-neutral-900">Filters</h3>
        <button onClick={onClearAll} className="text-xs text-brand-700 font-medium">
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <p className="text-sm font-medium text-neutral-900 mb-2">Categories</p>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategory === cat.name}
                onChange={() =>
                  onCategoryChange(selectedCategory === cat.name ? '' : cat.name)
                }
                className="rounded border-neutral-200 text-brand-700 focus:ring-brand-500"
              />
              {cat.name} ({cat.providerCount})
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="mb-6">
        <p className="text-sm font-medium text-neutral-900 mb-2">Price Range</p>
        <input
          type="range"
          min={0}
          max={20000}
          step={500}
          value={priceRange[1]}
          onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-brand-700"
        />
        <div className="flex justify-between text-xs text-neutral-400 mt-1">
          <span>PKR {priceRange[0]}</span>
          <span>PKR {priceRange[1]}</span>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <p className="text-sm font-medium text-neutral-900 mb-2">Rating</p>
        <div className="space-y-2">
          {['4.5', '4.0', '3.5'].map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={minRating === r}
                onChange={() => onMinRatingChange(minRating === r ? '' : r)}
                className="text-brand-700 focus:ring-brand-500"
              />
              <span className="text-warning-500">{'★'.repeat(Math.floor(Number(r)))}</span>
              {r} & above
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}