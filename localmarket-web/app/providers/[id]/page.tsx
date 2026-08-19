'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useProviderDetail, useProviderReviews } from '@/hooks/useProviderDetail';
import { ProfileTabs } from '@/components/provider/ProfileTabs';
import { BookingPanel } from '@/components/provider/BookingPanel';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { getImageUrl } from '@/lib/image';

export default function ProviderProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: provider, isLoading } = useProviderDetail(id);
  const { data: reviews } = useProviderReviews(id);
  const [isMessaging, setIsMessaging] = useState(false);

  const handleMessage = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setIsMessaging(true);
    try {
      await api.post('/threads', { providerId: id });
      router.push('/dashboard/messages');
    } catch {
      // fail silently but stop loading state
    } finally {
      setIsMessaging(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-sm text-neutral-400">Loading...</div>
        <Footer />
      </>
    );
  }

  if (!provider) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-sm text-neutral-400">Provider not found.</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <p className="text-sm text-neutral-400 mb-4">
          Home &gt; Browse Services &gt; {provider.user.name}
        </p>

        {/* Header card */}
        <div className="bg-white border border-neutral-200 rounded-card p-5 flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-2xl flex-shrink-0 overflow-hidden">
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
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-neutral-900">{provider.user.name}</h1>
              {provider.verified && (
                <span className="bg-brand-100 text-brand-700 text-xs font-medium px-2 py-0.5 rounded-pill">
                  ✓ Verified Provider
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-600 mt-1">
              {provider.category.name} · {provider.experienceYears} Years Experience
            </p>
            <p className="text-xs text-neutral-400">📍 {provider.location}</p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-lg font-bold text-neutral-900">{provider.rating}%</p>
              <p className="text-xs text-neutral-400">Response Rate</p>
            </div>
            <div>
              <p className="text-lg font-bold text-neutral-900">{provider.reviewCount}</p>
              <p className="text-xs text-neutral-400">Reviews</p>
            </div>
          </div>
          <button
            onClick={handleMessage}
            disabled={isMessaging}
            className="border border-brand-700 text-brand-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-50 transition-colors disabled:opacity-60 flex-shrink-0"
          >
            {isMessaging ? 'Opening...' : '💬 Message'}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ProfileTabs provider={provider} reviews={reviews || []} />
          </div>
          <div>
            <BookingPanel providerId={provider.id} services={provider.services} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}