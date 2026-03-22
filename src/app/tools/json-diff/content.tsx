'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/editor/json-editor';
import { ErrorDisplay } from '@/components/editor/error-display';
import { UpgradeGate } from '@/components/shared/upgrade-gate';
import { useSubscription } from '@/context/SubscriptionContext';
import { computeJsonDiff } from '@/lib/converters/json-diff';
import type { DiffResult } from '@/lib/converters/json-diff';

export function JsonDiffContent() {
  const { isProUser } = useSubscription();
  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');
  const [results, setResults] = useState<DiffResult[] | null>(null);
  const [error, setError] = useState<{ message: string; line?: number; column?: number } | null>(null);

  const handleCompare = useCallback(() => {
    if (!inputA.trim() || !inputB.trim()) {
      setError({ message: 'Please provide both JSON A and JSON B to compare.' });
      setResults(null);
      return;
    }

    const { result, error: diffError } = computeJsonDiff(inputA, inputB);

    if (diffError) {
      setError({ message: diffError.message });
      setResults(null);
    } else {
      setError(null);
      setResults(result ?? []);
    }
  }, [inputA, inputB]);

  const handleClear = useCallback(() => {
    setInputA('');
    setInputB('');
    setResults(null);
    setError(null);
  }, []);

  const toolContent = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">JSON A</label>
          <JsonEditor
            value={inputA}
            onChange={setInputA}
            readOnly={false}
            placeholder='{"name": "Alice", "age": 30, "city": "NYC"}'
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">JSON B</label>
          <JsonEditor
            value={inputB}
            onChange={setInputB}
            readOnly={false}
            placeholder='{"name": "Alice", "age": 31, "country": "US"}'
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleCompare}
          className="px-6 py-2 bg-accent text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          Compare
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-surface-elevated text-text-primary rounded-lg font-medium hover:bg-surface transition-colors border border-border"
        >
          Clear
        </button>
      </div>

      <ErrorDisplay error={error} />

      {results !== null && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">
            {results.length === 0 ? 'No Differences Found' : `${results.length} Difference${results.length !== 1 ? 's' : ''} Found`}
          </h2>

          {results.length === 0 && (
            <p className="text-text-secondary text-sm">The two JSON objects are identical.</p>
          )}

          <div className="space-y-2">
            {results.map((diff, index) => (
              <div
                key={index}
                className={`rounded-lg p-3 text-sm font-mono ${
                  diff.type === 'added'
                    ? 'bg-green-500/10 border border-green-500/20'
                    : diff.type === 'removed'
                    ? 'bg-red-500/10 border border-red-500/20'
                    : 'bg-amber-500/10 border border-amber-500/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-semibold uppercase px-2 py-0.5 rounded ${
                      diff.type === 'added'
                        ? 'bg-green-500/20 text-green-400'
                        : diff.type === 'removed'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {diff.type}
                  </span>
                  <span className="text-text-primary font-medium">{diff.path}</span>
                </div>

                {diff.type === 'added' && (
                  <p className="text-green-400 text-xs mt-1">+ {JSON.stringify(diff.newValue)}</p>
                )}
                {diff.type === 'removed' && (
                  <p className="text-red-400 text-xs mt-1">- {JSON.stringify(diff.oldValue)}</p>
                )}
                {diff.type === 'changed' && (
                  <div className="text-xs mt-1 space-y-0.5">
                    <p className="text-red-400">- {JSON.stringify(diff.oldValue)}</p>
                    <p className="text-green-400">+ {JSON.stringify(diff.newValue)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">JSON Diff Tool</h1>
        <p className="text-text-secondary">Compare two JSON objects side by side and highlight differences.</p>
      </div>

      {!isProUser ? (
        <UpgradeGate feature="JSON Diff Tool" tier="pro">
          {toolContent}
        </UpgradeGate>
      ) : (
        toolContent
      )}

      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-3">About JSON Diff</h2>
        <p className="text-text-secondary text-sm leading-relaxed">
          The JSON Diff tool compares two JSON objects and identifies additions, removals, and changes at every level of nesting.
          It performs a deep recursive comparison, handling objects, arrays, and primitive values. Use it to compare API responses,
          configuration files, or any two JSON documents.
        </p>
      </div>
    </div>
  );
}
