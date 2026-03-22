'use client';

import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: {
    message: string;
    line?: number;
    column?: number;
  } | null;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;

  const location =
    error.line !== undefined
      ? error.column !== undefined
        ? ` (Line ${error.line}, Column ${error.column})`
        : ` (Line ${error.line})`
      : '';

  return (
    <div className="flex items-start gap-2 bg-error/10 border border-error/30 text-error rounded-md p-3">
      <AlertCircle size={18} className="shrink-0 mt-0.5" />
      <p className="text-sm">
        {error.message}
        {location && <span className="text-error/70">{location}</span>}
      </p>
    </div>
  );
}
