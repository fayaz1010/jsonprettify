import { NextResponse } from 'next/server';
import { users } from '@/lib/auth';

export async function POST(request: Request) {
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

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return NextResponse.json(
      { error: 'Email already exists' },
      { status: 409 }
    );
  }

  const newUser = {
    id: String(users.length + 1),
    email,
    password,
    plan: 'free' as const,
  };

  users.push(newUser);

  return NextResponse.json(
    { message: 'Account created successfully' },
    { status: 201 }
  );
}
