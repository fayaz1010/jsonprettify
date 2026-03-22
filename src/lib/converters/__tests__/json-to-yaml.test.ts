import { jsonToYaml } from "../json-to-yaml";

describe("jsonToYaml", () => {
  it("converts simple object to YAML", () => {
    const result = jsonToYaml('{"name":"Alice","age":30}');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain("name: Alice");
    expect(result.result).toContain("age: 30");
  });

  it("converts nested objects", () => {
    const input = JSON.stringify({ parent: { child: "value" } });
    const result = jsonToYaml(input);
    expect(result.error).toBeUndefined();
    expect(result.result).toContain("parent:");
    expect(result.result).toContain("child: value");
  });

  it("converts arrays", () => {
    const input = JSON.stringify({ list: [1, 2, 3] });
    const result = jsonToYaml(input);
    expect(result.error).toBeUndefined();
    expect(result.result).toContain("- 1");
    expect(result.result).toContain("- 2");
  });

  it("returns error for invalid JSON", () => {
    const result = jsonToYaml("{broken}");
    expect(result.error).toBeDefined();
  });

  it("handles empty object", () => {
    const result = jsonToYaml("{}");
    expect(result.error).toBeUndefined();
    expect(result.result).toBe("{}\n");
  });

  it("handles empty array", () => {
    const result = jsonToYaml("[]");
    expect(result.error).toBeUndefined();
    expect(result.result).toBe("[]\n");
  });

  it("handles string with special YAML characters", () => {
    const input = JSON.stringify({ text: "value: with colon" });
    const result = jsonToYaml(input);
    expect(result.error).toBeUndefined();
    expect(result.result).toBeDefined();
  });

  it("handles deeply nested structure", () => {
    const input = JSON.stringify({ a: { b: { c: { d: "deep" } } } });
    const result = jsonToYaml(input);
    expect(result.error).toBeUndefined();
    expect(result.result).toContain("d: deep");
  });

  it("handles boolean and null values", () => {
    const result = jsonToYaml('{"flag":true,"empty":null}');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain("flag: true");
    expect(result.result).toContain("empty: null");
  });
});
