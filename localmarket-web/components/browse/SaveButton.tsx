'use client';

import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useSavedProviderIds, useToggleSaveProvider } from '@/hooks/useSavedProviders';

export function SaveButton({ providerId, className = '' }: { providerId: string; className?: string }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: savedIds } = useSavedProviderIds();
  const toggleSave = useToggleSaveProvider();

  const isSaved = savedIds?.includes(providerId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push('/login');
      return;
    }
    toggleSave.mutate(providerId);
  };

  return (
    <button
      onClick={handleClick}
      disabled={toggleSave.isPending}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
        isSaved ? 'bg-red-50 text-red-500' : 'bg-neutral-100 text-neutral-400 hover:text-red-500'
      } ${className}`}
    >
      <Heart size={15} fill={isSaved ? 'currentColor' : 'none'} />
    </button>
  );
}