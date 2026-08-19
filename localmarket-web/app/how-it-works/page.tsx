import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const steps = [
  {
    num: 1,
    title: 'Search or Speak',
    desc: 'Type what you need, or use our AI voice assistant to describe your service request naturally.',
  },
  {
    num: 2,
    title: 'Compare Providers',
    desc: 'Browse verified, rated local providers filtered by price, rating, and availability near you.',
  },
  {
    num: 3,
    title: 'Book Instantly',
    desc: 'Pick a date and time, add details about your issue, and confirm your booking in seconds.',
  },
  {
    num: 4,
    title: 'Pay Securely',
    desc: 'Choose cash-on-service or pay online — your payment is protected until the job is done.',
  },
  {
    num: 5,
    title: 'Rate & Review',
    desc: 'After service completion, leave a review to help the community find trusted providers.',
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">How LocalMarket Works</h1>
          <p className="text-sm text-neutral-600 mt-3 max-w-xl mx-auto">
            Getting help from a trusted local professional takes just a few minutes.
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.num} className="flex gap-5 items-start">
              <span className="w-10 h-10 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {step.num}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">{step.title}</h3>
                <p className="text-sm text-neutral-600 mt-1 max-w-lg">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-brand-50 rounded-card p-8 mt-14 text-center">
          <h2 className="text-xl font-bold text-neutral-900">Ready to get started?</h2>
          <p className="text-sm text-neutral-600 mt-1">Find a trusted provider near you today.</p>
          <Link
            href="/browse"
            className="inline-block mt-4 bg-brand-700 hover:bg-brand-600 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors"
          >
            Browse Services
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}