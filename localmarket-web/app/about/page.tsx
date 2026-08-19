import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const stats = [
  { value: '10K+', label: 'Happy Users' },
  { value: '5K+', label: 'Service Providers' },
  { value: '50+', label: 'Service Categories' },
  { value: '4.8★', label: 'Average Rating' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">About LocalMarket</h1>
          <p className="text-sm text-neutral-600 mt-3 max-w-xl mx-auto">
            LocalMarket connects customers with trusted, verified local service providers —
            from plumbers and electricians to tutors and cleaners — making it easy to get
            things done in your neighborhood.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {stats.map((s) => (
            <div key={s.label} className="bg-white border border-neutral-200 rounded-card p-5 text-center">
              <p className="text-2xl font-bold text-neutral-900">{s.value}</p>
              <p className="text-xs text-neutral-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Our Mission</h2>
            <p className="text-sm text-neutral-600 mt-2">
              We believe finding reliable local help shouldn&apos;t be a hassle. Our AI-powered
              platform matches you with verified professionals based on ratings, pricing, and
              availability — saving you time and giving you peace of mind.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Why Choose Us</h2>
            <ul className="text-sm text-neutral-600 mt-2 space-y-1.5 list-disc list-inside">
              <li>Verified and background-checked service providers</li>
              <li>Transparent pricing with no hidden fees</li>
              <li>Secure payments and real-time booking tracking</li>
              <li>Responsive customer support whenever you need it</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}