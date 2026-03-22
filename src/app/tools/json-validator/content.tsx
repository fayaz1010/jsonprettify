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
import { validateJson, prettifyJson } from '@/lib/json-utils';
import { FREE_TIER } from '@/lib/config';

export function JsonValidatorContent() {
  const { state, setInput, setOutput, setError, clear } = useJsonEditor();
  const { isProUser } = useSubscription();
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);

  const handleValidate = useCallback(() => {
    if (!state.input.trim()) return;
    const result = validateJson(state.input);
    if (result.valid) {
      setValidationResult({ valid: true, message: 'Valid JSON' });
      setError(null);
      const formatted = prettifyJson(state.input);
      setOutput(formatted.result || state.input);
    } else {
      setValidationResult({
        valid: false,
        message: result.error?.message || 'Invalid JSON',
      });
      setError(
        result.error
          ? { message: result.error.message, line: result.error.line, column: result.error.column }
          : null
      );
      setOutput('');
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
    const blob = new Blob([state.output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'validated.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [state.output]);

  const handleClear = useCallback(() => {
    clear();
    setValidationResult(null);
  }, [clear]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          JSON Validator - Check JSON Syntax Online
        </h1>
        <p className="text-text-secondary">
          Validate JSON syntax with precise error messages and line-level
          highlighting. Paste your JSON below and click Validate to check.
        </p>
      </div>

      <UrlFetch onFetch={setInput} />

      <div className="flex items-center gap-4 flex-wrap">
        <EditorToolbar
          onValidate={handleValidate}
          onCopy={handleCopy}
          onClear={handleClear}
          onUpload={handleUpload}
          onDownload={handleDownload}
          showPrettify={false}
          showMinify={false}
          showValidate
          validationResult={validationResult}
        />
        {!isProUser && (
          <span className="text-xs text-text-muted ml-auto">
            Max {Math.round(FREE_TIER.maxFileSizeBytes / (1024 * 1024))}MB
          </span>
        )}
      </div>

      {validationResult && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg border ${
            validationResult.valid
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          <span className="text-xl">{validationResult.valid ? '\u2713' : '\u2717'}</span>
          <span className="font-medium">{validationResult.message}</span>
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
            placeholder="Paste your JSON here to validate..."
          />
        }
        right={
          <JsonEditor
            value={state.output}
            readOnly
            placeholder="Formatted output will appear here if valid..."
          />
        }
        leftLabel="Input"
        rightLabel="Formatted Output"
      />

      <div className="bg-surface border border-border rounded-xl p-6 mt-6">
        <h2 className="text-lg font-semibold text-text-primary mb-3">
          About JSON Validator
        </h2>
        <div className="text-text-secondary text-sm space-y-2">
          <p>
            This free JSON validator checks your JSON data for syntax errors and
            provides precise error messages including the exact line and column
            where the problem occurs.
          </p>
          <h3 className="font-medium text-text-primary pt-2">Features</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Instant JSON syntax validation</li>
            <li>Precise error messages with line and column numbers</li>
            <li>Automatic pretty-printing of valid JSON</li>
            <li>Upload JSON files or fetch from a URL</li>
            <li>Clear visual feedback with green check or red X</li>
          </ul>
          <h3 className="font-medium text-text-primary pt-2">Common JSON Errors</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Missing or extra commas between elements</li>
            <li>Unquoted property names (keys must be in double quotes)</li>
            <li>Single quotes instead of double quotes</li>
            <li>Trailing commas after the last element</li>
            <li>Missing closing brackets or braces</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
