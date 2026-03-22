'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { UserPlus, Loader2, Mail } from 'lucide-react';

export function SignupPageContent() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

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

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else if (data.requiresVerification) {
        setVerificationSent(true);
      } else {
        router.push('/login');
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
          {verificationSent ? (
            <div className="bg-surface border border-border rounded-xl p-8 text-center">
              <div className="flex justify-center mb-4">
                <Mail className="w-12 h-12 text-[#3B82F6]" />
              </div>
              <h1 className="text-2xl font-bold text-[#E2E8F0] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                Check Your Email
              </h1>
              <p className="text-[#E2E8F0] mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                Thank you for signing up! Please check your email to verify your account.
              </p>
              <p className="text-[#94A3B8] text-sm mb-6">
                We sent a verification link to <span className="font-medium text-[#E2E8F0]">{email}</span>.
                Please click the link in the email to activate your account.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#3B82F6] text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Go to Login
              </Link>
            </div>
          ) : (
          <>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Create Your Account</h1>
            <p className="text-text-secondary">Start your 14-day free trial of Pro features.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-8 space-y-6">
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
                placeholder="Create a password (min. 6 characters)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-primary-dark border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                placeholder="Confirm your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
            <p className="text-xs text-text-muted text-center">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-accent hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
            </p>
          </form>

          <p className="text-center text-text-secondary text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-accent hover:underline font-medium">
              Sign in
            </Link>
          </p>
          </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
