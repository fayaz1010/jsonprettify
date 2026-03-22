import { XMLBuilder } from "fast-xml-parser";
import type { JsonResult } from "@/types";

export function jsonToXml(input: string): JsonResult {
  try {
    const parsed = JSON.parse(input);

    const builder = new XMLBuilder({
      format: true,
      indentBy: "  ",
      suppressEmptyNode: true,
    });

    const xml = builder.build({ root: parsed }) as string;
    return { result: xml };
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
}
