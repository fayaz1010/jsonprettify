import type { JsonError } from "@/types";

export interface DiffResult {
  path: string;
  type: "added" | "removed" | "changed";
  oldValue?: unknown;
  newValue?: unknown;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function diffRecursive(
  a: unknown,
  b: unknown,
  path: string,
  results: DiffResult[]
): void {
  if (a === b) return;

  if (isPlainObject(a) && isPlainObject(b)) {
    const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of allKeys) {
      const childPath = path ? `${path}.${key}` : key;
      if (!(key in a)) {
        results.push({ path: childPath, type: "added", newValue: b[key] });
      } else if (!(key in b)) {
        results.push({ path: childPath, type: "removed", oldValue: a[key] });
      } else {
        diffRecursive(a[key], b[key], childPath, results);
      }
    }
    return;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    const maxLen = Math.max(a.length, b.length);
    for (let i = 0; i < maxLen; i++) {
      const childPath = `${path}[${i}]`;
      if (i >= a.length) {
        results.push({ path: childPath, type: "added", newValue: b[i] });
      } else if (i >= b.length) {
        results.push({ path: childPath, type: "removed", oldValue: a[i] });
      } else {
        diffRecursive(a[i], b[i], childPath, results);
      }
    }
    return;
  }

  // Primitives or type mismatch
  results.push({ path: path || "$", type: "changed", oldValue: a, newValue: b });
}

export function computeJsonDiff(
  jsonA: string,
  jsonB: string
): { result?: DiffResult[]; error?: JsonError } {
  try {
    const a = JSON.parse(jsonA);
    const b = JSON.parse(jsonB);

    const results: DiffResult[] = [];
    diffRecursive(a, b, "", results);
    return { result: results };
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
}
