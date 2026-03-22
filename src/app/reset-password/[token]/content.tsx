'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { KeyRound, Loader2 } from 'lucide-react';

interface ResetPasswordContentProps {
  token: string;
}

export function ResetPasswordContent({ token }: ResetPasswordContentProps) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Password is required');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'An error occurred during password reset. Please try again.');
      } else {
        // Redirect to login with success message
        router.push('/login?reset=success');
      }
    } catch {
      setError('An error occurred during password reset. Please try again.');
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
            <h1 className="text-3xl font-bold text-text-primary mb-2">Reset Your Password</h1>
            <p className="text-text-secondary">Enter your new password below.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-8 space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20">
                <p className="text-sm text-[#EF4444]">{error}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-primary-dark border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                placeholder="Minimum 8 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-primary-dark border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                placeholder="Re-enter your new password"
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
                <KeyRound className="w-4 h-4" />
              )}
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <p className="text-center text-text-secondary text-sm mt-6">
            <Link href="/login" className="text-accent hover:underline font-medium">
              Back to Login
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
