'use client';

import { useCallback } from 'react';
import { useJsonEditor } from '@/hooks/use-json-editor';
import { JsonEditor } from '@/components/editor/json-editor';
import { SplitPanel } from '@/components/editor/split-panel';
import { EditorToolbar } from '@/components/editor/editor-toolbar';
import { ErrorDisplay } from '@/components/editor/error-display';
import { UrlFetch } from '@/components/editor/url-fetch';
import { jsonToXml } from '@/lib/converters/json-to-xml';

export function JsonToXmlContent() {
  const { state, setInput, setOutput, setError, clear } = useJsonEditor();

  const handleConvert = useCallback(() => {
    if (!state.input.trim()) return;
    const result = jsonToXml(state.input);
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
      const reader = new FileReader();
      reader.onload = (e) => setInput((e.target?.result as string) || '');
      reader.readAsText(file);
    },
    [setInput]
  );

  const handleDownload = useCallback(() => {
    if (!state.output) return;
    const blob = new Blob([state.output], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.xml';
    a.click();
    URL.revokeObjectURL(url);
  }, [state.output]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          JSON to XML Converter Online
        </h1>
        <p className="text-text-secondary">
          Convert JSON objects to well-formed XML documents. Paste your JSON on
          the left and click Convert to generate the XML output.
        </p>
      </div>

      <UrlFetch onFetch={setInput} />

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

      <ErrorDisplay error={state.error} />

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
            placeholder="XML output will appear here..."
          />
        }
        leftLabel="JSON Input"
        rightLabel="XML Output"
      />

      <div className="bg-surface border border-border rounded-xl p-6 mt-6">
        <h2 className="text-lg font-semibold text-text-primary mb-3">
          About JSON to XML Converter
        </h2>
        <div className="text-text-secondary text-sm space-y-2">
          <p>
            XML (eXtensible Markup Language) is a markup language used for
            storing and transporting data. This tool converts JSON objects into
            well-formed XML documents with proper nesting and indentation.
          </p>
          <h3 className="font-medium text-text-primary pt-2">Features</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Converts JSON to well-formed XML</li>
            <li>Proper indentation and nesting</li>
            <li>Handles arrays and nested objects</li>
            <li>Download output as a .xml file</li>
            <li>Upload JSON files or fetch from a URL</li>
          </ul>
          <h3 className="font-medium text-text-primary pt-2">XML Conversion Notes</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>JSON object keys become XML element names</li>
            <li>Arrays are wrapped in container elements</li>
            <li>Special characters are properly escaped</li>
            <li>The root element wraps the entire document</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
