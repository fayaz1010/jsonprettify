import { prisma } from "@/lib/db";
import { rateLimit } from '@/utils/rate-limiter';
import { sendVerificationEmail } from '@/lib/email';
import { generateVerificationToken, hashVerificationToken, getVerificationTokenExpiry } from '@/lib/verification-tokens';
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return Response.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const rawToken = generateVerificationToken();
    const tokenHash = hashVerificationToken(rawToken);
    const tokenExpires = getVerificationTokenExpiry();

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name: name || null,
        isVerified: false,
        emailVerificationToken: tokenHash,
        emailVerificationTokenExpires: tokenExpires,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const verificationLink = `${baseUrl}/verify-email/${rawToken}`;

    try {
      await sendVerificationEmail(email, verificationLink);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    return Response.json(
      {
        success: true,
        message: "Account created successfully. Please check your email to verify your account.",
        requiresVerification: true,
        user: {
          id: user.id,
          email: user.email,
          name: name || null,
          subscription: user.subscriptionStatus.toLowerCase(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
