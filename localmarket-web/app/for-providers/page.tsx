import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const benefits = [
  { icon: '📈', title: 'Grow Your Business', desc: 'Get discovered by thousands of customers actively searching for your services.' },
  { icon: '📅', title: 'Manage Bookings Easily', desc: 'Accept, decline, and track jobs from one simple dashboard.' },
  { icon: '💳', title: 'Get Paid Securely', desc: 'Cash-on-service or online payments — track earnings and request payouts anytime.' },
  { icon: '⭐', title: 'Build Your Reputation', desc: 'Collect verified reviews from real customers to stand out from the competition.' },
];

export default function ForProvidersPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-brand-900 text-white">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-16 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Grow Your Business with LocalMarket</h1>
            <p className="text-sm text-brand-100 mt-3 max-w-lg mx-auto">
              Join thousands of trusted service providers earning more by connecting with customers in their area.
            </p>
            <Link
              href="/for-providers/apply"
              className="inline-block mt-6 bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm px-6 py-3 rounded-lg transition-colors"
            >
              Apply as a Provider
            </Link>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 md:px-6 py-14">
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white border border-neutral-200 rounded-card p-6">
                <span className="text-3xl">{b.icon}</span>
                <h3 className="text-base font-semibold text-neutral-900 mt-3">{b.title}</h3>
                <p className="text-sm text-neutral-600 mt-1">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-brand-50 py-14">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-xl font-bold text-neutral-900">Ready to join?</h2>
            <p className="text-sm text-neutral-600 mt-1">
              Applications are reviewed within 24-48 hours by our team.
            </p>
            <Link
              href="/for-providers/apply"
              className="inline-block mt-4 bg-brand-700 hover:bg-brand-600 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}