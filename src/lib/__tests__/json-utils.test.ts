import {
  extractErrorPosition,
  prettifyJson,
  minifyJson,
  validateJson,
} from "../json-utils";

describe("extractErrorPosition", () => {
  it("extracts line and column from error message", () => {
    const error = new SyntaxError(
      "Unexpected token at line 3 column 5"
    );
    expect(extractErrorPosition(error)).toEqual({ line: 3, column: 5 });
  });

  it("extracts position from error message", () => {
    const error = new SyntaxError(
      "Unexpected token } at position 42"
    );
    expect(extractErrorPosition(error)).toEqual({ position: 42 });
  });

  it("returns empty object when no position info", () => {
    const error = new SyntaxError("Unexpected token");
    expect(extractErrorPosition(error)).toEqual({});
  });
});

describe("prettifyJson", () => {
  it("formats valid JSON with default indent (2 spaces)", () => {
    const result = prettifyJson('{"a":1,"b":2}');
    expect(result.result).toBe('{\n  "a": 1,\n  "b": 2\n}');
    expect(result.error).toBeUndefined();
  });

  it("formats valid JSON with 4-space indent", () => {
    const result = prettifyJson('{"a":1}', 4);
    expect(result.result).toBe('{\n    "a": 1\n}');
  });

  it("handles nested objects", () => {
    const result = prettifyJson('{"a":{"b":{"c":1}}}');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('"c": 1');
  });

  it("handles arrays", () => {
    const result = prettifyJson("[1,2,3]");
    expect(result.result).toBe("[\n  1,\n  2,\n  3\n]");
  });

  it("returns error for invalid JSON", () => {
    const result = prettifyJson("{invalid}");
    expect(result.result).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error!.message).toBeTruthy();
  });

  it("handles empty object", () => {
    const result = prettifyJson("{}");
    expect(result.result).toBe("{}");
  });

  it("handles empty array", () => {
    const result = prettifyJson("[]");
    expect(result.result).toBe("[]");
  });

  it("handles null value", () => {
    const result = prettifyJson("null");
    expect(result.result).toBe("null");
  });

  it("handles string value", () => {
    const result = prettifyJson('"hello"');
    expect(result.result).toBe('"hello"');
  });

  it("returns error for empty string", () => {
    const result = prettifyJson("");
    expect(result.error).toBeDefined();
  });
});

describe("minifyJson", () => {
  it("minifies valid JSON", () => {
    const input = '{\n  "a": 1,\n  "b": 2\n}';
    const result = minifyJson(input);
    expect(result.result).toBe('{"a":1,"b":2}');
    expect(result.error).toBeUndefined();
  });

  it("minifies nested JSON", () => {
    const input = '{\n  "a": {\n    "b": [1, 2, 3]\n  }\n}';
    const result = minifyJson(input);
    expect(result.result).toBe('{"a":{"b":[1,2,3]}}');
  });

  it("returns error for invalid JSON", () => {
    const result = minifyJson("{not valid json}");
    expect(result.result).toBeUndefined();
    expect(result.error).toBeDefined();
  });

  it("handles already minified JSON", () => {
    const result = minifyJson('{"a":1}');
    expect(result.result).toBe('{"a":1}');
  });

  it("handles empty object", () => {
    const result = minifyJson("{}");
    expect(result.result).toBe("{}");
  });
});

describe("validateJson", () => {
  it("returns valid for correct JSON", () => {
    const result = validateJson('{"key": "value"}');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("returns invalid with error for malformed JSON", () => {
    const result = validateJson("{missing: quotes}");
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error!.message).toBeTruthy();
  });

  it("validates arrays", () => {
    expect(validateJson("[1, 2, 3]").valid).toBe(true);
  });

  it("validates primitives", () => {
    expect(validateJson("42").valid).toBe(true);
    expect(validateJson('"string"').valid).toBe(true);
    expect(validateJson("true").valid).toBe(true);
    expect(validateJson("null").valid).toBe(true);
  });

  it("rejects trailing commas", () => {
    const result = validateJson('{"a": 1,}');
    expect(result.valid).toBe(false);
  });

  it("rejects empty string", () => {
    expect(validateJson("").valid).toBe(false);
  });

  it("rejects undefined-like input", () => {
    expect(validateJson("undefined").valid).toBe(false);
  });
});
