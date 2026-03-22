'use client';

import { useCallback, useState, useMemo } from 'react';
import { useJsonEditor } from '@/hooks/use-json-editor';
import { JsonEditor } from '@/components/editor/json-editor';
import { SplitPanel } from '@/components/editor/split-panel';
import { EditorToolbar } from '@/components/editor/editor-toolbar';
import { ErrorDisplay } from '@/components/editor/error-display';
import { TreeView } from '@/components/editor/tree-view';
import { UrlFetch } from '@/components/editor/url-fetch';
import { CopyButton } from '@/components/editor/copy-button';
import { useSubscription } from '@/context/SubscriptionContext';
import { prettifyJson, minifyJson, validateJson } from '@/lib/json-utils';
import { FREE_TIER } from '@/lib/config';

type OutputView = 'code' | 'tree';

export function JsonFormatterContent() {
  const { state, setInput, setOutput, setError, clear } = useJsonEditor();
  const { isProUser } = useSubscription();
  const [indent, setIndent] = useState(2);
  const [outputView, setOutputView] = useState<OutputView>('code');
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);

  const parsedOutput = useMemo(() => {
    if (!state.output) return undefined;
    try {
      return JSON.parse(state.output);
    } catch {
      return undefined;
    }
  }, [state.output]);

  const handlePrettify = useCallback(() => {
    if (!state.input.trim()) return;
    const result = prettifyJson(state.input, indent);
    if (result.error) {
      setError({ message: result.error.message, line: result.error.line, column: result.error.column });
      setOutput('');
      setValidationResult(null);
    } else {
      setOutput(result.result || '');
      setError(null);
      setValidationResult({ valid: true, message: 'Valid JSON' });
    }
  }, [state.input, indent, setOutput, setError]);

  const handleMinify = useCallback(() => {
    if (!state.input.trim()) return;
    const result = minifyJson(state.input);
    if (result.error) {
      setError({ message: result.error.message, line: result.error.line, column: result.error.column });
      setOutput('');
      setValidationResult(null);
    } else {
      setOutput(result.result || '');
      setError(null);
      setValidationResult({ valid: true, message: 'Valid JSON' });
    }
  }, [state.input, setOutput, setError]);

  const handleValidate = useCallback(() => {
    if (!state.input.trim()) return;
    const result = validateJson(state.input);
    if (result.valid) {
      setValidationResult({ valid: true, message: 'Valid JSON' });
      setError(null);
    } else {
      setValidationResult({ valid: false, message: result.error?.message || 'Invalid JSON' });
      setError(result.error ? { message: result.error.message, line: result.error.line, column: result.error.column } : null);
    }
  }, [state.input, setError]);

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
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [state.output]);

  const handleClear = useCallback(() => {
    clear();
    setValidationResult(null);
    setOutputView('code');
  }, [clear]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          JSON Formatter - Pretty Print JSON Online
        </h1>
        <p className="text-text-secondary">
          Beautify and format JSON with customizable indentation and syntax highlighting.
          Paste your JSON below or fetch it from a URL to get started.
        </p>
      </div>

      <UrlFetch onFetch={setInput} />

      <div className="flex items-center gap-4 flex-wrap">
        <EditorToolbar
          onPrettify={handlePrettify}
          onMinify={handleMinify}
          onValidate={handleValidate}
          onCopy={handleCopy}
          onClear={handleClear}
          onUpload={handleUpload}
          onDownload={handleDownload}
          showPrettify
          showMinify
          showValidate
          validationResult={validationResult}
        />
        <div className="flex items-center gap-2 ml-auto">
          {!isProUser && (
            <span className="text-xs text-text-muted">
              Max {Math.round(FREE_TIER.maxFileSizeBytes / (1024 * 1024))}MB
            </span>
          )}
          <label className="text-sm text-text-secondary">Indent:</label>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="bg-surface border border-border rounded px-2 py-1 text-sm text-text-primary"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </div>
      </div>

      <ErrorDisplay error={state.error} />

      {/* Output view toggle */}
      {state.output && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">Output view:</span>
          <div className="inline-flex bg-surface border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setOutputView('code')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                outputView === 'code'
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Code
            </button>
            <button
              onClick={() => setOutputView('tree')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                outputView === 'tree'
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Tree View
            </button>
          </div>
          <div className="ml-auto">
            <CopyButton text={state.output} />
          </div>
        </div>
      )}

      <SplitPanel
        left={
          <JsonEditor
            value={state.input}
            onChange={setInput}
            placeholder="Paste your JSON here..."
          />
        }
        right={
          outputView === 'tree' && parsedOutput !== undefined ? (
            <div className="p-4 overflow-auto h-full">
              <TreeView data={parsedOutput} level={0} />
            </div>
          ) : (
            <JsonEditor
              value={state.output}
              readOnly
              placeholder="Formatted output will appear here..."
            />
          )
        }
        leftLabel="Input"
        rightLabel={outputView === 'tree' ? 'Tree View' : 'Output'}
      />

      <div className="bg-surface border border-border rounded-xl p-6 mt-6">
        <h2 className="text-lg font-semibold text-text-primary mb-3">
          About JSON Formatter
        </h2>
        <div className="text-text-secondary text-sm space-y-2">
          <p>
            This free JSON formatter lets you beautify, pretty-print, and format
            JSON data with customizable indentation. It supports both 2-space and
            4-space indentation styles.
          </p>
          <h3 className="font-medium text-text-primary pt-2">Features</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Pretty print JSON with 2 or 4 space indentation</li>
            <li>Minify JSON to reduce file size</li>
            <li>Validate JSON syntax with detailed error messages</li>
            <li>Interactive tree view for navigating complex JSON</li>
            <li>Upload JSON files or fetch from a URL</li>
            <li>Copy formatted output to clipboard</li>
            <li>Download the result as a .json file</li>
          </ul>
          <h3 className="font-medium text-text-primary pt-2">Tips</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Use the Validate button to check syntax before formatting</li>
            <li>Switch between 2 and 4 space indentation using the dropdown</li>
            <li>Toggle between Code and Tree View to explore complex JSON structures</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
