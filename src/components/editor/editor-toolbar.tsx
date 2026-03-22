'use client';

import { useRef } from 'react';
import {
  Wand2,
  Minimize2,
  CheckCircle,
  Copy,
  Upload,
  Download,
  Trash2,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ValidationResult {
  valid: boolean;
  message: string;
}

interface EditorToolbarProps {
  onPrettify?: () => void;
  onMinify?: () => void;
  onValidate?: () => void;
  onCopy?: () => void;
  onClear?: () => void;
  onUpload?: (file: File) => void;
  onDownload?: () => void;
  showPrettify?: boolean;
  showMinify?: boolean;
  showValidate?: boolean;
  validationResult?: ValidationResult | null;
}

export function EditorToolbar({
  onPrettify,
  onMinify,
  onValidate,
  onCopy,
  onClear,
  onUpload,
  onDownload,
  showPrettify = true,
  showMinify = true,
  showValidate = true,
  validationResult = null,
}: EditorToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload?.(file);
      // Reset so the same file can be re-uploaded
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2">
      {/* Left group: action buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {showPrettify && (
          <Button
            variant="primary"
            size="sm"
            icon={<Wand2 size={16} />}
            onClick={onPrettify}
          >
            Prettify
          </Button>
        )}
        {showMinify && (
          <Button
            variant="secondary"
            size="sm"
            icon={<Minimize2 size={16} />}
            onClick={onMinify}
          >
            Minify
          </Button>
        )}
        {showValidate && (
          <Button
            variant="secondary"
            size="sm"
            icon={<CheckCircle size={16} />}
            onClick={onValidate}
          >
            Validate
          </Button>
        )}

        {validationResult && (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              validationResult.valid
                ? 'bg-success/10 text-success'
                : 'bg-error/10 text-error'
            }`}
          >
            {validationResult.valid ? (
              <CheckCircle size={14} />
            ) : (
              <XCircle size={14} />
            )}
            {validationResult.message}
          </span>
        )}
      </div>

      {/* Right group: utility buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          icon={<Copy size={16} />}
          onClick={onCopy}
        >
          Copy
        </Button>

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
          onChange={handleFileChange}
          className="hidden"
        />

        <Button
          variant="ghost"
          size="sm"
          icon={<Download size={16} />}
          onClick={onDownload}
        >
          Download
        </Button>

        <Button
          variant="ghost"
          size="sm"
          icon={<Trash2 size={16} />}
          onClick={onClear}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
