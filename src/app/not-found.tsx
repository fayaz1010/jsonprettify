import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#0F172A" }}>
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4" style={{ color: "#1E293B" }}>
          404
        </h1>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-slate-400 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-lg font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: "#3B82F6" }}
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
