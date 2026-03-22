import { validateJsonSchema } from "../schema-validator";

const simpleSchema = JSON.stringify({
  type: "object",
  properties: {
    name: { type: "string" },
    age: { type: "number" },
  },
  required: ["name"],
});

describe("validateJsonSchema", () => {
  it("returns valid for conforming data", () => {
    const data = JSON.stringify({ name: "Alice", age: 30 });
    const result = validateJsonSchema(data, simpleSchema);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("returns errors for missing required field", () => {
    const data = JSON.stringify({ age: 30 });
    const result = validateJsonSchema(data, simpleSchema);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].keyword).toBe("required");
  });

  it("returns errors for wrong type", () => {
    const data = JSON.stringify({ name: 123 });
    const result = validateJsonSchema(data, simpleSchema);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.keyword === "type")).toBe(true);
  });

  it("handles invalid JSON data", () => {
    const result = validateJsonSchema("{bad json}", simpleSchema);
    expect(result.valid).toBe(false);
    expect(result.errors[0].keyword).toBe("parse");
  });

  it("handles invalid schema JSON", () => {
    const result = validateJsonSchema('{"name":"test"}', "{bad schema}");
    expect(result.valid).toBe(false);
    expect(result.errors[0].keyword).toBe("parse");
  });

  it("validates with additionalProperties false", () => {
    const strictSchema = JSON.stringify({
      type: "object",
      properties: { id: { type: "number" } },
      additionalProperties: false,
    });
    const data = JSON.stringify({ id: 1, extra: "field" });
    const result = validateJsonSchema(data, strictSchema);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.keyword === "additionalProperties")).toBe(true);
  });

  it("validates nested objects", () => {
    const nestedSchema = JSON.stringify({
      type: "object",
      properties: {
        address: {
          type: "object",
          properties: { city: { type: "string" } },
          required: ["city"],
        },
      },
      required: ["address"],
    });
    const data = JSON.stringify({ address: {} });
    const result = validateJsonSchema(data, nestedSchema);
    expect(result.valid).toBe(false);
    expect(result.errors[0].path).toContain("address");
  });

  it("validates arrays with items schema", () => {
    const arraySchema = JSON.stringify({
      type: "array",
      items: { type: "number" },
    });
    expect(validateJsonSchema("[1, 2, 3]", arraySchema).valid).toBe(true);
    expect(validateJsonSchema('["a", "b"]', arraySchema).valid).toBe(false);
  });

  it("validates empty object against schema", () => {
    const result = validateJsonSchema("{}", simpleSchema);
    expect(result.valid).toBe(false); // missing required "name"
  });
});
