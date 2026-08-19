import Link from 'next/link';
import { Provider } from '@/types/provider';
import { getImageUrl } from '@/lib/image';
import { SaveButton } from './SaveButton';

export function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-card shadow-card hover:shadow-cardHover transition-shadow p-4 flex gap-4 relative">
      <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-lg flex-shrink-0 overflow-hidden">
        {provider.user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={getImageUrl(provider.user.avatarUrl)!} alt={provider.user.name} className="w-full h-full object-cover" />
        ) : (
          provider.user.name.charAt(0)
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-base font-semibold text-neutral-900">{provider.user.name}</h3>
          {provider.verified && (
            <span className="bg-brand-100 text-brand-700 text-xs font-medium px-2 py-0.5 rounded-pill">
              ✓ Verified
            </span>
          )}
        </div>
        <p className="text-xs text-neutral-400 mt-0.5">
          {provider.category.name} · {provider.experienceYears} Years Experience
        </p>
        {provider.location && (
          <p className="text-xs text-neutral-400">📍 {provider.location}</p>
        )}
        <div className="flex items-center gap-1 mt-1 text-xs text-warning-500">
          {'★'.repeat(Math.round(provider.rating))}
          <span className="text-neutral-400">
            {provider.rating} ({provider.reviewCount})
          </span>
        </div>
      </div>

      <div className="text-right flex flex-col items-end justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <SaveButton providerId={provider.id} />
        </div>
        <div>
          <p className="text-xs text-neutral-400">Starts from</p>
          <span className="text-sm font-bold text-brand-700">PKR {provider.priceFrom}</span>
        </div>
        <Link
          href={`/providers/${provider.id}`}
          className="border border-brand-700 text-brand-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}