import Link from 'next/link';

export function ProviderBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="bg-brand-900 rounded-card p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center overflow-hidden">
        <div>
          <h2 className="text-2xl font-bold text-white">For Service Providers</h2>
          <p className="text-sm text-brand-100 mt-1">Grow your business with us</p>

          <ul className="mt-6 space-y-2 text-sm text-white">
            {[
              'Get more leads and customers',
              'Manage bookings easily',
              'Build your reputation',
              'Secure payments',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-brand-500">✓</span> {item}
              </li>
            ))}
          </ul>

          <div className="flex gap-3 mt-6">
            <Link
              href="/signup"
              className="bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
            >
              Join as Provider
            </Link>
            <Link
              href="/how-it-works"
              className="border border-white/30 text-white font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="bg-white/10 rounded-2xl p-6 text-white text-center">
            <p className="text-3xl font-bold">4.8 ★</p>
            <p className="text-xs text-brand-100 mt-1">Top Rated Provider</p>
          </div>
        </div>
      </div>
    </section>
  );
}