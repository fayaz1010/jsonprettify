import { jsonToCsv } from "../json-to-csv";

describe("jsonToCsv", () => {
  it("converts array of objects to CSV", () => {
    const input = JSON.stringify([
      { name: "Alice", age: 30 },
      { name: "Bob", age: 25 },
    ]);
    const result = jsonToCsv(input);
    expect(result.error).toBeUndefined();
    expect(result.result).toContain("name");
    expect(result.result).toContain("age");
    expect(result.result).toContain("Alice");
    expect(result.result).toContain("Bob");
  });

  it("returns error for non-array JSON", () => {
    const result = jsonToCsv('{"key": "value"}');
    expect(result.error).toBeDefined();
    expect(result.error!.message).toContain("array");
  });

  it("returns error for invalid JSON", () => {
    const result = jsonToCsv("{bad json}");
    expect(result.error).toBeDefined();
  });

  it("handles empty array", () => {
    const result = jsonToCsv("[]");
    expect(result.error).toBeUndefined();
  });

  it("handles objects with missing keys", () => {
    const input = JSON.stringify([
      { a: 1, b: 2 },
      { a: 3 },
    ]);
    const result = jsonToCsv(input);
    expect(result.error).toBeUndefined();
    expect(result.result).toContain("a");
    expect(result.result).toContain("b");
  });

  it("handles special characters in values", () => {
    const input = JSON.stringify([
      { text: 'hello, "world"' },
    ]);
    const result = jsonToCsv(input);
    expect(result.error).toBeUndefined();
    expect(result.result).toBeDefined();
  });

  it("handles single-row array", () => {
    const input = JSON.stringify([{ x: 1 }]);
    const result = jsonToCsv(input);
    expect(result.error).toBeUndefined();
    expect(result.result).toContain("x");
    expect(result.result).toContain("1");
  });
});
