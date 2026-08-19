import Link from 'next/link';

export function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <span className="inline-flex items-center gap-1.5 bg-brand-100 text-brand-700 text-xs font-medium px-3 py-1 rounded-pill">
          ⚡ AI Powered
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight mt-4">
          AI Powered Local Marketplace
        </h1>
        <p className="text-sm text-neutral-600 mt-4 max-w-md">
          Find trusted local services or offer your skills to thousands of customers in your area.
        </p>
        <div className="flex gap-3 mt-6">
          <Link
            href="/browse"
            className="bg-brand-700 hover:bg-brand-600 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            I need a service
          </Link>
          <Link
            href="/for-providers"
            className="border border-neutral-200 text-neutral-900 font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            I want to provide
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-10">
          <div>
            <p className="text-2xl font-bold text-neutral-900">10K+</p>
            <p className="text-xs text-neutral-400">Happy Users</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900">5K+</p>
            <p className="text-xs text-neutral-400">Service Providers</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900">50+</p>
            <p className="text-xs text-neutral-400">Service Categories</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900">4.8 ★</p>
            <p className="text-xs text-neutral-400">Average Rating</p>
          </div>
        </div>
      </div>

      {/* Phone mockup */}
      <div className="flex justify-center">
        <div className="w-72 bg-neutral-900 rounded-[2.5rem] p-3 shadow-cardHover">
          <div className="bg-white rounded-[2rem] p-4 min-h-[500px]">
            <div className="bg-brand-900 rounded-xl p-4 text-white text-center mb-4">
              <p className="text-sm font-semibold">Voice Assistant</p>
              <div className="flex items-center justify-center gap-1 mt-3 h-8">
                {[4, 8, 5, 10, 6, 9, 4].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-brand-500 rounded-full"
                    style={{ height: `${h * 3}px` }}
                  />
                ))}
              </div>
            </div>
            <div className="bg-neutral-100 rounded-xl p-3 mb-2 text-sm text-neutral-900">
              I need a plumber to fix my kitchen sink
            </div>
            <div className="bg-brand-50 rounded-xl p-3 text-sm text-neutral-900">
              Sure! I found some trusted plumbers near you.
            </div>
            <p className="text-center text-xs text-neutral-400 mt-4">AI is listening...</p>
          </div>
        </div>
      </div>
    </section>
  );
}