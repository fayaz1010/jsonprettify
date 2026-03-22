import { prisma } from '@/lib/db';
import { hashVerificationToken } from '@/lib/verification-tokens';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return Response.json(
        { success: false, error: 'Verification token is required' },
        { status: 400 }
      );
    }

    const tokenHash = hashVerificationToken(token);

    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: tokenHash },
    });

    if (!user) {
      return Response.json(
        { success: false, error: 'Invalid or expired verification token.' },
        { status: 400 }
      );
    }

    if (
      user.emailVerificationTokenExpires &&
      new Date() > user.emailVerificationTokenExpires
    ) {
      return Response.json(
        { success: false, error: 'Verification token has expired. Please sign up again.' },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpires: null,
      },
    });

    return Response.json({
      success: true,
      message: 'Email verified successfully! You can now log in.',
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
