'use client';

import { useRef, useState } from 'react';
import { Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FREE_TIER, PRO_TIER } from '@/lib/config';

interface FileHandlerProps {
  onFileLoad: (content: string) => void;
  outputContent: string;
  outputFilename?: string;
  isPro?: boolean;
}

export function FileHandler({
  onFileLoad,
  outputContent,
  outputFilename = 'output.json',
  isPro = false,
}: FileHandlerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);

  const maxFileSize = isPro ? PRO_TIER.maxFileSizeBytes : FREE_TIER.maxFileSizeBytes;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileSizeError(null);

    if (file.size > maxFileSize) {
      const limitMB = Math.round(maxFileSize / (1024 * 1024));
      setFileSizeError(
        `File exceeds the ${limitMB}MB limit for free accounts. Upgrade to Pro for unlimited file sizes.`
      );
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        onFileLoad(text);
      }
    };
    reader.readAsText(file);

    // Reset so the same file can be re-uploaded
    e.target.value = '';
  };

  const handleDownload = () => {
    if (!outputContent) return;

    const blob = new Blob([outputContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = outputFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          icon={<Upload size={16} />}
          onClick={() => fileInputRef.current?.click()}
        >
          Upload
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.txt"
          onChange={handleUpload}
          className="hidden"
        />

        <Button
          variant="ghost"
          size="sm"
          icon={<Download size={16} />}
          onClick={handleDownload}
          disabled={!outputContent}
        >
          Download
        </Button>

        {!isPro && (
          <span className="text-xs text-text-muted">
            Max {Math.round(FREE_TIER.maxFileSizeBytes / (1024 * 1024))}MB
          </span>
        )}
      </div>

      {fileSizeError && (
        <p className="text-sm text-error bg-error/10 border border-error/20 rounded-lg px-3 py-2">
          {fileSizeError}
        </p>
      )}
    </div>
  );
}
