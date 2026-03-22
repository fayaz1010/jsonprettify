import Ajv from "ajv";
import type { SchemaValidationError } from "@/types";

export function validateJsonSchema(
  json: string,
  schema: string
): { valid: boolean; errors: SchemaValidationError[] } {
  try {
    const data = JSON.parse(json);
    const schemaObj = JSON.parse(schema);

    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schemaObj);
    const valid = validate(data);

    if (valid) {
      return { valid: true, errors: [] };
    }

    const errors: SchemaValidationError[] = (validate.errors ?? []).map(
      (err) => ({
        path: err.instancePath || "/",
        message: err.message ?? "Unknown validation error",
        keyword: err.keyword,
      })
    );

    return { valid: false, errors };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          path: "/",
          message: error instanceof Error ? error.message : String(error),
          keyword: "parse",
        },
      ],
    };
  }
}
