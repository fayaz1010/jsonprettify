import { computeJsonDiff } from "../json-diff";

describe("computeJsonDiff", () => {
  it("returns empty array for identical objects", () => {
    const json = '{"a":1,"b":2}';
    const result = computeJsonDiff(json, json);
    expect(result.error).toBeUndefined();
    expect(result.result).toEqual([]);
  });

  it("detects added keys", () => {
    const a = '{"a":1}';
    const b = '{"a":1,"b":2}';
    const result = computeJsonDiff(a, b);
    expect(result.result).toEqual([
      { path: "b", type: "added", newValue: 2 },
    ]);
  });

  it("detects removed keys", () => {
    const a = '{"a":1,"b":2}';
    const b = '{"a":1}';
    const result = computeJsonDiff(a, b);
    expect(result.result).toEqual([
      { path: "b", type: "removed", oldValue: 2 },
    ]);
  });

  it("detects changed values", () => {
    const a = '{"a":1}';
    const b = '{"a":2}';
    const result = computeJsonDiff(a, b);
    expect(result.result).toEqual([
      { path: "a", type: "changed", oldValue: 1, newValue: 2 },
    ]);
  });

  it("handles nested object changes", () => {
    const a = JSON.stringify({ x: { y: 1 } });
    const b = JSON.stringify({ x: { y: 2 } });
    const result = computeJsonDiff(a, b);
    expect(result.result).toEqual([
      { path: "x.y", type: "changed", oldValue: 1, newValue: 2 },
    ]);
  });

  it("handles array element additions", () => {
    const a = "[1, 2]";
    const b = "[1, 2, 3]";
    const result = computeJsonDiff(a, b);
    expect(result.result).toContainEqual(
      expect.objectContaining({ type: "added", newValue: 3 })
    );
  });

  it("handles array element removals", () => {
    const a = "[1, 2, 3]";
    const b = "[1, 2]";
    const result = computeJsonDiff(a, b);
    expect(result.result).toContainEqual(
      expect.objectContaining({ type: "removed", oldValue: 3 })
    );
  });

  it("handles array element changes", () => {
    const a = '["a", "b"]';
    const b = '["a", "c"]';
    const result = computeJsonDiff(a, b);
    expect(result.result).toContainEqual(
      expect.objectContaining({ type: "changed", oldValue: "b", newValue: "c" })
    );
  });

  it("handles type mismatch between values", () => {
    const a = '{"x": 1}';
    const b = '{"x": "one"}';
    const result = computeJsonDiff(a, b);
    expect(result.result).toContainEqual(
      expect.objectContaining({ type: "changed", oldValue: 1, newValue: "one" })
    );
  });

  it("returns error for invalid JSON in first input", () => {
    const result = computeJsonDiff("{bad}", '{"a":1}');
    expect(result.error).toBeDefined();
  });

  it("returns error for invalid JSON in second input", () => {
    const result = computeJsonDiff('{"a":1}', "{bad}");
    expect(result.error).toBeDefined();
  });

  it("handles deeply nested structures", () => {
    const a = JSON.stringify({ a: { b: { c: { d: 1 } } } });
    const b = JSON.stringify({ a: { b: { c: { d: 2 } } } });
    const result = computeJsonDiff(a, b);
    expect(result.result).toEqual([
      { path: "a.b.c.d", type: "changed", oldValue: 1, newValue: 2 },
    ]);
  });

  it("handles empty objects", () => {
    const result = computeJsonDiff("{}", "{}");
    expect(result.result).toEqual([]);
  });

  it("detects multiple differences", () => {
    const a = JSON.stringify({ a: 1, b: 2, c: 3 });
    const b = JSON.stringify({ a: 1, b: 99, d: 4 });
    const result = computeJsonDiff(a, b);
    expect(result.result!.length).toBe(3); // b changed, c removed, d added
  });
});
