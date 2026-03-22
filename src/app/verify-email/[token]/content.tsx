'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function VerifyEmailContent() {
  const params = useParams();
  const token = params.token as string;
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided.');
        return;
      }

      try {
        const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setStatus('success');
          setMessage('Email verified successfully! You can now log in.');
        } else {
          setStatus('error');
          setMessage(
            data.error ||
            'Email verification failed. The link may be invalid or expired. Please try again or contact support.'
          );
        }
      } catch {
        setStatus('error');
        setMessage('Email verification failed. The link may be invalid or expired. Please try again or contact support.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="bg-surface border border-border rounded-xl p-8 text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="w-12 h-12 text-[#3B82F6] animate-spin mx-auto mb-4" />
                <h1
                  className="text-2xl font-bold text-[#E2E8F0] mb-3"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Verifying Your Email
                </h1>
                <p className="text-[#94A3B8]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Please wait while we verify your email address...
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="w-12 h-12 text-[#22C55E] mx-auto mb-4" />
                <h1
                  className="text-2xl font-bold text-[#E2E8F0] mb-3"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Email Verified
                </h1>
                <p
                  className="text-[#22C55E] mb-6"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {message}
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#3B82F6] text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Go to Login
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle className="w-12 h-12 text-[#EF4444] mx-auto mb-4" />
                <h1
                  className="text-2xl font-bold text-[#E2E8F0] mb-3"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Verification Failed
                </h1>
                <p
                  className="text-[#EF4444] mb-6"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {message}
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#3B82F6] text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Sign Up Again
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
