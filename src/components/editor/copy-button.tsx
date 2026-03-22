'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CopyButtonProps {
  text: string;
  label?: string;
}

export function CopyButton({ text, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing if clipboard API is unavailable
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      icon={copied ? <Check size={16} /> : <Copy size={16} />}
      onClick={handleCopy}
    >
      {copied ? 'Copied!' : label}
    </Button>
  );
}
