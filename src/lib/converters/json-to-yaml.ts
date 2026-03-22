import yaml from "js-yaml";
import type { JsonResult } from "@/types";

export function jsonToYaml(input: string): JsonResult {
  try {
    const parsed = JSON.parse(input);
    const result = yaml.dump(parsed, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
    });
    return { result };
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
}
