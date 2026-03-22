'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Mail, Loader2, CheckCircle } from 'lucide-react';

export function ForgotPasswordContent() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'An error occurred. Please try again.');
      } else {
        setSuccess(data.message);
      }
    } catch {
      setError('An error occurred. Please try again.');
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
            <h1 className="text-3xl font-bold text-text-primary mb-2">Forgot Your Password?</h1>
            <p className="text-text-secondary">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-8 space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20">
                <p className="text-sm text-[#EF4444]">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-3 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#22C55E] mt-0.5 shrink-0" />
                <p className="text-sm text-[#22C55E]">{success}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-primary-dark border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !!success}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="text-center text-text-secondary text-sm mt-6">
            Remember your password?{' '}
            <Link href="/login" className="text-accent hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
