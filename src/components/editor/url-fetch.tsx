'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UrlFetchProps {
  onFetch: (content: string) => void;
}

export function UrlFetch({ onFetch }: UrlFetchProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url.trim());
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const text = await response.text();
      onFetch(text);
    } catch (err) {
      if (err instanceof TypeError) {
        setError('Network error: Unable to fetch URL. This may be caused by CORS restrictions.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFetch();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Globe
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://api.example.com/data.json"
            className="w-full pl-9 pr-3 py-2 bg-primary-dark border border-border rounded-md text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleFetch}
          disabled={loading || !url.trim()}
        >
          {loading ? 'Fetching...' : 'Fetch'}
        </Button>
      </div>

      {error && (
        <p className="text-xs text-error">{error}</p>
      )}
    </div>
  );
}
