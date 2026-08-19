'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
      <div className="text-center max-w-md">
        <h2 className="text-xl font-bold text-neutral-900">Something went wrong</h2>
        <p className="text-sm text-neutral-600 mt-2">
          We hit an unexpected error. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-4 bg-brand-700 hover:bg-brand-600 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}