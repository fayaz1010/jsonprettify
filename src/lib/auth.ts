import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';

export interface MockUser {
  id: string;
  email: string;
  password: string;
  plan: 'free' | 'pro';
}

// In-memory mock user store (resets on server restart)
export const users: MockUser[] = [
  {
    id: '1',
    email: 'demo@jsonprettify.com',
    password: 'demo1234',
    plan: 'free',
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = users.find(
          (u) =>
            u.email === credentials.email && u.password === credentials.password
        );

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          plan: user.plan,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.plan = (user as { plan: string }).plan;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { plan?: string }).plan = token.plan as string;
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-do-not-use-in-production',
};
