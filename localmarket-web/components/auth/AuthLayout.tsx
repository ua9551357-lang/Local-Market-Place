import Link from 'next/link';
import { ShoppingBag, ShieldCheck, Tag, Zap } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const defaultFeatures: Feature[] = [
  { icon: <ShieldCheck className="w-4 h-4" />, title: 'Trusted Local Providers', description: 'Verified professionals in your area' },
  { icon: <Tag className="w-4 h-4" />, title: 'Fair Pricing', description: 'Transparent rates, no surprises' },
  { icon: <Zap className="w-4 h-4" />, title: 'Fast Response', description: 'Get matched with providers quickly' },
];

export function AuthLayout({
  children,
  heading = 'Find Local. Trust Local.',
  subheading = 'Connect with verified local service providers in your community.',
  features = defaultFeatures,
}: {
  children: React.ReactNode;
  heading?: string;
  subheading?: string;
  features?: Feature[];
}) {
  return (
    <div className="fixed inset-0 flex bg-neutral-100 overflow-hidden">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[42%] relative bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white flex-col justify-between p-8 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full border border-white/10" />

        <Link href="/" className="flex items-center gap-2 font-bold text-lg relative z-10">
          <span className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-white" />
          </span>
          LocalMarket
        </Link>

        <div className="relative z-10">
          <h2 className="text-2xl font-bold leading-tight">{heading}</h2>
          <p className="text-xs text-brand-100 mt-2 max-w-xs">{subheading}</p>

          <div className="mt-5 space-y-3">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  {f.icon}
                </span>
                <div>
                  <p className="text-xs font-semibold">{f.title}</p>
                  <p className="text-[11px] text-brand-100">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-end gap-1.5 h-10 opacity-70">
          <div className="w-8 h-6 bg-brand-500/40 rounded-t-sm" />
          <div className="w-10 h-9 bg-brand-500/50 rounded-t-sm" />
          <div className="w-7 h-5 bg-brand-500/30 rounded-t-sm" />
          <div className="w-9 h-10 bg-brand-500/60 rounded-t-sm" />
          <div className="w-6 h-6 bg-brand-500/35 rounded-t-sm" />
          <div className="w-11 h-8 bg-brand-500/45 rounded-t-sm" />
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1 flex items-center justify-center px-4 py-3 overflow-y-auto">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}