// Server-only configuration — do NOT import this file in client components.
// These env vars are only available on the server side.

export const serverConfig = {
  databaseUrl: process.env.DATABASE_URL,

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  },

  cloudflare: {
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  },

  githubToken: process.env.GITHUB_TOKEN,

  nextAuthUrl: process.env.NEXTAUTH_URL,
};
