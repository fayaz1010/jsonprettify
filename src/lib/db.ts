// Mock database module - replaces Prisma for development
// Uses the in-memory user store from auth.ts
import { users, type MockUser } from './auth';

export const prisma = {
  user: {
    findUnique: async ({ where }: { where: { email: string } }) => {
      return users.find((u) => u.email === where.email) || null;
    },
    create: async ({
      data,
    }: {
      data: { email: string; passwordHash: string };
    }) => {
      const newUser: MockUser = {
        id: String(users.length + 1),
        email: data.email,
        password: data.passwordHash,
        plan: 'free',
      };
      users.push(newUser);
      return {
        id: newUser.id,
        email: newUser.email,
        subscriptionStatus: 'FREE',
      };
    },
  },
};
