import { ShieldCheck, Headphones, Award } from 'lucide-react';

const badges = [
  { icon: ShieldCheck, title: 'Secure & Safe' },
  { icon: Headphones, title: '24/7 Support' },
  { icon: Award, title: 'Quality Assured' },
];

export function TrustBadges() {
  return (
    <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-neutral-200">
      {badges.map((b) => (
        <div key={b.title} className="flex items-center gap-1.5 whitespace-nowrap">
          <b.icon className="w-3.5 h-3.5 text-brand-700 flex-shrink-0" />
          <p className="text-[11px] font-medium text-neutral-700">{b.title}</p>
        </div>
      ))}
    </div>
  );
}