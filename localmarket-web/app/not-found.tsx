import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-neutral-900">404</h1>
        <p className="text-sm text-neutral-600 mt-2">Page not found.</p>
        <Link
          href="/"
          className="inline-block mt-4 bg-brand-700 hover:bg-brand-600 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}