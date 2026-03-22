'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface TreeViewProps {
  data: unknown;
  level?: number;
  keyName?: string;
}

function renderValue(value: unknown): React.ReactNode {
  if (value === null) {
    return <span className="text-[#64748B]">null</span>;
  }
  if (typeof value === 'string') {
    return <span className="text-[#22C55E]">&quot;{value}&quot;</span>;
  }
  if (typeof value === 'number') {
    return <span className="text-[#F59E0B]">{String(value)}</span>;
  }
  if (typeof value === 'boolean') {
    return <span className="text-[#A78BFA]">{String(value)}</span>;
  }
  return <span className="text-text-secondary">{String(value)}</span>;
}

export function TreeView({ data, level = 0, keyName }: TreeViewProps) {
  const [expanded, setExpanded] = useState(level < 2);

  const isObject =
    data !== null && typeof data === 'object' && !Array.isArray(data);
  const isArray = Array.isArray(data);

  if (!isObject && !isArray) {
    return (
      <div className="font-mono text-sm leading-6" style={{ paddingLeft: level * 20 }}>
        {keyName !== undefined && (
          <>
            <span className="text-[#3B82F6]">{keyName}</span>
            <span className="text-text-secondary">: </span>
          </>
        )}
        {renderValue(data)}
      </div>
    );
  }

  const entries = isArray
    ? (data as unknown[]).map((val, idx) => [String(idx), val] as const)
    : Object.entries(data as Record<string, unknown>);

  const count = entries.length;
  const bracket = isArray ? ['[', ']'] : ['{', '}'];
  const summary = isArray ? `[...] (${count} items)` : `{...} (${count} keys)`;

  return (
    <div className="font-mono text-sm leading-6">
      <div
        className="flex items-center cursor-pointer hover:bg-surface-elevated rounded px-1 -ml-1 select-none"
        style={{ paddingLeft: level * 20 }}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="shrink-0 w-4 h-4 flex items-center justify-center mr-1 text-text-muted">
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
        {keyName !== undefined && (
          <>
            <span className="text-[#3B82F6]">{keyName}</span>
            <span className="text-text-secondary">: </span>
          </>
        )}
        {expanded ? (
          <span className="text-text-secondary">{bracket[0]}</span>
        ) : (
          <span className="text-text-muted">{summary}</span>
        )}
      </div>

      {expanded && (
        <>
          {entries.map(([key, val]) => (
            <TreeView
              key={key}
              data={val}
              level={level + 1}
              keyName={isArray ? undefined : key}
            />
          ))}
          <div
            className="text-text-secondary"
            style={{ paddingLeft: level * 20 + 20 }}
          >
            {bracket[1]}
          </div>
        </>
      )}
    </div>
  );
}
