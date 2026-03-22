import { randomBytes, createHash } from 'crypto';

const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export function generateVerificationToken(): string {
  return randomBytes(32).toString('hex');
}

export function hashVerificationToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function getVerificationTokenExpiry(): Date {
  return new Date(Date.now() + TOKEN_EXPIRY_MS);
}
