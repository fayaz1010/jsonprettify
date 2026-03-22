import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateResetToken, storeResetToken } from '@/lib/reset-tokens';
import { sendEmail, buildPasswordResetEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: 'Email is required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Always return success to prevent email enumeration
    const successMessage =
      'If an account with that email exists, a password reset link has been sent to your inbox. Please check your email.';

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    if (user) {
      const token = generateResetToken();
      storeResetToken(user.email, token);

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const resetLink = `${baseUrl}/reset-password/${token}`;
      const { subject, body } = buildPasswordResetEmail(resetLink, '1 hour');

      await sendEmail({ to: user.email, subject, body });
    }

    return NextResponse.json({ message: successMessage });
  } catch {
    return NextResponse.json(
      { message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
