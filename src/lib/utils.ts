/**
 * Merge class names conditionally.
 * Filters out falsy values and joins the rest with a space.
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}
