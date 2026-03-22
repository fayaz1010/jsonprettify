'use client';

import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className={cn(
        'relative inline-flex items-center justify-center w-9 h-9 rounded-lg',
        'bg-surface-elevated text-text-primary',
        'hover:bg-border/50 transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        className,
      )}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
    </button>
  );
}
