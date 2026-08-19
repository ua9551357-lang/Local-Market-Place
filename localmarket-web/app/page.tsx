import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/landing/Hero';
import { PopularServices } from '@/components/landing/PopularServices';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { ProviderBanner } from '@/components/landing/ProviderBanner';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <PopularServices />
        <HowItWorks />
        <ProviderBanner />
      </main>
      <Footer />
    </div>
  );
}