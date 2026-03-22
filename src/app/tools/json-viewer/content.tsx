'use client';

import { useState, useCallback, useMemo } from 'react';
import { JsonEditor } from '@/components/editor/json-editor';
import { SplitPanel } from '@/components/editor/split-panel';
import { ErrorDisplay } from '@/components/editor/error-display';
import { TreeView } from '@/components/editor/tree-view';
import { UrlFetch } from '@/components/editor/url-fetch';
import { useSubscription } from '@/context/SubscriptionContext';
import { FREE_TIER } from '@/lib/config';
import { Upload } from 'lucide-react';

export function JsonViewerContent() {
  const [input, setInput] = useState('');
  const [uploadError, setUploadError] = useState<{ message: string } | null>(null);
  const { isProUser } = useSubscription();

  const parseResult = useMemo(() => {
    if (!input.trim()) {
      return { data: undefined, error: null };
    }
    try {
      const data = JSON.parse(input);
      return { data, error: null };
    } catch (e) {
      return {
        data: undefined,
        error: { message: e instanceof Error ? e.message : String(e) },
      };
    }
  }, [input]);

  const parsedData = parseResult.data;
  const error = parseResult.error || uploadError;

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!isProUser && file.size > FREE_TIER.maxFileSizeBytes) {
      setUploadError({
        message: `File exceeds the ${Math.round(FREE_TIER.maxFileSizeBytes / (1024 * 1024))}MB limit for free accounts. Upgrade to Pro for unlimited file sizes.`,
      });
      event.target.value = '';
      return;
    }
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        setInput(content);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }, [isProUser]);

  const handleUrlFetch = useCallback((content: string) => {
    setUploadError(null);
    setInput(content);
  }, []);

  const handleClear = useCallback(() => {
    setInput('');
    setUploadError(null);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">JSON Viewer</h1>
        <p className="text-text-secondary">Navigate complex nested JSON with an interactive, collapsible tree view.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <label className="px-4 py-2 bg-surface-elevated text-text-primary rounded-lg text-sm font-medium hover:bg-surface transition-colors cursor-pointer flex items-center gap-2 border border-border">
          <Upload className="w-4 h-4" />
          Upload File
          <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
        </label>
        <UrlFetch onFetch={handleUrlFetch} />
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-surface-elevated text-text-primary rounded-lg text-sm font-medium hover:bg-surface transition-colors border border-border"
        >
          Clear
        </button>
        {!isProUser && (
          <span className="text-xs text-text-muted self-center">
            Max {Math.round(FREE_TIER.maxFileSizeBytes / (1024 * 1024))}MB
          </span>
        )}
      </div>

      <ErrorDisplay error={error} />

      <SplitPanel
        leftLabel="JSON Input"
        rightLabel="Tree View"
        left={
          <JsonEditor
            value={input}
            onChange={setInput}
            readOnly={false}
            placeholder='{"name": "John", "address": {"city": "NYC"}, "hobbies": ["reading", "coding"]}'
          />
        }
        right={
          <div className="h-full overflow-auto p-4">
            {parsedData !== undefined ? (
              <TreeView data={parsedData} level={0} />
            ) : (
              <p className="text-text-secondary text-sm italic">
                {input.trim() ? 'Fix the JSON errors to see the tree view.' : 'Paste or upload JSON to see the interactive tree view.'}
              </p>
            )}
          </div>
        }
      />

      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-3">About JSON Viewer</h2>
        <p className="text-text-secondary text-sm leading-relaxed">
          The JSON Viewer renders your JSON data as an interactive, collapsible tree.
          Expand and collapse nodes to navigate deeply nested structures, inspect arrays and objects,
          and quickly understand the shape of your data. Supports file upload and fetching JSON from URLs.
        </p>
      </div>
    </div>
  );
}
