import Papa from "papaparse";
import type { JsonResult } from "@/types";

export function jsonToCsv(input: string): JsonResult {
  try {
    const parsed = JSON.parse(input);

    if (!Array.isArray(parsed)) {
      return {
        error: {
          message:
            "JSON must be an array of objects to convert to CSV.",
        },
      };
    }

    const result = Papa.unparse(parsed);
    return { result };
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
}
