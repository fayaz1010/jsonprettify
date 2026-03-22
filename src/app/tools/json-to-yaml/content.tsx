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
import { jsonToYaml } from '@/lib/converters/json-to-yaml';
import { FREE_TIER } from '@/lib/config';

export function JsonToYamlContent() {
  const { state, setInput, setOutput, setError, clear } = useJsonEditor();
  const { isProUser } = useSubscription();

  const handleConvert = useCallback(() => {
    if (!state.input.trim()) return;
    const result = jsonToYaml(state.input);
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
    const blob = new Blob([state.output], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.yaml';
    a.click();
    URL.revokeObjectURL(url);
  }, [state.output]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          JSON to YAML Converter Online
        </h1>
        <p className="text-text-secondary">
          Convert JSON data to YAML format instantly. Paste your JSON on the
          left and click Convert to see the YAML output on the right.
        </p>
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
            placeholder="Paste your JSON here..."
          />
        }
        right={
          <JsonEditor
            value={state.output}
            readOnly
            placeholder="YAML output will appear here..."
          />
        }
        leftLabel="JSON Input"
        rightLabel="YAML Output"
      />

      <div className="bg-surface border border-border rounded-xl p-6 mt-6">
        <h2 className="text-lg font-semibold text-text-primary mb-3">
          About JSON to YAML Converter
        </h2>
        <div className="text-text-secondary text-sm space-y-2">
          <p>
            YAML (YAML Ain&apos;t Markup Language) is a human-readable data
            serialization format commonly used for configuration files. This
            tool converts JSON to YAML while preserving data types and structure.
          </p>
          <h3 className="font-medium text-text-primary pt-2">Features</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Instant JSON to YAML conversion</li>
            <li>Preserves nested structures and arrays</li>
            <li>Download output as a .yaml file</li>
            <li>Upload JSON files or fetch from a URL</li>
          </ul>
          <h3 className="font-medium text-text-primary pt-2">YAML vs JSON</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>YAML uses indentation instead of brackets</li>
            <li>YAML supports comments, JSON does not</li>
            <li>YAML is more human-readable for configuration</li>
            <li>JSON is more widely used in APIs and data exchange</li>
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
