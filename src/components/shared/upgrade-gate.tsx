'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';

interface UpgradeGateProps {
  feature: string;
  tier?: 'pro' | 'enterprise';
  children: React.ReactNode;
}

export function UpgradeGate({ feature, tier = 'pro', children }: UpgradeGateProps) {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="relative">
      <div
        className="relative cursor-pointer"
        onClick={() => setShowOverlay(true)}
      >
        <div className="pointer-events-none opacity-50 blur-[1px]">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-primary-dark/60 rounded-lg backdrop-blur-sm">
          <div className="text-center p-6">
            <Lock className="w-8 h-8 text-accent mx-auto mb-3" />
            <p className="text-text-primary font-semibold mb-1">
              {tier === 'enterprise' ? 'Enterprise' : 'Pro'} Feature
            </p>
            <p className="text-text-secondary text-sm mb-4">
              Upgrade to unlock {feature}
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center px-4 py-2 bg-accent text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              Upgrade to {tier === 'enterprise' ? 'Enterprise' : 'Pro'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
