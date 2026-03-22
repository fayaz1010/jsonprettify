'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/editor/json-editor';
import { ErrorDisplay } from '@/components/editor/error-display';
import { UpgradeGate } from '@/components/shared/upgrade-gate';
import { useSubscription } from '@/context/SubscriptionContext';
import { validateJsonSchema } from '@/lib/schema-validator';

const SAMPLE_SCHEMA = `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "integer", "minimum": 0 },
    "email": { "type": "string", "format": "email" }
  },
  "required": ["name", "email"]
}`;

export function JsonSchemaValidatorContent() {
  const { isProUser } = useSubscription();
  const [jsonData, setJsonData] = useState('');
  const [jsonSchema, setJsonSchema] = useState('');
  const [validationResult, setValidationResult] = useState<{ valid: boolean; errors: { path: string; message: string; keyword: string }[] } | null>(null);
  const [error, setError] = useState<{ message: string; line?: number; column?: number } | null>(null);

  const handleValidate = useCallback(() => {
    if (!jsonData.trim()) {
      setError({ message: 'Please provide JSON data to validate.' });
      setValidationResult(null);
      return;
    }
    if (!jsonSchema.trim()) {
      setError({ message: 'Please provide a JSON Schema to validate against.' });
      setValidationResult(null);
      return;
    }

    setError(null);
    const result = validateJsonSchema(jsonData, jsonSchema);
    setValidationResult(result);
  }, [jsonData, jsonSchema]);

  const handleClear = useCallback(() => {
    setJsonData('');
    setJsonSchema('');
    setValidationResult(null);
    setError(null);
  }, []);

  const toolContent = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">JSON Data</label>
          <JsonEditor
            value={jsonData}
            onChange={setJsonData}
            readOnly={false}
            placeholder='{"name": "Alice", "age": 30, "email": "alice@example.com"}'
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">JSON Schema</label>
          <JsonEditor
            value={jsonSchema}
            onChange={setJsonSchema}
            readOnly={false}
            placeholder={SAMPLE_SCHEMA}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleValidate}
          className="px-6 py-2 bg-accent text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          Validate Schema
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-surface-elevated text-text-primary rounded-lg font-medium hover:bg-surface transition-colors border border-border"
        >
          Clear
        </button>
      </div>

      <ErrorDisplay error={error} />

      {validationResult !== null && (
        <div className="space-y-3">
          {validationResult.valid ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-400 font-medium">Valid! The JSON data conforms to the schema.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-text-primary">
                {validationResult.errors.length} Validation Error{validationResult.errors.length !== 1 ? 's' : ''}
              </h2>

              {validationResult.errors.map((err, index) => (
                <div key={index} className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm font-mono">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-400">
                      {err.keyword}
                    </span>
                    <span className="text-text-primary font-medium">{err.path}</span>
                  </div>
                  <p className="text-red-400 text-xs mt-1">{err.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">JSON Schema Validator</h1>
        <p className="text-text-secondary">Validate JSON data against a JSON Schema definition.</p>
      </div>

      {!isProUser ? (
        <UpgradeGate feature="JSON Schema Validation" tier="pro">
          {toolContent}
        </UpgradeGate>
      ) : (
        toolContent
      )}

      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-3">About JSON Schema Validation</h2>
        <p className="text-text-secondary text-sm leading-relaxed">
          JSON Schema is a vocabulary that allows you to annotate and validate JSON documents.
          It defines the structure, data types, and constraints for your JSON data. Use this tool to
          validate API payloads, configuration files, or any structured data against a schema definition.
        </p>
      </div>
    </div>
  );
}
