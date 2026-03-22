import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isValid) {
          return null;
        }

        if (!user.isVerified) {
          throw new Error('Please verify your email first.');
        }

        return {
          id: user.id,
          email: user.email,
          plan: user.subscriptionStatus.toLowerCase(),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.plan = (user as unknown as { plan: string }).plan;
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
