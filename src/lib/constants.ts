import type { ToolDefinition, PricingTier } from "@/types";

export const TOOLS: ToolDefinition[] = [
  {
    name: "JSON Formatter",
    slug: "json-formatter",
    description:
      "Pretty print and format your JSON data with customizable indentation.",
    icon: "Braces",
    tier: "free",
    category: "format",
  },
  {
    name: "JSON Validator",
    slug: "json-validator",
    description:
      "Validate your JSON syntax and get detailed error messages with line numbers.",
    icon: "CheckCircle",
    tier: "free",
    category: "format",
  },
  {
    name: "JSON Minifier",
    slug: "json-minifier",
    description:
      "Compress JSON by removing all unnecessary whitespace and formatting.",
    icon: "Minimize2",
    tier: "free",
    category: "format",
  },
  {
    name: "JSON to YAML",
    slug: "json-to-yaml",
    description:
      "Convert JSON data to YAML format for configuration files and more.",
    icon: "FileText",
    tier: "free",
    category: "convert",
  },
  {
    name: "JSON to CSV",
    slug: "json-to-csv",
    description:
      "Convert JSON arrays to CSV format for spreadsheet applications.",
    icon: "Table",
    tier: "free",
    category: "convert",
  },
  {
    name: "JSON to XML",
    slug: "json-to-xml",
    description:
      "Convert JSON data to well-formed XML with proper indentation.",
    icon: "Code",
    tier: "free",
    category: "convert",
  },
  {
    name: "JSON Diff",
    slug: "json-diff",
    description:
      "Compare two JSON documents and highlight the differences between them.",
    icon: "GitCompare",
    tier: "pro",
    category: "analyze",
  },
  {
    name: "JSON Schema Validator",
    slug: "json-schema-validator",
    description:
      "Validate JSON data against a JSON Schema to ensure data integrity.",
    icon: "Shield",
    tier: "pro",
    category: "analyze",
  },
  {
    name: "JSON Viewer",
    slug: "json-viewer",
    description:
      "Explore JSON data in an interactive tree view with search and filtering.",
    icon: "Eye",
    tier: "free",
    category: "analyze",
  },
];

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "Essential JSON tools for everyday use.",
    features: [
      "Core formatting, validation & minification",
      "Basic conversions (CSV, XML, YAML)",
      "Ad-supported",
      "1MB file size limit",
      "Up to 5 saved files",
    ],
    cta: "Get Started",
    tier: "free",
  },
  {
    name: "Pro",
    price: "$7",
    period: "/mo",
    description: "Advanced tools for power users and developers.",
    features: [
      "Everything in Free",
      "Ad-free experience",
      "Up to 200 saved/shared files",
      "Unlimited file size",
      "JSON diff tool",
      "JSON schema validation",
      "Priority processing",
      "Export options",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
    tier: "pro",
  },
  {
    name: "Enterprise",
    price: "$120",
    period: "/mo",
    description: "Full-featured plan for teams and organizations.",
    features: [
      "Everything in Pro",
      "Unlimited premium accounts for team",
      "Shared cloud workspace",
      "API access",
      "Priority email support",
      "White-label options",
    ],
    cta: "Contact Sales",
    tier: "enterprise",
  },
];

export const SAMPLE_JSON = `{
  "api": "jsonprettify",
  "version": "2.1.0",
  "status": "success",
  "data": {
    "users": [
      {
        "id": 1,
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "active": true,
        "roles": ["admin", "editor"],
        "profile": {
          "avatar": "https://api.example.com/avatars/alice.png",
          "bio": "Full-stack developer and open-source enthusiast.",
          "joinedAt": "2023-06-15T08:30:00Z"
        }
      },
      {
        "id": 2,
        "name": "Bob Smith",
        "email": "bob@example.com",
        "active": false,
        "roles": ["viewer"],
        "profile": {
          "avatar": null,
          "bio": "",
          "joinedAt": "2024-01-22T14:45:00Z"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "perPage": 25,
      "totalItems": 2,
      "totalPages": 1
    }
  },
  "meta": {
    "requestId": "req_abc123",
    "responseTime": 42,
    "rateLimit": {
      "remaining": 98,
      "resetAt": "2025-03-21T00:00:00Z"
    }
  }
}`;
