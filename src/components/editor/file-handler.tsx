'use client';

import { useRef } from 'react';
import { Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileHandlerProps {
  onFileLoad: (content: string) => void;
  outputContent: string;
  outputFilename?: string;
}

export function FileHandler({
  onFileLoad,
  outputContent,
  outputFilename = 'output.json',
}: FileHandlerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    </div>
  );
}
