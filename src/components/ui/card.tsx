'use client';

import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`bg-surface border border-border rounded-lg p-6
        ${hover ? 'hover:border-accent/50 hover:shadow-md transition-all duration-200' : ''}
        ${className}`}
    >
      {children}
    </div>
  );
}
