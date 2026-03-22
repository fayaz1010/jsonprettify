'use client';

import { useCallback, useState } from 'react';
import { useJsonEditor } from '@/hooks/use-json-editor';
import { JsonEditor } from '@/components/editor/json-editor';
import { SplitPanel } from '@/components/editor/split-panel';
import { EditorToolbar } from '@/components/editor/editor-toolbar';
import { ErrorDisplay } from '@/components/editor/error-display';
import { UrlFetch } from '@/components/editor/url-fetch';
import { CopyButton } from '@/components/editor/copy-button';
import { useSubscription } from '@/context/SubscriptionContext';
import { minifyJson, prettifyJson } from '@/lib/json-utils';
import { FREE_TIER } from '@/lib/config';

export function JsonMinifierContent() {
  const { state, setInput, setOutput, setError, clear } = useJsonEditor();
  const { isProUser } = useSubscription();
  const [sizeInfo, setSizeInfo] = useState<{
    original: number;
    minified: number;
  } | null>(null);

  const handleMinify = useCallback(() => {
    if (!state.input.trim()) return;
    const result = minifyJson(state.input);
    if (result.error) {
      setError({ message: result.error.message, line: result.error.line, column: result.error.column });
      setOutput('');
      setSizeInfo(null);
    } else {
      const output = result.result || '';
      setOutput(output);
      setError(null);
      setSizeInfo({
        original: new Blob([state.input]).size,
        minified: new Blob([output]).size,
      });
    }
  }, [state.input, setOutput, setError]);

  const handlePrettify = useCallback(() => {
    if (!state.input.trim()) return;
    const result = prettifyJson(state.input);
    if (result.error) {
      setError({ message: result.error.message, line: result.error.line, column: result.error.column });
      setOutput('');
    } else {
      setOutput(result.result || '');
      setError(null);
    }
    setSizeInfo(null);
  }, [state.input, setOutput, setError]);

  const handleCopy = useCallback(() => {
    if (state.output) navigator.clipboard.writeText(state.output);
  }, [state.output]);

  const handleUpload = useCallback(
    (file: File) => {
      if (!isProUser && file.size > FREE_TIER.maxFileSizeBytes) {
        setError({
          message: `File exceeds the ${Math.round(FREE_TIER.maxFileSizeBytes / (1024 * 1024))}MB limit for free accounts. Upgrade to Pro for unlimited file sizes.`,
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => setInput((e.target?.result as string) || '');
      reader.readAsText(file);
    },
    [setInput, setError, isProUser]
  );

  const handleDownload = useCallback(() => {
    if (!state.output) return;
    const blob = new Blob([state.output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minified.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [state.output]);

  const handleClear = useCallback(() => {
    clear();
    setSizeInfo(null);
  }, [clear]);

  const savedPercentage =
    sizeInfo && sizeInfo.original > 0
      ? ((1 - sizeInfo.minified / sizeInfo.original) * 100).toFixed(1)
      : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          JSON Minifier - Compact JSON Online
        </h1>
        <p className="text-text-secondary">
          Remove all unnecessary whitespace from JSON to reduce file size. Paste
          your JSON below and click Minify to compress it.
        </p>
      </div>

      <UrlFetch onFetch={setInput} />

      <div className="flex items-center gap-4 flex-wrap">
        <EditorToolbar
          onMinify={handleMinify}
          onPrettify={handlePrettify}
          onCopy={handleCopy}
          onClear={handleClear}
          onUpload={handleUpload}
          onDownload={handleDownload}
          showMinify
          showPrettify
          showValidate={false}
        />
        {!isProUser && (
          <span className="text-xs text-text-muted ml-auto">
            Max {Math.round(FREE_TIER.maxFileSizeBytes / (1024 * 1024))}MB
          </span>
        )}
      </div>

      {sizeInfo && (
        <div className="flex items-center gap-4 p-3 rounded-lg border bg-accent/10 border-accent/30 text-sm">
          <span className="text-text-secondary">
            Original: <span className="font-medium text-text-primary">{sizeInfo.original.toLocaleString()} bytes</span>
          </span>
          <span className="text-text-secondary">
            Minified: <span className="font-medium text-text-primary">{sizeInfo.minified.toLocaleString()} bytes</span>
          </span>
          {savedPercentage && (
            <span className="text-green-400 font-medium">
              Saved {savedPercentage}%
            </span>
          )}
        </div>
      )}

      <ErrorDisplay error={state.error} />

      {state.output && (
        <div className="flex justify-end">
          <CopyButton text={state.output} />
        </div>
      )}

      <SplitPanel
        left={
          <JsonEditor
            value={state.input}
            onChange={setInput}
            placeholder="Paste your JSON here to minify..."
          />
        }
        right={
          <JsonEditor
            value={state.output}
            readOnly
            placeholder="Minified output will appear here..."
          />
        }
        leftLabel="Input"
        rightLabel="Minified Output"
      />

      <div className="bg-surface border border-border rounded-xl p-6 mt-6">
        <h2 className="text-lg font-semibold text-text-primary mb-3">
          About JSON Minifier
        </h2>
        <div className="text-text-secondary text-sm space-y-2">
          <p>
            This free JSON minifier removes all unnecessary whitespace,
            newlines, and indentation from your JSON data to produce the most
            compact representation possible.
          </p>
          <h3 className="font-medium text-text-primary pt-2">Features</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Instantly minify JSON to reduce file size</li>
            <li>See original vs minified size comparison</li>
            <li>Percentage savings displayed after minification</li>
            <li>Option to re-prettify the output</li>
            <li>Upload JSON files or fetch from a URL</li>
          </ul>
          <h3 className="font-medium text-text-primary pt-2">When to Minify JSON</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Reducing payload size for API responses</li>
            <li>Saving bandwidth in network transfers</li>
            <li>Storing JSON in databases or configuration files</li>
            <li>Embedding JSON in URLs or query parameters</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
