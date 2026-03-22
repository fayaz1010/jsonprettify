import { jsonToXml } from "../json-to-xml";

describe("jsonToXml", () => {
  it("converts simple object to XML", () => {
    const result = jsonToXml('{"name":"Alice","age":30}');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain("<name>");
    expect(result.result).toContain("Alice");
    expect(result.result).toContain("<age>");
    expect(result.result).toContain("30");
  });

  it("wraps output in root element", () => {
    const result = jsonToXml('{"key":"value"}');
    expect(result.result).toContain("<root>");
  });

  it("handles nested objects", () => {
    const input = JSON.stringify({ parent: { child: "value" } });
    const result = jsonToXml(input);
    expect(result.error).toBeUndefined();
    expect(result.result).toContain("<parent>");
    expect(result.result).toContain("<child>");
  });

  it("handles arrays", () => {
    const input = JSON.stringify({ items: [1, 2, 3] });
    const result = jsonToXml(input);
    expect(result.error).toBeUndefined();
    expect(result.result).toBeDefined();
  });

  it("returns error for invalid JSON", () => {
    const result = jsonToXml("{not valid}");
    expect(result.error).toBeDefined();
  });

  it("handles empty object", () => {
    const result = jsonToXml("{}");
    expect(result.error).toBeUndefined();
    expect(result.result).toBeDefined();
  });

  it("handles boolean and null values", () => {
    const input = JSON.stringify({ flag: true, empty: null });
    const result = jsonToXml(input);
    expect(result.error).toBeUndefined();
    expect(result.result).toContain("<flag>");
  });
});
