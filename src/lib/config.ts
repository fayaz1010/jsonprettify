// Client-safe site configuration (NEXT_PUBLIC_ env vars only)
export const siteConfig = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://jsonprettify.com',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://jsonprettify.com',
};

// Tier limits and feature flags
export const FREE_TIER = {
  maxFileSizeBytes: 1 * 1024 * 1024, // 1MB
  maxSavedFiles: 5,
  showAds: true,
  hasJsonDiff: false,
  hasSchemaValidation: false,
  hasAdvancedConversions: false,
} as const;

export const PRO_TIER = {
  maxFileSizeBytes: Infinity, // Unlimited
  maxSavedFiles: 200,
  showAds: false,
  hasJsonDiff: true,
  hasSchemaValidation: true,
  hasAdvancedConversions: true,
} as const;

export type UserTier = 'free' | 'pro' | 'enterprise';

export function getTierConfig(tier: UserTier) {
  return tier === 'free' ? FREE_TIER : PRO_TIER;
}
