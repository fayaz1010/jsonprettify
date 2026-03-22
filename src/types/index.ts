export interface JsonError {
  message: string;
  line?: number;
  column?: number;
  position?: number;
}

export interface JsonResult {
  result?: string;
  error?: JsonError;
}

export interface ValidationResult {
  valid: boolean;
  error?: JsonError;
}

export interface ToolDefinition {
  name: string;
  slug: string;
  description: string;
  icon: string;
  tier: "free" | "pro" | "enterprise";
  category: "format" | "convert" | "analyze";
}

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  tier: "free" | "pro" | "enterprise";
}

export interface EditorState {
  input: string;
  output: string;
  error: JsonError | null;
  activeAction: string | null;
}

export type EditorAction =
  | { type: "SET_INPUT"; payload: string }
  | { type: "SET_OUTPUT"; payload: string }
  | { type: "SET_ERROR"; payload: JsonError | null }
  | { type: "SET_ACTION"; payload: string | null }
  | { type: "CLEAR" };

export interface SchemaValidationError {
  path: string;
  message: string;
  keyword: string;
}
