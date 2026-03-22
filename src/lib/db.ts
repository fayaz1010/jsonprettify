// Mock database module - replaces Prisma for development
// Uses an in-memory user store with hashed passwords
import bcrypt from 'bcryptjs';

export interface MockUser {
  id: string;
  email: string;
  passwordHash: string;
  subscriptionStatus: string;
}

// Pre-hashed password for demo user (bcrypt hash of 'demo1234')
const DEMO_HASH = bcrypt.hashSync('demo1234', 12);

const users: MockUser[] = [
  {
    id: '1',
    email: 'demo@jsonprettify.com',
    passwordHash: DEMO_HASH,
    subscriptionStatus: 'FREE',
  },
];

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
        passwordHash: data.passwordHash,
        subscriptionStatus: 'FREE',
      };
      users.push(newUser);
      return {
        id: newUser.id,
        email: newUser.email,
        subscriptionStatus: newUser.subscriptionStatus,
      };
    },
    update: async ({
      where,
      data,
    }: {
      where: { email: string };
      data: { passwordHash: string };
    }) => {
      const user = users.find((u) => u.email === where.email);
      if (user) {
        user.passwordHash = data.passwordHash;
      }
      return user;
    },
  },
};
