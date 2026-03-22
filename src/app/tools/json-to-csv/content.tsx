'use client';

import { useCallback } from 'react';
import { useJsonEditor } from '@/hooks/use-json-editor';
import { JsonEditor } from '@/components/editor/json-editor';
import { SplitPanel } from '@/components/editor/split-panel';
import { EditorToolbar } from '@/components/editor/editor-toolbar';
import { ErrorDisplay } from '@/components/editor/error-display';
import { UrlFetch } from '@/components/editor/url-fetch';
import { CopyButton } from '@/components/editor/copy-button';
import { UpgradeGate } from '@/components/shared/upgrade-gate';
import { useSubscription } from '@/context/SubscriptionContext';
import { jsonToCsv } from '@/lib/converters/json-to-csv';
import { FREE_TIER } from '@/lib/config';

export function JsonToCsvContent() {
  const { state, setInput, setOutput, setError, clear } = useJsonEditor();
  const { isProUser } = useSubscription();

  const handleConvert = useCallback(() => {
    if (!state.input.trim()) return;
    const result = jsonToCsv(state.input);
    if (result.error) {
      setError({ message: result.error.message });
      setOutput('');
    } else {
      setOutput(result.result || '');
      setError(null);
    }
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
    const blob = new Blob([state.output], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [state.output]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          JSON to CSV Converter Online
        </h1>
        <p className="text-text-secondary">
          Transform JSON arrays into CSV spreadsheet format for data analysis.
          Your input must be an array of objects with consistent keys.
        </p>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-sm text-amber-300">
        <strong>Note:</strong> The input JSON must be an array of objects (e.g.,{' '}
        <code className="bg-background px-1 rounded">[{'{'}...{'}'}, {'{'}...{'}'}]</code>).
        Each object becomes a row, and the keys become column headers.
      </div>

      <UrlFetch onFetch={setInput} />

      <div className="flex items-center gap-4 flex-wrap">
        <EditorToolbar
          onPrettify={handleConvert}
          onCopy={handleCopy}
          onClear={clear}
          onUpload={handleUpload}
          onDownload={handleDownload}
          showPrettify
          prettifyLabel="Convert"
          showMinify={false}
          showValidate={false}
        />
        {!isProUser && (
          <span className="text-xs text-text-muted ml-auto">
            Max {Math.round(FREE_TIER.maxFileSizeBytes / (1024 * 1024))}MB
          </span>
        )}
      </div>

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
            placeholder='Paste your JSON array here, e.g. [{"name": "Alice", "age": 30}]'
          />
        }
        right={
          <JsonEditor
            value={state.output}
            readOnly
            placeholder="CSV output will appear here..."
          />
        }
        leftLabel="JSON Input"
        rightLabel="CSV Output"
      />

      <div className="bg-surface border border-border rounded-xl p-6 mt-6">
        <h2 className="text-lg font-semibold text-text-primary mb-3">
          About JSON to CSV Converter
        </h2>
        <div className="text-text-secondary text-sm space-y-2">
          <p>
            CSV (Comma-Separated Values) is a simple tabular format widely
            supported by spreadsheet applications like Excel and Google Sheets.
            This tool converts JSON arrays of objects into CSV format.
          </p>
          <h3 className="font-medium text-text-primary pt-2">Features</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Converts JSON arrays to CSV format</li>
            <li>Automatically extracts column headers from object keys</li>
            <li>Download output as a .csv file</li>
            <li>Upload JSON files or fetch from a URL</li>
          </ul>
          <h3 className="font-medium text-text-primary pt-2">Input Requirements</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Input must be a JSON array of objects</li>
            <li>Objects should have consistent keys for best results</li>
            <li>Nested objects will be serialized as strings</li>
            <li>Missing keys in some objects will result in empty cells</li>
          </ul>
        </div>
      </div>
      {!isProUser && (
        <UpgradeGate feature="Advanced Conversion Options (TOML, BSON)" tier="pro">
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              Advanced Conversions
            </h2>
            <p className="text-text-secondary text-sm">
              Convert JSON to TOML, BSON, and other formats with Pro.
            </p>
          </div>
        </UpgradeGate>
      )}
    </div>
  );
}
