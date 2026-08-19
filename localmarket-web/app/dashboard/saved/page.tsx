'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { useSavedProviders, useToggleSaveProvider } from '@/hooks/useSavedProviders';
import { getImageUrl } from '@/lib/image';

function SavedProvidersContent() {
  const { data: providers, isLoading } = useSavedProviders();
  const toggleSave = useToggleSaveProvider();

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <DashboardSidebar />
      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">Saved Providers</h1>
        <p className="text-sm text-neutral-400 mb-4">Providers you&apos;ve saved for later</p>

        {isLoading ? (
          <p className="text-sm text-neutral-400">Loading...</p>
        ) : providers?.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-card p-10 text-center max-w-md">
            <Heart className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
            <p className="text-sm text-neutral-600 font-medium">No saved providers yet</p>
            <p className="text-xs text-neutral-400 mt-1">
              Tap the heart icon on any provider card to save them here.
            </p>
            <Link
              href="/browse"
              className="inline-block mt-4 bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Browse Providers
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
            {providers?.map((provider: any) => (
              <div
                key={provider.id}
                className="bg-white border border-neutral-200 rounded-card p-4 flex gap-4 relative"
              >
                <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold overflow-hidden flex-shrink-0">
                  {provider.user.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getImageUrl(provider.user.avatarUrl)!}
                      alt={provider.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    provider.user.name.charAt(0)
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-neutral-900">{provider.user.name}</h3>
                    {provider.verified && (
                      <span className="bg-brand-100 text-brand-700 text-[10px] font-medium px-1.5 py-0.5 rounded-pill">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">{provider.category.name}</p>
                  <p className="text-xs text-warning-500 mt-1">
                    {'★'.repeat(Math.round(provider.rating))}{' '}
                    <span className="text-neutral-400">({provider.reviewCount})</span>
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <Link
                      href={`/providers/${provider.id}`}
                      className="text-xs text-brand-700 font-medium hover:underline"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => toggleSave.mutate(provider.id)}
                      className="text-xs text-danger-500 font-medium hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function SavedProvidersPage() {
  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <SavedProvidersContent />
    </ProtectedRoute>
  );
}