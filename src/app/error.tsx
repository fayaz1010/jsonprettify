"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#0F172A" }}>
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4" style={{ color: "#1E293B" }}>
          500
        </h1>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Something Went Wrong
        </h2>
        <p className="text-slate-400 mb-8">
          We&apos;re sorry, but an unexpected error occurred on our server. Please try again later.
        </p>
        <button
          onClick={() => reset()}
          className="inline-block px-6 py-3 rounded-lg font-medium text-white transition-colors hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: "#3B82F6" }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
