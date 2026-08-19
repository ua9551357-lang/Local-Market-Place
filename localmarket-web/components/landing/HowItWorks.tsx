const steps = [
  { num: 1, title: 'Tell Us What You Need', desc: 'Use voice or text to describe your service need' },
  { num: 2, title: 'Get Matched', desc: 'Our AI finds the best local service providers for you' },
  { num: 3, title: 'Book & Relax', desc: 'Choose, book, and get your service done' },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
        <h2 className="text-2xl font-bold text-neutral-900">How It Works</h2>
        <p className="text-sm text-neutral-600 mt-1">Get things done in 3 simple steps</p>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-neutral-100 rounded-card p-6 flex flex-col items-center text-center"
            >
              <span className="w-9 h-9 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-sm mb-4">
                {step.num}
              </span>
              <h3 className="text-lg font-semibold text-neutral-900">{step.title}</h3>
              <p className="text-sm text-neutral-600 mt-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}