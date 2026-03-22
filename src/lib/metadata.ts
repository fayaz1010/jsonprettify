import type { Metadata } from "next";

const BASE_TITLE = "JSON Prettify";
const BASE_URL = "https://jsonprettify.com";

interface ToolMeta {
  title: string;
  description: string;
  keywords: string[];
}

const toolMetaMap: Record<string, ToolMeta> = {
  "json-formatter": {
    title: "JSON Formatter - Pretty Print JSON Online",
    description:
      "Free online JSON formatter and pretty printer. Paste your JSON and instantly format it with proper indentation. Fast, secure, and easy to use.",
    keywords: [
      "JSON formatter",
      "pretty print JSON",
      "JSON beautifier",
      "format JSON online",
      "JSON indenter",
    ],
  },
  "json-validator": {
    title: "JSON Validator - Validate JSON Online",
    description:
      "Free online JSON validator. Check your JSON syntax, find errors with exact line and column numbers, and fix invalid JSON quickly.",
    keywords: [
      "JSON validator",
      "validate JSON online",
      "JSON syntax checker",
      "JSON lint",
      "check JSON",
    ],
  },
  "json-minifier": {
    title: "JSON Minifier - Compress JSON Online",
    description:
      "Free online JSON minifier. Remove whitespace and compress your JSON data to reduce file size. One-click minification.",
    keywords: [
      "JSON minifier",
      "minify JSON",
      "compress JSON",
      "JSON compressor",
      "reduce JSON size",
    ],
  },
  "json-to-yaml": {
    title: "JSON to YAML Converter - Convert JSON to YAML Online",
    description:
      "Free online JSON to YAML converter. Instantly convert your JSON data to clean YAML format for configuration files and more.",
    keywords: [
      "JSON to YAML",
      "convert JSON to YAML",
      "JSON YAML converter",
      "JSON to YAML online",
    ],
  },
  "json-to-csv": {
    title: "JSON to CSV Converter - Convert JSON to CSV Online",
    description:
      "Free online JSON to CSV converter. Convert JSON arrays to CSV format for use in spreadsheets and data analysis tools.",
    keywords: [
      "JSON to CSV",
      "convert JSON to CSV",
      "JSON CSV converter",
      "JSON to spreadsheet",
    ],
  },
  "json-to-xml": {
    title: "JSON to XML Converter - Convert JSON to XML Online",
    description:
      "Free online JSON to XML converter. Transform JSON data into well-formed XML with proper indentation and structure.",
    keywords: [
      "JSON to XML",
      "convert JSON to XML",
      "JSON XML converter",
      "JSON to XML online",
    ],
  },
  "json-diff": {
    title: "JSON Diff - Compare JSON Documents Online",
    description:
      "Compare two JSON documents side by side and identify differences. Highlights added, removed, and changed values with clear paths.",
    keywords: [
      "JSON diff",
      "compare JSON",
      "JSON comparison",
      "JSON difference",
      "diff JSON online",
    ],
  },
  "json-schema-validator": {
    title: "JSON Schema Validator - Validate JSON Against Schema",
    description:
      "Validate your JSON data against a JSON Schema. Get detailed validation errors with paths and messages for easy debugging.",
    keywords: [
      "JSON schema validator",
      "validate JSON schema",
      "JSON schema",
      "schema validation",
      "JSON schema online",
    ],
  },
  "json-viewer": {
    title: "JSON Viewer - Interactive JSON Tree View Online",
    description:
      "Explore JSON data in an interactive tree view. Search, filter, expand, and collapse nodes to navigate complex JSON structures.",
    keywords: [
      "JSON viewer",
      "JSON tree view",
      "view JSON online",
      "JSON explorer",
      "interactive JSON",
    ],
  },
};

export function getToolMetadata(slug: string): Metadata {
  const meta = toolMetaMap[slug];

  if (!meta) {
    return {
      title: BASE_TITLE,
      description:
        "Free online JSON tools. Format, validate, minify, convert, and compare JSON data.",
    };
  }

  const fullTitle = `${meta.title} | ${BASE_TITLE}`;

  return {
    title: fullTitle,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: fullTitle,
      description: meta.description,
      url: `${BASE_URL}/tools/${slug}`,
      siteName: BASE_TITLE,
      type: "website",
      locale: "en_US",
    },
  };
}
