import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { validateResetToken, invalidateResetToken, hashToken } from '@/lib/reset-tokens';

export async function POST(request: Request) {
  try {
    const { token, password, confirmPassword } = await request.json();

    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { message: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    const resetEntry = validateResetToken(token);

    if (!resetEntry) {
      return NextResponse.json(
        { message: 'Invalid or expired password reset link. Please request a new one.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: resetEntry.email } });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired password reset link. Please request a new one.' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { email: user.email },
      data: { passwordHash: hashedPassword },
    });

    // Invalidate the used token
    invalidateResetToken(hashToken(token));

    return NextResponse.json({
      message: 'Your password has been reset successfully. You can now log in with your new password.',
    });
  } catch {
    return NextResponse.json(
      { message: 'An error occurred during password reset. Please try again.' },
      { status: 500 }
    );
  }
}
