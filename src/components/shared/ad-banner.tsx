'use client';

import { useSubscription } from '@/context/SubscriptionContext';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

interface AdBannerProps {
  position?: 'top' | 'sidebar' | 'bottom';
}

export function AdBanner({ position = 'top' }: AdBannerProps) {
  const { isProUser, loading } = useSubscription();

  if (loading || isProUser) return null;

  if (position === 'sidebar') {
    return (
      <div className="bg-surface border border-border rounded-lg p-4 text-center">
        <p className="text-text-muted text-xs uppercase tracking-wider mb-2">Advertisement</p>
        <div className="bg-surface-elevated rounded-md p-6 mb-3">
          <p className="text-text-secondary text-sm">Ad Space</p>
        </div>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
        >
          <Sparkles className="w-3 h-3" />
          Remove ads with Pro
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-text-muted text-xs uppercase tracking-wider">Ad</span>
        <div className="bg-surface-elevated rounded px-4 py-2">
          <p className="text-text-secondary text-sm">Advertisement Space</p>
        </div>
      </div>
      <Link
        href="/pricing"
        className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline shrink-0"
      >
        <Sparkles className="w-3 h-3" />
        Go ad-free
      </Link>
    </div>
  );
}
