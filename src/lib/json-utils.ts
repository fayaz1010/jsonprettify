import type { JsonError, JsonResult, ValidationResult } from "@/types";

export function extractErrorPosition(error: SyntaxError): {
  line?: number;
  column?: number;
  position?: number;
} {
  const message = error.message;

  // Pattern: "at line X column Y"
  const lineColMatch = message.match(/at line (\d+) column (\d+)/i);
  if (lineColMatch) {
    return {
      line: parseInt(lineColMatch[1], 10),
      column: parseInt(lineColMatch[2], 10),
    };
  }

  // Pattern: "at position X"
  const positionMatch = message.match(/at position (\d+)/i);
  if (positionMatch) {
    return {
      position: parseInt(positionMatch[1], 10),
    };
  }

  return {};
}

function buildJsonError(error: unknown): JsonError {
  if (error instanceof SyntaxError) {
    const position = extractErrorPosition(error);
    return {
      message: error.message,
      ...position,
    };
  }
  return {
    message: error instanceof Error ? error.message : String(error),
  };
}

export function prettifyJson(input: string, indent: number = 2): JsonResult {
  try {
    const parsed = JSON.parse(input);
    return { result: JSON.stringify(parsed, null, indent) };
  } catch (error) {
    return { error: buildJsonError(error) };
  }
}

export function minifyJson(input: string): JsonResult {
  try {
    const parsed = JSON.parse(input);
    return { result: JSON.stringify(parsed) };
  } catch (error) {
    return { error: buildJsonError(error) };
  }
}

export function validateJson(input: string): ValidationResult {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: buildJsonError(error) };
  }
}
