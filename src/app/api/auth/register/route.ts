import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { rateLimit } from '@/utils/rate-limiter';

export async function POST(request: Request) {
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: 'Invalid email format' },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: 'Password must be at least 6 characters' },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { error: 'Email already exists' },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
    },
  });

  return NextResponse.json(
    { message: 'Account created successfully' },
    { status: 201 }
  );
}
