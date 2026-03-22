'use client';

import { ReactNode } from 'react';

interface SplitPanelProps {
  left: ReactNode;
  right: ReactNode;
  leftLabel: string;
  rightLabel: string;
}

export function SplitPanel({ left, right, leftLabel, rightLabel }: SplitPanelProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-0 w-full">
      {/* Left Panel */}
      <div className="flex-1 flex flex-col bg-surface border border-border rounded-lg overflow-hidden min-h-[250px] lg:min-h-[400px]">
        <div className="px-4 py-2 border-b border-border bg-surface-elevated">
          <span className="text-sm text-text-muted font-medium">{leftLabel}</span>
        </div>
        <div className="flex-1 overflow-auto">{left}</div>
      </div>

      {/* Divider */}
      <div className="hidden lg:block w-[2px] bg-border shrink-0" />
      <div className="block lg:hidden h-[2px] bg-border shrink-0" />

      {/* Right Panel */}
      <div className="flex-1 flex flex-col bg-surface border border-border rounded-lg overflow-hidden min-h-[250px] lg:min-h-[400px]">
        <div className="px-4 py-2 border-b border-border bg-surface-elevated">
          <span className="text-sm text-text-muted font-medium">{rightLabel}</span>
        </div>
        <div className="flex-1 overflow-auto">{right}</div>
      </div>
    </div>
  );
}
