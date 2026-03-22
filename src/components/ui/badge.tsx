'use client';

import React, { ReactNode } from 'react';

type BadgeVariant = 'free' | 'pro' | 'enterprise' | 'default';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  free: 'bg-success/10 text-success',
  pro: 'bg-accent/10 text-accent',
  enterprise: 'bg-warning/10 text-warning',
  default: 'bg-surface-elevated text-text-secondary',
};

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
