'use client';

import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PrivacyBadge({ className = '' }: { className?: string }) {
  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-4 py-2 rounded-full',
      'bg-success/10 border border-success/20',
      className,
    )}>
      <Shield className="w-4 h-4 text-success" />
      <span className="text-success text-sm font-medium">
        Client-side only: Your data stays private
      </span>
    </div>
  );
}
