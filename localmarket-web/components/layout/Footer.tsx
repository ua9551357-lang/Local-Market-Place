export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <p className="text-white font-bold text-lg mb-3">LocalMarket</p>
          <p className="text-sm">AI-powered local services marketplace connecting you with trusted providers.</p>
        </div>
        <div>
          <p className="text-white font-semibold mb-3 text-sm">Company</p>
          <ul className="space-y-2 text-sm">
            <li>About Us</li>
            <li>How It Works</li>
            <li>Careers</li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-3 text-sm">For Providers</p>
          <ul className="space-y-2 text-sm">
            <li>Join as Provider</li>
            <li>Provider Resources</li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-3 text-sm">Support</p>
          <ul className="space-y-2 text-sm">
            <li>Help Center</li>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-10 pt-6 border-t border-neutral-800 text-xs">
        © 2026 LocalMarket. All rights reserved.
      </div>
    </footer>
  );
}