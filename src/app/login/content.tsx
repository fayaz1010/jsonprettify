'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { LogIn, Loader2, CheckCircle } from 'lucide-react';

export function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get('reset') === 'success';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome Back</h1>
            <p className="text-text-secondary">Sign in to access your JSON Prettify account.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-8 space-y-6">
            {resetSuccess && (
              <div className="p-3 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#22C55E] mt-0.5 shrink-0" />
                <p className="text-sm text-[#22C55E]">Your password has been reset successfully. You can now log in with your new password.</p>
              </div>
            )}
            {error && (
              <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20">
                <p className="text-sm text-[#EF4444]">{error}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-primary-dark border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-primary-dark border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-text-secondary">
                <input type="checkbox" className="rounded border-border" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-sm text-accent hover:underline">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-text-secondary text-sm mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-accent hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
