import { randomBytes, createHash } from 'crypto';

export interface ResetToken {
  email: string;
  tokenHash: string;
  expiresAt: Date;
}

// In-memory token store (matches the mock user store pattern)
export const resetTokens: ResetToken[] = [];

const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export function generateResetToken(): string {
  return randomBytes(32).toString('hex');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function storeResetToken(email: string, token: string): void {
  const tokenHash = hashToken(token);

  // Remove any existing tokens for this email
  const idx = resetTokens.findIndex((t) => t.email === email);
  if (idx !== -1) resetTokens.splice(idx, 1);

  resetTokens.push({
    email,
    tokenHash,
    expiresAt: new Date(Date.now() + TOKEN_EXPIRY_MS),
  });
}

export function validateResetToken(token: string): ResetToken | null {
  const tokenHash = hashToken(token);
  const entry = resetTokens.find((t) => t.tokenHash === tokenHash);

  if (!entry) return null;
  if (new Date() > entry.expiresAt) {
    // Expired — remove it
    invalidateResetToken(tokenHash);
    return null;
  }

  return entry;
}

export function invalidateResetToken(tokenHash: string): void {
  const idx = resetTokens.findIndex((t) => t.tokenHash === tokenHash);
  if (idx !== -1) resetTokens.splice(idx, 1);
}
